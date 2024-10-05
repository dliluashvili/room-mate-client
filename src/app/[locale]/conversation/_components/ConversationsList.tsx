'use client'

import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { useRouter, useSearchParams } from 'next/navigation'
import { useVirtualizer } from '@tanstack/react-virtual'
import {
    ConversationStatus,
    ConversationWithUserObject,
    PaginationInfoObject,
} from '@/graphql/typesGraphql'
import { MEDIA_QUERY } from '../constants'
import { LIMIT } from '@/src/constants/pagination'
import { Spinner } from '@/src/components/ui/spinner'
import { cn } from '@/src/utils/cn'
import Avatar from '@images/UniversalAvatar.webp'
import Image from 'next/image'
import { RequestConversation } from '@/src/components/svgs'
import { useTranslation } from 'react-i18next'

type Props = {
    request: boolean
    setRequest: Dispatch<SetStateAction<boolean>>
    setMobileOpen: Dispatch<SetStateAction<boolean>>
    conversations: ConversationWithUserObject[] | []
    pageInfo: PaginationInfoObject | null
    // FIXME: because argument and return types is not fully typed, autosuggestion is not working
    fetchMoreConversationsForUser: Function
    data: any // need type
    mobileOpen: boolean
}

const CONVERSATION_BOX_ESTIMATE_HEIGHT = 80

export default function ConversationsList({
    request,
    setRequest,
    setMobileOpen,
    conversations,
    pageInfo,
    data,
    fetchMoreConversationsForUser,
}: Props) {
    const [requestMessage, setRequestMessage] = useState(false)

    const parentDomRef = useRef<HTMLDivElement>(null)

    const router = useRouter()

    const searchParams = useSearchParams()
    const conversationIdFromParam = searchParams.get('id')

    const media = useMediaQuery({ query: MEDIA_QUERY })

    const { t } = useTranslation()

    const virtualizer = useVirtualizer({
        count: pageInfo?.hasNextPage ? conversations.length + 1 : conversations.length,
        getScrollElement: () => parentDomRef.current,
        estimateSize: () => CONVERSATION_BOX_ESTIMATE_HEIGHT,
        overscan: 5,
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
        setRequest(false)
    }

    const requestClickHandler = () => {
        setRequest(true)
    }

    // useEffect(() => {
    //     const [lastVirtualItem] = [...virtualizer.getVirtualItems()].reverse()

    //     if (!lastVirtualItem) {
    //         return
    //     }

    //     if (lastVirtualItem.index >= conversations.length - 1 && pageInfo?.hasNextPage) {
    //         fetchMoreConversationsForUser({
    //             variables: {
    //                 pagination: {
    //                     offset: conversations.length,
    //                     limit: LIMIT,
    //                 },
    //             },
    //         })
    //     }
    // }, [pageInfo?.hasNextPage, virtualizer.getVirtualItems(), conversations.length])

    useEffect(() => {
        const hasRequested =
            data &&
            data.list.some(
                (item: { status: ConversationStatus; unreadMessagesCount: number }) =>
                    (item?.status === ConversationStatus.Requested ||
                        item?.status === ConversationStatus.Rejected) &&
                    item?.unreadMessagesCount > 0
            )

        if (hasRequested) {
            setRequestMessage(true)
        } else {
            setRequestMessage(false)
        }
    }, [data, request])

    useEffect(() => {
        const filteredAccepts = data?.list?.filter(
            (item: { status: ConversationStatus }) => item.status === ConversationStatus.Accepted
        )

        const filteredRequestsRejects = data?.list?.filter(
            (item: { status: ConversationStatus }) =>
                item.status === ConversationStatus.Rejected ||
                item.status === ConversationStatus.Requested
        )

        if (filteredAccepts?.length === 0 && filteredRequestsRejects?.length !== 0) {
            setRequest(true)
        }
    }, [data])

    return (
        <section className="flex w-full flex-col items-start rounded-md border-[gray] bg-[#FFFFFF] md:w-[100px] md:border-b-4 lg:w-[400px]">
            <div className="block w-full">
                <div className="flex flex-row items-center justify-start gap-6 px-6 py-2 md:flex-col lg:flex-row">
                    <span
                        className={cn(
                            'cursor-pointer',
                            !request && 'text-[#0A7CFF]',
                            request && 'text-[#838CAC]'
                        )}
                        onClick={chatClickHandler}
                    >
                        {t('chat')}
                    </span>
                    <span
                        className={cn(
                            'relative cursor-pointer',
                            request && 'text-[#0A7CFF]',
                            !request && 'text-[#838CAC]'
                        )}
                        onClick={requestClickHandler}
                    >
                        {t('request')}
                        {requestMessage && (
                            <div className="absolute -right-4 -top-1.5 z-50 ">
                                <RequestConversation className="h-4 w-4" />
                            </div>
                        )}
                    </span>
                </div>
            </div>
            <div className="w-full overflow-auto" ref={parentDomRef}>
                <div
                    className="relative w-full"
                    style={{
                        height: `${virtualizer.getTotalSize() + 50}px`,
                    }}
                >
                    {virtualizer.getVirtualItems().map((virtualRow) => {
                        const isLoaderRow = virtualRow.index > conversations.length - 1

                        const conversation = conversations[virtualRow.index]

                        return (
                            <div
                                key={virtualRow.index}
                                data-index={virtualRow.index}
                                ref={virtualizer.measureElement}
                                className={cn(
                                    'absolute flex w-full cursor-pointer flex-row items-center justify-center border-b-2 border-[#E3E3E3] px-6 py-2 md:p-0 lg:justify-between lg:px-4 lg:py-2',
                                    conversation?.id === conversationIdFromParam
                                        ? 'bg-[#e7e7fe]'
                                        : ''
                                )}
                                style={{
                                    transform: `translateY(${virtualRow.start}px)`,
                                }}
                                onClick={() =>
                                    !isLoaderRow ? handleClickConversation(conversation.id) : {}
                                }
                            >
                                <div className="relative flex h-full w-full flex-row items-center justify-start md:justify-center md:py-2 lg:justify-start lg:py-0">
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
                        )
                    })}
                    {(() => (
                        <div
                            className={cn(
                                'absolute bottom-0 flex w-full cursor-pointer flex-row items-center justify-center border-b-2 border-[#E3E3E3] px-6 py-2 md:p-0 lg:justify-between lg:px-4 lg:py-2'
                            )}
                            onClick={() =>
                                fetchMoreConversationsForUser({
                                    variables: {
                                        pagination: {
                                            offset: conversations.length,
                                            limit: LIMIT,
                                        },
                                    },
                                })
                            }
                        >
                            load more
                        </div>
                    ))()}
                </div>
            </div>
        </section>
    )
}
