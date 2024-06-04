import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useMediaQuery } from "react-responsive";
import { useRouter } from "next/router";
import { RouterQuery } from "./types";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  ConversationStatus,
  ConversationWithUserObject,
  PaginationInfoObject,
} from "../../gql/graphql";
import { Howl } from "howler";
import { Spinner } from "../../@/components/ui/spinner";
import { LIMIT } from "../../constants/pagination";
import clsx from "clsx";

const sound = new Howl({
  src: ["./../sound.mp3"],
});

type Props = {
  request: boolean;
  setRequest: Dispatch<SetStateAction<boolean>>;
  setMobileOpen: Dispatch<SetStateAction<boolean>>;
  conversations: ConversationWithUserObject[] | [];
  pageInfo: PaginationInfoObject | null;
  // FIXME: because argument and return types is not fully typed, autosuggestion is not working
  fetchMoreConversationsForUser: Function;
  data: any; // need type
};

const CONVERSATION_BOX_ESTIMATE_HEIGHT = 80;

export default function ConversationsList({
  request,
  setRequest,
  setMobileOpen,
  conversations,
  pageInfo,
  data,
  fetchMoreConversationsForUser,
}: Props) {
  const parentDomRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const { id }: RouterQuery = router.query;
  const [requestMessage, setRequestMessage] = useState(false);

  const media = useMediaQuery({ query: "(max-width: 768px)" });

  const virtualizer = useVirtualizer({
    count: pageInfo?.hasNextPage
      ? conversations.length + 1
      : conversations.length,
    getScrollElement: () => parentDomRef.current,
    estimateSize: () => CONVERSATION_BOX_ESTIMATE_HEIGHT,
    overscan: 5,
  });

  const handleClickConversation = (conversationId: string) => {
    if (conversationId !== id) {
      router.push(`/conversation?id=${conversationId}`, undefined, {
        shallow: true,
      });
    }
    if (media) {
      setMobileOpen(true);
    }
  };

  useEffect(() => {
    const [lastVirtualItem] = [...virtualizer.getVirtualItems()].reverse();

    if (!lastVirtualItem) {
      return;
    }

    if (
      lastVirtualItem.index >= conversations.length - 1 &&
      pageInfo?.hasNextPage
    ) {
      fetchMoreConversationsForUser({
        variables: {
          pagination: {
            offset: conversations.length,
            limit: LIMIT,
          },
        },
      });
    }
  }, [
    pageInfo?.hasNextPage,
    virtualizer.getVirtualItems(),
    conversations.length,
  ]);

  useEffect(() => {
    const hasUnreadMessages = conversations.some(
      (item: any) => item?.unreadMessagesCount > 0
    );
    if (hasUnreadMessages) {
      sound.play();
    }
  }, [conversations]);

  useEffect(() => {
    const hasRequested =
      data &&
      data.list.some(
        (item) =>
          item?.status ===
            (ConversationStatus.Requested || ConversationStatus.Rejected) &&
          item?.user?.unreadMessagesCount > 0
      );
    if (hasRequested) {
      setRequestMessage(true);
    } else {
      setRequestMessage(false);
    }
  }, [data, request]);

  console.log(conversations);

  return (
    <section className="flex flex-col w-full md:w-[100px] lg:w-[400px] h-full items-start rounded-md overflow-hidden bg-[#FFFFFF] border-b-4 border-[gray]">
      <div className="block w-full">
        <div className="flex flex-row md:flex-col lg:flex-row items-center gap-6 justify-start px-6 py-2">
          <span
            className={clsx(
              "cursor-pointer",
              !request && "text-[#0A7CFF]",
              request && "text-[#838CAC]"
            )}
            onClick={() => {
              setRequest(false);
              const filteredAccepts = data?.list?.filter(
                (item) => item.status === "accepted"
              );

              const id = filteredAccepts?.[0]?.id;

              if (id) {
                router.push(`/conversation?id=${id}`);
              } else {
                router.push(`/conversation?id=${id}`);
              }
            }}
          >
            chat
          </span>
          <span
            className={clsx(
              "cursor-pointer relative",
              request && "text-[#0A7CFF]",
              !request && "text-[#838CAC]"
            )}
            onClick={() => {
              setRequest(true);
              const filteredRequestsRejects = data?.list?.filter(
                (item) =>
                  item.status === "rejected" || item.status === "requested"
              );

              const id = filteredRequestsRejects?.[0]?.id;
              console.log(id);

              if (id) {
                router.push(`/conversation?id=${id}`);
              }
            }}
          >
            request
            {requestMessage && (
              <div className="absolute w-2 h-2 bg-[#3b66d1] top-0 -right-2 rounded-full"></div>
            )}
          </span>
        </div>
        <div className="h-[1px] w-full bg-[#E3E3E3]"></div>
      </div>
      <div className="w-full overflow-auto" ref={parentDomRef}>
        <div
          className="relative w-full"
          style={{
            height: `${virtualizer.getTotalSize()}px`,
          }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const isLoaderRow = virtualRow.index > conversations.length - 1;

            const conversation = conversations[virtualRow.index];

            return (
              <div
                key={virtualRow.index}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                className={clsx(
                  "absolute w-full flex flex-row cursor-pointer items-center justify-center lg:justify-between px-6 md:p-0 py-2 lg:py-2 lg:px-4 border-b-2 border-[#E3E3E3]",
                  conversation?.id === router.query.id ? "bg-[#e7e7fe]" : ""
                )}
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                onClick={() =>
                  !isLoaderRow ? handleClickConversation(conversation.id) : {}
                }
              >
                {isLoaderRow ? (
                  <div className="w-full h-full flex justify-center items-center">
                    <Spinner size="small" />
                  </div>
                ) : (
                  <>
                    <div className="w-full h-full  relative flex  flex-row  items-center justify-start md:justify-center md:py-2 lg:py-0 lg:justify-start">
                      <div className="w-10 h-10 relative rounded-[50%] overflow-hidden">
                        {conversation?.user?.profileImage ? (
                          <img
                            src={conversation?.user?.profileImage}
                            alt="User Avatar"
                            className=" object-cover w-full h-full"
                          />
                        ) : (
                          <img
                            src="./../newImages/default-avatar.png"
                            alt="Fallback Avatar"
                            className=" object-cover w-full h-full"
                          />
                        )}
                      </div>

                      {!!conversation.unreadMessagesCount && (
                        <div
                          id="#tablet"
                          className="bg-[#DB0505] left-12 absolute  hidden md:flex lg:hidden text-white text-[10px] rounded-full w-5 h-5 items-center justify-center"
                        >
                          {conversation.unreadMessagesCount}
                        </div>
                      )}

                      <div className="flex-col h-full ml-6 flex  items-center justify-center md:hidden lg:flex">
                        <span className="text-[#484848] font-semibold text-[14px]">
                          {conversation.user.firstname}
                        </span>
                        {/* <span className="text-[#838CAC] text-xs mt-1">
                          last message or active now 
                        </span> */}
                      </div>
                    </div>
                    {!!conversation.unreadMessagesCount && (
                      <div className="bg-[#DB0505] flex md:hidden lg:flex  rounded-full w-5 h-5 items-center justify-center">
                        <span className="text-white text-[10px] text-center">
                          {conversation.unreadMessagesCount}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
