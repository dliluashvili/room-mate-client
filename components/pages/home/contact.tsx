import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { FormGroup, Button, Input } from "../../common/form";
import classnames from "classnames";
import { ProfileService } from "../../../services/profile/profile.http";
import { ToastContainer, toast } from "react-toastify";

interface IContactForm {
  name: string;
  last_name: string;
  text: string;
  email: string;
}

interface IErrorMsg {
  email?: string | Array<string>;
  name?: string | Array<string>;
  text?: string | Array<string>;
  last_name?: string | Array<string>;
}

function Contact() {
  const [load, setLoad] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    getValues,
    formState: { errors },
  } = useForm<IContactForm>();

  const submit = handleSubmit((data) => {
    // console.log(errors);
    ProfileService.contactForm({
      firstname: data.name,
      lastname: data.last_name,
      email: data.email,
      text: data.text,
    })
      .then((res) => {
        // alert("saved");
        toast.success("შეტყობინება წარმატეით გაიგზავნა", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        reset({ name: "", last_name: "", email: "", text: "" });
      })
      .catch((err) => {
        // console.log("err");
        toast.error("დაფიქსირდა შეცდომა", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
    console.log(data);
  });
  return (
    <form onSubmit={submit} className="contactSection_from">
      <ToastContainer />
      <FormGroup errorMessage={errors?.name ? errors.name.message : ""}>
        <Input
          useRef={register("name")}
          type="name"
          hasError={!!errors?.name}
          placeholder="სახელი"
          {...register("name", {
            required: "სახელი აუცილებელია",
          })}
          autocomplete="off"
        />
      </FormGroup>

      <FormGroup
        errorMessage={errors?.last_name ? errors.last_name.message : ""}
      >
        <Input
          useRef={register("last_name")}
          autocomplete="off"
          type="last_name"
          hasError={!!errors?.last_name}
          placeholder="გვარი"
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
            ? "გთხოვთ შიყვანოთ მეილი სწორი ფორმატით"
            : ""
        }
      >
        <Input
          type="text"
          name={"email"}
          autocomplete="off"
          placeholder="ელ.ფოსტა"
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
      <FormGroup errorMessage={errors?.text ? errors.text.message : ""}>
        <textarea
          placeholder="მოგვწერე წერილი"
          className={classnames("form-control textarea", {
            "is-invalid": !!errors?.text,
          })}
          {...register("text", {
            required: "ტექსტი აუცილებელია",
          })}
        ></textarea>
      </FormGroup>
      <div className="btn_wrapper">
        <Button loading={load} className="btn btn-primary w-100 mt-3 py-2">
          გაგზავნა
        </Button>
      </div>
    </form>
  );
}

export default Contact;
