import Image from "next/image";
import TestAvatar from "../../public/newImages/testAvatar.svg";
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

  const handleMessageChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (conversationResource && message.length) {
      conversationResource.sendMessage(message);
      setMessage("");
    }
  };

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
    <section className="w-full flex-col bg-[#FFFFFF] hidden ml-6 md:flex rounded-md border-b-4 border-[gray] overflow-hidden">
      <div
        ref={headerRef}
        className="flex flex-row w-full justify-between items-center pt-4 pb-4 px-6 shadow-md"
      >
        <div className="flex flex-row items-center">
          <Image src={TestAvatar} alt="avatar" width={40} height={40} />
          <div className="flex flex-col ml-6 justify-between">
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
              <div className="flex w-full h-auto flex-row items-center  border-t border-[#838CAC] px-3 py-4 ">
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
            <div className="w-full h-full flex flex-col justify-end p-4 ">
              <div className="w-full bg-[#838CAC] rounded-lg flex  md:flex-col lg:flex-row items-center justify-between gap-14 p-10">
                <span className="text-[#FFFFFF]">
                  if you reply Mako will be able to call you and see information
                  such as you active status and when you have read messages.
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
  );
}
