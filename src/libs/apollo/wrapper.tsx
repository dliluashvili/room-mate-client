'use client'

import { PropsWithChildren } from 'react'
import { ApolloNextAppProvider } from '@apollo/experimental-nextjs-app-support'
import { client } from './client'

export function ApolloWrapper({ children }: PropsWithChildren) {
    return <ApolloNextAppProvider makeClient={client}>{children}</ApolloNextAppProvider>
}
