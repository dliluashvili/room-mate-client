import React, { useState } from "react";
import { FormGroup, Button, Input } from "../../../components/common/form";
import { useForm } from "react-hook-form";
import { AuthService } from "../../../services/auth/auth.http";
import Router from "next/router";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useCheckUnAuthResponse } from "../../../components/hooks/useCheckUnauthRespnse";
import useTranslation from "next-translate/useTranslation";

interface ILoginForm {
  password: string;
  passwordRepeat: string;
  currentPassword: string;
}

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ILoginForm>();

  let { t } = useTranslation("common");

  const [load, setLoad] = useState(false);
  const checkUnAuth = useCheckUnAuthResponse();
  const submit = handleSubmit(async (data) => {
    setLoad(true);
    try {
      const res = await AuthService.passwordReset({
        confirm_password: data.passwordRepeat,
        password: data.password,
        current_password: data.currentPassword,
      });

      // debugger
      //   dispatch(setCurrentUser({ user: null, token: res.data.access_token }));
      setLoad(false);
      toast.success(t("passwordChangeSuccess"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        Router.push("/profile");
      }, 3000);
      //   Router.push("/profile"
    } catch (e) {
      console.log(e);
      setLoad(false);
      if (e?.response?.data?.message) {
        let msg =
          typeof e.response.data.message === "string"
            ? e.response.data.message
            : e.response.data.message[0];
        toast.error(msg, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        if (e?.response?.data?.message === "Unauthorized") {
          checkUnAuth();
        }
      }
    }
  });

  return (
    <div className="login resetPassword resetPassword_fromProfile">
      <ToastContainer />

      <div className="reset_pass loginSection_container">
        <form onSubmit={submit} className="contentWrapper">
          <FormGroup
            errorMessage={
              errors?.currentPassword?.message
                ? errors?.currentPassword?.message
                : ""
            }
            Label={t("currentPassword")}
          >
            <Input
              type="text"
              name={t("currentPassword")}
              placeholder={t("currentPassword")}
              hasError={!!errors?.currentPassword}
              onChange={() => {
                //   clearError("currentPassword");
                //   setUnVerify(false);
              }}
              useRef={register("currentPassword")}
              className="w-100"
              {...register("currentPassword", {
                required: t("currentPasswordError"),
              })}
            />
          </FormGroup>

          <FormGroup
            errorMessage={errors?.password ? errors.password.message : ""}
            Label={
              <label
                className="form-control-label d-flex "
                htmlFor="inputSuccess2"
              >
                <span>{t("newPassword")}</span>
              </label>
            }
          >
            <Input
              className="password w-100"
              useRef={register("password")}
              type="password"
              hasError={!!errors?.password}
              placeholder="******"
              {...register("password", {
                required: t("PasswordError"),
              })}
            />
          </FormGroup>

          <FormGroup
            errorMessage={
              errors?.passwordRepeat &&
              errors?.passwordRepeat.type === "required"
                ? t("PasswordError")
                : t("mismatchedPasswordsError")
            }
            Label={
              <label
                className="form-control-label d-flex "
                htmlFor="inputSuccess2"
              >
                <span> {t("PasswordRepeat")} </span>
              </label>
            }
          >
            <Input
              className="passwordRepeat w-100"
              useRef={register("passwordRepeat")}
              type="password"
              hasError={!!errors?.passwordRepeat}
              placeholder="******"
              {...register("passwordRepeat", {
                required: t("PasswordError"),
                validate: {
                  isMatch: (value) => value === watch("password"),
                },
              })}
            />
          </FormGroup>
          <Button
            loading={load}
            className="btn btn-primary w-100 mt-3 py-2 mb-3 bg-[#19a463]"
          >
            {t("changePassword")}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
