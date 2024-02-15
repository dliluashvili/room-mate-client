import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../@/components/ui/form";
import { BaseInput } from "../@/components/ui/input";
import { Button } from "../@/components/ui/button";
import { useRouter } from "next/router";
import { Calendar } from "../@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../@/components/ui/popover";
import { cn } from "../@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns/format";
import useTranslation from "next-translate/useTranslation";
import SignupStepTwo from "./validations/SignupStepTwo";
import { Question, TranslatableItem, Translation } from "./types/types";

export default function SignupSecond({ questions, updateFormData, submit }) {
  const router = useRouter();
  let { t } = useTranslation("common") as { t: (key: string) => string };
  const form = SignupStepTwo({ questions });

  const handleSubmit = async (data: FormData) => {
    const answeredQuestions: {
      questionId: string;
      answerId?: number;
      data?: any;
    }[] = [];
    questions.forEach((question: Question) => {
      let answerData: { answerId?: number; data?: any };
      if (question.uiFieldInfo.input_type.type === "select") {
        answerData = { answerId: data[question.id] };
      } else if (question.uiFieldInfo.input_type.type === "text") {
        answerData = { data: data[question.id] };
      } else if (question.uiFieldInfo.input_type.type === "button") {
        answerData = { data: data[question.id] };
      }
      answeredQuestions.push({
        questionId: question.id,
        ...answerData,
      });
    });
    await updateFormData({ answeredQuestions: answeredQuestions });
    submit();
  };

  const getTranslationSelect = (
    translations: Translation[],
    locale: string
  ) => {
    const translation = translations.find((t) => t.lang === locale);
    return translation ? translation.title : "";
  };

  const getTranslationText = (item: TranslatableItem, locale: string) => {
    const translation = item.translations.find((t) => t.lang === locale);
    return translation ? translation.title : "";
  };

  return (
    <>
      <main className="flex flex-col  p-2 items-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            {questions.map((item: Question) => {
              return (
                <>
                  <div className="mt-4 mb-4">
                    {item.uiFieldInfo.input_type.type === "text" && (
                      <FormField
                        control={form.control}
                        name={item.id}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="leading-5">
                              {getTranslationText(item, router.locale)}
                            </FormLabel>
                            <FormControl>
                              <BaseInput
                                onChange={field.onChange}
                                type="text"
                                {...field}
                                hasError={!!form.formState.errors[item.id]}
                                isSuccess={
                                  !form.formState.errors[item.id] &&
                                  form.formState.touchedFields[item.id] &&
                                  field.value !== ""
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                  {item.uiFieldInfo.input_type.type === "select" && (
                    <FormField
                      control={form.control}
                      name={item.id}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="leading-5 ">
                            {getTranslationSelect(
                              item.translations,
                              router.locale
                            )}
                          </FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(value)}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t("selectField")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {item.answers.map((answer, answerIndex) => (
                                <SelectItem key={answerIndex} value={answer.id}>
                                  {getTranslationSelect(
                                    answer.translations,
                                    router.locale
                                  )}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {item.uiFieldInfo.input_type.type === "button" && (
                    <FormField
                      control={form.control}
                      name={item.id}
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="leading-5">
                            {getTranslationText(item, router.locale)}
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="calendar"
                                  className={cn(
                                    "w-[240px] pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Select date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  field.onChange(date.toISOString());
                                }}
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </>
              );
            })}
            <Button
              className="mt-4"
              variant="default"
              size="default"
              type="submit"
            >
              Send
            </Button>
          </form>
        </Form>
      </main>
    </>
  );
}
