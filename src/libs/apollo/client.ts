import { ApolloClient, InMemoryCache } from '@apollo/experimental-nextjs-app-support'
import { links } from './links'
import { NormalizedCacheObject } from '@apollo/client'
import { PaginatedConversationWithUserObject } from '@/graphql/typesGraphql'

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined

export function client() {
    if (apolloClient) {
        return apolloClient
    }

    apolloClient = new ApolloClient({
        cache: new InMemoryCache({
            typePolicies: {
                Query: {
                    fields: {
                        getConversationsForUser: {
                            keyArgs: ['status'],
                            merge(
                                existing: PaginatedConversationWithUserObject,
                                incoming: PaginatedConversationWithUserObject,
                                // @ts-ignore
                                { args: { pagination } }
                            ) {
                                // If any client write happens, the merge function is called.
                                // In this case cache should be replaced.
                                if (!existing || !pagination) {
                                    return incoming
                                }

                                // While two query runs parallel, accidentally data is merged and duplicated
                                // This clause protects from it
                                if (incoming.pageInfo.cursor === existing.pageInfo.cursor) {
                                    return existing
                                }

                                return {
                                    ...existing,
                                    list: [
                                        ...(existing.list ? existing.list : []),
                                        ...(incoming.list ? incoming.list : []),
                                    ],
                                    pageInfo: incoming.pageInfo,
                                }
                            },
                        },
                    },
                },
                ConversationWithUserObject: {
                    fields: {
                        unreadMessagesCount: {
                            read(incoming: any) {
                                return incoming ?? 0
                            },
                        },
                        messages: {
                            read(existing: any) {
                                return existing ?? []
                            },
                        },
                    },
                },
            },
        }),
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

    return apolloClient
}
