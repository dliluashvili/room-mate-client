import React, { useEffect, useMemo, useState } from "react";
import List from "../components/messengerComponents/List";
import NewHeader from "../components/NewHeader";
import ChatField from "../components/messengerComponents/ChatField";
import { useCheckAuth } from "../components/hooks/useCheckAuth";
import ChatFieldMobile from "../components/messengerComponents/ChatFieldMobile";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { getConversationsForUserQuery } from "../gql/graphqlStatements";
import { LIMIT, OFFSET } from "../constants/pagination";
import { ConversationStatus, ConversationWithUserObject } from "../gql/graphql";

export default function messenger() {
  useCheckAuth();

  const [request, setRequest] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentConversation, setCurrentConversation] =
    useState<ConversationWithUserObject | null>(null);

  const router = useRouter();
  const {
    query: { id },
  } = router;

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

  /**
   * there is id null
   *
   * 1. give value to id
   *    1. check which tab is active
   *    2. from tab array give first value
   */
  /**
   * there is id with value
   *
   * 1. get conversation from conversations data
   *    1. if exists
   *      2. set active tab according conversation status
   *    2. if not exists
   *      1. redirect to messenger
   */

  useEffect(() => {
    if (data?.getConversationsForUser?.list?.length) {
      const conversations = data.getConversationsForUser.list;

      if (!id) {
        router.push(`/messenger?id=${conversations[0].sid}`);
      }

      if (id) {
        const conversation = conversations.find(
          (conversation) => conversation.sid === id
        );

        if (!conversation) {
          router.push("/messenger");
        } else {
          setCurrentConversation(conversation);
        }
      }
    }
  }, [id, data]);

  useEffect(() => {
    if (
      currentConversation &&
      currentConversation.status === ConversationStatus.Requested
    ) {
      setRequest(true);
    }
  }, [currentConversation]);

  return (
    <main className="w-full flex flex-col h-screen overflow-hidden">
      <NewHeader />
      <div className="relative flex flex-row md:pt-6 h-full overflow-hidden md:px-20 xl:px-24 bg-[#F5F5F5] flex-grow">
        <List
          request={request}
          setRequest={setRequest}
          setMobileOpen={setMobileOpen}
          conversations={filteredConversationsByStatus}
        />
        {currentConversation && (
          <>
            <ChatField />
            <ChatFieldMobile
              mobileOpen={mobileOpen}
              setMobileOpen={setMobileOpen}
            />
          </>
        )}
      </div>
    </main>
  );
}
