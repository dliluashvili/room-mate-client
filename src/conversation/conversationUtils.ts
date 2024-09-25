import { ConversationWithUserObject, Query } from '@/graphql/typesGraphql'

import { getConversationsForUserQuery, getSharedConversationQuery } from '@/graphql/query'
import { client } from '@/src/libs/apollo/client'

export const checkConversationExistence = async (
    participantId: string
): Promise<ConversationWithUserObject | null> => {
    const apolloClient = client()

    const conversationsFromCache = apolloClient.cache.readQuery({
        query: getConversationsForUserQuery,
    })

    const sharedConversationFromCache = conversationsFromCache?.getConversationsForUser?.list?.find(
        (conversation) => conversation?.user?.id === participantId
    )

    // local storage check
    if (sharedConversationFromCache) {
        return sharedConversationFromCache
    }

    const { data } = await apolloClient.query({
        query: getSharedConversationQuery,
        variables: {
            participantId,
        },
        fetchPolicy: 'network-only',
    })

    // db check
    if (data?.getSharedConversation) {
        updateCacheWithNewConversationInFirstPlace(data.getSharedConversation)

        return data.getSharedConversation
    }

    return null
}

export const updateCacheWithNewConversationInFirstPlace = (
    newConversation: ConversationWithUserObject
) => {
    const apolloClient = client()

    apolloClient.cache.updateQuery(
        {
            query: getConversationsForUserQuery,
        },
        (data) => {
            if (data?.getConversationsForUser) {
                return {
                    ...data,
                    getConversationsForUser: {
                        ...data.getConversationsForUser,
                        list: [
                            newConversation,
                            ...(data.getConversationsForUser.list?.length
                                ? data.getConversationsForUser.list
                                : []),
                        ],
                    },
                }
            }
        }
    )
}
