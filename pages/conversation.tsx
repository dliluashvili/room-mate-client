import React, { useEffect, useMemo, useState } from "react";
import ConversationsList from "../components/conversationComponents/ConversationsList";
import NewHeader from "../components/NewHeader";
import { useCheckAuth } from "../components/hooks/useCheckAuth";
import { useRouter } from "next/router";
import { useQuery, useReactiveVar } from "@apollo/client";
import { getConversationsForUserQuery } from "../gql/graphqlStatements";
import { ConversationStatus } from "../gql/graphql";
import Conversation from "../components/conversationComponents/Conversation";
import { RouterQuery } from "../components/conversationComponents/types";
import { LIMIT, OFFSET } from "../constants/pagination";
import { useMediaQuery } from "react-responsive";
import { twilioConnectionStateVar } from "../store/twilioVars";
import { TwilioDisconnectionAlertDialog } from "../components/conversationComponents/TwilioDisconnectionAlertDialog";

export default function conversation() {
  useCheckAuth();

  const [request, setRequest] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const media = useMediaQuery({
    query: "(min-width: 768px)",
  });

  const router = useRouter();
  const { id }: RouterQuery = router.query;

  const twilioConnectionState = useReactiveVar(twilioConnectionStateVar);

  const { data, fetchMore: fetchMoreConversationsForUser } = useQuery(
    getConversationsForUserQuery,
    {
      variables: {
        pagination: {
          offset: OFFSET,
          limit: LIMIT,
        },
      },
    }
  );

  const filteredConversationsByStatus = useMemo(() => {
    if (data?.getConversationsForUser.list.length) {
      if (request) {
        return data.getConversationsForUser.list.filter(
          (conversation) => conversation.status !== ConversationStatus.Accepted
        );
      }

      return data.getConversationsForUser.list.filter(
        (conversation) => conversation.status === ConversationStatus.Accepted
      );
    }

    return [];
  }, [data, request]);

  useEffect(() => {
    if (filteredConversationsByStatus.length && !id && media) {
      router.replace(
        `/conversation?id=${filteredConversationsByStatus[0].id}`,
        undefined,
        {
          shallow: true,
        }
      );
    } else if (filteredConversationsByStatus.length && id) {
      router.replace(`/conversation?id=${id}`, undefined, {
        shallow: true,
      });
    } 
  }, [filteredConversationsByStatus]);

  useEffect(() => {
    if (!media) {
      if (id) {
        setMobileOpen(true);
      } else if (!id) {
        setMobileOpen(false);
      }
    }
  }, [media, id]);

  const isTwilioConnectionDown =
    twilioConnectionState === "disconnected" ||
    twilioConnectionState === "denied";

  return (
    <>
      <TwilioDisconnectionAlertDialog open={isTwilioConnectionDown} />
      <main className="w-full flex flex-col h-full md:h-screen overflow-hidden overscroll-none ">
        <NewHeader />
        <div className="relative flex flex-row md:pt-6 h-full overflow-hidden md:px-20 xl:px-24 bg-[#F5F5F5] flex-grow">
          <ConversationsList
            data={data?.getConversationsForUser}
            request={request}
            setRequest={setRequest}
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
            conversations={filteredConversationsByStatus}
            pageInfo={data?.getConversationsForUser?.pageInfo ?? null}
            fetchMoreConversationsForUser={fetchMoreConversationsForUser}
          />
          <Conversation
            key={id}
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
            setRequest={setRequest}
            media={media}
          />
        </div>
      </main>
    </>
  );
}
