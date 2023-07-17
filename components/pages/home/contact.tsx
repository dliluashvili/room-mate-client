import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { FormGroup, Button, Input } from "../../common/form";
import classnames from "classnames";
import { ProfileService } from "../../../services/profile/profile.http";
import { ToastContainer, toast } from "react-toastify";
import useTranslation from "next-translate/useTranslation";

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

  let { t } = useTranslation("common");

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
        let rr = t("contacteSendSusses");
        debugger;
        toast.success(rr, {
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
        let rr = t("contacteSendError");
        toast.error(rr, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  });
  return (
    <form onSubmit={submit} className="contactSection_from">
      <ToastContainer />
      <FormGroup errorMessage={errors?.name ? errors.name.message : ""}>
        <Input
          useRef={register("name")}
          type="name"
          hasError={!!errors?.name}
          placeholder={t("name")}
          {...register("name", {
            required: t("nameError"),
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
          placeholder={t("surname")}
          {...register("last_name", {
            required: t("surnameError"),
          })}
        />
      </FormGroup>
      <FormGroup
        errorMessage={
          errors?.email?.message
            ? errors?.email?.message
            : errors?.email?.type === "pattern"
            ? t("mailError2")
            : ""
        }
      >
        <Input
          type="text"
          name={"email"}
          autocomplete="off"
          placeholder={t("mail")}
          hasError={!!errors?.email}
          onChange={() => {
            //   clearError("email");
            //   setUnVerify(false);
          }}
          useRef={register("email")}
          {...register("email", {
            required: t("mailError"),
            pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          })}
        />
      </FormGroup>
      <FormGroup errorMessage={errors?.text ? errors.text.message : ""}>
        <textarea
          placeholder={t("WriteLetter")}
          className={classnames("form-control textarea", {
            "is-invalid": !!errors?.text,
          })}
          {...register("text", {
            required: t("WriteLettererror"),
          })}
        ></textarea>
      </FormGroup>
      <div className="btn_wrapper">
        <Button loading={load} className="btn btn-primary w-100 mt-3 py-2">
          {t("Send")}
        </Button>
      </div>
    </form>
  );
}

export default Contact;
