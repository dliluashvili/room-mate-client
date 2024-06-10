import Image from "next/image";
import React, { useRef, useState } from "react";
import Send from "../../public/newImages/send.svg";
import ArrowLeft from "../../public/newImages/arrow-left-chat.svg";
import MessagesList from "./MessagesList";
import { Conversation } from "@twilio/conversations";
import {
  ConversationStatus,
  ConversationWithUserObject,
} from "../../gql/graphql";
import {
  getConversationsForUserQuery,
  updateConversationStatusMutation,
} from "../../gql/graphqlStatements";
import { useApolloClient, useMutation } from "@apollo/client";
import AutosizeTextarea from "react-textarea-autosize";
import clsx from "clsx";
import useTranslation from "next-translate/useTranslation";
import { useToast } from "../../@/components/ui/use-toast";
import { useRouter } from "next/router";

type Props = {
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  conversationResource: Conversation;
  conversation: ConversationWithUserObject;
  setRequest: any;
};

export default function MobileConversation({
  mobileOpen,
  setMobileOpen,
  conversationResource,
  conversation,
  setRequest,
}: Props) {
  const [message, setMessage] = useState("");

  const headerRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const client = useApolloClient();

  const { t } = useTranslation("common");
  const { toast } = useToast();

  const [updateConversationStatus, { loading }] = useMutation(
    updateConversationStatusMutation,
    {
      onCompleted: (response) => {
        client.cache.updateQuery(
          {
            query: getConversationsForUserQuery,
          },
          (data) => {
            if (data?.getConversationsForUser) {
              const getConversationsForUser = structuredClone(
                data?.getConversationsForUser
              );

              const updatedConversations = getConversationsForUser.list.map(
                (userConversation) => {
                  if (userConversation.id === conversation.id) {
                    return {
                      ...userConversation,
                      status: response.updateConversationStatus,
                    };
                  }

                  return userConversation;
                }
              );

              if (getConversationsForUser.list.length > 1) {
                const updatedConversationIndex =
                  getConversationsForUser.list.findIndex(
                    (userConversation) =>
                      userConversation.id === conversation.id
                  );

                if (updatedConversationIndex === 0) {
                  return {
                    ...data,
                    getConversationsForUser: {
                      ...data.getConversationsForUser,
                      list: updatedConversations,
                    },
                  };
                } else {
                  const prevUpdatedConversations = updatedConversations.slice(
                    0,
                    updatedConversationIndex
                  );

                  let nextUpdatedConversations = [];

                  if (
                    updatedConversationIndex <
                    updatedConversations.length - 1
                  ) {
                    nextUpdatedConversations = updatedConversations.slice(
                      updatedConversationIndex + 1
                    );
                  }

                  const updatedConversation = updatedConversations.find(
                    (_, index) => index === updatedConversationIndex
                  );

                  return {
                    ...data,
                    getConversationsForUser: {
                      ...data.getConversationsForUser,
                      list: [
                        updatedConversation,
                        ...prevUpdatedConversations,
                        ...nextUpdatedConversations,
                      ],
                    },
                  };
                }
              } else {
                return {
                  ...data,
                  getConversationsForUser: {
                    ...data.getConversationsForUser,
                    list: updatedConversations,
                  },
                };
              }
            }
          }
        );
      },
    }
  );

  const handleMessageChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (
      conversationResource &&
      message.length &&
      conversation?.user?.conversationStatus !== "rejected"
    ) {
      conversationResource.sendMessage(message);
      setMessage("");
    } else if (message !== "") {
      toast({
        variant: "destructiveMobile",
        title: "Blocked",
        description: t("rejected"),
      });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent default form submission
      handleSendMessage();
    }
  };

  const handleBackNavigation = () => {
    setMobileOpen(false);
    router.push("conversation/", undefined, {
      shallow: true,
    });
  };

  const containerHeight = headerRef.current?.clientHeight
    ? `calc(100% - ${headerRef.current.clientHeight}px)`
    : "100%";

  const participantFullName =
    conversation?.user?.firstname && conversation?.user?.lastname
      ? `${conversation.user.firstname} ${conversation.user.lastname}`
      : "User";

  return (
    <>
      <section
        className={clsx(
          "w-screen bg-[#FFFFFF] h-full  overscroll-none overflow-y-hidden flex-col top-0 fixed z-50",
          mobileOpen ? "flex" : "hidden"
        )}
      >
        <div
          ref={headerRef}
          className="flex flex-row w-full justify-between  items-center pt-4 pb-4 px-6 shadow-md "
        >
          <div className="flex flex-row items-center ">
            <div onClick={handleBackNavigation} className="mr-4">
              <Image src={ArrowLeft} alt="avatar" />
            </div>

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
            <div className="flex flex-col ml-4 justify-between">
              <span>{participantFullName}</span>
              {/* <span>active now</span> */}
            </div>
          </div>
        </div>
        {(() => {
          if (conversation?.status === ConversationStatus.Accepted) {
            return (
              <div
                className="flex flex-col justify-end pt-5 py-2  px-4 w-full"
                style={{
                  height: containerHeight,
                }}
              >
                <MessagesList
                  conversationResource={conversationResource}
                  conversation={conversation}
                />
                {conversation &&
                conversation?.user?.conversationStatus !==
                  ConversationStatus.Rejected ? (
                  <div className="flex w-full h-auto flex-row items-center px-3 py-4">
                    <AutosizeTextarea
                      placeholder="send message"
                      className="scrollable-content w-full max-h-20 text-[14px] py-2 px-3 focus:outline-[#838CAC] inset-0  border border-[gray] rounded-xl mr-2"
                      value={message}
                      onChange={handleMessageChange}
                      onKeyDown={handleKeyDown}
                    />

                    <Image
                      src={Send}
                      width={24}
                      height={24}
                      alt="send message"
                      className="cursor-pointer"
                      onClick={handleSendMessage}
                    />
                  </div>
                ) : (
                  <div className="flex w-full text-center text-sm h-auto flex-row justify-center items-center px-3 py-4 ">
                    {t("rejected")}
                  </div>
                )}
              </div>
            );
          }

          if (
            conversation?.status === ConversationStatus.Requested ||
            conversation?.status === ConversationStatus.Rejected
          ) {
            return (
              <div
                className="flex w-full  justify-end flex-col  p-5 pt-4"
                style={{
                  height: containerHeight,
                }}
              >
                <MessagesList
                  conversationResource={conversationResource}
                  conversation={conversation}
                />

                <div
                  style={{
                    backgroundColor:
                      conversation?.status === ConversationStatus.Requested
                        ? "#838CAC"
                        : "#c25744",
                  }}
                  className=" w-full rounded-lg flex flex-col items-center p-6"
                >
                  <span className="text-[#FFFFFF] text-sm">
                    {conversation?.status === ConversationStatus.Requested
                      ? t("acceptReject", { receiverName: participantFullName })
                      : t("rejectedMessages", { participantFullName })}
                  </span>
                  <div className="w-full flex gap-4 flex-row justify-center items-center mt-6">
                    <button
                      className="py-2 w-full px-10 bg-white rounded-xl text-sm text-[#838CAC]"
                      disabled={loading}
                      onClick={() => {
                        setRequest(false);
                        updateConversationStatus({
                          variables: {
                            conversationId: conversation.id,
                            status: ConversationStatus.Accepted,
                          },
                        });
                      }}
                    >
                      {t("accept")}
                    </button>
                    {conversation?.status === ConversationStatus.Requested && (
                      <button
                        className="py-2 px-10 w-full text-[#FFFFFF] text-sm border border-[#FFFFFF] rounded-xl"
                        disabled={loading}
                        onClick={() =>
                          updateConversationStatus({
                            variables: {
                              conversationId: conversation.id,
                              status: ConversationStatus.Rejected,
                            },
                          })
                        }
                      >
                        {t("reject")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          if (conversation?.status === ConversationStatus.Rejected) {
            return "rejected";
          }

          return <></>;
        })()}
      </section>
    </>
  );
}
