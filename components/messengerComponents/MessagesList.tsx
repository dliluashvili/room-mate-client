import { useVirtualizer } from "@tanstack/react-virtual";
import { Conversation, Message, Paginator } from "@twilio/conversations";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { UserPreviewObject } from "../../gql/graphql";
import { IUser } from "../../redux/reducers/profileReducer";
import { useApolloClient } from "@apollo/client";
import { getConversationsForUserQuery } from "../../gql/graphqlStatements";
import { Spinner } from "../../@/components/ui/spinner";

type Props = {
  conversationResource: Conversation;
  participant?: UserPreviewObject;
  user: IUser;
};

const MESSAGES_PAGE_SIZE = 10;
const MESSAGE_BOX_ESTIMATE_HEIGHT = 100;
const LOADER_BOX_HEIGHT = 20;

const MessagesList = ({ conversationResource, participant, user }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const paginatedMessagesRef = useRef<Paginator<Message>>(null);

  const parentDomRef = useRef<HTMLDivElement>(null);

  const client = useApolloClient();

  const { ref: inViewRef, inView } = useInView();

  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentDomRef.current,
    estimateSize: () => MESSAGE_BOX_ESTIMATE_HEIGHT,
    overscan: 5,
    gap: 20,
  });

  //   const getRandomElement = () => {
  //     const elements = [
  //       "A Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  //       "B Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of de Finibus Bonorum et Malorum (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, Lorem ipsum dolor sit amet.., comes from a line in section 1.10.32.",
  //       "C Lorem Ipsum is simply dummy text of the printing and typesetting industry. is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
  //       "D is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
  //     ];
  //     const randomIndex = Math.floor(Math.random() * elements.length);

  //     return elements[randomIndex];
  //   };

  //   const messagesWithHeight = (messages: Message[]) => {
  //     return messages.map((message) => {
  //       return { ...message, text: getRandomElement() };
  //     });
  //   };

  const getMessagesFromTwilio = async (conversationResource: Conversation) => {
    try {
      if (!paginatedMessagesRef.current) {
        const paginatedMessages = await conversationResource.getMessages(
          MESSAGES_PAGE_SIZE
        );

        paginatedMessagesRef.current = paginatedMessages;

        setMessages((prevMessages) => [
          ...paginatedMessages.items,
          ...prevMessages,
        ]);
      } else if (paginatedMessagesRef.current.hasPrevPage) {
        const paginatedMessages = await paginatedMessagesRef.current.prevPage();

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

            // console.log({ conversationIncrementedUnreadMessage });

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

  /**
   * virtualizer should paint newly added elements to it to perform calculations(sum of element's heights) of them
   *
   * FIXME: On most browser, especially safari it is blinking because setTimeout
   */
  const waitToRenderVirtualItemsAndScrollToOffset = () => {
    setTimeout(() => {
      const lastElements = Array.from(
        virtualizer.measureElementCache.entries()
      ).slice(0, paginatedMessagesRef.current.items.length);

      const lastElementOffset = lastElements.reduce((acc, curr) => {
        return (acc += curr[1].clientHeight);
      }, 0);

      const nextScrollToOffset = paginatedMessagesRef.current?.hasPrevPage
        ? virtualizer.scrollOffset +
          lastElementOffset +
          paginatedMessagesRef.current.items.length * virtualizer.options.gap
        : virtualizer.scrollOffset + lastElementOffset - LOADER_BOX_HEIGHT;

      virtualizer.scrollToOffset(nextScrollToOffset);
    });
  };

  const handleMessageAdded = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

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
  }, [inView, messages]);

  useEffect(() => {
    if (messages.length) {
      waitToRenderVirtualItemsAndScrollToOffset();
    }

    // set message read while user load page
    if (
      conversationResource &&
      messages.length > 0 &&
      messages.length <= MESSAGES_PAGE_SIZE
    ) {
      setAllMessagesRead(conversationResource);
    }
  }, [messages]);

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

  const height = paginatedMessagesRef.current?.hasPrevPage
    ? virtualizer.getTotalSize() + LOADER_BOX_HEIGHT
    : virtualizer.getTotalSize();

  const [loading, setLoading] = useState(false);

  return (
    <>
      {messages.length === 0 ? (
        <div className="flex w-full h-full  justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <div
          className="overflow-auto scrollable-content scroll-smooth scroll-m-0 pt-2  px-3 pb-4"
          ref={parentDomRef}
        >
          <div
            style={{
              height: `${height}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {paginatedMessagesRef?.current?.hasPrevPage && (
              <div
                ref={inViewRef}
                style={{
                  width: "100%",
                  height: LOADER_BOX_HEIGHT,
                  position: "absolute",
                  transform: "translateY(0px)",
                  border: "1px solid red",
                }}
              >
                load more
              </div>
            )}

            {virtualizer.getVirtualItems().map((virtualRow) => {
              const message = messages[virtualRow.index];

              const translateY = paginatedMessagesRef.current?.hasPrevPage
                ? LOADER_BOX_HEIGHT + virtualRow.start
                : virtualRow.start;

              const author =
                participant.id === message.author
                  ? `${participant.firstname} ${participant.lastname}`
                  : `${user.firstname} ${user.lastname}`;

              return (
                <div
                  className="bg-none  "
                  key={virtualRow.index}
                  data-index={virtualRow.index}
                  ref={virtualizer.measureElement}
                  style={{
                    width: "100%",
                    position: "absolute",
                    transform: `translateY(${translateY}px)`,

                    textAlign:
                      participant.id === message.author ? "left" : "right", // Align text based on author
                    // background:
                    //   Number(message.index) % MESSAGES_PAGE_SIZE == 0
                    //     ? "#90EE90"
                    //     : "",
                  }}
                >
                  <div
                    className="  bg-[#19A463]   text-[#FFFFFF] p-2 text-sm"
                    style={{
                      display: "inline-block", // Ensure the message box takes only necessary width up to the max-width
                      maxWidth: "50%", // Set the max-width to 50% of the container
                      borderRadius:
                        participant.id === message.author
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
      )}
    </>
  );
};

export default MessagesList;
