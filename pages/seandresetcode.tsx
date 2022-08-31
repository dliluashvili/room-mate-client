import React, { useState } from "react";
import { FormGroup, Button, Input } from "../components/common/form";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { AuthService } from "../services/auth/auth.http";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../redux/action-creators/index";
import Header from "../components/Header";
import Footer from "../components/footer";
import axios from "axios";
import Router, { useRouter } from "next/router";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import Logo from "../components/svg/logo";
import useTranslation from "next-translate/useTranslation";

interface ILoginForm {
  phone: string;
}

interface IErrorMsg {
  phone?: string | Array<string>;
}

const SendResetCode = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    control,
    watch,
    getValues,
    formState: { errors },
  } = useForm<ILoginForm>();

  let { t } = useTranslation("common");

  //   const [errors, setErrors] = useState<IErrorMsg>({});

  const [load, setLoad] = useState(false);

  const submit = handleSubmit(async (data) => {
    // console.log(errors);'

    setLoad(true);
    try {
      const res = await AuthService.sendResetCode(data.phone);

      // debugger;
      //   dispatch(setCurrentUser({ user: null, token: res.data.access_token }));
      setLoad(false);
      toast.success(t("codeSent"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        Router.push(`/passwordReset?phone=${data.phone}`);
      }, 2000);
    } catch (e) {
      console.log(e);
      setLoad(false);
      toast.error("error", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    // console.log(data);
  });

  console.log(errors);

  return (
    <div className="login">
      <ToastContainer />

      <Header />

      <div className="container loginSection w-25 mt-5">
        <div className="loginSection_container">
          <div className="form_Wrapper m-auto">
            <form onSubmit={submit} className="contentWrapper">
              <h2 className="form_title">{t("passwordrecovery")}</h2>

              <FormGroup
                errorMessage={
                  errors?.phone?.message
                    ? errors?.phone?.message
                    : errors?.phone?.type === "pattern"
                    ? "მობილური"
                    : ""
                }
                Label={t("Phonenumber")}
              >
                <Input
                  type="number"
                  name={"phone"}
                  placeholder={t("Phonenumber")}
                  hasError={!!errors?.phone}
                  onChange={() => {
                    //   clearError("phone");
                    //   setUnVerify(false);
                  }}
                  useRef={register("phone")}
                  className="w-100"
                  {...register("phone", {
                    required: t("PhonenumberError"),
                  })}
                />
              </FormGroup>

              {/* <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="exampleCheck1"
                />
                <label className="form-check-label k" htmlFor="exampleCheck1">
                  Remember me
                </label>
              </div> */}

              <Button
                loading={load}
                className="btn btn-primary w-100 mt-3 py-2 mb-3"
              >
                {t("Send")}
              </Button>
              <Link href="/createProfile">
                <a className="label"> {t("register")}</a>
              </Link>
              <br />
              <Link href="/login">
                <a className="label"> {t("login")}</a>
              </Link>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SendResetCode;
