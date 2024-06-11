import Image from "next/image";
import Send from "../../public/newImages/send.svg";
import MessagesList from "./MessagesList";
import { Conversation } from "@twilio/conversations";
import { useEffect, useRef, useState } from "react";
import AutosizeTextarea from "react-textarea-autosize";
import {
  ConversationStatus,
  ConversationWithUserObject,
} from "../../gql/graphql";
import { useApolloClient, useMutation, useReactiveVar } from "@apollo/client";
import {
  getConversationsForUserQuery,
  updateConversationResourceStateMutation,
  updateConversationStatusMutation,
} from "../../gql/graphqlStatements";
import useTranslation from "next-translate/useTranslation";
import { twilioClientVar } from "../../store/twilioVars";

type Props = {
  conversationResource: Conversation;
  conversation: ConversationWithUserObject;
  setRequest: any;
};

export default function DesktopConversation({
  conversationResource,
  conversation,
  setRequest,
}: Props) {
  const [message, setMessage] = useState("");
  const headerRef = useRef<HTMLDivElement>(null);

  const amIUpdaterOfConversationStatus = useRef(null);

  const client = useApolloClient();

  const twilioClient = useReactiveVar(twilioClientVar);

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

  const [updateConversationResourceState] = useMutation(
    updateConversationResourceStateMutation
  );

  const { t } = useTranslation("common");

  const updateConversationStatusInCache = (sid: string, status: string) => {
    client.cache.updateQuery(
      {
        query: getConversationsForUserQuery,
      },
      (data) => {
        if (data?.getConversationsForUser) {
          const updateConversations = data.getConversationsForUser.list.map(
            (conversation) => {
              if (conversation.sid === sid) {
                return {
                  ...conversation,
                  user: {
                    ...conversation.user,
                    conversationStatus:
                      status === "active"
                        ? ConversationStatus.Accepted
                        : ConversationStatus.Rejected,
                  },
                };
              }

              return conversation;
            }
          );

          return {
            ...data,
            getConversationsForUser: {
              ...data.getConversationsForUser,
              list: updateConversations,
            },
          };
        }
      }
    );

    amIUpdaterOfConversationStatus.current = null;
  };

  const handleSendMessage = () => {
    if (
      conversationResource &&
      message.length &&
      conversation?.user.conversationStatus !== ConversationStatus.Rejected
    ) {
      conversationResource.sendMessage(message);
      setMessage("");
    }
  };

  const handleMessageChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setMessage(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleAcceptClick = () => {
    setRequest(false);

    amIUpdaterOfConversationStatus.current = true;

    updateConversationStatus({
      variables: {
        conversationId: conversation.id,
        status: ConversationStatus.Accepted,
      },
    });

    if (conversationResource.state.current === "inactive") {
      updateConversationResourceState({
        variables: {
          sid: conversationResource.sid,
          state: "active",
        },
      });
    }
  };

  const handleRejectClick = async () => {
    amIUpdaterOfConversationStatus.current = true;

    updateConversationStatus({
      variables: {
        conversationId: conversation.id,
        status: ConversationStatus.Rejected,
      },
    });

    if (conversationResource.state.current === "active") {
      updateConversationResourceState({
        variables: {
          sid: conversationResource.sid,
          state: "inactive",
        },
      });
    }
  };

  // listen conversation status change
  useEffect(() => {
    if (twilioClient) {
      twilioClient.addListener(
        "conversationUpdated",
        ({ updateReasons, conversation }) => {
          if (
            updateReasons.includes("state") &&
            conversation &&
            !amIUpdaterOfConversationStatus.current
          ) {
            updateConversationStatusInCache(
              conversation.sid,
              conversation.state.current
            );
          }
        }
      );
    }
  }, [twilioClient]);

  const containerHeight = headerRef.current?.clientHeight
    ? `calc(100% - ${headerRef.current.clientHeight}px)`
    : "100%";

  const participantFullName =
    conversation?.user?.firstname && conversation?.user?.lastname
      ? `${conversation.user.firstname} ${conversation.user.lastname}`
      : "User";

  return (
    <>
      <section className="w-full flex-col bg-[#FFFFFF] hidden ml-6 md:flex rounded-md border-b-4 border-[gray] overflow-hidden">
        <div
          ref={headerRef}
          className="flex flex-row w-full justify-between items-center pt-4 pb-4 px-6 shadow-md"
        >
          <div className="flex flex-row items-center">
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
                className="flex flex-col justify-end pt-5 py-2  px-2 w-full"
                style={{
                  height: containerHeight,
                }}
              >
                <MessagesList
                  conversationResource={conversationResource}
                  conversation={conversation}
                />
                {conversation?.user.conversationStatus !==
                ConversationStatus.Rejected ? (
                  <div className="flex w-full h-auto flex-row items-center px-3 py-4 ">
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
                  <div className="flex w-full text-center h-auto flex-row justify-center items-center px-3 py-4 ">
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
                className="flex w-full justify-end flex-col  p-5"
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
                  className="py-6  w-full h-auto rounded-lg flex flex-col xl:flex-row items-center justify-between gap-5 px-10"
                >
                  <span className="text-[#FFFFFF] text-center">
                    {conversation?.status === ConversationStatus.Requested
                      ? t("acceptReject", { receiverName: participantFullName })
                      : t("rejectedMessages", { participantFullName })}
                  </span>
                  <div className=" flex gap-4 flex-row  items-center">
                    <button
                      className="py-3 px-14 bg-white rounded-xl text-[#838CAC]"
                      disabled={loading}
                      onClick={handleAcceptClick}
                    >
                      {t("accept")}
                    </button>
                    {conversation?.status === ConversationStatus.Requested && (
                      <button
                        className="py-3 px-14 text-[#FFFFFF] border border-[#FFFFFF] rounded-xl"
                        disabled={loading}
                        onClick={handleRejectClick}
                      >
                        {t("reject")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          }
        })()}
      </section>
    </>
  );
}
