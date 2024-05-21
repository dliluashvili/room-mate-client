import Image from "next/image";
import TestAvatar from "../../public/newImages/testAvatar.svg";
import Send from "../../public/newImages/send.svg";
import MessagesList from "./MessagesList";
import { Conversation } from "@twilio/conversations";
import { useRef } from "react";
import { useTypedSelector } from "../hooks/useTypeSelector";
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
  const { user } = useTypedSelector((state) => state.profile);

  const headerRef = useRef<HTMLDivElement>(null);

  const client = useApolloClient();

  const [updateConversationStatus, { loading, data, error }] = useMutation(
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
                  return conversation;
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
                  const prevUpdatedConversations =
                    getConversationsForUser.list.slice(
                      0,
                      updatedConversationIndex
                    );

                  const nextUpdatedConversations =
                    getConversationsForUser.list.slice(
                      updatedConversationIndex + 1
                    );

                  const updatedConversation = getConversationsForUser.list.find(
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

  const containerHeight = headerRef.current?.clientHeight
    ? `calc(100% - ${headerRef.current.clientHeight}px)`
    : "100%";

  const participantFullName =
    conversation?.user?.firstname && conversation?.user?.lastname
      ? `${conversation.user.firstname} ${conversation.user.lastname}`
      : "User";

  return (
    <section className="w-full flex-col  bg-[#FFFFFF] hidden ml-6 md:flex  rounded-md border-b-4 border-[gray] overflow-hidden">
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
              className="flex flex-col justify-end pt-5 pb-4 px-4 w-full"
              style={{
                height: containerHeight,
              }}
            >
              <MessagesList
                conversationResource={conversationResource}
                participant={conversation.user}
                user={user}
              />
              <div className="flex w-full h-auto flex-row items-center px-6 py-4">
                <input
                  placeholder="send message"
                  className="w-full text-[14px] py-2 px-3 border border-[gray] rounded-3xl mr-2"
                />
                <Image
                  src={Send}
                  width={24}
                  height={24}
                  alt="send message"
                  className="cursor-pointer"
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