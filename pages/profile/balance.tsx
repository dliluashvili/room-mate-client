import React, { useState } from "react";
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

  return (
    <ProfileWrapper consumerPage="balance">
      <div className="balance_wrapper">
        <PayModal />
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
