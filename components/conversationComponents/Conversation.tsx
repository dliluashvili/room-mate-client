import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import DesktopConversation from "./DesktopConversation";
import MobileConversation from "./MobileConversation";
import {
  ConversationStatus,
  ConversationWithUserObject,
} from "../../gql/graphql";
import { useQuery, useReactiveVar } from "@apollo/client";
import { getConversationsForUserQuery } from "../../gql/graphqlStatements";
import { RouterQuery } from "./types";
import {
  twilioClientVar,
  twilioConnectionStateVar,
} from "../../store/twilioVars";
import { Client, Conversation } from "@twilio/conversations";
import { useMediaQuery } from "react-responsive";
import { MEDIA_QUERY } from "./constants";

const ConversationComponent = ({ mobileOpen, setMobileOpen, setRequest }) => {
  const [conversation, setConversation] =
    useState<ConversationWithUserObject | null>(null);
  const [conversationResource, setConversationResource] =
    useState<Conversation | null>(null);

  const media = useMediaQuery({
    query: MEDIA_QUERY,
  });

  const twilioClient = useReactiveVar(twilioClientVar);
  const twilioClientState = useReactiveVar(twilioConnectionStateVar);

  // Conversations for user is already fetching or fetched from useNotifications hook
  // So this is why it is fetched from cache
  const { data } = useQuery(getConversationsForUserQuery, {
    fetchPolicy: "cache-only",
  });

  const router = useRouter();
  const { id }: RouterQuery = router.query;

  const updateRequest = (conversation: ConversationWithUserObject) => {
    if (conversation.status === ConversationStatus.Requested) {
      setRequest(true);
    } else if (conversation.status === ConversationStatus.Accepted) {
      setRequest(false);
    }
  };

  const updateConversation = (
    conversations: ConversationWithUserObject[],
    id: string
  ) => {
    const conversation = conversations.find(
      (conversation) => conversation.id === id
    );

    setConversation(conversation);
  };

  const getConversationResource = async (twilioClient: Client, sid: string) => {
    try {
      const conversationResourceResponse =
        await twilioClient.peekConversationBySid(sid);

      setConversationResource(conversationResourceResponse);
    } catch (error) {
      console.log({ error });
    }
  };

  /*
   * useEffects start
   */
  useEffect(() => {
    if (data?.getConversationsForUser?.list?.length && id) {
      updateConversation(data.getConversationsForUser.list, id);
    }
  }, [data, id]);

  useEffect(() => {
    if (conversation) {
      updateRequest(conversation);
    }
  }, [conversation]);

  useEffect(() => {
    if (conversation && twilioClientState === "connected") {
      getConversationResource(twilioClient, conversation.sid);
    }
  }, [conversation, twilioClientState]);

  return (
    <>
      {media ? (
        <DesktopConversation
          conversationResource={conversationResource}
          conversation={conversation}
          setRequest={setRequest}
        />
      ) : (
        <MobileConversation
          conversationResource={conversationResource}
          conversation={conversation}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          setRequest={setRequest}
        />
      )}
    </>
  );
};

export default ConversationComponent;
