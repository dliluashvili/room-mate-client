'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery, useReactiveVar } from '@apollo/client'
import { useRouter, useSearchParams } from 'next/navigation'
import ConversationsList from '../_components/ConversationsList'
import Conversation from '../_components/Conversation'
import { useMediaQuery } from 'react-responsive'
import { TwilioDisconnectionAlertDialog } from '../_components/TwilioDisconnectionAlertDialog'
import { MEDIA_QUERY } from '../constants'
import { LIMIT, OFFSET } from '@/src/constants/pagination'
import { twilioConnectionStateVar } from '@/src/conversation/conversationVars'
import { getConversationsForUserQuery } from '@/graphql/query'
import { ConversationStatus } from '@/graphql/typesGraphql'
import { Spinner } from '@/src/components/ui/spinner'
import { withAuth } from '@/src/auth/withAuth'

const ClientWrapper = () => {
    const [request, setRequest] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const isDesktop = useMediaQuery({
        query: MEDIA_QUERY,
    })

    const searchParams = useSearchParams()
    const conversationIdFromParam = searchParams.get('id')

    const twilioConnectionState = useReactiveVar(twilioConnectionStateVar)

    // useEffect(() => {
    //     if (filteredConversationsByStatus.length && !conversationIdFromParam && isDesktop) {
    //         router.replace(`/conversation?id=${filteredConversationsByStatus[0].id}`)
    //     }

    //     if (filteredConversationsByStatus.length && conversationIdFromParam) {
    //         router.replace(`/conversation?id=${conversationIdFromParam}`)
    //     }
    // }, [filteredConversationsByStatus])

    // useEffect(() => {
    //     if (filteredConversationsByStatus.length && conversationIdFromParam) {
    //         router.replace(`/conversation?id=${filteredConversationsByStatus[0].id}`)
    //     }
    //     if (!filteredConversationsByStatus.length && conversationIdFromParam) {
    //         router.replace(`/conversation`)
    //     }
    // }, [request])

    useEffect(() => {
        if (!isDesktop) {
            if (conversationIdFromParam) {
                setMobileOpen(true)
            } else if (!conversationIdFromParam) {
                setMobileOpen(false)
            }
        }
    }, [isDesktop, conversationIdFromParam])

    useEffect(() => {
        setIsLoading(false)
    }, [])

    const isTwilioConnectionDown =
        twilioConnectionState === 'disconnected' || twilioConnectionState === 'denied'

    if (isLoading) {
        return (
            <div className="flex h-20 w-full items-center justify-center">
                <Spinner />
            </div>
        )
    }

    return (
        <>
            <TwilioDisconnectionAlertDialog open={isTwilioConnectionDown} />
            <main className="flex h-full w-full flex-col overflow-hidden overscroll-none md:h-[calc(100vh-150px)]">
                <div className="relative flex h-full flex-grow flex-row overflow-hidden bg-[#F5F5F5] md:px-20 md:py-6 xl:px-24">
                    <ConversationsList
                        request={request}
                        setRequest={setRequest}
                        mobileOpen={mobileOpen}
                        setMobileOpen={setMobileOpen}
                    />

                    <Conversation
                        key={conversationIdFromParam}
                        mobileOpen={mobileOpen}
                        setMobileOpen={setMobileOpen}
                        setRequest={setRequest}
                    />
                </div>
            </main>
        </>
    )
}

export default withAuth(ClientWrapper)
