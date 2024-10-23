'use client'

import { useApolloClient, useLazyQuery, useQuery, useReactiveVar } from '@apollo/client'
import { Conversation, Message, Client as TwilioClient } from '@twilio/conversations'
import { useEffect, useRef } from 'react'
import { twilioClientVar } from './conversationVars'
import { LIMIT } from '../constants/pagination'
import {
    getConversationsForUserQuery,
    getSharedConversationQuery,
    getUserQuery,
} from '@/graphql/query'
import {
    ConversationStatus,
    ConversationWithUserObject,
    PaginatedConversationWithUserObject,
} from '@/graphql/typesGraphql'

type PromisedUnreadMessagesCount = {
    sid: string
    unreadMessagesCount: number
}

export const useInitializeConversationNotification = () => {
    const isChatConversationResourcesInit = useRef(false)
    const isRequestedConversationResourcesInit = useRef(false)

    const loadDate = useRef(new Date())

    const client = useApolloClient()

    const twilioClient = useReactiveVar(twilioClientVar)

    const { data: user } = useQuery(getUserQuery)

    const [getChatConversationsForUser, { data: chatConversations }] = useLazyQuery(
        getConversationsForUserQuery,
        {
            variables: {
                status: ConversationStatus.Accepted,
                pagination: {
                    limit: LIMIT,
                },
            },
        }
    )

    const [getRequestedConversationsForUser, { data: requestedConversations }] = useLazyQuery(
        getConversationsForUserQuery,
        {
            variables: {
                status: ConversationStatus.Requested,
                pagination: {
                    limit: LIMIT,
                },
            },
        }
    )

    const [getSharedConversation] = useLazyQuery(getSharedConversationQuery)

    const handleMessageAdded = async (message: Message) => {
        updateConversationsCacheWithNewConversationAndUnreadMessagesCount(
            [message],
            message.conversation.sid
        )
    }

    const handleConversationJoined = async (conversation: Conversation) => {
        if (
            conversation.dateCreated &&
            conversation.dateCreated > loadDate.current &&
            conversation.createdBy !== twilioClient?.user.identity
        ) {
            const messages = await conversation.getMessages()

            updateConversationsCacheWithNewConversationAndUnreadMessagesCount(
                messages.items,
                conversation.sid
            )
        }
    }

    const getConversationResources = async (
        conversations: PaginatedConversationWithUserObject['list'],
        twilioClient: TwilioClient
    ) => {
        const promisedConversations =
            conversations?.map(async (conversation) => {
                return await twilioClient.peekConversationBySid(conversation.sid)
            }) ?? []

        const conversationResources = await Promise.allSettled(promisedConversations)

        return conversationResources.reduce((acc: Conversation[] | [], curr) => {
            if (curr.status === 'fulfilled') return [...acc, curr.value]
            return acc
        }, [])
    }

    const getUnreadMessagesCount = async (conversationResources: Conversation[] | []) => {
        const promisedUnreadMessages =
            conversationResources?.map(async (conversationResource: Conversation) => {
                const promisedUnreadMessagesCount =
                    await conversationResource.getUnreadMessagesCount()

                return {
                    sid: conversationResource.sid,
                    promisedUnreadMessagesCount,
                }
            }) ?? []

        const unreadMessages = await Promise.allSettled(promisedUnreadMessages)

        const promisedUnreadMessagesCountFromMessagesList = unreadMessages.map(
            async (unreadMessage) => {
                if (unreadMessage.status === 'fulfilled') {
                    /**
                     *  while 'read horizon' is not set need to get messages manually'
                     *  read horizon doc: https://www.twilio.com/docs/conversations/read-horizon
                     */
                    if (unreadMessage.value.promisedUnreadMessagesCount === null) {
                        const conversation = conversationResources.find(
                            (conversation: Conversation) =>
                                conversation.sid === unreadMessage.value.sid
                        )

                        if (conversation) {
                            const messages = await conversation.getMessages()
                            const incomeMessages = messages.items.filter(
                                (message) => message.author !== twilioClient?.user.identity
                            )

                            return {
                                sid: unreadMessage.value.sid,
                                unreadMessagesCount: incomeMessages.length,
                            }
                        }

                        return {
                            sid: unreadMessage.value.sid,
                            unreadMessagesCount: 0,
                        }
                    }

                    return {
                        sid: unreadMessage.value.sid,
                        unreadMessagesCount: unreadMessage.value.promisedUnreadMessagesCount,
                    }
                }
            }
        )

        const unreadMessagesCountFromMessagesList = await Promise.allSettled(
            promisedUnreadMessagesCountFromMessagesList
        )

        return unreadMessagesCountFromMessagesList.reduce(
            (acc: PromisedUnreadMessagesCount[] | [], curr) => {
                if (curr.status === 'fulfilled' && curr.value) {
                    return [
                        ...acc,
                        {
                            sid: curr.value.sid,
                            unreadMessagesCount: curr.value.unreadMessagesCount,
                        },
                    ]
                }
                return acc
            },
            []
        )
    }

    const addNewConversationAndUpdateUnreadMessagesToConversations = async ({
        currentConversation,
        conversations,
        sid,
        participantId,
        unreadMessagesCount,
    }: {
        currentConversation: ConversationWithUserObject | null | undefined
        conversations: ConversationWithUserObject[]
        sid: string
        participantId: string
        unreadMessagesCount: number
    }): Promise<ConversationWithUserObject[]> => {
        if (!currentConversation) {
            const { data: sharedConversation } = await getSharedConversation({
                variables: {
                    participantId,
                },
            })

            if (sharedConversation?.getSharedConversation) {
                const chatCacheData = client.cache.readQuery({
                    query: getConversationsForUserQuery,
                    variables: {
                        status: sharedConversation.getSharedConversation.status,
                    },
                })

                const nextConversations = [
                    ...(chatCacheData?.getConversationsForUser?.list ?? []),
                    {
                        ...sharedConversation.getSharedConversation,
                        unreadMessagesCount,
                    },
                ]

                return nextConversations
            }
        }

        const nextConversations = conversations.map((conversation) => {
            if (conversation.sid == sid) {
                return {
                    ...conversation,
                    unreadMessagesCount: conversation.unreadMessagesCount + unreadMessagesCount,
                }
            }

            return conversation
        })

        return nextConversations
    }

    const moveConversationToTop = (
        conversations: ConversationWithUserObject[],
        conversationSid: string,
        cursor?: string | null
    ): {
        conversations: ConversationWithUserObject[]
        cursor?: string | null
    } => {
        const index = conversations.findIndex(
            (conversation) => conversation.sid === conversationSid
        )

        if (index <= 0) return { conversations, cursor } // Already at top or not found

        let conversationsClone = structuredClone(conversations)

        const [movedConversation] = conversationsClone.splice(index, 1)

        return {
            conversations: [movedConversation, ...conversationsClone],
            cursor: Number.isFinite(Number(cursor)) ? (Number(cursor) + 1).toString() : cursor,
        }
    }

    const getConversationsAndConversationByStatus = (status: ConversationStatus, sid: string) => {
        const cacheData = client.cache.readQuery({
            query: getConversationsForUserQuery,
            variables: {
                status,
            },
        })

        const chatConversations = cacheData?.getConversationsForUser?.list ?? []

        const checkChatConversationExistence = chatConversations.find(
            (conversation) => conversation.sid === sid
        )

        return {
            conversations: chatConversations,
            conversation: checkChatConversationExistence,
            cursor: cacheData?.getConversationsForUser?.pageInfo.cursor,
        }
    }

    const updateConversationsCacheWithNewConversationAndUnreadMessagesCount = async (
        messages: Message[],
        sid: string
    ) => {
        const receivedMessages = messages.filter(
            (message) => message.author !== twilioClient?.user.identity
        )
        const unreadMessagesCount = receivedMessages.length

        let reorderedConversations = null
        let nextCursor = null

        const {
            conversation: checkChatConversationExistence,
            conversations: chatConversations,
            cursor: chatConversationsCursor,
        } = getConversationsAndConversationByStatus(ConversationStatus.Accepted, sid)

        const {
            conversation: checkRequestedConversationExistence,
            conversations: requestedConversations,
            cursor: requestedConversationsCursor,
        } = getConversationsAndConversationByStatus(ConversationStatus.Accepted, sid)

        const currentConversations = checkChatConversationExistence
            ? chatConversations
            : checkRequestedConversationExistence
              ? requestedConversations
              : []

        const cacheCursor = checkChatConversationExistence
            ? chatConversationsCursor
            : checkRequestedConversationExistence
              ? requestedConversationsCursor
              : null

        const currentConversation =
            checkChatConversationExistence ?? checkRequestedConversationExistence

        if (unreadMessagesCount && receivedMessages[0]?.author) {
            const updatedConversations =
                await addNewConversationAndUpdateUnreadMessagesToConversations({
                    currentConversation,
                    conversations: currentConversations,
                    sid,
                    participantId: receivedMessages[0].author,
                    unreadMessagesCount,
                })

            const { conversations, cursor } = moveConversationToTop(
                updatedConversations,
                sid,
                cacheCursor
            )

            reorderedConversations = conversations
            nextCursor = cursor
        } else {
            const { conversations, cursor } = moveConversationToTop(
                currentConversations,
                sid,
                cacheCursor
            )

            reorderedConversations = conversations
            nextCursor = cursor
        }

        client.cache.updateQuery(
            {
                query: getConversationsForUserQuery,
                variables: {
                    status: reorderedConversations[0].status,
                },
            },
            (existingData) => {
                if (!existingData?.getConversationsForUser) return existingData

                return {
                    getConversationsForUser: {
                        ...existingData.getConversationsForUser,
                        list: reorderedConversations,
                        pageInfo: {
                            ...existingData.getConversationsForUser.pageInfo,
                            cursor: nextCursor,
                        },
                    },
                }
            }
        )
    }

    const setUnreadMessagesCount = (
        unreadMessages: PromisedUnreadMessagesCount[],
        status: ConversationStatus
    ) => {
        client.cache.updateQuery(
            {
                query: getConversationsForUserQuery,
                variables: {
                    status,
                },
            },
            (data) => {
                if (!data?.getConversationsForUser?.list) return data

                const unreadMessagesMap = new Map(
                    unreadMessages.map((msg) => [msg.sid, msg.unreadMessagesCount])
                )

                const updatedList = data.getConversationsForUser.list.map((conversation) => ({
                    ...conversation,
                    unreadMessagesCount:
                        unreadMessagesMap.get(conversation.sid) ?? conversation.unreadMessagesCount,
                }))

                return {
                    getConversationsForUser: {
                        ...data.getConversationsForUser,
                        list: updatedList,
                    },
                }
            }
        )
    }

    const init = async (
        conversations: PaginatedConversationWithUserObject['list'],
        twilioClient: TwilioClient,
        status: ConversationStatus
    ) => {
        const conversationResources = await getConversationResources(conversations, twilioClient)

        const unreadMessagesCount = await getUnreadMessagesCount(conversationResources)

        setUnreadMessagesCount(unreadMessagesCount, status)
    }

    useEffect(() => {
        if (twilioClient && user) {
            twilioClient.addListener('messageAdded', handleMessageAdded)
            twilioClient.addListener('conversationJoined', handleConversationJoined)
        }

        return () => {
            if (twilioClient) {
                twilioClient.removeListener('messageAdded', handleMessageAdded)

                /**
                 * When 'A' user will add 'B' user to conversation,
                 * 'B' user can not see current conversation in live mode before will not refresh page.
                 * With the below listener new conversation added to 'B' user and starts listening for its messages.
                 */
                twilioClient.removeListener('conversationJoined', handleConversationJoined)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [twilioClient, user])

    useEffect(() => {
        if (twilioClient) {
            if (
                chatConversations?.getConversationsForUser?.list &&
                !isChatConversationResourcesInit.current
            ) {
                isChatConversationResourcesInit.current = true
                init(
                    chatConversations.getConversationsForUser.list,
                    twilioClient,
                    ConversationStatus.Accepted
                )
            }

            if (
                requestedConversations?.getConversationsForUser?.list &&
                !isRequestedConversationResourcesInit.current
            ) {
                isRequestedConversationResourcesInit.current = true
                init(
                    requestedConversations.getConversationsForUser.list,
                    twilioClient,
                    ConversationStatus.Requested
                )
            }
        }
    }, [chatConversations, requestedConversations, twilioClient])

    useEffect(() => {
        if (twilioClient && user) {
            getChatConversationsForUser()
            getRequestedConversationsForUser()
        }
    }, [twilioClient, user])
}
