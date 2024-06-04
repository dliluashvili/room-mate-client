import useTranslation from "next-translate/useTranslation";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../@/components/ui/alert-dialog";

import { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "../../@/components/ui/button";
import successIcon from "../../public/imgs/Success.svg";
import errorIcon from "../../public/imgs/Error.svg";
import Image from "next/image";

export function MessageAlert({ feedback, setIsOpen, alertType }) {
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const { t } = useTranslation("common");

  const getModalType = () => {
    switch (alertType) {
      // case "success":
      //   return {
      //     text: t("keepSearch"),
      //     href: "/search",
      //     img: successIcon,
      //   };
      // case "error1":
      //   return {
      //     text: t("checkMessages"),
      //     href: "/conversation",
      //     img: errorIcon,
      //   };
      default:
        return {
          text: t("supportTeam"),
          href: "https://www.facebook.com/RoommateGeorgia.ge",
          img: errorIcon,
          target: "_blank",
          cancel: t("cancel"),
        };
    }
  };

  const handleClose = () => {
    setOpen(false);
    setIsOpen(false);
    if (type.cancel) {
      window.open(type.href, "_blank");
    } else {
      router.push(type.href);
    }
  };
  const type = getModalType();

  return (
    <AlertDialog open={feedback && open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <Image src={type.img} width={100} height={100} />
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {feedback}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {type.cancel && (
            <Button
              onClick={() => {
                setOpen(false);
                setIsOpen(false);
              }}
              className=" w-auto lg:w-auto text-xs mt-4 sm:mt-0 md:text-sm lg:text-sm "
            >
              {type.cancel}
            </Button>
          )}
          <Button
            className="w-auto text-xs  md:text-sm lg:text-sm "
            onClick={handleClose}
          >
            {type.text}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
