import { ApolloLink, DefaultContext, HttpLink } from '@apollo/client'
import { RestLink } from 'apollo-link-rest'
import { errorLink } from './errorLink'

const authLink = new ApolloLink((operation, forward) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token')
        if (token) {
            operation.setContext(({ headers }: DefaultContext) => ({
                headers: {
                    ...headers,
                    authorization: `Bearer ${token}`,
                    'apollo-require-preflight': 'true',
                },
            }))
        }
    }
    return forward(operation)
})

const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_API,
    headers: {
        'apollo-require-preflight': 'true',
    },
})

const restLink = new RestLink({ uri: process.env.NEXT_PUBLIC_REST_API })

const links = ApolloLink.from([errorLink, authLink, restLink, httpLink])

export { authLink, httpLink, restLink, links }
