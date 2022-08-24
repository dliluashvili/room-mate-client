import React, { useState } from "react";
import { FormGroup, Button, Input } from "../components/common/form";
import { useForm } from "react-hook-form";
import Link from "next/link";

interface IRegisterForm {
  password: string;
  email: string;
  name: string;
  last_name: string;
  repeatPassword: string;
}

interface IErrorMsg {
  email?: string | Array<string>;
  password?: string | Array<string>;
  name?: string | Array<string>;
  repeatPassword?: string | Array<string>;
}

const Register = () => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    getValues,
    formState: { errors },
  } = useForm<IRegisterForm>();

  //   const [errors, setErrors] = useState<IErrorMsg>({});

  const [load, setLoad] = useState(false);

  const submit = handleSubmit((data: any) => {
    // console.log(errors);
    console.log(data);
  });

  console.log(errors);

  return (
    <div className="container w-25 mt-5">
      <form onSubmit={submit} className="contentWrapper">
        <h4 className="form_title">Register to BitBook</h4>
        <div className="separatorLine">
          <span>or</span>
        </div>
        <FormGroup
          errorMessage={errors?.password ? errors.password.message : ""}
          Label={"Name"}
        >
          <Input
            useRef={register("name")}
            type="name"
            hasError={!!errors?.name}
            placeholder="name"
            {...register("name", {
              required: "სახელი აუცილებელია",
            })}
          />
        </FormGroup>

        <FormGroup
          errorMessage={errors?.password ? errors.password.message : ""}
          Label="გვარი"
        >
          <Input
            useRef={register("last_name")}
            type="last_name"
            hasError={!!errors?.last_name}
            placeholder="last_name"
            {...register("last_name", {
              required: "გვარი აუცილებელია",
            })}
          />
        </FormGroup>
        <FormGroup
          errorMessage={
            errors?.email?.message
              ? errors?.email?.message
              : errors?.email?.type === "pattern"
              ? "please enter valid email address"
              : ""
          }
          Label="Email"
        >
          <Input
            type="text"
            name={"email"}
            placeholder="example@bitbook.com"
            hasError={!!errors?.email}
            onChange={() => {
              //   clearError("email");
              //   setUnVerify(false);
            }}
            useRef={register("email")}
            {...register("email", {
              required: "მეილი აუცილებელია",
              pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
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
              <span> Password </span>
            </label>
          }
        >
          <Input
            useRef={register("password")}
            type="password"
            hasError={!!errors?.password}
            placeholder="password"
            {...register("password", {
              required: "პაროლი აუცილებელია",
            })}
          />
        </FormGroup>

        <FormGroup
          errorMessage={
            errors?.repeatPassword?.message
              ? "პაროლი აუცილებელია"
              : "პაროლები არ მეთხვევა"
          }
          Label={
            <label
              className="form-control-label d-flex "
              htmlFor="inputSuccess2"
            >
              <span> Password confirmation </span>
            </label>
          }
        >
          <Input
            useRef={register("repeatPassword")}
            type="password"
            hasError={!!errors?.repeatPassword}
            placeholder="repeatPassword"
            {...register("repeatPassword", {
              required: "პაროლი აუცილებელია",
              validate: (value) => value === watch("password"),
            })}
          />
        </FormGroup>

        <Button loading={load} className="btn btn-primary w-100 mt-3 py-2">
          Log In
        </Button>
        <Link href={"/login"}>
          <a>უკვე ხართ რეგისტრირებული?</a>
        </Link>
      </form>
    </div>
  );
};

export default Register;
