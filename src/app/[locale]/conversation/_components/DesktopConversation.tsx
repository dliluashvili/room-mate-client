'use client'

import Image from 'next/image'
import { Send } from '@/src/components/svgs'
import MessagesList from './MessagesList'
import { Conversation } from '@twilio/conversations'
import { useRef, useState, KeyboardEvent, Dispatch, SetStateAction } from 'react'
import AutosizeTextarea from 'react-textarea-autosize'
import Avatar from '@images/UniversalAvatar.webp'
import { useApolloClient, useMutation } from '@apollo/client'
import {
    updateConversationResourceStateMutation,
    updateConversationStatusMutation,
} from '@/graphql/mutation'
import { ConversationStatus, ConversationWithUserObject } from '@/graphql/typesGraphql'
import { getConversationsForUserQuery } from '@/graphql/query'
import { useTranslation } from 'react-i18next'
import { amIUpdaterOfStatusVar } from '@/src/conversation/conversationVars'
import { TabTypes } from '../types'

type Props = {
    conversationResource: Conversation | null
    conversation: ConversationWithUserObject | null
    setActiveTab: Dispatch<SetStateAction<TabTypes>>
}

export default function DesktopConversation({
    conversationResource,
    conversation,
    setActiveTab,
}: Props) {
    const [message, setMessage] = useState('')

    const headerRef = useRef<HTMLDivElement>(null)

    const { t } = useTranslation('conversation')

    const client = useApolloClient()

    const [updateConversationStatus, { loading }] = useMutation(updateConversationStatusMutation, {
        onCompleted: (response) => {
            client.cache.updateQuery({ query: getConversationsForUserQuery }, (data) => {
                if (!data?.getConversationsForUser?.list) return data

                const updatedList = data.getConversationsForUser.list.map((userConversation) =>
                    userConversation.id === conversation?.id
                        ? { ...userConversation, status: response.updateConversationStatus }
                        : userConversation
                )

                const updatedConversationIndex = updatedList.findIndex(
                    (userConversation) => userConversation.id === conversation?.id
                )

                let reorderedList = updatedList
                if (updatedConversationIndex > 0) {
                    const [updatedConversation] = updatedList.splice(updatedConversationIndex, 1)
                    reorderedList = [updatedConversation, ...updatedList]
                }

                return {
                    ...data,
                    getConversationsForUser: {
                        ...data.getConversationsForUser,
                        list: reorderedList,
                    },
                }
            })
        },
    })

    const [updateConversationResourceState] = useMutation(updateConversationResourceStateMutation)

    const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(event.target.value)
    }

    const handleSendMessage = () => {
        if (
            conversationResource &&
            message.length &&
            conversation?.user?.conversationStatus !== ConversationStatus.Rejected
        ) {
            conversationResource.sendMessage(message)
            setMessage('')
        }
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            handleSendMessage()
        }
    }

    const handleAcceptClick = () => {
        amIUpdaterOfStatusVar(true)

        setActiveTab('chats')

        if (conversation) {
            updateConversationStatus({
                variables: {
                    conversationId: conversation.id,
                    status: ConversationStatus.Accepted,
                },
            })

            if (conversationResource?.state?.current === 'inactive') {
                updateConversationResourceState({
                    variables: {
                        sid: conversationResource.sid,
                        state: 'active',
                    },
                })
            }
        }
    }

    const handleRejectClick = async () => {
        amIUpdaterOfStatusVar(true)

        if (conversation) {
            updateConversationStatus({
                variables: {
                    conversationId: conversation.id,
                    status: ConversationStatus.Rejected,
                },
            })

            if (conversationResource?.state?.current === 'active') {
                updateConversationResourceState({
                    variables: {
                        sid: conversationResource.sid,
                        state: 'inactive',
                    },
                })
            }
        }
    }

    const containerHeight = headerRef.current?.clientHeight
        ? `calc(100% - ${headerRef.current.clientHeight}px)`
        : '100%'

    const participantFullName =
        conversation?.user?.firstname && conversation?.user?.lastname
            ? `${conversation.user.firstname} ${conversation.user.lastname}`
            : 'User'

    return (
        <>
            <section className="ml-6 hidden w-full flex-col overflow-hidden rounded-md border-b-4 border-[gray] bg-[#FFFFFF] md:flex">
                <div
                    ref={headerRef}
                    className="flex w-full flex-row items-center justify-between px-6 pb-4 pt-4 shadow-md"
                >
                    <div className="flex flex-row items-center">
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

                        <div className="ml-4 flex flex-col justify-between">
                            <span>{participantFullName}</span>
                        </div>
                    </div>
                </div>

                {(() => {
                    if (conversation?.status === ConversationStatus.Accepted) {
                        return (
                            <div
                                className="flex w-full flex-col justify-end px-2  py-2 pt-5"
                                style={{
                                    height: containerHeight,
                                }}
                            >
                                <MessagesList
                                    conversationResource={conversationResource}
                                    conversation={conversation}
                                />
                                {conversation?.user?.conversationStatus !==
                                ConversationStatus.Rejected ? (
                                    <div className="flex h-auto w-full flex-row items-center px-3 py-4 ">
                                        <AutosizeTextarea
                                            placeholder={t('sendMessage')}
                                            className="scrollable-content inset-0 mr-2 max-h-20 w-full rounded-xl border border-[gray]  px-3 py-2 text-[14px] focus:outline-[#838CAC]"
                                            value={message}
                                            onChange={handleMessageChange}
                                            onKeyDown={handleKeyDown}
                                        />

                                        <Send className="h-6 w-6" />
                                    </div>
                                ) : (
                                    <div className="flex h-auto w-full flex-row items-center justify-center px-3 py-4 text-center ">
                                        {t('rejected')}
                                    </div>
                                )}
                            </div>
                        )
                    }

                    if (
                        conversation?.status === ConversationStatus.Requested ||
                        conversation?.status === ConversationStatus.Rejected
                    ) {
                        return (
                            <div
                                className="flex w-full flex-col justify-end  p-5"
                                style={{
                                    height: containerHeight,
                                }}
                            >
                                <MessagesList
                                    conversationResource={conversationResource}
                                    conversation={conversation}
                                />

                                {conversationResource && (
                                    <div
                                        style={{
                                            backgroundColor:
                                                conversation?.status ===
                                                ConversationStatus.Requested
                                                    ? '#838CAC'
                                                    : '#c25744',
                                        }}
                                        className="flex  h-auto w-full flex-col items-center justify-between gap-5 rounded-lg px-10 py-6 xl:flex-row"
                                    >
                                        <span className="text-center text-[#FFFFFF]">
                                            {conversation?.status === ConversationStatus.Requested
                                                ? t('acceptReject', {
                                                      receiverName: participantFullName,
                                                  })
                                                : t('rejectedMessages', { participantFullName })}
                                        </span>
                                        <div className=" flex flex-row items-center  gap-4">
                                            <button
                                                className="rounded-xl bg-white px-14 py-3 text-[#838CAC]"
                                                disabled={loading}
                                                onClick={handleAcceptClick}
                                            >
                                                {t('accept')}
                                            </button>
                                            {conversation?.status ===
                                                ConversationStatus.Requested && (
                                                <button
                                                    className="rounded-xl border border-[#FFFFFF] px-14 py-3 text-[#FFFFFF]"
                                                    disabled={loading}
                                                    onClick={handleRejectClick}
                                                >
                                                    {t('reject')}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    }
                })()}
            </section>
        </>
    )
}
