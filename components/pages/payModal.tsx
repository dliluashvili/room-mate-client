import React, { useEffect } from "react";
import useTranslation from "next-translate/useTranslation";
import { Button } from "../common/form";
import { ProfileService } from "../../services/profile/profile.http";
import { useRouter } from "next/router";

const PayModal = ({
  setClose,
  isModal = false,
}: {
  setClose?: () => void;
  isModal?: boolean;
}) => {
  let { t } = useTranslation("common");
  const router = useRouter();

  // useEffect(() => {

  // }, [])

  const buyHandler = () => {
    ProfileService.buyPlan().then((res) => {
      console.log(res);
      router.push("");
      window.open(res.data.redirectUrl);
      debugger;
    });
  };
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
            <Button onClick={() => buyHandler()} className="btn btn-primary">
              {t("Pay")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayModal;

// import React, { useEffect } from "react";
// import useTranslation from "next-translate/useTranslation";
// import { Button } from "../common/form";
// import { ProfileService } from "../../services/profile/profile.http";
// import { useRouter } from "next/router";

// const PayModal = ({
//   setClose,
//   isModal = false,
//   isTakosModal,
// }: {
//   setClose?: () => void;
//   isModal?: boolean;
//   isTakosModal?: boolean;
// }) => {
//   let { t } = useTranslation("common");
//   const router = useRouter();

//   console.log("isTakosModal", isTakosModal);

//   // useEffect(() => {

//   // }, [])

//   const buyHandler = () => {
//     ProfileService.buyPlan().then((res) => {
//       console.log(res);
//       router.push("");
//       window.open(res.data.redirectUrl);
//       debugger;
//     });
//   };
//   return (
//     <div className="payModal_wrapper">
//       {isModal ? <div className="blurBg"></div> : null}

//       <div className="buyModal text-center">
//         <h2>{isTakosModal ? null : t("servicePriceDEscription")}</h2>
//         <span
//           style={{
//             textAlign: "center",
//           }}
//           className="text-center"
//         >
//           {isTakosModal
//             ? `თუ ისეთ ოთახის მეზობელს ეძებ, რომელსაც უკვე ბინა ნაპოვნი აქვს, უფასო პაკეტი უნდა გააუმჯობესო ^^ დანარჩენი საძიებო ფილტრების გამოყენებას კი უფასოდ შეძლებ.
//         ახლა ჩვენს ვებგვერდზე 22 ადამიანია, რომელსაც ბინა უკვე ნაპოვნი აქვს. `
//             : null}
//         </span>
//         <div>
//           {isTakosModal ? (
//             <p className="text-center">
//               <div>{t("servicePriceDEscription2")}</div>
//               <div className="mb-2">{t("servicePriceDEscription3")}</div>
//               <div>{t("servicePriceDEscription4")}</div>
//               <div>{t("servicePriceDEscription5")}</div>
//             </p>
//           ) : (
//             <p className="text-center">
//               <div>{t("servicePriceDEscription2")}</div>
//               <div className="mb-2">{t("servicePriceDEscription3")}</div>
//               <div>{t("servicePriceDEscription4")}</div>
//               <div>{t("servicePriceDEscription5")}</div>
//             </p>
//           )}

//           <div className="d-flex align-items-center w-100 justify-content-center">
//             <Button onClick={setClose} className="btn btn-light mr-3">
//               {t("Cancel")}
//             </Button>
//             <Button onClick={() => buyHandler()} className="btn btn-primary">
//               {t("Pay")}
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PayModal;
