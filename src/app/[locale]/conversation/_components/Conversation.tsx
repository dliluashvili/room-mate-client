'use client'

import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import DesktopConversation from './DesktopConversation'
import MobileConversation from './MobileConversation'
import { useQuery, useReactiveVar } from '@apollo/client'
import { Client, Conversation } from '@twilio/conversations'
import { ConversationStatus, ConversationWithUserObject } from '@/graphql/typesGraphql'
import { twilioClientVar, twilioConnectionStateVar } from '@/src/conversation/conversationVars'
import { getConversationsForUserQuery } from '@/graphql/query'
import dynamic from 'next/dynamic'
import { TabTypes } from '../types'
import { LIMIT } from '@/src/constants/pagination'

const MediaQuery = dynamic(() => import('react-responsive'), {
    ssr: false,
})

type Props = {
    mobileOpen: boolean
    setMobileOpen: Dispatch<SetStateAction<boolean>>
    activeTab: TabTypes
    setActiveTab: Dispatch<SetStateAction<TabTypes>>
}

const ConversationComponent = ({ mobileOpen, setMobileOpen, setActiveTab }: Props) => {
    const [conversation, setConversation] = useState<ConversationWithUserObject | null>(null)
    const [conversationResource, setConversationResource] = useState<Conversation | null>(null)

    const twilioClient = useReactiveVar(twilioClientVar)
    const twilioClientState = useReactiveVar(twilioConnectionStateVar)

    // Conversations for user is already fetching or fetched from useNotifications hook
    // So this is why it is fetched from cache
    const { data: chatConversations } = useQuery(getConversationsForUserQuery, {
        variables: {
            status: ConversationStatus.Accepted,
        },
    })

    const { data: requestedConversations } = useQuery(getConversationsForUserQuery, {
        variables: {
            status: ConversationStatus.Requested,
        },
    })

    const searchParams = useSearchParams()
    const conversationIdFromParam = searchParams.get('id')

    const updateRequest = (conversation: ConversationWithUserObject) => {
        if (conversation.status === ConversationStatus.Requested) {
            setActiveTab('requests')
        } else if (conversation.status === ConversationStatus.Accepted) {
            setActiveTab('chats')
        }
    }

    const updateConversation = (conversations: ConversationWithUserObject[], id: string) => {
        const conversation = conversations.find((conversation) => conversation.id === id)

        if (conversation) setConversation(conversation)
    }

    const getConversationResource = async (twilioClient: Client, sid: string) => {
        try {
            const conversationResourceResponse = await twilioClient.peekConversationBySid(sid)

            setConversationResource(conversationResourceResponse)
        } catch (error) {
            console.log({ error })
        }
    }

    /*
     * useEffects start
     */
    useEffect(() => {
        if (conversationIdFromParam) {
            if (chatConversations?.getConversationsForUser?.list?.length) {
                updateConversation(
                    chatConversations.getConversationsForUser.list,
                    conversationIdFromParam
                )
            }

            if (requestedConversations?.getConversationsForUser?.list?.length) {
                updateConversation(
                    requestedConversations.getConversationsForUser.list,
                    conversationIdFromParam
                )
            }
        }
    }, [chatConversations, requestedConversations, conversationIdFromParam])

    useEffect(() => {
        if (conversation) {
            updateRequest(conversation)
        }
    }, [conversation])

    useEffect(() => {
        if (conversation && twilioClient && twilioClientState === 'connected') {
            getConversationResource(twilioClient, conversation.sid)
        }
    }, [conversation, twilioClientState])

    return (
        <>
            <MediaQuery minWidth={768}>
                <DesktopConversation
                    conversationResource={conversationResource}
                    conversation={conversation}
                    setActiveTab={setActiveTab}
                />
            </MediaQuery>
            <MediaQuery maxWidth={768}>
                <MobileConversation
                    conversationResource={conversationResource}
                    conversation={conversation}
                    mobileOpen={mobileOpen}
                    setMobileOpen={setMobileOpen}
                    setActiveTab={setActiveTab}
                />
            </MediaQuery>
        </>
    )
}

export default ConversationComponent
