import {
  useApolloClient,
  useLazyQuery,
  useQuery,
  useReactiveVar,
} from "@apollo/client";
import {
  Conversation,
  Message,
  Client as TwilioClient,
} from "@twilio/conversations";
import { useEffect, useRef } from "react";
import { twilioClientVar } from "../store/twilioVars";
import {
  getConversationsForUserQuery,
  getSharedConversationQuery,
} from "../gql/graphqlStatements";
import {
  ConversationWithUserObject,
  PaginatedConversationWithUserObject,
} from "../gql/graphql";
import { useTypedSelector } from "../components/hooks/useTypeSelector";
import { LIMIT, OFFSET } from "../constants/pagination";

type PromisedUnreadMessagesCount = {
  sid: string;
  unreadMessagesCount: number;
};

export const useInitializeNotification = () => {
  const { user } = useTypedSelector((state) => state.profile);

  const isInitFunctionInitialized = useRef(false);

  const websiteLoadDate = useRef(new Date());

  const newlyCreatedConversationsRef = useRef<Conversation[]>([]);

  const client = useApolloClient();

  const twilioClient = useReactiveVar(twilioClientVar);

  const [getConversationsForUser, { data }] = useLazyQuery(
    getConversationsForUserQuery,
    {
      variables: {
        pagination: {
          offset: OFFSET,
          limit: 1,
        },
      },
    }
  );

  const [getSharedConversation] = useLazyQuery(getSharedConversationQuery);

  const getConversationResources = async (
    conversations: PaginatedConversationWithUserObject["list"],
    twilioClient: TwilioClient
  ) => {
    const promisedConversations =
      conversations?.map(async (conversation) => {
        return await twilioClient.peekConversationBySid(conversation.sid);
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
    const promisedUnreadMessages =
      conversationResources?.map(async (conversationResource: Conversation) => {
        const promisedUnreadMessagesCount =
          await conversationResource.getUnreadMessagesCount();

        return {
          sid: conversationResource.sid,
          promisedUnreadMessagesCount,
        };
      }) ?? [];

    const unreadMessages = await Promise.allSettled(promisedUnreadMessages);

    const promisedUnreadMessagesCountFromMessagesList = unreadMessages.map(
      async (unreadMessage) => {
        if (unreadMessage.status === "fulfilled") {
          /**
           *  while 'read horizon' is not set need to get messages manually'
           *  read horizon doc: https://www.twilio.com/docs/conversations/read-horizon
           */
          if (unreadMessage.value.promisedUnreadMessagesCount === null) {
            const conversation = conversationResources.find(
              (conversation: Conversation) =>
                conversation.sid === unreadMessage.value.sid
            );

            if (conversation) {
              const messages = await conversation.getMessages();
              const incomeMessages = messages.items.filter(
                (message) => message.author !== twilioClient.user.identity
              );

              return {
                sid: unreadMessage.value.sid,
                unreadMessagesCount: incomeMessages.length,
              };
            }

            return {
              sid: unreadMessage.value.sid,
              unreadMessagesCount: 0,
            };
          }

          return {
            sid: unreadMessage.value.sid,
            unreadMessagesCount:
              unreadMessage.value.promisedUnreadMessagesCount,
          };
        }
      }
    );

    const unreadMessagesCountFromMessagesList = await Promise.allSettled(
      promisedUnreadMessagesCountFromMessagesList
    );

    return unreadMessagesCountFromMessagesList.reduce(
      (acc: PromisedUnreadMessagesCount[] | [], curr) => {
        if (curr.status === "fulfilled" && curr.value) {
          return [
            ...acc,
            {
              sid: curr.value.sid,
              unreadMessagesCount: curr.value.unreadMessagesCount,
            },
          ];
        }
        return acc;
      },
      []
    );
  };

  const addNewConversationAndUpdateUnreadMessagesToConversations = async ({
    conversations,
    sid,
    participantId,
    unreadMessagesCount,
  }: {
    conversations: ConversationWithUserObject[];
    sid: string;
    participantId: string;
    unreadMessagesCount: number;
  }) => {
    const checkConversationExistence = conversations.find(
      (conversation) => conversation.sid === sid
    );

    if (!checkConversationExistence) {
      const { data: sharedConversation } = await getSharedConversation({
        variables: {
          participantId,
        },
      });

      const nextConversations = [
        ...conversations,
        {
          ...sharedConversation.getSharedConversation,
          unreadMessagesCount,
        },
      ];

      return nextConversations;
    }

    const nextConversations = conversations.map((conversation) => {
      if (conversation.sid === sid) {
        return {
          ...conversation,
          unreadMessagesCount:
            conversation.unreadMessagesCount + unreadMessagesCount,
        };
      }

      return conversation;
    });

    return nextConversations;
  };

  const moveConversationToTop = (
    conversations: ConversationWithUserObject[],
    conversationSid: string
  ) => {
    if (conversations.length > 1) {
      const conversationIndex = conversations.findIndex(
        (conversation) => conversation.sid === conversationSid
      );

      if (conversationIndex) {
        const prevConversations = conversations.slice(0, conversationIndex);

        const conversation = conversations.find(
          (_, index) => index === conversationIndex
        );

        if (conversationIndex < conversations.length - 1) {
          const nextConversations = conversations.slice(conversationIndex + 1);

          return [conversation, ...prevConversations, ...nextConversations];
        }

        return [conversation, ...prevConversations];
      }
    }

    return conversations;
  };

  const updateConversationsCacheWithNewConversationAndUnreadMessagesCount =
    async (messages: Message[], sid: string) => {
      const receivedMessages = messages.filter(
        (message) => message.author !== twilioClient.user.identity
      );
      const unreadMessagesCount = receivedMessages.length;

      // During component initialization data(getConversationsForUser) is undefined.
      // This is why we need to take latest snapshot from cache every time function will be called
      const getConversationsForUserData = client.cache.readQuery({
        query: getConversationsForUserQuery,
      });

      if (unreadMessagesCount) {
        // updateQuery's update parameter does not return promised value so this is why nextConversations is done here
        const nextConversations =
          await addNewConversationAndUpdateUnreadMessagesToConversations({
            conversations:
              getConversationsForUserData.getConversationsForUser.list,
            sid,
            participantId: receivedMessages[0].author,
            unreadMessagesCount,
          });

        const reorderedNextConversations = moveConversationToTop(
          nextConversations,
          sid
        );

        client.cache.updateQuery(
          {
            query: getConversationsForUserQuery,
          },
          () => ({
            ...getConversationsForUserData,
            getConversationsForUser: {
              ...getConversationsForUserData.getConversationsForUser,
              list: reorderedNextConversations,
            },
          })
        );
      } else {
        client.cache.updateQuery(
          {
            query: getConversationsForUserQuery,
          },
          () => ({
            ...getConversationsForUserData,
            getConversationsForUser: {
              ...getConversationsForUserData.getConversationsForUser,
              list: moveConversationToTop(
                getConversationsForUserData.getConversationsForUser.list,
                sid
              ),
            },
          })
        );
      }
    };

  const setUnreadMessagesCount = (
    unreadMessages: PromisedUnreadMessagesCount[] | []
  ) => {
    client.cache.updateQuery(
      {
        query: getConversationsForUserQuery,
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

  const handleMessageAdded = async (message: Message) => {
    updateConversationsCacheWithNewConversationAndUnreadMessagesCount(
      [message],
      message.conversation.sid
    );
  };

  useEffect(() => {
    if (twilioClient && user) {
      twilioClient.addListener("messageAdded", (message) => {
        handleMessageAdded(message);
      });

      twilioClient.addListener("conversationJoined", async (conversation) => {
        if (conversation.dateCreated > websiteLoadDate.current) {
          newlyCreatedConversationsRef.current = [
            ...newlyCreatedConversationsRef.current,
            conversation,
          ];

          const messages = await conversation.getMessages();

          updateConversationsCacheWithNewConversationAndUnreadMessagesCount(
            messages.items,
            conversation.sid
          );

          conversation.addListener("messageAdded", handleMessageAdded);
        }
      });
    }

    return () => {
      if (twilioClient) {
        twilioClient.removeListener("messageAdded", handleMessageAdded);
      }

      if (newlyCreatedConversationsRef.current.length) {
        newlyCreatedConversationsRef.current.forEach((conversation) => {
          conversation.removeListener("messageAdded", handleMessageAdded);
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [twilioClient, user]);

  useEffect(() => {
    if (
      data?.getConversationsForUser?.list &&
      !isInitFunctionInitialized.current
    ) {
      isInitFunctionInitialized.current = true;
      init(data.getConversationsForUser.list, twilioClient);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, twilioClient, user]);

  useEffect(() => {
    if (twilioClient && user) {
      getConversationsForUser();
    }
  }, [twilioClient, user]);
};
