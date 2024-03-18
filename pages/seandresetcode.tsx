import React, { useState } from "react";
import { FormGroup, Button, Input } from "../components/common/form";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { AuthService } from "../services/auth/auth.http";
import Header from "../components/Header";
import Footer from "../components/footer";
import Router from "next/router";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import useTranslation from "next-translate/useTranslation";
import NewHeader from "../components/NewHeader";
import NewFooter from "../components/NewFooter";
import withAuth from "../components/withAuth";

interface ILoginForm {
  phone: string;
}

interface IErrorMsg {
  phone?: string | Array<string>;
}

const SendResetCode = () => {
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<ILoginForm>();

  let { t } = useTranslation("common");

  const [load, setLoad] = useState(false);

  const submit = handleSubmit(async (data) => {
    setLoad(true);
    try {
      await AuthService.sendResetCode(data.phone);

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
  });

  return (
    <div className="login">
      <ToastContainer />

      <NewHeader />

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
                  onChange={() => {}}
                  useRef={register("phone")}
                  className="w-100"
                  {...register("phone", {
                    required: t("PhonenumberError"),
                  })}
                />
              </FormGroup>

              <Button
                loading={load}
                className="btn btn-primary w-100 mt-3 py-2 mb-3 bg-[#19a463]"
              >
                {t("Send")}
              </Button>
              <Link href="/createProfile">
                <a className="label"> {t("register")}</a>
              </Link>
              <br />
              <Link href="/login">
                <a className="label"> {t("auth")}</a>
              </Link>
            </form>
          </div>
        </div>
      </div>
      <NewFooter />
    </div>
  );
};

export default withAuth(SendResetCode);
