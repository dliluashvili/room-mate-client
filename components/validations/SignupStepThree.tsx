import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useTranslation from "next-translate/useTranslation";
import "react-phone-number-input/style.css";

export default function SignupStepThree({ questions }) {
  let { t } = useTranslation("common") as { t: (key: string) => string };

  const formSchema = z.object(
    questions.reduce((acc: any, item: any) => {
      if (
        item.uiFieldInfo &&
        (item.uiFieldInfo.input.variant === "button" ||
          item.uiFieldInfo.input.variant === "numeric" ||
          item.uiFieldInfo.input.variant === "text")
      ) {
        let fieldSchema;

        if (
          item.uiFieldInfo.input.variant === "button" ||
          item.uiFieldInfo.input.variant === "text" ||
          item.uiFieldInfo.input.variant === "numeric"
        ) {
          if (item.uiFieldInfo.input.required === true) {
            fieldSchema = z.string().min(1, { message: t("filsRequire") });
          }
        }

        if (item.uiFieldInfo.input.required === false) {
          acc[item.id] = fieldSchema;
        } else {
          // This will catch 'true' and also 'undefined' or 'null'
          acc[item.id] = fieldSchema;
        }
      }

      return acc;
    }, {})
  );

  const defaultValues = {
    ...questions.reduce((acc: any, item: any) => {
      if (item.uiFieldInfo) {
        if (item.uiFieldInfo.input.type === "button") {
          acc[item.id] = "";
        } else if (item.uiFieldInfo.input.type === "text") {
          acc[item.id] = "";
        } else if (item.uiFieldInfo.input.type === "numeric") {
          acc[item.id] = "";
        }
      }
      return acc;
    }, {}),
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });
  return form;
}
