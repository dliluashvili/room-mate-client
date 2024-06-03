import useTranslation from "next-translate/useTranslation";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../@/components/ui/alert-dialog";

import { useState } from "react";

export function MessageAlert({ feedback, setIsOpen, alertType }) {
  const [open, setOpen] = useState(true);
  const { t } = useTranslation("common");

  // Function to dynamically generate button text and href based on alertType
  const getModalButton = () => {
    switch (alertType) {
      case "success":
        return { text: t("keepSearch"), href: "/" }; // Use translated text
      case "error1":
        return { text: t("checkMessages"), href: "/messages" }; // More specific link (consider using a dedicated error page)
      default:
        return { text: t("checkMessages"), href: "/facebook.com" }; // Fallback for unknown types
    }
  };

  const handleClose = () => {
    setOpen(false);
    setIsOpen(false); // Close both the alert and potentially the parent component
  };

  const button = getModalButton();

  return (
    <AlertDialog open={feedback && open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("areYouSure")}</AlertDialogTitle>{" "}
          {/* Translated title */}
          <AlertDialogDescription>{feedback}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>
            {button.text}
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
