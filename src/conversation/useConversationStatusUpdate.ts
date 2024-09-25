import { useApolloClient, useReactiveVar } from '@apollo/client'
import { useEffect, useRef } from 'react'
import { amIUpdaterOfStatusVar, twilioClientVar } from './conversationVars'
import { Conversation, ConversationUpdateReason } from '@twilio/conversations'
import { getConversationsForUserQuery } from '@/graphql/query'
import {
    ConversationStatus,
    ConversationWithUserObject,
    UserPreviewObject,
} from '@/graphql/typesGraphql'

export const useConversationStatusUpdate = () => {
    const twilioClient = useReactiveVar(twilioClientVar)
    const amIUpdaterOfStatus = useReactiveVar(amIUpdaterOfStatusVar)

    const amIUpdaterOfStatusRef = useRef<boolean>()

    const client = useApolloClient()

    const updateConversationStatusInCache = (data: {
        conversation: Conversation
        updateReasons: ConversationUpdateReason[]
    }) => {
        const { conversation, updateReasons } = data

        if (!updateReasons.includes('state') || !conversation || amIUpdaterOfStatusRef.current) {
            return
        }

        client.cache.updateQuery({ query: getConversationsForUserQuery }, (cacheData) => {
            if (!cacheData?.getConversationsForUser?.list) return cacheData

            const updateConversations = cacheData.getConversationsForUser.list.map(
                (conversationObject): ConversationWithUserObject => {
                    if (conversationObject.sid === conversation.sid) {
                        return {
                            ...conversationObject,
                            user: {
                                ...(conversationObject.user as UserPreviewObject),
                                conversationStatus:
                                    conversation?.state?.current === 'active'
                                        ? ConversationStatus.Accepted
                                        : ConversationStatus.Rejected,
                            },
                        }
                    }
                    return conversationObject
                }
            )

            return {
                ...cacheData,
                getConversationsForUser: {
                    ...cacheData.getConversationsForUser,
                    list: updateConversations,
                },
            }
        })

        amIUpdaterOfStatusVar(false)
    }

    useEffect(() => {
        if (twilioClient) {
            twilioClient.addListener('conversationUpdated', updateConversationStatusInCache)
        }

        ;() => {
            if (twilioClient) {
                return twilioClient.removeListener(
                    'conversationUpdated',
                    updateConversationStatusInCache
                )
            }
        }
    }, [twilioClient])

    /**
     * directly amIUpdaterOfStatus actual reassigned value is not readable in updateConversationStatusInCache
     * maybe because function already set in listener and can not read outside states
     */
    useEffect(() => {
        amIUpdaterOfStatusRef.current = amIUpdaterOfStatus
    }, [amIUpdaterOfStatus])
}
