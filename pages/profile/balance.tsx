import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useCheckAuth } from "../../components/hooks/useCheckAuth";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser, logout } from "../../redux/action-creators";
import { useTypedSelector } from "../../components/hooks/useTypeSelector";
import Header from "../../components/Header";
import Link from "next/link";
import { useRouter } from "next/router";
import Loader from "../../components/common/loader";
import ProfileWrapper from "../../components/pages/profile/profileWrapper";
import { FormGroup, Button, Input } from "../../components/common/form";
import PayModal from "../../components/pages/payModal";

function Balance(props) {
  const [load, setLoad] = useState(false);
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
                  // className={className}
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
        {/* <form className="balance_container">
          <h2>ბალანსის შევსება</h2>
          <img className="pb-4" src="/imgs/image 8.png" />
          <FormGroup
            // errorMessage={
            //   errors?.phone?.message
            //     ? errors?.phone?.message
            //     : errors?.phone?.type === "pattern"
            //     ? "მობილური"
            //     : ""
            // }
            Label="ჩაწერე თანხა"
          >
            <Input
              type="text"
              name={"phone"}
              placeholder="00"
              //   hasError={!!errors?.phone}
              onChange={() => {
                //   clearError("phone");
                //   setUnVerify(false);
              }}
              //   useRef={register("phone")}
              //   {...register("phone", {
              //     required: "მოობილური აუცილებელია",
              //   })}
            />
          </FormGroup>

          <Button
            loading={load}
            className="btn btn-primary w-100 mt-3 py-2 mb-3"
          >
            შევსება
          </Button>
        </form> */}
      </div>
    </ProfileWrapper>
  );
}

export default Balance;
