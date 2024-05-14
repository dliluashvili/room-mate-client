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
import { ToastContainer, toast } from "react-toastify";
import { updateCacheWithNewConversationInFirstPlace } from "../utils/checkConversationExistence";

type messageSendStatus = "sent" | "error";

export default function WindowChat({ setIsOpen, name, targetUserId }) {
  const [messageText, setMessageText] = useState("");
  const [messageSendStatus, setMessageSendStatus] =
    useState<messageSendStatus | null>(null);

  const ref = useRef();

  const media = useMediaQuery({ maxWidth: 768 });

  const twilioClient = twilioClientVar();

  const [getSharedConversation] = useLazyQuery(getSharedConversationQuery, {
    fetchPolicy: "network-only",
  });

  const [lookupOrCreateTwilioUserResource] = useMutation(
    lookupOrCreateTwilioUserResourceMutation
  );

  const handleClose = () => {
    setIsOpen(false);
    enableBodyScroll(ref.current);
  };

  const handleMessageChange = (event) => {
    setMessageText(event.target.value);
  };

  const handleSendMessage = async () => {
    try {
      if (messageText?.length) {
        const twilioUserResourceResponse =
          await lookupOrCreateTwilioUserResource({
            variables: {
              userId: targetUserId,
            },
          });

        if (twilioUserResourceResponse) {
          const conversation = await twilioClient.createConversation();

          const settledParticipantAdd = await Promise.allSettled([
            conversation.add(twilioClient.user.identity),
            conversation.add(targetUserId),
          ]);

          const isFulfilledParticipantAdd = settledParticipantAdd.every(
            (settledParticipant) => settledParticipant.status === "fulfilled"
          );

          if (isFulfilledParticipantAdd) {
            await conversation.sendMessage(messageText);

            const { data } = await getSharedConversation({
              variables: {
                targetUserId,
              },
            });

            if (data.getSharedConversation) {
              updateCacheWithNewConversationInFirstPlace(
                data.getSharedConversation
              );
            }

            setMessageSendStatus("sent");
          } else {
            setMessageSendStatus("error");

            throw new Error("Participant add failed");
          }
        } else {
          setMessageSendStatus("error");

          throw new Error("Twilio user resource lookup or creation failed");
        }
      }
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    if (ref.current && media) {
      disableBodyScroll(ref.current);
    }
  }, [setIsOpen]);

  useEffect(() => {
    if (messageSendStatus === "sent") {
      toast.success(
        "Message and request with user sent successfully. For Tester: you can not send message from here, send button disabled. Need brainstorming what should be done.",
        { pauseOnHover: true, autoClose: 10000 }
      );
    }
    if (messageSendStatus === "error") {
      toast.error(
        "Error during sending message/request, retry or contact with site administrators!"
      );
    }
  }, [messageSendStatus]);

  return (
    <>
      <ToastContainer />
      <div
        ref={ref}
        className="w-full h-full md:w-[375px] md:h-[415px] right-0 fixed bottom-0 md:right-20 bg-[#FFFFFF] flex  flex-col  border z-50 rounded-lg shadow-md"
      >
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

        <div className=" h-auto w-full flex flex-col justify-end items-end ">
          <div className="flex flex-col pt-5 pb-4 px-4 w-full h-full justify-end  ">
            <span className="w-[300px] text-xs mb-5">
              შემთხვევითად გენერირებული ტექსტი ეხმარება დიზაინერებს და
              ტიპოგრაფიული ნაწარმის შემთხვევითად გენერირებული ტექსტი
            </span>
            <textarea
              className="border-[#838CAC] border focus:outline-none rounded-md h-24 pl-1 text-md pt-1"
              value={messageText}
              onChange={handleMessageChange}
            />
            <button
              className="w-full flex flex-row justify-end mt-6 cursor-pointer"
              onClick={handleSendMessage}
              disabled={messageSendStatus === "sent"}
            >
              <Image src={Send} width={24} height={24} alt="send" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
