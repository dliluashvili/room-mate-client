'use client';

import { ApolloLink, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import {
    NextSSRApolloClient,
    ApolloNextAppProvider,
    NextSSRInMemoryCache,
    SSRMultipartLink,
} from '@apollo/experimental-nextjs-app-support/ssr';

export function makeClient() {
    const httpLink = new HttpLink({
        uri: 'http://localhost:3000/graphql',
    });

    const authToken =
        typeof window === 'undefined' ? '' : localStorage.getItem('token');

    // Set authorization header
    const authLink = setContext((_, { headers }) => {
        return {
            headers: {
                ...headers,
                authorization: authToken ? `Bearer ${authToken}` : '',
            },
        };
    });

    const link = authLink.concat(httpLink);

    return new NextSSRApolloClient({
        cache: new NextSSRInMemoryCache({
            typePolicies: {
                ConversationWithUserObject: {
                    fields: {
                        unreadMessagesCount: {
                            read(incoming) {
                                return incoming ?? 1;
                            },
                        },
                    },
                },
            },
        }),
        link:
            typeof window === 'undefined'
                ? ApolloLink.from([
                      new SSRMultipartLink({
                          stripDefer: true,
                      }),
                      link,
                  ])
                : link,
        connectToDevTools: true,
    });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
    return (
        <ApolloNextAppProvider makeClient={makeClient}>
            {children}
        </ApolloNextAppProvider>
    );
}
