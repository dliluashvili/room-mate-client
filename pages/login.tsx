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
import Router from "next/router";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import Logo from "../components/svg/logo";

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
      console.log(e);
      setLoad(false);
      if (e?.response?.data?.message) {
        toast.error(e?.response?.data?.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
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
    // console.log(data);
  });

  console.log(errors);

  return (
    <div className="login">
      <ToastContainer />

      <Header />

      <div className="container loginSection w-25 mt-5">
        <div className="loginSection_container">
          <div className="leftSide d-none d-md-flex ">
            <div>
              <Link href="/">
                <a>
                  <Logo />
                </a>
              </Link>
              <p>იპოვე ოთახის მეზობელი და გაიყავი ბინის ქირა</p>
            </div>
          </div>
          <div className="form_Wrapper">
            <form onSubmit={submit} className="contentWrapper">
              <h2 className="form_title">ავტორიზაცია</h2>

              <FormGroup
                errorMessage={
                  errors?.phone?.message
                    ? errors?.phone?.message
                    : errors?.phone?.type === "pattern"
                    ? "მობილური"
                    : ""
                }
                Label="მობილურის ნომერი"
              >
                <Input
                  type="number"
                  name={"phone"}
                  placeholder="579121212"
                  hasError={!!errors?.phone}
                  onChange={() => {
                    //   clearError("phone");
                    //   setUnVerify(false);
                  }}
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
                    <span> პაროლი </span>
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
                შესვლა
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

export default Login;

// import React from "react";
// import { useForm } from "react-hook-form";

// export default function App() {
//   const {
//     register,
//     handleSubmit,
//     // watch,
//     formState: { errors },
//   } = useForm();
//   const onSubmit = (data) => console.log(data);

//   //   console.log(watch("example")); // watch input value by passing the name of it

//   return (
//     /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
//     <form onSubmit={handleSubmit(onSubmit)}>
//       {/* register your input into the hook by invoking the "register" function */}
//       <input defaultValue="test" {...register("example")} />

//       {/* include validation with required or other standard HTML validation rules */}
//       <input {...register("exampleRequired", { required: true })} />
//       {/* errors will return when field validation fails  */}
//       {errors.exampleRequired && <span>This field is required</span>}

//       <input type="submit" />
//     </form>
//   );
// }
