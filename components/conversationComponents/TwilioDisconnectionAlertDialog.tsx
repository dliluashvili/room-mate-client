import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "../../@/components/ui/alert-dialog";
import { Button } from "../../@/components/ui/button";
import useTranslation from "next-translate/useTranslation";

type Props = {
  open: boolean;
};

export const TwilioDisconnectionAlertDialog = ({ open }: Props) => {
  const [openAlert, setOpenAlert] = useState(null);
  const { t } = useTranslation("common");

  const handleRefresh = () => {
    location.reload();
  };

  useEffect(() => {
    setOpenAlert(open);
  }, [open]);

  return (
    <AlertDialog open={openAlert}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogDescription className="text-center">
            {t("twilioError")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            onClick={() => setOpenAlert(false)}
            className="w-auto lg:w-auto text-xs mt-4 sm:mt-0 md:text-sm lg:text-sm "
          >
            {t("cancel")}
          </Button>
          <Button
            className="w-auto text-xs  md:text-sm lg:text-sm "
            onClick={handleRefresh}
          >
            {t("refresh")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
