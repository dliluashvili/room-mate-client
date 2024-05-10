import { TypedDocumentNode, gql } from '@apollo/client';
import { Query, QueryGetConversationsForUserArgs } from './graphql';

const generateTwilioAccessTokenMutation = gql`
    mutation GenerateTwilioAccessToken {
        generateTwilioAccessToken
    }
`;

const logConnectionErrorMutation = gql`
    mutation LogConnectionError($error: String!) {
        logConnectionError(error: $error)
    }
`;

const getConversationsForUserQuery: TypedDocumentNode<
    { getConversationsForUser: Query['getConversationsForUser'] },
    QueryGetConversationsForUserArgs
> = gql`
    query GetConversationsForUser($pagination: PaginationInput) {
        getConversationsForUser(pagination: $pagination) {
            list {
                id
                sid
                createdAt
                updatedAt
                user {
                    id
                    firstname
                    lastname
                    profileImage
                }
                unreadMessagesCount @client
            }
            pageInfo {
                hasNextPage
                hasPrevious
                offset
                limit
                total
                page
            }
        }
    }
`;

export {
    generateTwilioAccessTokenMutation,
    logConnectionErrorMutation,
    getConversationsForUserQuery,
};
