'use client'

import { useApolloClient, useLazyQuery, useQuery, useReactiveVar } from '@apollo/client'
import { Conversation, Message, Client as TwilioClient } from '@twilio/conversations'
import { useEffect, useRef } from 'react'
import { twilioClientVar } from './conversationVars'
import { LIMIT, OFFSET } from '../constants/pagination'
import {
    getConversationsForUserQuery,
    getSharedConversationQuery,
    getUserQuery,
} from '@/graphql/query'
import {
    ConversationWithUserObject,
    PaginatedConversationWithUserObject,
} from '@/graphql/typesGraphql'

type PromisedUnreadMessagesCount = {
    sid: string
    unreadMessagesCount: number
}

export const useInitializeConversationNotification = () => {
    const isInitFunctionInitialized = useRef(false)

    const loadDate = useRef(new Date())

    const client = useApolloClient()

    const twilioClient = useReactiveVar(twilioClientVar)

    const { data: user } = useQuery(getUserQuery)

    const [getConversationsForUser, { data }] = useLazyQuery(getConversationsForUserQuery, {
        variables: {
            pagination: {
                offset: OFFSET,
                limit: LIMIT,
            },
        },
    })

    const [getSharedConversation] = useLazyQuery(getSharedConversationQuery)

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
        conversations,
        sid,
        participantId,
        unreadMessagesCount,
    }: {
        conversations: ConversationWithUserObject[]
        sid: string
        participantId: string
        unreadMessagesCount: number
    }): Promise<ConversationWithUserObject[]> => {
        const checkConversationExistence = conversations.find(
            (conversation) => conversation.sid === sid
        )

        if (!checkConversationExistence) {
            const { data: sharedConversation } = await getSharedConversation({
                variables: {
                    participantId,
                },
            })

            if (sharedConversation?.getSharedConversation) {
                const nextConversations = [
                    ...conversations,
                    {
                        ...sharedConversation.getSharedConversation,
                        unreadMessagesCount,
                    },
                ]

                return nextConversations
            }

            return conversations
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
        conversationSid: string
    ): ConversationWithUserObject[] => {
        const index = conversations.findIndex(
            (conversation) => conversation.sid === conversationSid
        )

        if (index <= 0) return conversations // Already at top or not found

        let conversationsClone = structuredClone(conversations)

        const [movedConversation] = conversationsClone.splice(index, 1)

        return [movedConversation, ...conversationsClone]
    }

    const updateConversationsCacheWithNewConversationAndUnreadMessagesCount = async (
        messages: Message[],
        sid: string
    ) => {
        const receivedMessages = messages.filter(
            (message) => message.author !== twilioClient?.user.identity
        )
        const unreadMessagesCount = receivedMessages.length

        const cacheData = client.cache.readQuery({ query: getConversationsForUserQuery })
        const conversations = cacheData?.getConversationsForUser?.list ?? []

        let reorderedConversations = null

        if (unreadMessagesCount && receivedMessages[0]?.author) {
            const updatedConversations =
                await addNewConversationAndUpdateUnreadMessagesToConversations({
                    conversations,
                    sid,
                    participantId: receivedMessages[0].author,
                    unreadMessagesCount,
                })

            reorderedConversations = moveConversationToTop(updatedConversations, sid)
        } else {
            reorderedConversations = moveConversationToTop(conversations, sid)
        }

        client.cache.updateQuery({ query: getConversationsForUserQuery }, (existingData) => {
            if (!existingData?.getConversationsForUser) return existingData

            return {
                getConversationsForUser: {
                    ...existingData.getConversationsForUser,
                    list: reorderedConversations,
                },
            }
        })
    }

    const setUnreadMessagesCount = (unreadMessages: PromisedUnreadMessagesCount[]) => {
        client.cache.updateQuery({ query: getConversationsForUserQuery }, (data) => {
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
        })
    }

    const init = async (
        conversations: PaginatedConversationWithUserObject['list'],
        twilioClient: TwilioClient
    ) => {
        const conversationResources = await getConversationResources(conversations, twilioClient)

        const unreadMessagesCount = await getUnreadMessagesCount(conversationResources)

        setUnreadMessagesCount(unreadMessagesCount)
    }

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
        if (
            data?.getConversationsForUser?.list &&
            !isInitFunctionInitialized.current &&
            twilioClient
        ) {
            isInitFunctionInitialized.current = true
            init(data.getConversationsForUser.list, twilioClient)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, twilioClient, user])

    useEffect(() => {
        if (twilioClient && user) {
            getConversationsForUser()
        }
    }, [twilioClient, user])
}
