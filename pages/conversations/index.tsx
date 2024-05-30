import { useRouter } from "next/router";
import { RouterQuery } from "../../components/messengerComponents/types";
import { useQuery } from "@apollo/client";
import { getConversationsForUserQuery } from "../../gql/graphqlStatements";
import { useEffect } from "react";

export default function conversation() {
  const router = useRouter();
  const { id }: RouterQuery = router.query;

  const { data } = useQuery(getConversationsForUserQuery, {
    variables: {
      pagination: {
        offset: 0,
        limit: 15,
      },
    },
  });

  useEffect(() => {
    if (data?.getConversationsForUser.list.length) {
      const conversations = data.getConversationsForUser.list;

      if (!id) {
        router.push(`/conversations/${conversations[0].sid}`);
      }
    }
  }, [id, data]);

  return <div></div>;
}
