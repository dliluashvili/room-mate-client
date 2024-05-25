import React, { useRef, useState } from "react";
import axios from "axios";
import { useInView } from "react-intersection-observer";
import {
  useInfiniteQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useMutation, useReactiveVar } from "@apollo/client";
import { twilioClientVar } from "../store/twilioVars";
import { Client, Message, Paginator } from "@twilio/conversations";
import { generateTwilioAccessTokenMutation } from "../gql/graphqlStatements";

const queryClient = new QueryClient();

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  );
}

function Example() {
  const paginatedMessagesRef = useRef<Paginator<Message>>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const [generateTwilioAccessToken] = useMutation(
    generateTwilioAccessTokenMutation
  );

  const { ref, inView } = useInView();
  const pageSize = 10;
  const itemSize = 300;

  const getMessagesFromTwilio = async () => {
    try {
      const { data } = await generateTwilioAccessToken();

      const twilioClient = new Client(data.generateTwilioAccessToken);

      const conversationResource = await twilioClient.getConversationBySid(
        "CHb6aff242adff474a86c581e46ee04f25"
      );

      if (!paginatedMessagesRef.current) {
        const paginatedMessages = await conversationResource.getMessages(
          pageSize
        );

        paginatedMessagesRef.current = paginatedMessages;

        setMessages((prevMessages) => [
          ...prevMessages,
          ...paginatedMessages.items,
        ]);
      } else if (paginatedMessagesRef.current.hasPrevPage) {
        const paginatedMessages = await paginatedMessagesRef.current.prevPage();

        paginatedMessagesRef.current = paginatedMessages;

        setMessages((prevMessages) => [
          ...prevMessages,
          ...paginatedMessages.items,
        ]);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  React.useEffect(() => {
    if (inView) {
      getMessagesFromTwilio();
    }
  }, [inView]);

  // virtualizer logic

  const count = messages.length;

  const reverseIndex = React.useCallback((index) => count - 1 - index, [count]);

  const virtualizerRef = React.useRef(null);

  if (
    virtualizerRef.current &&
    count !== virtualizerRef.current.options.count
  ) {
    const delta = count - virtualizerRef.current.options.count;
    const nextOffset = virtualizerRef.current.scrollOffset + delta * itemSize;

    console.log({ nextOffset });

    virtualizerRef.current.scrollOffset = nextOffset;
    virtualizerRef.current.scrollToOffset(nextOffset, { align: "start" });
  }

  const parentRef = React.useRef(null);
  const virtualizer = useVirtualizer({
    getScrollElement: () => parentRef.current,
    count,
    estimateSize: () => itemSize,
    getItemKey: React.useCallback(
      (index) => messages[reverseIndex(index)].index,
      [messages, reverseIndex]
    ),
    overscan: 5,
    scrollMargin: 50,
  });

  useIsomorphicLayoutEffect(() => {
    virtualizerRef.current = virtualizer;
  });

  const items = virtualizer.getVirtualItems();

  const [paddingTop, paddingBottom] =
    items.length > 0
      ? [
          Math.max(0, items[0].start - virtualizer.options.scrollMargin),
          Math.max(0, virtualizer.getTotalSize() - items[items.length - 1].end),
        ]
      : [0, 0];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: 700,
      }}
    >
      <div
        ref={parentRef}
        style={{
          overflowY: "auto",
          flex: 1,
          width: "100%",
        }}
      >
        <div style={{ height: 50 }} ref={ref}>
          <button>'loading'</button>
        </div>
        <div
          style={{
            overflowAnchor: "none",
            paddingTop,
            paddingBottom,
          }}
        >
          {items.map((item) => {
            const index = reverseIndex(item.index);
            const project = messages[index];

            return (
              <div
                key={item.key}
                data-index={item.index}
                data-reverse-index={index}
                ref={virtualizer.measureElement}
              >
                <div
                  style={{
                    padding: 15,
                    background: `hsla(${project.index * 30}, 60%, 80%, 1)`,
                    lineHeight: 1.5,
                  }}
                >
                  <div>
                    {project.body} - {project.author}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
