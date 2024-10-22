'use client'

import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { useRouter, useSearchParams } from 'next/navigation'
import { ConversationStatus, ConversationWithUserObject } from '@/graphql/typesGraphql'
import { MEDIA_QUERY } from '../constants'
import { LIMIT } from '@/src/constants/pagination'
import { Spinner } from '@/src/components/ui/spinner'
import { cn } from '@/src/utils/cn'
import Avatar from '@images/UniversalAvatar.webp'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { getConversationsForUserQuery } from '@/graphql/query'
import { useQuery } from '@apollo/client'
import { TabTypes } from '../types'
import { useInView } from 'react-intersection-observer'

type Props = {
    activeConversationId: string | null
    setMobileOpen: Dispatch<SetStateAction<boolean>>
    mobileOpen: boolean
    activeTab: TabTypes
    setActiveTab: Dispatch<SetStateAction<TabTypes>>
}

export default function ConversationsList({
    activeTab,
    setActiveTab,
    activeConversationId,
    setMobileOpen,
}: Props) {
    const parentDomRef = useRef<HTMLDivElement>(null)

    const router = useRouter()

    const searchParams = useSearchParams()
    const conversationIdFromParam = searchParams.get('id')

    const media = useMediaQuery({ query: MEDIA_QUERY })

    const { t } = useTranslation()

    const { ref: inViewLoaderDomRef, inView: inViewLoaderDom } = useInView()

    const { data: chatConversations, fetchMore: fetchMoreGetChatConversationsForUser } = useQuery(
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

    const { data: requestedConversations, fetchMore: fetchMoreGetRequestConversationsForUser } =
        useQuery(getConversationsForUserQuery, {
            variables: {
                status: ConversationStatus.Requested,
                pagination: {
                    limit: LIMIT,
                },
            },
        })

    const handleClickConversation = (conversationId: string) => {
        if (conversationId !== conversationIdFromParam) {
            router.push(`/conversation?id=${conversationId}`)
        }
        if (!media) {
            setMobileOpen(true)
        }
    }

    const chatClickHandler = () => {
        setActiveTab('chats')
    }

    const requestClickHandler = () => {
        setActiveTab('requests')
    }

    useEffect(() => {
        if (inViewLoaderDom) {
            if (activeTab === 'chats') {
                fetchMoreGetChatConversationsForUser({
                    variables: {
                        status: ConversationStatus.Accepted,
                        pagination: {
                            limit: LIMIT,
                            cursor: chatConversations?.getConversationsForUser?.pageInfo.cursor,
                        },
                    },
                })
            } else {
                fetchMoreGetRequestConversationsForUser({
                    variables: {
                        status: ConversationStatus.Requested,
                        pagination: {
                            limit: LIMIT,
                            cursor: requestedConversations?.getConversationsForUser?.pageInfo
                                .cursor,
                        },
                    },
                })
            }
        }
    }, [activeTab, inViewLoaderDom])

    useEffect(() => {
        if (!activeConversationId) {
            if (activeTab === 'chats') {
                const activeConversation = chatConversations?.getConversationsForUser?.list?.[0]

                if (activeConversation) {
                    console.log({ activeConversation: activeConversation?.id })

                    router.push(`/conversation?id=${activeConversation.id}`)
                }
            } else if (activeTab === 'requests') {
                const activeConversation =
                    requestedConversations?.getConversationsForUser?.list?.[0]

                if (activeConversation) {
                    router.push(`/conversation?id=${activeConversation.id}`)
                }
            }
        }
    }, [chatConversations, requestedConversations])

    useEffect(() => {
        if (activeTab === 'chats') {
            const activeConversation = chatConversations?.getConversationsForUser?.list?.[0]

            if (activeConversation) {
                router.push(`/conversation?id=${activeConversation.id}`)
            }
        } else if (activeTab === 'requests') {
            const activeConversation = requestedConversations?.getConversationsForUser?.list?.[0]

            if (activeConversation) {
                router.push(`/conversation?id=${activeConversation.id}`)
            }
        }
    }, [activeTab])

    const activeConversationsByTab =
        activeTab === 'chats'
            ? (chatConversations?.getConversationsForUser?.list ?? [])
            : (requestedConversations?.getConversationsForUser?.list ?? [])

    const groupedConversations = activeConversationsByTab.reduce((acc, conversation, index) => {
        const groupIndex = Math.floor(index / 15)
        if (!acc[groupIndex]) {
            acc[groupIndex] = []
        }
        acc[groupIndex].push(conversation)
        return acc
    }, [] as ConversationWithUserObject[][])

    const hasNextPageByTab =
        activeTab === 'chats'
            ? chatConversations?.getConversationsForUser?.pageInfo.hasNextPage
            : requestedConversations?.getConversationsForUser?.pageInfo.hasNextPage

    return (
        <section className="flex w-full flex-col items-start rounded-md border-[gray] bg-[#FFFFFF] md:h-full md:w-[100px] md:border-b-4 lg:w-[400px]">
            <div className="block w-full">
                <div className="flex flex-row items-center justify-start gap-6 px-6 py-2 md:flex-col lg:flex-row">
                    <span
                        className={cn(
                            'cursor-pointer',
                            activeTab === 'chats' ? 'text-[#0A7CFF]' : 'text-[#838CAC]'
                        )}
                        onClick={chatClickHandler}
                    >
                        {t('chat')}
                    </span>
                    <span
                        className={cn(
                            'relative cursor-pointer',
                            activeTab === 'requests' ? 'text-[#0A7CFF]' : 'text-[#838CAC]'
                        )}
                        onClick={requestClickHandler}
                    >
                        {t('request')}
                        {/* {activeTab === 'requests' && (
                            <div className="absolute -right-4 -top-1.5 z-50 ">
                                <RequestConversation className="h-4 w-4" />
                            </div>
                        )} */}
                    </span>
                </div>
            </div>
            <div className="w-full overflow-auto" ref={parentDomRef}>
                {groupedConversations.map((group, groupIndex) => (
                    <div key={`group-${groupIndex}`} className="content-visibility">
                        {group.map((conversation) => (
                            <div
                                key={conversation.id}
                                className={cn(
                                    'flex w-full cursor-pointer flex-row items-center justify-center border-b-2 border-[#E3E3E3] px-6 py-2 md:p-0 lg:justify-between lg:px-4 lg:py-2',
                                    conversation?.id === conversationIdFromParam
                                        ? 'bg-[#e7e7fe]'
                                        : ''
                                )}
                                onClick={() => handleClickConversation(conversation.id)}
                            >
                                <div className="flex h-full w-full flex-row items-center justify-start md:justify-center md:py-2 lg:justify-start lg:py-0">
                                    <div className="relative h-10 w-10 overflow-hidden rounded-[50%]">
                                        <Image
                                            fill
                                            src={
                                                conversation?.user?.profileImage
                                                    ? conversation?.user?.profileImage
                                                    : Avatar
                                            }
                                            alt="Fallback Avatar"
                                            priority
                                        />
                                    </div>

                                    {!!conversation?.unreadMessagesCount && (
                                        <div
                                            id="#tablet"
                                            className="absolute left-12 hidden  h-5 w-5 items-center justify-center rounded-full bg-[#DB0505] text-[10px] text-white md:flex lg:hidden"
                                        >
                                            {conversation.unreadMessagesCount}
                                        </div>
                                    )}

                                    <div className="ml-6 flex h-full flex-col  items-center justify-center md:hidden lg:flex">
                                        <span className="text-[14px] font-semibold text-[#484848]">
                                            {conversation?.user?.firstname ?? ''}
                                        </span>
                                    </div>
                                </div>
                                {!!conversation?.unreadMessagesCount && (
                                    <div className="flex h-5 w-5 items-center  justify-center rounded-full bg-[#DB0505] md:hidden lg:flex">
                                        <span className="text-center text-[10px] text-white">
                                            {conversation.unreadMessagesCount}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ))}

                {hasNextPageByTab && (
                    <div className="my-6 flex w-full justify-center" ref={inViewLoaderDomRef}>
                        <Spinner size="small" />
                    </div>
                )}
            </div>
        </section>
    )
}
