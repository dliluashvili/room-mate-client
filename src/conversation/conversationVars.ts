import { makeVar } from '@apollo/client'
import type { Client, ConnectionState, Conversation } from '@twilio/conversations'

const twilioClientVar = makeVar<Client | null>(null)
const twilioConnectionStateVar = makeVar<ConnectionState>('unknown')
const twilioConversationsVar = makeVar<Conversation[] | []>([])

const amIUpdaterOfStatusVar = makeVar<boolean>(false)

export { twilioClientVar, twilioConnectionStateVar, twilioConversationsVar, amIUpdaterOfStatusVar }
