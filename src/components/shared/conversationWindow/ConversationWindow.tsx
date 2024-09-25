'use client'

import { CloseCircle, Send } from '@/src/components/svgs'
import Image from 'next/image'
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import { useMediaQuery } from 'react-responsive'
import { useLazyQuery, useMutation } from '@apollo/client'
import { useTranslation } from 'react-i18next'
import { twilioClientVar } from '@/src/conversation/conversationVars'
import { getSharedConversationQuery } from '@/graphql/query'
import { lookupOrCreateTwilioUserResourceMutation } from '@/graphql/mutation'
import { Spinner } from '@/src/components/ui/spinner'
import { MessageSendStatusType } from '@/src/types/conversation'
import { MessageAlertDialog } from './MessageAlertDialog'
import { updateCacheWithNewConversationInFirstPlace } from '@/src/conversation/conversationUtils'
import Avatar from '@images/UniversalAvatar.webp'

type MessageSendStatus = {
    type: MessageSendStatusType
    feedback: string
}

type Props = {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    name: string
    participantId: string
    avatar: string
}

export default function ConversationWindow({ setIsOpen, name, participantId, avatar }: Props) {
    const [messageText, setMessageText] = useState('')
    const [messageSendStatus, setMessageSendStatus] = useState<MessageSendStatus | null>(null)

    const [isLoading, setIsLoading] = useState(false)

    const ref = useRef<HTMLDivElement>(null)

    let { t } = useTranslation('common')

    const media = useMediaQuery({ maxWidth: 768 })

    const twilioClient = twilioClientVar()

    const [getSharedConversation] = useLazyQuery(getSharedConversationQuery, {
        fetchPolicy: 'network-only',
    })

    const [lookupOrCreateTwilioUserResource] = useMutation(lookupOrCreateTwilioUserResourceMutation)

    const updateConversationCacheWithNewConversation = async (participantId: string) => {
        const { data } = await getSharedConversation({
            variables: { participantId },
        })

        if (data?.getSharedConversation) {
            updateCacheWithNewConversationInFirstPlace(data.getSharedConversation)
        }
    }

    const handleClose = () => {
        setIsOpen(false)
        if (ref.current) {
            enableBodyScroll(ref.current)
        }
    }

    const handleMessageChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setMessageText(event.target.value)
    }

    const handleSendMessage = async () => {
        try {
            setIsLoading(true)

            if (messageText?.length) {
                const twilioUserResourceResponse = await lookupOrCreateTwilioUserResource({
                    variables: { userId: participantId },
                })

                if (twilioUserResourceResponse) {
                    const conversation = await twilioClient!.createConversation()

                    const settledParticipantAdd = await Promise.allSettled([
                        conversation.add(twilioClient!.user.identity),
                        conversation.add(participantId),
                    ])

                    const isFulfilledParticipantAdd = settledParticipantAdd.every(
                        (settledParticipant) => settledParticipant.status === 'fulfilled'
                    )

                    if (isFulfilledParticipantAdd) {
                        await conversation
                            .sendMessage(messageText)
                            .then(async () => {
                                await updateConversationCacheWithNewConversation(participantId)

                                setMessageSendStatus({
                                    type: 'messageSendSuccess',
                                    feedback: t('successMessage', { receiverName: name }),
                                })
                            })
                            .catch(async () => {
                                await updateConversationCacheWithNewConversation(participantId)

                                setMessageSendStatus({
                                    type: 'messageSendError',
                                    feedback: t('sendMessageError1'),
                                })
                            })
                    } else {
                        setMessageSendStatus({
                            type: 'anotherError',
                            feedback: t('sendMessageError2'),
                        })
                    }
                } else {
                    setMessageSendStatus({
                        type: 'anotherError',
                        feedback: t('sendMessageError2'),
                    })
                }
            }
        } catch (error) {
            console.log({ error })
            setMessageSendStatus({
                type: 'anotherError',
                feedback: t('sendMessageError2'),
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            handleSendMessage()
        }
    }

    useEffect(() => {
        if (ref.current && media) {
            disableBodyScroll(ref.current)
        }
    }, [setIsOpen])

    return messageSendStatus ? (
        <MessageAlertDialog
            feedback={messageSendStatus.feedback}
            alertType={messageSendStatus.type}
            setIsOpen={setIsOpen}
        />
    ) : (
        <div
            ref={ref}
            className="fixed bottom-0 right-0 z-50 flex h-full w-full flex-col rounded-lg border bg-[#FFFFFF] shadow-md md:right-20 md:h-[415px] md:w-[375px]"
        >
            <div className="flex w-full flex-row items-center justify-between p-6 shadow-md">
                <div className="flex w-full flex-row items-center justify-between">
                    <div className=" flex w-full flex-row items-center justify-start">
                        <div className="relative h-12 w-12">
                            <Image
                                fill
                                src={avatar ? avatar : Avatar}
                                className="rounded-full object-cover"
                                alt="Fallback Avatar"
                                priority
                            />
                        </div>
                        <div className="ml-4 flex flex-col justify-between">
                            <span>{name}</span>
                        </div>
                    </div>
                    <div className="flex h-full items-start justify-between">
                        <button onClick={handleClose} className="cursor-pointer">
                            <CloseCircle className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>
            <div className="h-full w-full px-6 "></div>
            {isLoading ? (
                <div className="flex h-full items-start justify-center">
                    <Spinner />
                </div>
            ) : (
                <div className="flex h-auto w-full flex-col items-end justify-end">
                    <div className="flex h-full w-full flex-col justify-end px-4 pb-4 pt-5">
                        <div className="mb-5 w-[300px] text-xs">
                            <p className="mb-2">{t('aboutChat1', { receiverName: name })}</p>
                            <p>{t('aboutChat2', { receiverName: name })}</p>
                        </div>
                        <textarea
                            className="text-md h-24 rounded-md border border-[#838CAC] pl-1 pt-1 focus:outline-none"
                            value={messageText}
                            onChange={handleMessageChange}
                            onKeyDown={handleKeyDown}
                        />
                        <button
                            className="mt-6 flex w-full cursor-pointer flex-row justify-end"
                            onClick={handleSendMessage}
                            disabled={isLoading}
                        >
                            <Send className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
