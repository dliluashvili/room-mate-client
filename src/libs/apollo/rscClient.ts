import {
    registerApolloClient,
    ApolloClient,
    InMemoryCache,
} from '@apollo/experimental-nextjs-app-support'
import { links } from './links'

export const { getClient } = registerApolloClient(() => {
    return new ApolloClient({
        cache: new InMemoryCache(),
        link: links,
        defaultOptions: {
            watchQuery: {
                errorPolicy: 'all',
            },
            query: {
                errorPolicy: 'all',
            },
            mutate: {
                errorPolicy: 'all',
            },
        },
    })
})
