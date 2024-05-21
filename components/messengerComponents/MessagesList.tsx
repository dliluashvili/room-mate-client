import { useVirtualizer } from "@tanstack/react-virtual";
import { Conversation, Message, Paginator } from "@twilio/conversations";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { UserPreviewObject } from "../../gql/graphql";
import { IUser } from "../../redux/reducers/profileReducer";

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

  const paginatedMessagesRed = useRef<Paginator<Message>>(null);

  const parentDomRef = useRef<HTMLDivElement>(null);

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
      if (!paginatedMessagesRed.current) {
        const paginatedMessages = await conversationResource.getMessages(
          MESSAGES_PAGE_SIZE
        );

        paginatedMessagesRed.current = paginatedMessages;

        setMessages([...paginatedMessages.items, ...messages]);
      } else if (paginatedMessagesRed.current.hasPrevPage) {
        const paginatedMessages = await paginatedMessagesRed.current.prevPage();

        paginatedMessagesRed.current = paginatedMessages;

        setMessages([...paginatedMessages.items, ...messages]);
      }
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
      ).slice(0, paginatedMessagesRed.current.items.length);

      const lastElementOffset = lastElements.reduce((acc, curr) => {
        return (acc += curr[1].clientHeight);
      }, 0);

      const nextScrollToOffset = paginatedMessagesRed.current?.hasPrevPage
        ? virtualizer.scrollOffset +
          lastElementOffset +
          paginatedMessagesRed.current.items.length * virtualizer.options.gap
        : virtualizer.scrollOffset + lastElementOffset - LOADER_BOX_HEIGHT;

      virtualizer.scrollToOffset(nextScrollToOffset);
    });
  };

  useEffect(() => {
    if (conversationResource) {
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
      paginatedMessagesRed.current?.hasPrevPage
    ) {
      getMessagesFromTwilio(conversationResource);
    }
  }, [inView, messages]);

  useEffect(() => {
    if (messages.length) {
      waitToRenderVirtualItemsAndScrollToOffset();
    }
  }, [messages]);

  const height = paginatedMessagesRed.current?.hasPrevPage
    ? virtualizer.getTotalSize() + LOADER_BOX_HEIGHT
    : virtualizer.getTotalSize();

  return (
    <div className="overflow-auto" ref={parentDomRef}>
      <div
        style={{
          height: `${height}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {paginatedMessagesRed?.current?.hasPrevPage && (
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

          const translateY = paginatedMessagesRed.current?.hasPrevPage
            ? LOADER_BOX_HEIGHT + virtualRow.start
            : virtualRow.start;

          const author =
            participant.id === message.author
              ? `${participant.firstname} ${participant.lastname}`
              : `${user.firstname} ${user.lastname}`;

          return (
            <div
              key={virtualRow.index}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              style={{
                width: "100%",
                position: "absolute",
                transform: `translateY(${translateY}px)`,
                border: "1px solid black",
                background:
                  Number(message.index) % MESSAGES_PAGE_SIZE == 0
                    ? "#90EE90"
                    : "",
              }}
            >
              {message.body} - {author}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MessagesList;
