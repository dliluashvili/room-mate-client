'use client'

import React, { useEffect, useState } from 'react'
import { useReactiveVar } from '@apollo/client'
import { useSearchParams } from 'next/navigation'
import ConversationsList from '../_components/ConversationsList'
import Conversation from '../_components/Conversation'
import { useMediaQuery } from 'react-responsive'
import { TwilioDisconnectionAlertDialog } from '../_components/TwilioDisconnectionAlertDialog'
import { MEDIA_QUERY } from '../constants'
import { twilioConnectionStateVar } from '@/src/conversation/conversationVars'
import { Spinner } from '@/src/components/ui/spinner'
import { withAuth } from '@/src/auth/withAuth'
import { TabTypes } from '../types'

const ClientWrapper = () => {
    const [activeTab, setActiveTab] = useState<TabTypes>('chats')
    const [mobileOpen, setMobileOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const isDesktop = useMediaQuery({
        query: MEDIA_QUERY,
    })

    const searchParams = useSearchParams()
    const activeConversationId = searchParams.get('id')

    const twilioConnectionState = useReactiveVar(twilioConnectionStateVar)

    useEffect(() => {
        if (!isDesktop) {
            if (activeConversationId) {
                setMobileOpen(true)
            } else if (!activeConversationId) {
                setMobileOpen(false)
            }
        }
    }, [isDesktop, activeConversationId])

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
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        activeConversationId={activeConversationId}
                        mobileOpen={mobileOpen}
                        setMobileOpen={setMobileOpen}
                    />

                    <Conversation
                        key={activeConversationId}
                        mobileOpen={mobileOpen}
                        setMobileOpen={setMobileOpen}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                </div>
            </main>
        </>
    )
}

export default withAuth(ClientWrapper)
