'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Conversation, Message, Paginator } from '@twilio/conversations'
import { useInView } from 'react-intersection-observer'
import { useApolloClient, useReactiveVar } from '@apollo/client'
import mergeRefs from 'merge-refs'
import { format, isToday, isYesterday } from 'date-fns'
import { ConversationWithUserObject } from '@/graphql/typesGraphql'
import { twilioClientVar } from '@/src/conversation/conversationVars'
import { useDocumentHasFocus } from '@/src/hooks/useDocumentHasFocus'
import { getConversationsForUserQuery } from '@/graphql/query'
import { Spinner } from '@/src/components/ui/spinner'
import { cn } from '@/src/utils/cn'

type Props = {
    conversationResource: Conversation | null
    conversation?: ConversationWithUserObject
}

/*
 * CONSTANTS
 */
const MESSAGES_PAGE_SIZE = 20

const MESSAGE_BOX_ESTIMATE_HEIGHT = 50
const MESSAGE_BOX_ESTIMATE_HEIGHT_FOR_FIRST_PAGE = 250

const GET_NEXT_MESSAGES_MIN_TIMEOUT = 400

/*
 * UTILS
 */
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

const extendFetchTime = async <T,>(minDuration: number, callback: () => Promise<T>) => {
    let response: T | null = null

    const startTime = performance.now()

    response = await callback()

    const endTime = performance.now()

    const duration = endTime - startTime

    if (duration < minDuration) {
        await new Promise((resolve) => setTimeout(resolve, minDuration - duration))
    }

    return response
}

/*
 * MAIN COMPONENT
 */
const MessagesList = ({ conversationResource, conversation }: Props) => {
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(true)

    const paginatedMessagesRef = useRef<Paginator<Message> | null>(null)

    const parentDomRef = useRef<HTMLDivElement>(null)

    const client = useApolloClient()

    const twilioClient = useReactiveVar(twilioClientVar)

    const { ref: inViewLoaderDomRef, inView } = useInView()
    const { ref: firstMessageDomRef, inView: inViewFirstMessageDom } = useInView()

    const isDocumentFocused = useDocumentHasFocus()

    const getMessagesFromTwilio = async (conversationResource: Conversation) => {
        try {
            if (!paginatedMessagesRef.current) {
                const paginatedMessages = await conversationResource.getMessages(MESSAGES_PAGE_SIZE)
                paginatedMessagesRef.current = paginatedMessages
                setMessages((prevMessages) => [
                    ...prevMessages,
                    ...paginatedMessages.items.reverse(),
                ])
            } else if (paginatedMessagesRef.current.hasPrevPage) {
                // In safari if scroll has big velocity and fetch time is small
                // browser renders empty area before touch it(after touch it shows items)
                // and scrollOffset is not works properly.
                // To slow velocity to 0, 1000ms is totally enough.
                // In another browsers it is not the case but,
                // browser maybe somehow saves scroll velocity and
                // continue scroll after instant(100ms for example) fetch.
                const paginatedMessages = await extendFetchTime(GET_NEXT_MESSAGES_MIN_TIMEOUT, () =>
                    paginatedMessagesRef.current!.prevPage()
                )
                paginatedMessagesRef.current = paginatedMessages
                setMessages((prevMessages) => [
                    ...prevMessages,
                    ...paginatedMessages.items.reverse(),
                ])
            }
        } catch (error) {
            console.log({ error })
        } finally {
            setLoading(false)
        }
    }

    const setAllMessagesRead = async (conversationResource: Conversation) => {
        try {
            await conversationResource.setAllMessagesRead()

            client.cache.updateQuery(
                {
                    query: getConversationsForUserQuery,
                },
                (data) => {
                    if (data?.getConversationsForUser) {
                        const conversationIncrementedUnreadMessage =
                            data?.getConversationsForUser?.list?.map((conversation) => {
                                if (conversation.sid === conversationResource.sid) {
                                    return {
                                        ...conversation,
                                        unreadMessagesCount: 0,
                                    }
                                }

                                return conversation
                            })

                        return {
                            ...data,
                            getConversationsForUser: {
                                ...data.getConversationsForUser,
                                list: conversationIncrementedUnreadMessage,
                            },
                        }
                    }
                }
            )
        } catch (error) {
            console.log({ error })
        }
    }

    const formatDate = (date: Date) => {
        if (isToday(date)) {
            return 'Today'
        }
        if (isYesterday(date)) {
            return 'Yesterday'
        }
        return format(date, ' MMMM do, yyyy')
    }

    const formatTime = (date: Date) => format(date, 'HH:mm:ss')

    const handleMessageAdded = (message: Message) => {
        if (message.author === twilioClient?.user.identity) {
            conversationResource?.advanceLastReadMessageIndex(message.index)

            // scroll to bottom
            virtualizer.scrollOffset = virtualizer.getTotalSize()
        }

        setMessages((prevMessages) => [message, ...prevMessages])
    }

    useEffect(() => {
        if (conversationResource) {
            conversationResource.addListener('messageAdded', handleMessageAdded)
        }

        return () => {
            if (conversationResource) {
                conversationResource.removeListener('messageAdded', handleMessageAdded)
            }
        }
    }, [conversationResource])

    /**
     * Fetch prev messages
     * FIXME: need fetch logic if not enough messages are not shown
     */
    useEffect(() => {
        if (inView && conversationResource) {
            getMessagesFromTwilio(conversationResource)
        }
    }, [inView, conversationResource])

    /**
     * Set incoming messages as read
     */
    useEffect(() => {
        if (
            inViewFirstMessageDom &&
            conversationResource &&
            conversation?.unreadMessagesCount &&
            conversation?.unreadMessagesCount > 0 &&
            isDocumentFocused
        ) {
            setAllMessagesRead(conversationResource)
        }
    }, [inViewFirstMessageDom, isDocumentFocused])

    /*
     * VIRTUALIZER CODE START
     */
    const count = messages.length

    const virtualizerRef = useRef<ReturnType<
        typeof useVirtualizer<HTMLDivElement, Element>
    > | null>(null)

    // Reverse scroll code below and idea is provided from github discussion.
    // link: https://github.com/TanStack/virtual/discussions/195#discussioncomment-4706845
    if (virtualizerRef.current && count !== virtualizerRef.current.options.count) {
        const delta = count - virtualizerRef.current.options.count

        // For initial(first) render message box height should be higher,
        // to make scroll bottom not stack somewhere middle.
        // P.S. mostly in safari if item size is bigger then 250px
        // when start scrolling it start flickering because adjusting itself scrollable area size.
        // For first render item be 250px ans start flickering should not be problem,
        // but for every next render and scroll on it can be for user.
        // During next renders it is not important if item size bigger then 250px.
        // 10px or 20px also works perfect, the scrollbar stays on old place.
        // Now MESSAGE_BOX_ESTIMATE_HEIGHT is 50px to self insure from potential risk.
        const messageBoxEstimateHeight =
            virtualizerRef.current.options.count === 0
                ? MESSAGE_BOX_ESTIMATE_HEIGHT_FOR_FIRST_PAGE
                : MESSAGE_BOX_ESTIMATE_HEIGHT

        const nextOffset =
            (virtualizerRef?.current?.scrollOffset ?? 0) +
            delta * messageBoxEstimateHeight +
            delta * virtualizerRef.current.options.gap

        virtualizerRef.current.scrollOffset = nextOffset
        virtualizerRef.current.scrollToOffset(nextOffset)
    }

    const reverseIndex = (index: number) => count - 1 - index

    const virtualizer = useVirtualizer({
        getScrollElement: () => parentDomRef.current,
        count,
        estimateSize: () => {
            if (messages.length <= MESSAGES_PAGE_SIZE) {
                return MESSAGE_BOX_ESTIMATE_HEIGHT_FOR_FIRST_PAGE
            }

            return MESSAGE_BOX_ESTIMATE_HEIGHT
        },
        getItemKey: (index: number) => messages[reverseIndex(index)].index,
        overscan: messages.length <= MESSAGES_PAGE_SIZE ? 33 : 5,
        paddingEnd: 3,
        paddingStart: 3,
        gap: 10,
    })

    useIsomorphicLayoutEffect(() => {
        virtualizerRef.current = virtualizer
    })

    const virtualizerItems = virtualizer.getVirtualItems()

    /*
     * VIRTUALIZER CODE END
     */

    return (
        <div ref={parentDomRef} className="overflow-y-auto overscroll-none">
            {(paginatedMessagesRef?.current?.hasPrevPage || loading) && (
                <div className="mb-3 flex w-full justify-center" ref={inViewLoaderDomRef}>
                    <Spinner size="small" />
                </div>
            )}

            <div
                className="relative"
                style={{
                    height: virtualizer.getTotalSize(),
                }}
            >
                {virtualizerItems.map((virtualItem) => {
                    const index = reverseIndex(virtualItem.index)
                    const message = messages[index]
                    const messageDate = new Date(message.dateCreated ?? '')

                    const virtualItemRef =
                        messages[0].index === message.index
                            ? (mergeRefs(virtualizer.measureElement, firstMessageDomRef) as any)
                            : virtualizer.measureElement

                    return (
                        <div
                            key={virtualItem.key}
                            data-index={virtualItem.index}
                            ref={virtualItemRef}
                            className={cn('absolute flex w-full flex-col', {
                                'left-0 items-start': conversation?.user?.id === message.author,
                                'right-0 items-end': conversation?.user?.id !== message.author,
                            })}
                            style={{
                                transform: `translateY(${virtualItem.start}px)`,
                            }}
                        >
                            <div
                                className={cn(
                                    'text group relative mx-2 max-w-[65%] bg-[#c5bdff] p-2 text-sm text-stone-800 md:max-w-[75%]',
                                    {
                                        'ml-40 rounded-t-[12px] rounded-bl-[12px] rounded-br-[0] text-right ':
                                            conversation?.user?.id !== message.author,
                                        'mr-40 rounded-t-[12px] rounded-bl-[0] rounded-br-[12px] text-left ':
                                            conversation?.user?.id === message.author,
                                    }
                                )}
                            >
                                {message.body}

                                <span
                                    className={`absolute bottom-full right-0 mb-1 w-max rounded bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                                        conversation?.user?.id !== message.author
                                            ? 'right-0'
                                            : 'left-0'
                                    }`}
                                >
                                    {formatTime(messageDate)} {formatDate(messageDate)}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default MessagesList
