import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import Avatar from "../../public/newImages/default-avatar.png";
import Image from "next/image";
import { useMediaQuery } from "react-responsive";
import { useRouter } from "next/router";
import { RouterQuery } from "./types";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  ConversationWithUserObject,
  PaginationInfoObject,
} from "../../gql/graphql";
import { Howl } from "howler";
import { Spinner } from "../../@/components/ui/spinner";
import { LIMIT } from "../../constants/pagination";

const sound = new Howl({
  src: ["./../sound.mp3"], // Replace with your actual sound file
});

type Props = {
  request: boolean;
  setRequest: Dispatch<SetStateAction<boolean>>;
  setMobileOpen: Dispatch<SetStateAction<boolean>>;
  conversations: ConversationWithUserObject[] | [];
  pageInfo: PaginationInfoObject | null;
  // FIXME: because argument and return types is not fully typed, autosuggestion is not working
  fetchMoreConversationsForUser: Function;
};

const CONVERSATION_BOX_ESTIMATE_HEIGHT = 80;

export default function ConversationsList({
  request,
  setRequest,
  setMobileOpen,
  conversations,
  pageInfo,
  fetchMoreConversationsForUser,
}: Props) {
  const parentDomRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const { id }: RouterQuery = router.query;

  const media = useMediaQuery({ query: "(max-width: 768px)" });

  const virtualizer = useVirtualizer({
    count: pageInfo?.hasNextPage
      ? conversations.length + 1
      : conversations.length,
    getScrollElement: () => parentDomRef.current,
    estimateSize: () => CONVERSATION_BOX_ESTIMATE_HEIGHT,
    overscan: 5,
  });

  const handleClickConversation = (sid: string) => {
    if (id !== sid) {
      router.push(`/conversation?id=${sid}`, undefined, { shallow: true });
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

  return (
    <section className="flex flex-col w-full md:w-[100px] lg:w-[400px] h-full items-start rounded-md overflow-hidden bg-[#FFFFFF] border-b-4 border-[gray]">
      <div className="block w-full">
        <div className="flex flex-row md:flex-col lg:flex-row items-center gap-6 justify-start px-6 py-2">
          <span
            className="cursor-pointer"
            style={{ color: !request ? "#0A7CFF" : "#838CAC" }}
            onClick={() => setRequest(false)}
          >
            chat
          </span>
          <span
            className="cursor-pointer relative"
            style={{ color: request ? "#0A7CFF" : "#838CAC" }}
            onClick={() => setRequest(true)}
          >
            request
            <div className="absolute w-2 h-2 bg-[#3b66d1] top-0 -right-2 rounded-full"></div>
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

            /**
             * FIXME: დომში ამის რენდერი არამგონია კარგი მიდგომა იყვეს, ზემოთ useEffect-ში ჯობია გაკეთდეს ეს.
             */
            const conversation = conversations[virtualRow.index];

            {
              !!conversation?.unreadMessagesCount && sound.play();
            }

            return (
              <div
                key={virtualRow.index}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                className={`absolute w-full flex flex-row cursor-pointer items-center ${
                  conversation?.sid === router.query.id ? "bg-[#e7e7fe]" : ""
                } justify-center lg:justify-between px-6 md:p-0 py-2 lg:py-2 lg:px-4 border-b-2 border-[#E3E3E3] w-full`}
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                onClick={() =>
                  !isLoaderRow ? handleClickConversation(conversation.sid) : {}
                }
              >
                {isLoaderRow ? (
                  <div className="w-full h-full flex justify-center items-center">
                    <Spinner size="small" />
                  </div>
                ) : (
                  <>
                    <div className="w-full h-full  relative flex  flex-row justify-start md:justify-center md:py-2 lg:py-0 lg:justify-start">
                      <div className="w-10 h-10 relative rounded-[50%] overflow-hidden">
                        {conversation?.user?.profileImage ? (
                          <Image
                            src={conversation?.user?.profileImage}
                            alt="User Avatar"
                            objectFit="cover"
                            layout="fill"
                          />
                        ) : (
                          <Image
                            src={Avatar}
                            alt="Fallback Avatar"
                            objectFit="cover"
                            layout="fill"
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

                      <div className="flex-col h-full ml-6 flex md:hidden lg:flex">
                        <span className="text-[#484848] font-semibold text-[14px]">
                          {conversation.user.firstname}
                        </span>
                        <span className="text-[#838CAC] text-xs mt-1">
                          last message
                        </span>
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
