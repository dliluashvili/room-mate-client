import React, { useEffect, useMemo, useState } from "react";
import List from "../components/messangerComponents/List";
import NewHeader from "../components/NewHeader";
import ChatField from "../components/messangerComponents/ChatField";
import { useCheckAuth } from "../components/hooks/useCheckAuth";
import ChatFieldMobile from "../components/messangerComponents/ChatFieldMobile";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { getConversationsForUserQuery } from "../gql/graphqlStatements";
import { LIMIT, OFFSET } from "../constants/pagination";
import { ConversationStatus } from "../gql/graphql";

export default function messenger() {
  useCheckAuth();

  const [user, setUser] = useState(null);
  const [request, setRequest] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const router = useRouter();
  const { query } = router;
  const { id } = query;

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
    if (!id && filteredConversationsByStatus.length) {
      router.push(`/messenger?id=${filteredConversationsByStatus[0].sid}`);
    }
  }, [id, filteredConversationsByStatus]);

  useEffect(() => {
    const id = filteredConversationsByStatus?.[0]?.sid ?? "";
    router.push(`/messenger?id=${id}`);
  }, [request]);

  return (
    <main className="w-full flex flex-col  h-screen   overflow-hidden  ">
      <NewHeader />
      <div className=" relative flex flex-row md:pt-6 h-full overflow-hidden      md:px-20  xl:px-24   bg-[#F5F5F5] flex-grow ">
        <List
          setUser={setUser}
          request={request}
          setRequest={setRequest}
          setMobileOpen={setMobileOpen}
          conversations={filteredConversationsByStatus}
        />
        <ChatField user={user} request={request} />
        <ChatFieldMobile
          user={user}
          request={request}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />
      </div>
    </main>
  );
}
