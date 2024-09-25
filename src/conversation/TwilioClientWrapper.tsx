'use client'

import { useInitializeTwilioClient } from './useInitializeTwilioClient'
import { useInitializeConversationNotification } from './useConversationNotification'
import { useConversationStatusUpdate } from './useConversationStatusUpdate'

export default function TwilioClientWrapper({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    useInitializeTwilioClient()
    useInitializeConversationNotification()
    useConversationStatusUpdate()

    return <>{children}</>
}
