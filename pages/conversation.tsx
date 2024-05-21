import React, { useEffect, useMemo, useState } from "react";
import ConversationsList from "../components/messengerComponents/ConversationsList";
import NewHeader from "../components/NewHeader";
import { useCheckAuth } from "../components/hooks/useCheckAuth";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { getConversationsForUserQuery } from "../gql/graphqlStatements";
import { LIMIT, OFFSET } from "../constants/pagination";
import { ConversationStatus } from "../gql/graphql";
import Conversation from "../components/messengerComponents/Conversation";
import { RouterQuery } from "../components/messengerComponents/types";

export default function conversation() {
  useCheckAuth();

  const [request, setRequest] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const router = useRouter();
  const { id }: RouterQuery = router.query;

  const { data } = useQuery(getConversationsForUserQuery, {
    variables: {
      pagination: {
        offset: OFFSET,
        limit: LIMIT,
      },
    },
  });

  const filteredConversationsByStatus = useMemo(() => {
    if (data?.getConversationsForUser?.list) {
      if (request) {
        return data.getConversationsForUser.list.filter(
          (conversation) => conversation.status === ConversationStatus.Requested
        );
      }

      return data.getConversationsForUser.list.filter(
        (conversation) => conversation.status === ConversationStatus.Accepted
      );
    }

    return [];
  }, [data, request]);

  useEffect(() => {
    if (data?.getConversationsForUser?.list?.length) {
      const conversations = data.getConversationsForUser.list;

      if (!id) {
        router.push(`/conversation?id=${conversations[0].sid}`);
      }
    }
  }, [id, data]);

  return (
    <main className="w-full flex flex-col h-screen overflow-hidden">
      <NewHeader />
      <div className="relative flex flex-row md:pt-6 h-full overflow-hidden md:px-20 xl:px-24 bg-[#F5F5F5] flex-grow">
        <ConversationsList
          request={request}
          setRequest={setRequest}
          setMobileOpen={setMobileOpen}
          conversations={filteredConversationsByStatus}
        />
        <Conversation
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          setRequest={setRequest}
        />
      </div>
    </main>
  );
}