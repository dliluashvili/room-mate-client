import Image from "next/image";
import React, { useRef, useState } from "react";
import Avatar from "../../public/newImages/default-avatar.png";
import CloseCircle from "../../public/newImages/close-circle.svg";
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
type Props = {
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  conversationResource: Conversation;
  conversation: ConversationWithUserObject;
};

export default function MobileConversation({
  mobileOpen,
  setMobileOpen,
  conversationResource,
  conversation,
}: Props) {
  const request = false;

  const [message, setMessage] = useState("");
  const headerRef = useRef<HTMLDivElement>(null);
  const client = useApolloClient();

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
    if (message.length) {
      conversationResource.sendMessage(message);
      setMessage("");
    }
  };

  // FIXME: sometimes headerRef.current?.clientHeight undefined and textarea is hiding below visible area
  const containerHeight = headerRef.current?.clientHeight
    ? `calc(100% - ${headerRef.current.clientHeight}px)`
    : "100%";

  const participantFullName =
    conversation?.user?.firstname && conversation?.user?.lastname
      ? `${conversation.user.firstname} ${conversation.user.lastname}`
      : "User";

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent default form submission
      handleSendMessage();
    }
  };

  return (
    <section
      className="w-full bg-[#FFFFFF]  h-full flex-col absolute z-50"
      style={{ display: mobileOpen ? "flex" : "none" }}
    >
      <div
        ref={headerRef}
        className="flex flex-row w-full justify-between items-center pt-4 pb-4 px-6 shadow-md"
      >
        <div className="flex flex-row items-center">
          {!request ? (
            <div onClick={() => setMobileOpen(false)} className="mr-4">
              <Image src={ArrowLeft} alt="avatar" />
            </div>
          ) : null}
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
          <div className="flex flex-col ml-4 justify-between">
            <span>{participantFullName}</span>
            {/* <span>active now</span> */}
          </div>
        </div>
        <div className="h-full flex items-start justify-start">
          {request ? (
            <Image
              onClick={() => setMobileOpen(false)}
              src={CloseCircle}
              alt="123"
              width={32}
              height={32}
              className="cursor-pointer"
            />
          ) : null}
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
            </div>
          );
        }

        if (conversation?.status === ConversationStatus.Requested) {
          return (
            <div className="w-full h-full flex flex-col justify-end  p-6 ">
              <div className="w-full bg-[#838CAC] rounded-lg flex flex-col items-center p-6">
                <span className="text-[#FFFFFF]">
                  if you reply Mako will be able to call you and see information
                  such as you active status and when you have read messages.
                </span>
                <div className="w-full flex gap-4 flex-row justify-center items-center mt-6">
                  <button
                    disabled={loading}
                    onClick={() =>
                      updateConversationStatus({
                        variables: {
                          conversationId: conversation.id,
                          status: ConversationStatus.Accepted,
                        },
                      })
                    }
                    className="py-2 w-full px-10 bg-white rounded-xl text-[#838CAC]"
                  >
                    accept
                  </button>
                  <button
                    disabled={loading}
                    onClick={() =>
                      updateConversationStatus({
                        variables: {
                          conversationId: conversation.id,
                          status: ConversationStatus.Rejected,
                        },
                      })
                    }
                    className="py-2 px-10 w-full text-[#FFFFFF] border border-[#FFFFFF] rounded-xl"
                  >
                    reject
                  </button>
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
  );
}
