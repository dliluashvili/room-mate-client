import React from "react";
import { Button } from "../common/form";

const PayModal = ({
  setClose,
  isModal = false,
}: {
  setClose?: () => void;
  isModal?: boolean;
}) => {
  return (
    <div className="payModal_wrapper">
      {isModal ? <div className="blurBg"></div> : null}

      <div className="buyModal">
        <h2>სერვისის სარგებლობისთვის საჭიროა მომსახურების საფასურის გადახდა</h2>
        <div>
          <p className="text-center">
            <div>მომსახურების საფასური 30 ლარი</div>
            <div>პარტნიორი უნივერსიტეტის სტუდენტებისთვის - 10 ლარი</div>
          </p>

          <div className="d-flex align-items-center w-100 justify-content-center">
            <Button onClick={setClose} className="btn btn-light mr-3">
              გაუქმება
            </Button>
            <Button className="btn btn-primary">გადახდა</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayModal;
