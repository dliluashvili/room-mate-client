import { ConversationStatus, ConversationWithUserObject } from '@/graphql/typesGraphql'

import { getConversationsForUserQuery, getSharedConversationQuery } from '@/graphql/query'
import { client } from '@/src/libs/apollo/client'

const checkConversationExistenceInCache = (participantId: string, status: ConversationStatus) => {
    const apolloClient = client()

    const conversationsFromCache = apolloClient.cache.readQuery({
        query: getConversationsForUserQuery,
        variables: {
            status,
        },
    })

    const sharedConversationFromCache = conversationsFromCache?.getConversationsForUser?.list?.find(
        (conversation) => conversation?.user?.id === participantId
    )

    return sharedConversationFromCache
}

export const checkConversationExistence = async (
    participantId: string
): Promise<ConversationWithUserObject | null> => {
    const apolloClient = client()

    const checkChatConversationExistenceInCache = checkConversationExistenceInCache(
        participantId,
        ConversationStatus.Accepted
    )

    // local storage check
    if (checkChatConversationExistenceInCache) {
        return checkChatConversationExistenceInCache
    }

    const checkRequestedConversationExistenceInCache = checkConversationExistenceInCache(
        participantId,
        ConversationStatus.Requested
    )

    if (checkRequestedConversationExistenceInCache) {
        return checkRequestedConversationExistenceInCache
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
            variables: {
                status: newConversation.status,
            },
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
