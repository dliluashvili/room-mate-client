import { Button } from "../@/components/ui/button";
import { Dialog, DialogContent } from "../@/components/ui/dialog";
import popupBack from "../public/newImages/popup.svg";
import Image from "next/image";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";

export function PopUp({ isOpen, range, country }) {
  const router = useRouter();
  let { t } = useTranslation("common") as { t: (key: string) => string };

  return (
    <Dialog open={isOpen && country !== "145"}>
      <DialogContent className="sm:max-w-[470px] flex flex-col   overflow-hidden bg-white ">
        <div className="w-full h-40 relative">
          <Image src={popupBack} layout="fill" objectFit="cover" />
        </div>
        <div className="flex flex-col  gap-4 px-2 md:px-6 text-center pb-2 md:pb-4 text-sm">
          <span>
            {range < 135
              ? t("135-1")
              : range > 135 && range < 270
              ? t("270-1")
              : range > 270 && range < 435
              ? t("435-1")
              : range > 435
              ? t("500-1")
              : null}
          </span>
          <span>
            {range < 135
              ? t("135-2")
              : range > 135 && range < 270
              ? t("270-2")
              : range > 270 && range < 435
              ? t("435-2")
              : range > 435
              ? t("500-2")
              : null}
          </span>
          <span>
            {range < 135
              ? t("135-3")
              : range > 135 && range < 270
              ? t("270-3")
              : range > 270 && range < 435
              ? t("435-3")
              : range > 435
              ? t("500-3")
              : null}
            <br />
            {range < 135
              ? t("135-4")
              : range > 135 && range < 270
              ? t("270-4")
              : null}
          </span>
          <span>
            {range < 135 ? (
              <>
                {t("135-5")} (You can also search them on our website or in our{" "}
                <a
                  href="https://www.facebook.com/RoommateGeorgia.ge"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook group
                </a>
                .)
              </>
            ) : range >= 135 && range < 270 ? (
              <>
                {t("270-5")} (You can also search them on our website or in our{" "}
                <a
                  href="https://www.facebook.com/RoommateGeorgia.ge"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook group
                </a>
                .)
              </>
            ) : range >= 270 && range < 435 ? (
              t("435-4") + "\u00A0".repeat(5)
            ) : range >= 435 ? (
              t("500-4") + "\u00A0".repeat(5)
            ) : null}
          </span>

          <span>
            {range < 135 ? t("135-6") : null}
            {range > 135 && range < 270 ? <br /> : null}
            {range > 270 && range < 435
              ? t("435-5") + "\u00A0".repeat(13)
              : null}
            {range > 435 ? t("500-5") + "\u00A0".repeat(13) : null}
            <br />
            {range > 270 && range < 435
              ? t("435-6") + "\u00A0".repeat(10)
              : null}
            {range > 435 ? t("500-6") + "\u00A0".repeat(10) : null}
            <br />
            {range > 270 && range < 435 ? t("435-7") : null}
            {range > 435 ? t("500-7") : null}
          </span>

          <div className="flex flex-row gap-2 mt-2 ">
            {range < 135 ? (
              <Button variant="popUp" onClick={() => router.push("/")}>
                {t("135-no")}
              </Button>
            ) : range > 135 && range < 270 ? (
              <Button variant="popUp" onClick={() => router.push("/")}>
                {t("270-no")}
              </Button>
            ) : null}
            <Button variant="popUp" onClick={() => router.push("/")}>
              {range < 135
                ? t("135-yes")
                : range > 135 && range < 270
                ? t("270-yes")
                : range > 270 && range < 435
                ? t("435-yes")
                : range > 435
                ? t("435-yes")
                : null}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
