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
                                if (!existing) {
                                    return incoming
                                }

                                // If any client write happens, the merge function is called.
                                // In this case cache should be replaced.
                                if (!pagination) {
                                    return {
                                        ...existing,
                                        list: incoming.list,
                                    }
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

function offsetFromCursor(items: any, cursor: any, readField: any) {
    // Search from the back of the list because the cursor we're
    // looking for is typically the ID of the last item.
    for (let i = items.length - 1; i >= 0; --i) {
        const item = items[i]
        // Using readField works for both non-normalized objects
        // (returning item.id) and normalized references (returning
        // the id field from the referenced entity object), so it's
        // a good idea to use readField when you're not sure what
        // kind of elements you're dealing with.
        if (readField('id', item) === cursor) {
            // Add one because the cursor identifies the item just
            // before the first item in the page we care about.
            return i + 1
        }
    }
    // Report that the cursor could not be found.
    return -1
}

// console.log({ cursor, existing, incoming })
