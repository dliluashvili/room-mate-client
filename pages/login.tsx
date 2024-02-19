import React, { useState } from "react";
import { FormGroup, Button, Input } from "../components/common/form";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { AuthService } from "../services/auth/auth.http";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../redux/action-creators/index";
import Router from "next/router";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import Logo from "../components/svg/logo";
import useTranslation from "next-translate/useTranslation";
import NewHeader from "../components/NewHeader";
import NewFooter from "../components/NewFooter";

interface ILoginForm {
  password: string;
  phone: string;
}

interface IErrorMsg {
  phone?: string | Array<string>;
  password?: string | Array<string>;
}

const Login = () => {
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

  const submit = handleSubmit(async (data: any) => {
    // console.log(errors);'

    setLoad(true);
    try {
      const res = await AuthService.login(data);

      // debugger;
      dispatch(setCurrentUser({ user: null, token: res.data.access_token }));
      setLoad(false);
      Router.push("/profile");
    } catch (e) {
      setLoad(false);
      if (e?.response?.data?.message) {
        if (e?.response?.data?.message === "Unauthorized") {
          toast.error(t("unuthorized"), {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          toast.error(e?.response?.data?.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      } else {
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
    }
  });

  return (
    <div className="login">
      <ToastContainer />

      <NewHeader />

      <div className="container loginSection w-25 mt-5">
        <div className="loginSection_container">
          <div className="leftSide d-none d-md-flex ">
            <div>
              <Link href="/">
                <a>
                  <Logo />
                </a>
              </Link>
              <p>
                {t("heading")} {t("heading2")}
              </p>
            </div>
          </div>
          <div className="form_Wrapper">
            <form onSubmit={submit} className="contentWrapper">
              <h2 className="form_title"> {t("auth")}</h2>

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
                  useRef={register("phone")}
                  {...register("phone", {
                    required: "მოობილური აუცილებელია",
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
                    <span> {t("Password")} </span>
                  </label>
                }
              >
                <Input
                  className="password"
                  useRef={register("password")}
                  type="password"
                  hasError={!!errors?.password}
                  placeholder="password"
                  {...register("password", {
                    required: "პაროლი აუცილებელია",
                  })}
                />
              </FormGroup>

              <Button
                loading={load}
                className="btn btn-primary w-100 mt-3 py-2 mb-3 bg-[#19a463]"
              >
                {t("enter")}
              </Button>
              <Link href="/signup">
                <a className="label">{t("register")} </a>
              </Link>
              <br />
              <Link href="/seandresetcode">
                <a className="label">{t("Forgotpassword")}</a>
              </Link>
            </form>
          </div>
        </div>
      </div>
      <NewFooter />
    </div>
  );
};

export default Login;
