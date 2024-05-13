import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { BASE_URL_GRAPHQL } from "../services/api";
import { PaginatedConversationWithUserObject } from "../gql/graphql";
import { LIMIT, OFFSET } from "../constants/pagination";

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

export const makeApolloClient = () => {
  if (apolloClient) {
    return apolloClient;
  }

  const httpLink = new HttpLink({
    uri: BASE_URL_GRAPHQL,
  });

  const authToken =
    typeof window === "undefined" ? "" : localStorage.getItem("token");

  // Set authorization header
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: authToken ? `Bearer ${authToken}` : "",
      },
    };
  });

  const link = authLink.concat(httpLink);

  const cache = new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getConversationsForUser: {
            keyArgs: false,
            read(
              existing: PaginatedConversationWithUserObject,
              {
                variables: {
                  pagination: { offset, limit } = {
                    offset: OFFSET,
                    limit: LIMIT,
                  },
                },
              }
            ) {
              if (!existing) {
                return existing;
              }

              return {
                ...existing,
                list: existing.list.slice(offset, limit + 1),
              };
            },
            merge(
              existing: PaginatedConversationWithUserObject,
              incoming: PaginatedConversationWithUserObject,
              { args: { pagination: { offset } = { offset: null } } }
            ) {
              if (!existing) {
                return incoming;
              }

              // If any client write happens merge function is called.
              // This means that cache is updated with previous data.
              // Data should be updated while writing happens after server response.
              // This is why offset is checked.
              if (offset === null || existing.pageInfo.offset === offset) {
                return existing;
              }

              return {
                ...existing,
                list: [...existing.list, ...incoming.list],
                pageInfo: incoming.pageInfo,
              };
            },
          },
        },
      },
      ConversationWithUserObject: {
        fields: {
          unreadMessagesCount: {
            read(incoming) {
              return incoming ?? 0;
            },
          },
        },
      },
    },
  });

  apolloClient = new ApolloClient({
    link,
    cache,
  });

  return apolloClient;
};

export function ApolloWrapper({ children }: any) {
  return (
    <ApolloProvider client={makeApolloClient()}>{children}</ApolloProvider>
  );
}
