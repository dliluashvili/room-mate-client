import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useTranslation from "next-translate/useTranslation";
import "react-phone-number-input/style.css";
import { Question } from "../types/types";

export default function SignupStepTwo({ questions }) {
  let { t } = useTranslation("common") as { t: (key: string) => string };

  const formSchema = z.object(
    questions.reduce((acc: Question, item: Question) => {
      acc[item.id] = item.uiFieldInfo.required
        ? z.string().min(1, { message: t("requiredError") })
        : z.string().optional();
      return acc;
    }, {})
  );
  const defaultValues = {
    ...questions.reduce((acc: Question, item: Question) => {
      acc[item.id] = "";
      return acc;
    }, {}),
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });
  return form;
}
