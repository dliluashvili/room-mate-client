import { TypedDocumentNode, gql } from "@apollo/client";
import {
  Query,
  QueryGetConversationsForUserArgs,
  QueryGetSharedConversationArgs,
} from "./graphql";

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
  { getConversationsForUser: Query["getConversationsForUser"] },
  QueryGetConversationsForUserArgs
> = gql`
  query GetConversationsForUser($pagination: PaginationInput) {
    getConversationsForUser(pagination: $pagination) {
      list {
        id
        sid
        status
        creatorId
        createdAt
        updatedAt
        unreadMessagesCount @client
        user {
          id
          firstname
          lastname
          profileImage
        }
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

const getSharedConversationQuery: TypedDocumentNode<
  { getSharedConversation: Query["getSharedConversation"] },
  QueryGetSharedConversationArgs
> = gql`
  query GetSharedConversation($targetUserId: String!) {
    getSharedConversation(targetUserId: $targetUserId) {
      id
      sid
      status
      creatorId
      createdAt
      updatedAt
      user {
        id
        firstname
        lastname
        profileImage
      }
    }
  }
`;

export {
  generateTwilioAccessTokenMutation,
  logConnectionErrorMutation,
  getConversationsForUserQuery,
  getSharedConversationQuery,
};
