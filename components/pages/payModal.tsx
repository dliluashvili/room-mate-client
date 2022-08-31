import React from "react";
import useTranslation from "next-translate/useTranslation";
import { Button } from "../common/form";

const PayModal = ({
  setClose,
  isModal = false,
}: {
  setClose?: () => void;
  isModal?: boolean;
}) => {
  let { t } = useTranslation("common");

  return (
    <div className="payModal_wrapper">
      {isModal ? <div className="blurBg"></div> : null}

      <div className="buyModal">
        <h2>{t("servicePriceDEscription")}</h2>
        <div>
          <p className="text-center">
            <div>{t("servicePriceDEscription2")}</div>
            <div className="mb-2">{t("servicePriceDEscription3")}</div>
            <div>{t("servicePriceDEscription4")}</div>
            <div>{t("servicePriceDEscription5")}</div>
          </p>

          <div className="d-flex align-items-center w-100 justify-content-center">
            <Button onClick={setClose} className="btn btn-light mr-3">
              {t("Cancel")}
            </Button>
            <Button className="btn btn-primary">{t("Pay")}</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayModal;
