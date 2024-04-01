import { Button } from "../@/components/ui/button";
import { Dialog, DialogContent } from "../@/components/ui/dialog";
import popupBack from "../public/newImages/popup.svg";
import Image from "next/image";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";

export function PopUp({ isOpen, setIsOpen, range }) {
  const router = useRouter();
  let { t } = useTranslation("common") as { t: (key: string) => string };

  return (
    <Dialog open={isOpen}>
      <h1 onClick={() => setIsOpen(false)}>Close</h1>
      <DialogContent className="sm:max-w-[470px] flex flex-col   overflow-hidden bg-white ">
        <div className="w-full h-40 relative">
          <Image src={popupBack} layout="fill" objectFit="cover" />
        </div>
        <div className="flex flex-col  gap-2 px-2 md:px-6 text-center pb-2 md:pb-4 text-sm">
          <span>
            {range < 135
              ? t("135-1")
              : range > 135 && range < 270
              ? t("270-1")
              : range > 270 && range < 380
              ? t("380-1")
              : range > 435
              ? t("435-1")
              : ""}
          </span>
          <span>
            {range < 135
              ? t("135-2")
              : range > 135 && range < 270
              ? t("270-2")
              : range > 270 && range < 380
              ? t("380-2")
              : range > 435
              ? t("435-2")
              : ""}
          </span>
          <span>
            {range < 135
              ? t("135-3")
              : range > 135 && range < 270
              ? t("270-3")
              : range > 270 && range < 380
              ? t("380-3")
              : range > 435
              ? t("435-3")
              : ""}
          </span>
          <span>
            {range < 135
              ? t("135-4")
              : range > 135 && range < 270
              ? t("270-4")
              : range > 270 && range < 380
              ? t("380-4")
              : range > 435
              ? t("435-4")
              : ""}
            <br />
            {range < 135
              ? t("135-5")
              : range > 135 && range < 270
              ? t("270-5")
              : range > 270 && range < 380
              ? t("380-5")
              : range > 435
              ? t("435-5")
              : ""}
          </span>
          <span>
            {range < 135
              ? t("135-6")
              : range > 135 && range < 270
              ? t("270-6")
              : range > 270 && range < 380
              ? t("380-6")
              : range > 435
              ? t("435-6")
              : ""}
          </span>

          <span>
            {range < 135
              ? t("135-7")
              : range > 135 && range < 270
              ? ""
              : range > 270 && range < 380
              ? t("380-7")
              : range > 435
              ? t("435-7")
              : ""}
          </span>
          <div className="flex flex-row gap-2 mt-2 ">
            <Button variant="popUp" onClick={() => router.push("/")}>
              {range < 135
                ? t("135-no")
                : range > 135 && range < 270
                ? t("270-no")
                : range > 270 && range < 380
                ? t("380-no")
                : range > 435
                ? t("435-no")
                : ""}
            </Button>
            <Button variant="popUp" onClick={() => router.push("/")}>
              {range < 135
                ? t("135-yes")
                : range > 135 && range < 270
                ? t("270-yes")
                : range > 270 && range < 380
                ? t("380-yes")
                : range > 435
                ? t("435-yes")
                : ""}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
