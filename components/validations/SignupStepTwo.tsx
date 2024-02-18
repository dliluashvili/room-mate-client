import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useTranslation from "next-translate/useTranslation";
import "react-phone-number-input/style.css";

export default function SignupStepTwo({ questions }) {
  let { t } = useTranslation("common") as { t: (key: string) => string };
  console.log(questions);

  const formSchema = z.object(
    questions.reduce((acc: any, item: any) => {
      acc[item.id] =
        item.uiFieldInfo && item.uiFieldInfo.input.required === true
          ? z.string().min(1, { message: t("requiredError") })
          : z.string().optional();
      return acc;
    }, {})
  );
  console.log(formSchema);
  const defaultValues = {
    ...questions.reduce((acc: any, item: any) => {
      if (item.uiFieldInfo) {
        acc[item.id] = "";
      }
      return acc;
    }, {}),
  };
  console.log(defaultValues);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });
  return form;
}
