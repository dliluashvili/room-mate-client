import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useTranslation from "next-translate/useTranslation";
import "react-phone-number-input/style.css";
import { isValidPhoneNumber } from "react-phone-number-input";

export function SignupForm() {
  let { t } = useTranslation("common") as { t: (key: string) => string };

  const formSchema = z.object({
    firstname: z.string().min(2, { message: t("nameError") }),
    lastname: z.string().min(2, { message: t("surnameError") }),
    genderId: z.string().min(1, { message: t("genderError") }),
    countryId: z.string().min(1, { message: t("selectCountry") }),
    age: z.string().min(1, { message: t("selectAge") }),
    phone: z
      .string()
      .min(1, t("PhonenumberError"))
      .refine((value) => isValidPhoneNumber(value), {
        message: t("incorrectFormat"),
      }),
    email: z.string().optional(),
    password: z
      .string()
      .min(6, { message: t("minpass") })
      .refine(
        (value) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,30}$/.test(value),
        {
          message: t("passwordValidationError"),
        }
      ),
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
      firstname: "",
      lastname: "",
      genderId: "",
      countryId: "",
      age: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      code: "",
    },
  });

  return form;
}
