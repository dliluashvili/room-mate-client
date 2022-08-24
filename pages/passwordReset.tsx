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

interface ILoginForm {
  password: string;
  passwordRepeat: string;
  code: string;
}

interface IErrorMsg {
  code?: string | Array<string>;
  passwordRepeat?: string | Array<string>;
  password?: string | Array<string>;
}

const PasswordReset = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    control,
    watch,
    getValues,
    formState: { errors },
  } = useForm<ILoginForm>();

  //   const [errors, setErrors] = useState<IErrorMsg>({});

  const router = useRouter();
  const [load, setLoad] = useState(false);

  const submit = handleSubmit(async (data) => {
    // console.log(errors);'

    setLoad(true);
    try {
      const res = await AuthService.passwordRecover({
        code: data.code,
        password: data.password,
        phone: router.query.phone as string,
      });

      // debugger
      //   dispatch(setCurrentUser({ user: null, token: res.data.access_token }));
      setLoad(false);
      toast.error("პაროლი წარმატებით შეიცვალა", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        Router.push("/login");
      }, 2000);
      //   Router.push("/profile"
    } catch (e) {
      console.log(e);
      setLoad(false);
      if (e.response.data.message) {
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
      }
    }
    // console.log(data);
  });

  console.log(errors);

  return (
    <div className="login resetPassword">
      <ToastContainer />

      <Header />

      <div className="container loginSection w-25 mt-5">
        <div className="loginSection_container">
          <div className="form_Wrapper m-auto">
            <form onSubmit={submit} className="contentWrapper">
              <h2 className="form_title">პაროლის აღდგენა</h2>

              <label className="mb-3 text-center">
                გთხოვთ შიყვანოთ {router?.query?.phone} ნომერზე გამოგზავნილი კოდი
              </label>
              <FormGroup
                errorMessage={
                  errors?.code?.message
                    ? errors?.code?.message
                    : errors?.code?.type === "pattern"
                    ? "მობილური"
                    : ""
                }
                Label="SMS კოდი"
              >
                <Input
                  type="text"
                  name={"code"}
                  placeholder="sms code"
                  hasError={!!errors?.code}
                  onChange={() => {
                    //   clearError("code");
                    //   setUnVerify(false);
                  }}
                  useRef={register("code")}
                  className="w-100"
                  {...register("code", {
                    required: "SMS კოდი აუცილებელია",
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
                    <span> პაროლი </span>
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
                პაროლის აღდგენა
              </Button>
              <Link href="/createProfile">
                <a className="label">რეგისტრაცია</a>
              </Link>
              <br />
              <Link href="/seandresetcode">
                <a className="label">დაგავიწყდა პაროლი?</a>
              </Link>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PasswordReset;
