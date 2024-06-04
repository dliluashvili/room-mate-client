import { TypedDocumentNode, gql } from "@apollo/client";
import {
  Mutation,
  MutationLookupOrCreateTwilioUserResourceArgs,
  MutationUpdateConversationStatusArgs,
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

const updateConversationStatusMutation: TypedDocumentNode<
  { updateConversationStatus: Mutation["updateConversationStatus"] },
  MutationUpdateConversationStatusArgs
> = gql`
  mutation UpdateConversationStatusMutation(
    $conversationId: String!
    $status: ConversationStatus!
  ) {
    updateConversationStatus(conversationId: $conversationId, status: $status)
  }
`;

const lookupOrCreateTwilioUserResourceMutation: TypedDocumentNode<
  {
    lookupOrCreateTwilioUserResource: Mutation["lookupOrCreateTwilioUserResource"];
  },
  MutationLookupOrCreateTwilioUserResourceArgs
> = gql`
  mutation Mutation($userId: String!) {
    lookupOrCreateTwilioUserResource(userId: $userId)
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
        messages @client
        user {
          id
          firstname
          lastname
          profileImage
          conversationStatus
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
  query GetSharedConversation($participantId: String!) {
    getSharedConversation(participantId: $participantId) {
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
        conversationStatus
      }
    }
  }
`;

export {
  generateTwilioAccessTokenMutation,
  logConnectionErrorMutation,
  lookupOrCreateTwilioUserResourceMutation,
  updateConversationStatusMutation,
  getConversationsForUserQuery,
  getSharedConversationQuery,
};
