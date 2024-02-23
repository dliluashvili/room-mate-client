import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useTranslation from "next-translate/useTranslation";
import "react-phone-number-input/style.css";

export default function SignupStepTwo({ questions, formData }) {
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
          item.uiFieldInfo.input.type === "numeric" ||
          item.uiFieldInfo.input.type === "textarea"
        ) {
          if (item.uiFieldInfo.input.required === true) {
            fieldSchema = z.string().min(1, { message: t("filsRequire") });
          } else {
            fieldSchema = z.string().min(0);
          }
        }
        if (item.uiFieldInfo.input.required === false) {
          acc[item.id] = fieldSchema.optional();
        } else {
          acc[item.id] = fieldSchema;
        }
      }

      return acc;
    }, {})
  );

  const defaultValues = {
    ...questions.reduce((acc: any, item: any) => {
      const savedAnswers = formData?.answeredQuestions.filter(
        (q) => q.questionId === item.id
      );

      if (item.uiFieldInfo) {
        if (item.uiFieldInfo.input.variant === "multiple") {
          acc[item.id] = savedAnswers
            ? savedAnswers.map((k) => ({
                label: k.answer,
                questionId: k.questionId,
                value: k.answerId,
              }))
            : [];
        } else if (item.uiFieldInfo.input.variant === "single") {
          const savedAnswersObj = savedAnswers ? savedAnswers[0] : null;
          acc[item.id] = savedAnswersObj
            ? {
                label: savedAnswersObj.answer,
                value: savedAnswersObj.answerId,
                questionId: savedAnswersObj.questionId,
              }
            : null;
        } else {
          const data =
            savedAnswers && savedAnswers[0] ? savedAnswers[0].data : "";
          acc[item.id] = data ? data : "";
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
