import { useApolloClient, useQuery, useReactiveVar } from "@apollo/client";
import {
  Conversation,
  Message,
  Client as TwilioClient,
} from "@twilio/conversations";
import { useEffect, useRef } from "react";
import { twilioClientVar } from "../store/twilioVars";
import { getConversationsForUserQuery } from "../gql/graphqlStatements";
import { PaginatedConversationWithUserObject } from "../gql/graphql";
import { useTypedSelector } from "../components/hooks/useTypeSelector";

type PromisedUnreadMessagesCount = {
  sid: string;
  unreadMessagesCount: number;
};

const OFFSET = 0;
const LIMIT = 15;
const GET_CONVERSATIONS_FOR_USER_VARIABLES = {
  pagination: {
    offset: OFFSET,
    limit: LIMIT,
  },
};

export const useInitializeNotification = () => {
  const { user } = useTypedSelector((state) => state.profile);

  const isInitFunctionInitialized = useRef(false);

  const client = useApolloClient();

  const twilioClient = useReactiveVar(twilioClientVar);

  const { data } = useQuery(getConversationsForUserQuery, {
    variables: GET_CONVERSATIONS_FOR_USER_VARIABLES,
  });

  const getConversationResources = async (
    conversations: PaginatedConversationWithUserObject["list"],
    twilioClient: TwilioClient
  ) => {
    const promisedConversations =
      conversations?.map(async (conversation) => {
        return await twilioClient.getConversationBySid(conversation.sid);
      }) ?? [];

    const conversationResources = await Promise.allSettled(
      promisedConversations
    );

    return conversationResources.reduce((acc: Conversation[] | [], curr) => {
      if (curr.status === "fulfilled") return [...acc, curr.value];
      return acc;
    }, []);
  };

  const getUnreadMessagesCount = async (
    conversationResources: Conversation[] | []
  ) => {
    const promisedGetUnreadMessages =
      conversationResources?.map(async (conversationResource) => {
        const promisedUnreadMessagesCount =
          await conversationResource.getUnreadMessagesCount();

        return {
          sid: conversationResource.sid,
          promisedUnreadMessagesCount,
        };
      }) ?? [];

    const unreadMessages = await Promise.allSettled(promisedGetUnreadMessages);

    return unreadMessages.reduce(
      (acc: PromisedUnreadMessagesCount[] | [], curr) => {
        if (curr.status === "fulfilled") {
          return [
            ...acc,
            {
              sid: curr.value.sid,
              unreadMessagesCount: curr.value.promisedUnreadMessagesCount ?? 0,
            },
          ];
        }
        return acc;
      },
      []
    );
  };

  const setUnreadMessagesCount = (
    unreadMessages: PromisedUnreadMessagesCount[] | []
  ) => {
    client.cache.updateQuery(
      {
        query: getConversationsForUserQuery,
        variables: GET_CONVERSATIONS_FOR_USER_VARIABLES,
      },
      (data) => {
        if (data?.getConversationsForUser) {
          const conversationWithUnreadMessagesCount =
            data.getConversationsForUser.list?.map((conversation) => {
              const matchConversation = unreadMessages.find(
                (unreadMessage: PromisedUnreadMessagesCount) =>
                  unreadMessage.sid === conversation.sid
              );

              if (matchConversation) {
                return {
                  ...conversation,
                  unreadMessagesCount: matchConversation.unreadMessagesCount,
                };
              }

              return conversation;
            }) ?? [];

          return {
            getConversationsForUser: {
              ...data.getConversationsForUser,
              list: conversationWithUnreadMessagesCount,
            },
          };
        }
      }
    );
  };

  const init = async (
    conversations: PaginatedConversationWithUserObject["list"],
    twilioClient: TwilioClient
  ) => {
    const conversationResources = await getConversationResources(
      conversations,
      twilioClient
    );

    const unreadMessagesCount = await getUnreadMessagesCount(
      conversationResources
    );

    setUnreadMessagesCount(unreadMessagesCount);
  };

  const handleMessageAdded = (message: Message) => {
    client.cache.updateQuery(
      {
        query: getConversationsForUserQuery,
        variables: GET_CONVERSATIONS_FOR_USER_VARIABLES,
      },
      (data) => {
        if (data?.getConversationsForUser) {
          const conversationIncrementedUnreadMessage =
            data.getConversationsForUser.list?.map((conversation) => {
              if (conversation.sid === message.conversation.sid) {
                return {
                  ...conversation,
                  unreadMessagesCount: conversation.unreadMessagesCount + 1,
                };
              }

              return conversation;
            });

          return {
            getConversationsForUser: {
              ...data.getConversationsForUser,
              list: conversationIncrementedUnreadMessage,
            },
          };
        }
      }
    );
  };

  useEffect(() => {
    if (twilioClient && user) {
      twilioClient.addListener("messageAdded", (message) => {
        handleMessageAdded(message);
      });
    }

    return () => {
      if (twilioClient) twilioClient.removeAllListeners();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [twilioClient, user]);

  useEffect(() => {
    if (
      user &&
      twilioClient &&
      data?.getConversationsForUser?.list &&
      !isInitFunctionInitialized.current
    ) {
      isInitFunctionInitialized.current = true;
      init(data.getConversationsForUser.list, twilioClient);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, twilioClient, user]);

  console.log({ data });
};
