import Image from "next/image";

import Send from "../../public/newImages/send.svg";
import MessagesList from "./MessagesList";
import { Conversation } from "@twilio/conversations";

import { useRef, useState } from "react";
import AutosizeTextarea from "react-textarea-autosize";
import {
  ConversationStatus,
  ConversationWithUserObject,
} from "../../gql/graphql";
import { useApolloClient, useMutation } from "@apollo/client";
import {
  getConversationsForUserQuery,
  updateConversationStatusMutation,
} from "../../gql/graphqlStatements";

type Props = {
  conversationResource: Conversation;
  conversation: ConversationWithUserObject;
};

export default function DesktopConversation({
  conversationResource,
  conversation,
}: Props) {
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

  const handleSendMessage = () => {
    if (conversationResource && message.length) {
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
      event.preventDefault(); // Prevent default form submission
      handleSendMessage();
    }
  };

  const containerHeight = headerRef.current?.clientHeight
    ? `calc(100% - ${headerRef.current.clientHeight}px)`
    : "100%";

  const participantFullName =
    conversation?.user?.firstname && conversation?.user?.lastname
      ? `${conversation.user.firstname} ${conversation.user.lastname}`
      : "User";

  // Assuming conversation.user.sid is the SID of the user participant in the conversation
  // You can use userStatus to determine if the user is online or offline

  console.log(conversation);

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
              </div>
            );
          }

          if (conversation?.status === ConversationStatus.Requested) {
            return (
              <div
                className="flex w-full h-screen justify-end flex-col  p-5"
                style={{
                  height: containerHeight,
                }}
              >
                <MessagesList
                  conversationResource={conversationResource}
                  conversation={conversation}
                />

                <div className=" py-6 mt-2 w-full h-auto bg-[#838CAC] rounded-lg flex  md:flex-col lg:flex-row items-center justify-between gap-14 px-10">
                  <span className="text-[#FFFFFF]">
                    if you reply Mako will be able to call you and see
                    information such as you active status and when you have read
                    messages.
                  </span>
                  <div className=" flex gap-4 flex-row  items-center">
                    <button
                      className="py-3 px-14 bg-white rounded-xl text-[#838CAC]"
                      disabled={loading}
                      onClick={() =>
                        updateConversationStatus({
                          variables: {
                            conversationId: conversation.id,
                            status: ConversationStatus.Accepted,
                          },
                        })
                      }
                    >
                      accept
                    </button>
                    <button
                      className="py-3 px-14 text-[#FFFFFF] border border-[#FFFFFF] rounded-xl"
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
    </>
  );
}
