import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Conversation, Message, Paginator } from "@twilio/conversations";
import { useInView } from "react-intersection-observer";
import { useMeasure } from "react-use";
import { useApolloClient } from "@apollo/client";
import clsx from "clsx";
import mergeRefs from "merge-refs";

import { ConversationWithUserObject } from "../../gql/graphql";
import { getConversationsForUserQuery } from "../../gql/graphqlStatements";
import { useDocumentHasFocus } from "../../hooks/useDocumentHasFocus";

type Props = {
  conversationResource: Conversation;
  conversation?: ConversationWithUserObject;
};

/*
 * CONSTANTS
 */
const MESSAGES_PAGE_SIZE = 20;

const MESSAGE_BOX_ESTIMATE_HEIGHT = 50;
const MESSAGE_BOX_ESTIMATE_HEIGHT_FOR_FIRST_PAGE = 250;

const PARENT_DOM_BREAKPOINT_SIZE_FOR_DESKTOP_MOBILE = 600;

const GET_NEXT_MESSAGES_MIN_TIMEOUT = 700;

/*
 * UTILS
 */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const extendFetchTime = async <T,>(
  minDuration: number,
  callback: () => Promise<T>
) => {
  let response: T = null;

  const startTime = performance.now();

  response = await callback();

  const endTime = performance.now();

  const duration = endTime - startTime;

  if (duration < minDuration) {
    await new Promise((resolve) => setTimeout(resolve, minDuration - duration));
  }

  return response;
};

/*
 * MAIN COMPONENT
 */
const MessagesList = ({ conversationResource, conversation }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const paginatedMessagesRef = useRef<Paginator<Message>>(null);

  const parentDomRef = useRef<HTMLDivElement>(null);

  const client = useApolloClient();

  const { ref: inViewLoaderDomRef, inView } = useInView();
  const { ref: firstMessageDomRef, inView: inViewFirstMessageDom } =
    useInView();

  const isDocumentFocused = useDocumentHasFocus();

  const getMessagesFromTwilio = async (conversationResource: Conversation) => {
    try {
      if (!paginatedMessagesRef.current) {
        const paginatedMessages = await conversationResource.getMessages(
          MESSAGES_PAGE_SIZE
        );

        paginatedMessagesRef.current = paginatedMessages;

        console.log(paginatedMessages.items);

        setMessages((prevMessages) => [
          ...paginatedMessages.items,
          ...prevMessages,
        ]);
      } else if (paginatedMessagesRef.current.hasPrevPage) {
        // In safari if scroll has big velocity and fetch time is small
        // browser renders empty area before touch it(after touch it shows items)
        // and scrollOffset is not works properly.
        // To slow velocity to 0, 1000ms is totally enough.
        // In another browsers it is not the case but,
        // browser maybe somehow saves scroll velocity and
        // continue scroll after instant(100ms for example) fetch.
        const paginatedMessages = await extendFetchTime(
          GET_NEXT_MESSAGES_MIN_TIMEOUT,
          () => paginatedMessagesRef.current.prevPage()
        );

        paginatedMessagesRef.current = paginatedMessages;

        setMessages((prevMessages) => [
          ...paginatedMessages.items,
          ...prevMessages,
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

  // TODO: when new message is sent, scroll to bottom
  const handleMessageAdded = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

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

  /**
   * Fetch prev messages
   * FIXME: need fetch logic if not enough messages are not shown
   */
  useEffect(() => {
    if (inView && conversationResource) {
      getMessagesFromTwilio(conversationResource);
    }
  }, [inView, conversationResource]);

  /**
   * Set messages as read
   */
  useEffect(() => {
    if (
      inViewFirstMessageDom &&
      conversationResource &&
      conversation?.unreadMessagesCount > 0 &&
      isDocumentFocused
    ) {
      setAllMessagesRead(conversationResource);
    }
  }, [inViewFirstMessageDom, isDocumentFocused]);

  /*
   * VIRTUALIZER CODE START
   */
  const count = messages.length;

  const virtualizerRef =
    useRef<ReturnType<typeof useVirtualizer<HTMLDivElement, Element>>>(null);

  const [parentDomMeasureRef, { width: parentDomWidth }] = useMeasure();

  // Reverse scroll code below and idea is provided from github discussion.
  // link: https://github.com/TanStack/virtual/discussions/195#discussioncomment-4706845
  if (
    virtualizerRef.current &&
    count !== virtualizerRef.current.options.count
  ) {
    const delta = count - virtualizerRef.current.options.count;

    const messageBoxEstimateHeight =
      virtualizerRef.current.options.count === 0
        ? MESSAGE_BOX_ESTIMATE_HEIGHT_FOR_FIRST_PAGE
        : MESSAGE_BOX_ESTIMATE_HEIGHT;

    const nextOffset =
      virtualizerRef.current.scrollOffset +
      delta * messageBoxEstimateHeight +
      delta * virtualizerRef.current.options.gap;

    virtualizerRef.current.scrollOffset = nextOffset;
    virtualizerRef.current.scrollToOffset(nextOffset);
  }

  const virtualizer = useVirtualizer({
    getScrollElement: () => parentDomRef.current,
    count,
    estimateSize: useCallback(() => {
      if (messages.length <= MESSAGES_PAGE_SIZE) {
        return MESSAGE_BOX_ESTIMATE_HEIGHT_FOR_FIRST_PAGE;
      }
      return MESSAGE_BOX_ESTIMATE_HEIGHT;
    }, [messages]),
    getItemKey: useCallback((index) => messages[index].index, [messages]),
    overscan: 5,
    paddingEnd: 3,
    paddingStart: 3,
    gap: 10,
  });

  useIsomorphicLayoutEffect(() => {
    virtualizerRef.current = virtualizer;
  });

  const virtualizerItems = virtualizer.getVirtualItems();
  /*
   * VIRTUALIZER CODE END
   */

  const parentDomRefs = mergeRefs(parentDomRef, parentDomMeasureRef) as any;

  return (
    <div ref={parentDomRefs} className="overflow-y-auto">
      <div ref={inViewLoaderDomRef}>loading</div>
      <div
        className="relative"
        style={{
          height: virtualizer.getTotalSize(),
        }}
      >
        {virtualizerItems.map((virtualItem) => {
          const message = messages[virtualItem.index];

          const virtualItemRef =
            messages[MESSAGES_PAGE_SIZE - 1].index === message.index
              ? (mergeRefs(
                  virtualizer.measureElement,
                  firstMessageDomRef
                ) as any)
              : virtualizer.measureElement;

          return (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={virtualItemRef}
              className={clsx("absolute", {
                "right-0": conversation?.user?.id === message.author,
                "w-[75%]":
                  parentDomWidth <=
                  PARENT_DOM_BREAKPOINT_SIZE_FOR_DESKTOP_MOBILE,
                "w-[65%]":
                  parentDomWidth >
                  PARENT_DOM_BREAKPOINT_SIZE_FOR_DESKTOP_MOBILE,
              })}
              style={{
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <div
                className={clsx(
                  "bg-[#c5bdff] text-stone-800 p-2 text-sm w-fit",
                  {
                    "float-right": conversation?.user?.id === message.author,
                    "rounded-t-[12px] rounded-bl-[12px] rounded-br-[0]":
                      conversation?.user?.id === message.author,
                    "rounded-t-[12px] rounded-br-[12px] rounded-bl-[0]":
                      conversation?.user?.id !== message.author,
                  }
                )}
              >
                {message.index} - {message.body} -{" "}
                <span>{message.dateCreated.toString()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MessagesList;
