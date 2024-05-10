import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { BASE_URL_GRAPHQL } from "../services/api";

export function makeClient() {
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

  return new ApolloClient({
    link,
    cache: new InMemoryCache({
      typePolicies: {
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
    }),
  });
}

export function ApolloWrapper({ children }: any) {
  return <ApolloProvider client={makeClient()}>{children}</ApolloProvider>;
}
