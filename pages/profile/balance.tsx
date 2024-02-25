import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../../redux/action-creators";
import { useTypedSelector } from "../../components/hooks/useTypeSelector";
import { useRouter } from "next/router";
import ProfileWrapper from "../../components/pages/profile/profileWrapper";
import PayModal from "../../components/pages/payModal";

function Balance() {
  const { user } = useTypedSelector((state) => state.profile);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (router.query.paid === "success") {
      dispatch(setCurrentUser({ ...user, payed: true }));
    }
  }, [router.query]);

  return (
    <ProfileWrapper consumerPage="balance">
      <div className="balance_wrapper">
        {user?.payed ? (
          <div className="payModal_wrapper">
            <div className="buyModal pt-5">
              {router.query.paid === "success" ? (
                <h2 className="pt-4">გადახდა წარმატებით განხორციელდა </h2>
              ) : null}

              <h2 className="pt-4">თვენი პროფილი აქტიურია! </h2>
              <div className="text-center pt-4 pb-5">
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="10" cy="10" r="10" fill="#19A463" />
                  <path
                    d="M15.1724 6.20679L7.58622 13.793L4.13794 10.3447"
                    stroke="#E2EEED"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        ) : (
          <PayModal />
        )}
      </div>
    </ProfileWrapper>
  );
}

export default Balance;
