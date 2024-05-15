import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { BASE_URL_GRAPHQL } from "../services/api";
import { PaginatedConversationWithUserObject } from "../gql/graphql";
import { LIMIT, OFFSET } from "../constants/pagination";

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

export const authLink = new ApolloLink((operation, forward) => {
  const authToken = localStorage.getItem("token");

  if (authToken) {
    operation.setContext(({ headers }) => {
      return {
        headers: {
          ...headers,
          authorization: authToken ? `Bearer ${authToken}` : "",
        },
      };
    });
  }

  return forward(operation);
});

export const httpLink = new HttpLink({
  uri: BASE_URL_GRAPHQL,
});

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
              list: existing.list.slice(offset, offset + limit + 1),
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

            // If any client write happens, the merge function is called.
            // In this case cache should be replaced.
            if (offset === null) {
              return {
                ...existing,
                list: incoming.list,
              };
            }

            // While two query runs parallel, accidentally data is merged and duplicated
            // This clause protects from it
            if (offset === existing.pageInfo.offset) {
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

export const makeApolloClient = (shouldRecreate = false) => {
  if (apolloClient && !shouldRecreate) {
    return apolloClient;
  }

  const link = authLink.concat(httpLink);

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
