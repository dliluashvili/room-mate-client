import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useTranslation from "next-translate/useTranslation";
import "react-phone-number-input/style.css";
import { isValidPhoneNumber } from "react-phone-number-input";

export function SignupForm() {
  let { t } = useTranslation("common") as { t: (key: string) => string };

  const formSchema = z.object({
    name: z.string().min(2, { message: t("nameError") }),
    surname: z.string().min(2, { message: t("surnameError") }),
    gender: z.string().min(1, { message: t("genderError") }),
    country: z.string().min(1, { message: t("selectCountry") }),
    age: z.string().min(1, { message: t("selectAge") }),
    phone: z
      .string()
      .min(1, t("PhonenumberError"))
      .refine((value) => isValidPhoneNumber(value), {
        message: t("incorrectFormat"),
      }),
    mail: z.string().optional(),
    password: z.string().min(6, { message: t("minpass") }),
    confirmPassword: z
      .string()
      .refine((value) => value === form.getValues().password, {
        message: t("passwordMatchError"),
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      surname: "",
      gender: "",
      country: "",
      age: "",
      mail: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  return form;
}
