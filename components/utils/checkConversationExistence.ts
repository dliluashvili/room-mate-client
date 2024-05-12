import { ConversationWithUserObject } from "../../gql/graphql";
import {
  getConversationsForUserQuery,
  getSharedConversationQuery,
} from "../../gql/graphqlStatements";
import { makeApolloClient } from "../../providers/apolloProvider";

export const checkConversationExistence = async (
  targetUserId: string
): Promise<ConversationWithUserObject | null> => {
  const client = makeApolloClient();

  const conversationsFromCache = client.cache.readQuery({
    query: getConversationsForUserQuery,
  });

  const sharedConversationFromCache =
    conversationsFromCache?.getConversationsForUser?.list?.find(
      (conversation) => conversation?.user?.id === targetUserId
    );

  // local storage check
  if (sharedConversationFromCache) {
    return sharedConversationFromCache;
  }

  const { data } = await client.query({
    query: getSharedConversationQuery,
    variables: {
      targetUserId,
    },
  });

  // ! TODO getSharedConversation should be added to conversation list in cache
  // db check
  if (data?.getSharedConversation) {
    return data.getSharedConversation;
  }

  return null;
};
