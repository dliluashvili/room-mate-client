import { useVirtualizer } from "@tanstack/react-virtual";
import { Conversation, Message, Paginator } from "@twilio/conversations";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { ConversationWithUserObject } from "../../gql/graphql";
import { useApolloClient } from "@apollo/client";
import { getConversationsForUserQuery } from "../../gql/graphqlStatements";
import mergeRefs from "merge-refs";
import { useDocumentHasFocus } from "../../hooks/useDocumentHasFocus";
import React from "react";

type Props = {
  conversationResource: Conversation;
  conversation?: ConversationWithUserObject;
};

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

const MESSAGES_PAGE_SIZE = 10;
const MESSAGE_BOX_ESTIMATE_HEIGHT = 550;
const LOADER_BOX_HEIGHT = 20;

const MessagesList = ({ conversationResource, conversation }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const paginatedMessagesRef = useRef<Paginator<Message>>(null);

  const parentDomRef = useRef<HTMLDivElement>(null);

  const client = useApolloClient();

  const { ref: inViewRef, inView } = useInView();
  const { ref: firstMessageRef, inView: inViewFirstMessageDom } = useInView();

  const isDocumentFocused = useDocumentHasFocus();

  const getMessagesFromTwilio = async (conversationResource: Conversation) => {
    try {
      if (!paginatedMessagesRef.current) {
        const paginatedMessages = await conversationResource.getMessages(
          MESSAGES_PAGE_SIZE
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

  const setAllMessagesRead = async (conversationResource: Conversation) => {
    try {
      await conversationResource.setAllMessagesRead();

      client.cache.updateQuery(
        {
          query: getConversationsForUserQuery,
        },
        (data) => {
          if (data?.getConversationsForUser) {
            const conversationIncrementedUnreadMessage =
              data.getConversationsForUser.list.map((conversation) => {
                if (conversation.sid === conversationResource.sid) {
                  return {
                    ...conversation,
                    unreadMessagesCount: 0,
                  };
                }

                return conversation;
              });

            return {
              ...data,
              getConversationsForUser: {
                ...data.getConversationsForUser,
                list: conversationIncrementedUnreadMessage,
              },
            };
          }
        }
      );
    } catch (error) {
      console.log({ error });
    }
  };

  const handleMessageAdded = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  // FIXME: need to be removed getMessagesFromTwilio because data is fetched from inView hooks
  useEffect(() => {
    if (conversationResource) {
      setMessages([]);
      paginatedMessagesRef.current = null;

      getMessagesFromTwilio(conversationResource);
    }
  }, [conversationResource]);

  /**
   * FIXME: need fetch logic if not enough messages are not shown
   */
  // fetch prev messages
  useEffect(() => {
    if (
      inView &&
      conversationResource &&
      paginatedMessagesRef.current?.hasPrevPage
    ) {
      getMessagesFromTwilio(conversationResource);
    }
  }, [inView]);

  // TODO: uncomment later
  // useEffect(() => {
  //   if (
  //     inViewFirstMessageDom &&
  //     conversationResource &&
  //     conversation?.unreadMessagesCount > 0 &&
  //     isDocumentFocused
  //   ) {
  //     setAllMessagesRead(conversationResource);
  //   }
  // }, [inViewFirstMessageDom, isDocumentFocused]);

  useEffect(() => {
    if (conversationResource) {
      conversationResource.addListener("messageAdded", handleMessageAdded);
    }
    return () => {
      if (conversationResource) {
        conversationResource.removeListener("messageAdded", handleMessageAdded);
      }
    };
  }, [conversationResource]);

  // virtualizer logic
  const count = messages.length;

  const reverseIndex = React.useCallback((index) => count - 1 - index, [count]);

  const virtualizerRef = React.useRef(null);

  if (
    virtualizerRef.current &&
    count !== virtualizerRef.current.options.count
  ) {
    const delta = count - virtualizerRef.current.options.count;
    const nextOffset =
      virtualizerRef.current.scrollOffset + delta * MESSAGE_BOX_ESTIMATE_HEIGHT;

    virtualizerRef.current.scrollOffset = nextOffset;
    virtualizerRef.current.scrollToOffset(nextOffset, { align: "start" });
  }

  const virtualizer = useVirtualizer({
    getScrollElement: () => parentDomRef.current,
    count,
    estimateSize: () => MESSAGE_BOX_ESTIMATE_HEIGHT,
    getItemKey: React.useCallback(
      (index) => messages[reverseIndex(index)].index,
      [messages, reverseIndex]
    ),
    overscan: 5,
    scrollMargin: 50,
    gap: 10,
  });

  useIsomorphicLayoutEffect(() => {
    virtualizerRef.current = virtualizer;
  });

  const virtualizerItems = virtualizer.getVirtualItems();

  const [paddingTop, paddingBottom] =
    virtualizerItems.length > 0
      ? [
          Math.max(
            0,
            virtualizerItems[0].start - virtualizer.options.scrollMargin
          ),
          Math.max(
            0,
            virtualizer.getTotalSize() -
              virtualizerItems[virtualizerItems.length - 1].end
          ),
        ]
      : [0, 0];

  return (
    <div ref={parentDomRef} className="overflow-y-auto flex-1 w-full">
      <div className="h-[50px]" ref={inViewRef}>
        <button>'loading'</button>
      </div>
      <div
        style={{
          overflowAnchor: "none",
          paddingTop,
          paddingBottom,
        }}
      >
        {virtualizerItems.map((virtualRow) => {
          const index = reverseIndex(virtualRow.index);
          const message = messages[index];

          console.log({ virtualRow });

          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              data-reverse-index={index}
              ref={virtualizer.measureElement}
              style={{
                width: "100%",
                marginTop: 10,
                marginBottom: 10,
                //   conversation?.user?.id === message.author ? "left" : "right", // Align text based on author
              }}
            >
              <div
                className="bg-[#19A463] text-[#FFFFFF] p-2 text-sm"
                style={{
                  maxWidth: "50%",
                  borderRadius:
                    conversation?.user?.id === message.author
                      ? "12px 12px 12px 0px" // Author's message: right bottom corner not rounded
                      : "12px 12px 0px 12px", // Other user's message: left bottom corner not rounded
                }}
              >
                {message.body}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MessagesList;

// {virtualizerItems.map((virtualRow) => {
//   const index = reverseIndex(virtualRow.index);
//   const message = messages[virtualRow.index];

//   const translateY = paginatedMessagesRef.current?.hasPrevPage
//     ? LOADER_BOX_HEIGHT + virtualRow.start
//     : virtualRow.start;

//   // const messageRefs =
//   //   messages[messages.length - 1].index === message.index
//   //     ? (mergeRefs(virtualizer.measureElement, firstMessageRef) as any)
//   //     : virtualizer.measureElement;

//   return (
//     <div
//       key={virtualRow.key}
//       data-index={virtualRow.index}
//       data-reverse-index={index}
//       ref={virtualizer.measureElement}
//       style={{
//         width: "100%",
//         // textAlign:
//         //   conversation?.user?.id === message.author ? "left" : "right", // Align text based on author
//       }}
//     >
//       {/* <div
//         style={{
//           padding: 15,
//           background: `hsla(${message.index * 30}, 60%, 80%, 1)`,
//           lineHeight: 1.5,
//         }}
//       >
//         <div>
//           {message.body} - {message.author}
//         </div>
//       </div> */}
//       <div
//         className="bg-[#19A463] text-[#FFFFFF] p-2 text-sm"
//         style={{
//           maxWidth: "50%",
//           borderRadius:
//             conversation?.user?.id === message.author
//               ? "12px 12px 12px 0px" // Author's message: right bottom corner not rounded
//               : "12px 12px 0px 12px", // Other user's message: left bottom corner not rounded
//         }}
//       >
//         {message.body}
//       </div>
//     </div>
//   );
// })}
