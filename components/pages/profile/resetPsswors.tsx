import React, { useState } from "react";
import { FormGroup, Button, Input } from "../../../components/common/form";
import { useForm } from "react-hook-form";
import { AuthService } from "../../../services/auth/auth.http";
import Router from "next/router";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useCheckUnAuthResponse } from "../../../components/hooks/useCheckUnauthRespnse";

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

  //   const [errors, setErrors] = useState<IErrorMsg>({});

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
      toast.success("პაროლი წარმატებით შეიცვალა", {
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

      <div className="container loginSection w-25 mt-5">
        <div className="loginSection_container">
          <div className="form_Wrapper m-auto">
            <form onSubmit={submit} className="contentWrapper">
              <h2 className="form_title">პაროლის შეცვლა</h2>

              <FormGroup
                errorMessage={
                  errors?.currentPassword?.message
                    ? errors?.currentPassword?.message
                    : ""
                }
                Label="მიმდინარე პაროლი"
              >
                <Input
                  type="text"
                  name={"currentPassword"}
                  placeholder="მიმდინარე პაროლი"
                  hasError={!!errors?.currentPassword}
                  onChange={() => {
                    //   clearError("currentPassword");
                    //   setUnVerify(false);
                  }}
                  useRef={register("currentPassword")}
                  className="w-100"
                  {...register("currentPassword", {
                    required: "მიმდინარე პაროლი აუცილებელია",
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
                    <span>ახალი პაროლი </span>
                  </label>
                }
              >
                <Input
                  className="password"
                  useRef={register("password")}
                  type="password"
                  hasError={!!errors?.password}
                  placeholder="******"
                  {...register("password", {
                    required: "პაროლი აუცილებელია",
                  })}
                />
              </FormGroup>

              <FormGroup
                errorMessage={
                  errors?.passwordRepeat &&
                  errors?.passwordRepeat.type === "required"
                    ? "პაროლი აუცილებელია"
                    : "პაროლები არ მეთხვევა"
                }
                Label={
                  <label
                    className="form-control-label d-flex "
                    htmlFor="inputSuccess2"
                  >
                    <span> გაიმეორე პაროლი </span>
                  </label>
                }
              >
                <Input
                  className="passwordRepeat"
                  useRef={register("passwordRepeat")}
                  type="password"
                  hasError={!!errors?.passwordRepeat}
                  placeholder="******"
                  {...register("passwordRepeat", {
                    required: "პაროლი აუცილებელია",
                    validate: {
                      isMatch: (value) => value === watch("password"),
                    },
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
                პაროლის შეცვლა
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
