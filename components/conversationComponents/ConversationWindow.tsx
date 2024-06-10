import TestAvatar from "../../public/newImages/testAvatar.svg";
import Send from "../../public/newImages/send.svg";
import CloseCircle from "../../public/newImages/close-circle.svg";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { useMediaQuery } from "react-responsive";
import { twilioClientVar } from "../../store/twilioVars";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  getSharedConversationQuery,
  lookupOrCreateTwilioUserResourceMutation,
} from "../../gql/graphqlStatements";
import { updateCacheWithNewConversationInFirstPlace } from "../utils/conversationUtils";
import { MessageAlertDialog } from "./MessageAlertDialog";
import useTranslation from "next-translate/useTranslation";
import { Spinner } from "../../@/components/ui/spinner";

// TODO: move to types.ts file
export type messageSendStatusType =
  | "messageSendSuccess"
  | "userResourceCreation"
  | "conversationResourceCreationError"
  | "participantAddError"
  | "messageSendError";

type MessageSendStatus = {
  type: messageSendStatusType;
  feedback: string;
};

type Props = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  name: string;
  participantId: string;
};

export default function ConversationWindow({
  setIsOpen,
  name,
  participantId,
}: Props) {
  const [messageText, setMessageText] = useState("");
  const [messageSendStatus, setMessageSendStatus] =
    useState<MessageSendStatus | null>(null);

  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  let { t } = useTranslation("common");

  const ref = useRef();

  const media = useMediaQuery({ maxWidth: 768 });

  const twilioClient = twilioClientVar();

  const [getSharedConversation] = useLazyQuery(getSharedConversationQuery, {
    fetchPolicy: "network-only",
  });

  const [lookupOrCreateTwilioUserResource] = useMutation(
    lookupOrCreateTwilioUserResourceMutation
  );

  const updateConversationCacheWithNewConversation = async (
    participantId: string
  ) => {
    const { data } = await getSharedConversation({
      variables: { participantId },
    });

    if (data.getSharedConversation) {
      updateCacheWithNewConversationInFirstPlace(data.getSharedConversation);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    enableBodyScroll(ref.current);
  };

  const handleMessageChange = (event) => {
    setMessageText(event.target.value);
  };

  const handleSendMessage = async () => {
    setIsLoading(true); // Set loading state to true before request
    try {
      if (messageText?.length) {
        const twilioUserResourceResponse =
          await lookupOrCreateTwilioUserResource({
            variables: { userId: participantId },
          });
        if (twilioUserResourceResponse) {
          const conversation = await twilioClient.createConversation();
          const settledParticipantAdd = await Promise.allSettled([
            conversation.add(twilioClient.user.identity),
            conversation.add(participantId),
          ]);
          const isFulfilledParticipantAdd = settledParticipantAdd.every(
            (settledParticipant) => settledParticipant.status === "fulfilled"
          );
          if (isFulfilledParticipantAdd) {
            await conversation
              .sendMessage(messageText)
              .then(async () => {
                await updateConversationCacheWithNewConversation(participantId);

                setMessageSendStatus({
                  type: "messageSendSuccess",
                  feedback: t("successMessage", { receiverName: name }),
                });
              })
              .catch(async () => {
                await updateConversationCacheWithNewConversation(participantId);

                setMessageSendStatus({
                  type: "messageSendError",
                  feedback: t("sendMessageError1"),
                });
              });
          } else {
            setMessageSendStatus({
              type: "participantAddError",
              feedback: t("sendMessageError2"),
            });
          }
        } else {
          setMessageSendStatus({
            type: "conversationResourceCreationError",
            feedback: t("sendMessageError2"),
          });
        }
      }
    } catch (error) {
      console.log({ error });
    } finally {
      setIsLoading(false); // Set loading state to false after request
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
     
    }
  };

  useEffect(() => {
    if (ref.current && media) {
      disableBodyScroll(ref.current);
    }
  }, [setIsOpen]);

  return messageSendStatus ? (
    <MessageAlertDialog
      feedback={messageSendStatus.feedback}
      alertType={messageSendStatus.type}
      setIsOpen={setIsOpen}
    />
  ) : (
    <>
      <div
        ref={ref}
        className="w-full h-full md:w-[375px] md:h-[415px] right-0 fixed bottom-0 md:right-20 bg-[#FFFFFF] flex  flex-col  border z-50 rounded-lg shadow-md"
      >
        <>
          <div className="flex flex-row w-full justify-between items-center p-6  shadow-md">
            <div className="flex flex-row w-full items-center justify-between">
              <div className="w-full flex flex-row  items-center justify-start">
                <Image src={TestAvatar} alt="123" width={40} height={40} />
                <div className="flex flex-col ml-6 justify-between">
                  <span>{name}</span>
                </div>
              </div>
              <div className="h-full flex items-start justify-between">
                <Image
                  onClick={handleClose}
                  src={CloseCircle}
                  alt="123"
                  width={32}
                  height={32}
                  className="cursor-pointer"
                />
              </div>
            </div>
          </div>
          <div className="w-full h-full px-6 "></div>
          {feedback !== null ? (
            <div className="flex w-full h-full justify-center items-center pb-40">
              {feedback}
            </div>
          ) : isLoading ? (
            <div className="flex h-full justify-center items-start">
              <Spinner />
            </div>
          ) : (
            <div className=" h-auto w-full flex flex-col justify-end items-end ">
              <div className="flex flex-col pt-5 pb-4 px-4 w-full h-full justify-end  ">
                <span className="w-[300px] text-xs mb-5">
                  {t("aboutChat1")} {name} {t("aboutChat2")}
                </span>
                <textarea
                  className="border-[#838CAC] border focus:outline-none rounded-md h-24 pl-1 text-md pt-1"
                  value={messageText}
                  onChange={handleMessageChange}
                  onKeyDown={handleKeyDown}
                />
                <button
                  className="w-full flex flex-row justify-end mt-6 cursor-pointer"
                  onClick={handleSendMessage}
                  disabled={
                    isLoading ||
                    messageSendStatus?.type === "messageSendSuccess"
                  } // Disable on loading or sent
                >
                  <Image src={Send} width={24} height={24} alt="send" />
                </button>
              </div>
            </div>
          )}
        </>
      </div>
    </>
  );
}
