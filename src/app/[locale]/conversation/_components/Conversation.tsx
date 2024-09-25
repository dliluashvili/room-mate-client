'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import DesktopConversation from './DesktopConversation'
import MobileConversation from './MobileConversation'
import { useQuery, useReactiveVar } from '@apollo/client'
import { Client, Conversation } from '@twilio/conversations'
import { ConversationStatus, ConversationWithUserObject } from '@/graphql/typesGraphql'
import { twilioClientVar, twilioConnectionStateVar } from '@/src/conversation/conversationVars'
import { getConversationsForUserQuery } from '@/graphql/query'
import dynamic from 'next/dynamic'

const MediaQuery = dynamic(() => import('react-responsive'), {
    ssr: false,
})

const ConversationComponent = ({ mobileOpen, setMobileOpen, setRequest }: any) => {
    const [conversation, setConversation] = useState<ConversationWithUserObject | null>(null)
    const [conversationResource, setConversationResource] = useState<Conversation | null>(null)

    const twilioClient = useReactiveVar(twilioClientVar)
    const twilioClientState = useReactiveVar(twilioConnectionStateVar)

    // Conversations for user is already fetching or fetched from useNotifications hook
    // So this is why it is fetched from cache
    const { data } = useQuery(getConversationsForUserQuery, {
        fetchPolicy: 'cache-only',
    })

    const searchParams = useSearchParams()
    const conversationIdFromParam = searchParams.get('id')

    const updateRequest = (conversation: ConversationWithUserObject) => {
        if (conversation.status === ConversationStatus.Requested) {
            setRequest(true)
        } else if (conversation.status === ConversationStatus.Accepted) {
            setRequest(false)
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
        if (data?.getConversationsForUser?.list?.length && conversationIdFromParam) {
            updateConversation(data.getConversationsForUser.list, conversationIdFromParam)
        }
    }, [data, conversationIdFromParam])

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
                    setRequest={setRequest}
                />
            </MediaQuery>
            <MediaQuery maxWidth={768}>
                <MobileConversation
                    conversationResource={conversationResource}
                    conversation={conversation}
                    mobileOpen={mobileOpen}
                    setMobileOpen={setMobileOpen}
                    setRequest={setRequest}
                />
            </MediaQuery>
        </>
    )
}

export default ConversationComponent
