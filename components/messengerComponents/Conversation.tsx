import { useRouter } from "next/router";
import DesktopConversation from "./DesktopConversation";
import MobileConversation from "./MobileConversation";
import { useEffect, useState } from "react";
import {
  ConversationStatus,
  ConversationWithUserObject,
} from "../../gql/graphql";
import { useQuery } from "@apollo/client";
import { getConversationsForUserQuery } from "../../gql/graphqlStatements";
import { RouterQuery } from "./types";
import { twilioClientVar } from "../../store/twilioVars";
import { Client, Conversation } from "@twilio/conversations";

const ConversationComponent = ({ mobileOpen, setMobileOpen, setRequest }) => {
  const [conversation, setConversation] =
    useState<ConversationWithUserObject | null>(null);
  const [conversationResource, setConversationResource] =
    useState<Conversation | null>(null);

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

  return (
    <>
      <DesktopConversation conversationResource={conversationResource} />
      <MobileConversation
        conversationResource={conversationResource}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
    </>
  );
};

export default ConversationComponent;
