import { useRouter } from "next/router";
import DesktopConversation from "./DesktopConversation";
import MobileConversation from "./MobileConversation";
import { useEffect, useRef, useState } from "react";
import {
  ConversationStatus,
  ConversationWithUserObject,
} from "../../gql/graphql";
import { useApolloClient, useQuery } from "@apollo/client";
import { getConversationsForUserQuery } from "../../gql/graphqlStatements";
import { RouterQuery } from "./types";
import { twilioClientVar } from "../../store/twilioVars";
import {
  Client,
  Conversation,
  Message,
  Paginator,
} from "@twilio/conversations";

const MESSAGES_PAGE_SIZE = 10;

const ConversationComponent = ({ mobileOpen, setMobileOpen, setRequest }) => {
  const [conversation, setConversation] =
    useState<ConversationWithUserObject | null>(null);
  const [conversationResource, setConversationResource] =
    useState<Conversation | null>(null);

  const messagesRef = useRef<Paginator<Message> | null>(null);

  const client = useApolloClient();

  const twilioClient = twilioClientVar();

  const { data } = useQuery(getConversationsForUserQuery);

  const router = useRouter();
  const { id }: RouterQuery = router.query;

  const updateRequest = (conversation: ConversationWithUserObject) => {
    if (conversation.status === ConversationStatus.Requested) {
      setRequest(true);
    }
  };

  const updateConversation = (
    conversations: ConversationWithUserObject[],
    id: string
  ) => {
    const conversation = conversations.find(
      (conversation) => conversation.sid === id
    );

    setConversation(conversation);
  };

  const getConversationResource = async (twilioClient: Client, sid: string) => {
    try {
      const conversationResourceResponse =
        await twilioClient.getConversationBySid(sid);

      setConversationResource(conversationResourceResponse);
    } catch (error) {
      console.log({ error });
    }
  };

  const getMessagesFromTwilio = async (conversationResource: Conversation) => {
    try {
      if (!messagesRef.current) {
        const paginatedMessages = await conversationResource.getMessages(
          MESSAGES_PAGE_SIZE
        );

        messagesRef.current = paginatedMessages;

        addMessageToCache(paginatedMessages.items);
      } else if (messagesRef.current.hasPrevPage) {
        const paginatedMessages = await messagesRef.current.prevPage();

        messagesRef.current = paginatedMessages;

        addMessageToCache(paginatedMessages.items);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const addMessageToCache = (messages: Message[]) => {
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
              list: data.getConversationsForUser.list.map((conversation) => {
                if (conversation.sid === id) {
                  return {
                    ...conversation,
                    messages: [...messages, ...conversation.messages],
                  };
                }

                return conversation;
              }),
            },
          };
        }
      }
    );
  };

  /*
   * testings
   */
  const onClick = async () => {
    const messages = await messagesRef.current.prevPage();
    messagesRef.current = messages;
    console.log("next messages", { messages });
  };

  useEffect(() => {
    if (data?.getConversationsForUser?.list?.length) {
      console.log({ data });
    }
  }, [data]);

  /*
   * useEffects start
   */
  useEffect(() => {
    if (data?.getConversationsForUser?.list && id) {
      updateConversation(data.getConversationsForUser.list, id);
    }
  }, [data, id]);

  useEffect(() => {
    if (conversation) {
      updateRequest(conversation);
    }
  }, [conversation]);

  useEffect(() => {
    if (conversation && twilioClient?.connectionState === "connected") {
      getConversationResource(twilioClient, conversation.sid);
    }
  }, [conversation, twilioClient]);

  useEffect(() => {
    if (conversationResource) {
      getMessagesFromTwilio(conversationResource);
    }
  }, [conversationResource]);

  return (
    <>
      <DesktopConversation />
      <MobileConversation
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <button onClick={onClick}>click</button>
    </>
  );
};

export default ConversationComponent;
