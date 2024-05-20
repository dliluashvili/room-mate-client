import { useVirtualizer } from "@tanstack/react-virtual";
import { Conversation, Message, Paginator } from "@twilio/conversations";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

/**
 * TODO: if rowVirtualizer.getTotalSize() is less then its parent height fetch another chunk
 */

type Props = {
  conversationResource: Conversation;
};

const MESSAGES_PAGE_SIZE = 5;
// messages box max estimate height
const MESSAGE_BOX_ESTIMATE_SIZE = 50;
const LOADER_HEIGHT = 200;

const MessagesList = ({ conversationResource }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const [messagePaginator, setMessagePaginator] =
    useState<Paginator<Message>>(null);

  const parentRef = useRef<HTMLDivElement>(null);

  const { ref: inViewRef, inView } = useInView();

  const rowVirtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => MESSAGE_BOX_ESTIMATE_SIZE,
    overscan: 10,
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
      if (!messagePaginator) {
        const paginatedMessages = await conversationResource.getMessages(
          MESSAGES_PAGE_SIZE
        );

        setMessagePaginator(paginatedMessages);

        setMessages([...paginatedMessages.items, ...messages]);
      } else if (messagePaginator.hasPrevPage) {
        const paginatedMessages = await messagePaginator.prevPage();

        setMessagePaginator(paginatedMessages);

        setMessages([...paginatedMessages.items, ...messages]);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    if (conversationResource) {
      getMessagesFromTwilio(conversationResource);
    }
  }, [conversationResource]);

  /**
   * VIRTUALIZATION TESTING AREA
   */

  // fetch prev messages
  useEffect(() => {
    console.log({ inView }, messagePaginator?.hasPrevPage);
    if (inView && messagePaginator?.hasPrevPage) {
      getMessagesFromTwilio(conversationResource);
    }
  }, [inView]);

  // FIXME: can not scrollToOffset correctly because uncertain item height
  useEffect(() => {
    if (messages.length) {
      const lastElementOffset = Array.from(
        rowVirtualizer.measureElementCache.entries()
      )
        .slice(0, messagePaginator.items.length)
        .reduce((acc, curr) => {
          return (acc += curr[1].clientHeight);
        }, 0);

      rowVirtualizer.scrollToOffset(lastElementOffset);
    }
  }, [messages]);

  return (
    <div className="overflow-auto" ref={parentRef}>
      <div
        style={{
          height: `${
            messagePaginator?.hasPrevPage
              ? rowVirtualizer.getTotalSize() + LOADER_HEIGHT
              : rowVirtualizer.getTotalSize()
          }px`,
          width: "100%",
          position: "relative",
        }}
      >
        {messagePaginator?.hasPrevPage && (
          <div
            ref={inViewRef}
            style={{
              width: "100%",
              height: LOADER_HEIGHT,
              position: "absolute",
              transform: "translateY(0px)",
              border: "1px solid red",
            }}
          >
            load more
          </div>
        )}

        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const message = messages[virtualRow.index];

          const translateY = messagePaginator?.hasPrevPage
            ? LOADER_HEIGHT + virtualRow.start
            : virtualRow.start;

          return (
            <div
              key={virtualRow.index}
              data-index={virtualRow.index}
              ref={rowVirtualizer.measureElement}
              style={{
                width: "100%",
                position: "absolute",
                transform: `translateY(${translateY}px)`,
                border: "1px solid black",
              }}
            >
              {message.body} - {message.index}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MessagesList;
