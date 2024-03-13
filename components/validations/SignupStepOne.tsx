import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useTranslation from "next-translate/useTranslation";
import "react-phone-number-input/style.css";
import { isValidPhoneNumber } from "react-phone-number-input";

export function SignupStepOne({ formData }) {
  let { t } = useTranslation("common") as { t: (key: string) => string };

  const formSchema = z.object({
    firstname: z.string().min(2, { message: t("nameError") }),
    lastname: z.string().min(2, { message: t("surnameError") }),
    genderId: z
      .object({
        value: z
          .string()
          .min(1, { message: t("selectGender") })
          .optional(),
        label: z
          .string()
          .min(1, { message: t("selectGender") })
          .optional(),
      })
      .refine((obj) => Object.keys(obj).length >= 1, {
        message: t("selectGender"),
      }),
    countryId: z
      .object({
        value: z
          .string()
          .min(1, { message: t("selectCountry") })
          .optional(),
        label: z.any().optional(),
      })
      .refine((obj) => Object.keys(obj).length >= 1, {
        message: t("selectCountry"),
      }),
    birthDate: z.string().min(1, { message: t("selectAge") }),

    phone: z
      .string()
      .min(1, t("PhonenumberError"))
      .refine((value) => isValidPhoneNumber(value), {
        message: t("incorrectFormat"),
      }),
    email: z.string().email(t("emailError")).optional().or(z.literal("")),
    password: z
      .string()
      .min(6, { message: t("minpass") })
      .refine((value) => /(?=.*[0-9])(?=.*[^0-9]).{6,30}/.test(value), {
        message: t("passwordValidationError"),
      }),
    confirmPassword: z
      .string()
      .refine((value) => value === form.getValues().password, {
        message: t("passwordMatchError"),
      }),
    code: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: formData.firstname ? formData.firstname : "",
      lastname: formData.lastname ? formData.lastname : "",
      genderId: formData.genderId ? formData.genderId : null,
      countryId: formData?.countryId ? formData.countryId : null,
      birthDate: formData.birthDate ? formData.birthDate : "",
      email: formData.email ? formData.email : "",
      phone: formData.phone ? formData.phone : "",
      password: formData.password ? formData.password : "",
      confirmPassword: formData.confirmPassword ? formData.confirmPassword : "",
      code: formData.code ? formData.code : "",
    },
  });

  return form;
}
