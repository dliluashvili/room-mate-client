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
    fetchPolicy: "network-only",
  });

  // db check
  if (data?.getSharedConversation) {
    updateCacheWithNewConversationInFirstPlace(data.getSharedConversation);

    return data.getSharedConversation;
  }

  return null;
};

export const updateCacheWithNewConversationInFirstPlace = (
  newConversation: ConversationWithUserObject
) => {
  const client = makeApolloClient();
  console.log({ newConversation });

  client.cache.updateQuery(
    {
      query: getConversationsForUserQuery,
    },
    (data) => {
      if (data?.getConversationsForUser) {
        return {
          ...data,
          getConversationsForUser: {
            ...data.getConversationsForUser,
            list: [newConversation, ...data.getConversationsForUser.list],
          },
        };
      }
    }
  );
};
