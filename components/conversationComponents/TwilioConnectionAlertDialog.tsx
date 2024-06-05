import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../@/components/ui/alert-dialog";
import { Button } from "../../@/components/ui/button";

type Props = {
  open: boolean;
};

export const TwilioConnectionAlertDialog = ({ open }: Props) => {
  const [openAlert, setOpenAlert] = useState(null);

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
          <AlertDialogTitle>Twilio Socket Connection down</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            You can not use messaging feature, because twilio socket is
            disconnected. Please click "Refresh website" button to refresh
            website for continue using messaging feature
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            onClick={() => setOpenAlert(false)}
            className="w-auto lg:w-auto text-xs mt-4 sm:mt-0 md:text-sm lg:text-sm "
          >
            Cancel
          </Button>
          <Button
            className="w-auto text-xs  md:text-sm lg:text-sm "
            onClick={handleRefresh}
          >
            Refresh website
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
