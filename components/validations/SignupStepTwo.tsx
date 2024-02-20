import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useTranslation from "next-translate/useTranslation";
import "react-phone-number-input/style.css";

export default function SignupStepTwo({ questions }) {
  let { t } = useTranslation("common") as { t: (key: string) => string };

  const formSchema = z.object(
    questions.reduce((acc: any, item: any) => {
      if (item.uiFieldInfo) {
        let fieldSchema;

        if (item.uiFieldInfo.input.variant === "multiple") {
          fieldSchema = z
            .array(
              z.object({
                questionId: z.string().min(1, { message: t("filsRequire") }),
                value: z.string().min(1, { message: t("filsRequire") }),
                label: z.string().min(1, { message: t("filsRequire") }),
              })
            )
            .min(1, { message: t("filsRequire") });
        } else if (item.uiFieldInfo.input.variant === "single") {
          fieldSchema = z
            .object({
              questionId: z
                .string()
                .min(1, { message: t("filsRequire") })
                .optional(),
              value: z
                .string()
                .min(1, { message: t("filsRequire") })
                .optional(),
              label: z
                .string()
                .min(1, { message: t("filsRequire") })
                .optional(),
            })
            .refine((obj) => Object.keys(obj).length >= 1, {
              message: t("filsRequire"),
            });
        } else if (
          item.uiFieldInfo.input.type === "button" ||
          item.uiFieldInfo.input.type === "text" ||
          item.uiFieldInfo.input.type === "numeric"
        ) {
          if (item.uiFieldInfo.input.required === true) {
            fieldSchema = z.string().min(1, { message: t("filsRequire") });
          } else {
            fieldSchema = z.string().min(0); // Allow empty string
          }
        }

        if (item.uiFieldInfo.input.required === false) {
          acc[item.id] = fieldSchema.optional();
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
        if (item.uiFieldInfo.input.variant === "multiple") {
          acc[item.id] = [];
        } else if (item.uiFieldInfo.input.variant === "single") {
          acc[item.id] = {};
        } else if (item.uiFieldInfo.input.type === "button") {
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
