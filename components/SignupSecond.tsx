import React from "react";
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
import Select from "react-select";
import arroLeft from "../public/newImages/arrow-left.svg";
import Image from "next/image";
import { DropdownIndicator, customStyles } from "./SelectUI";

export default function SignupSecond({
  questions,
  updateFormData,
  setStep,
  formData,
  step,
}) {
  let { t } = useTranslation("common") as { t: (key: string) => string };
  const form = SignupStepTwo({ questions, formData });

  const handleSubmit = async (data: any) => {
    const answeredQuestions: {
      questionId: string;
      answerId?: any;
      data?: any;
    }[] = [];

    const prevData = formData.answeredQuestions || [];

    questions.forEach((question: any) => {
      if (question.uiFieldInfo) {
        let answerData: { answerId?: string; data?: any };
        if (question.uiFieldInfo.input.type === "select") {
          answerData = { answerId: data[question.id] };
        } else if (question.uiFieldInfo.input.type === "text") {
          answerData = { data: data[question.id] };
        } else if (question.uiFieldInfo.input.type === "numeric") {
          answerData = { data: data[question.id] };
        } else if (question.uiFieldInfo.input.type === "button") {
          answerData = { data: data[question.id] };
        } else if (question.uiFieldInfo.input.type === "textarea") {
          answerData = { data: data[question.id] };
        }
        if (answerData) {
          answeredQuestions.push({
            questionId: question.id,
            ...answerData,
          });
        }
      }
    });

    let result = answeredQuestions.flatMap((item: any) => {
      if (Array.isArray(item.answerId)) {
        return item.answerId.map((answer) => ({
          questionId: item.questionId,
          answerId: answer.value,
          answer: answer.label,
        }));
      } else if (typeof item.answerId === "object" && item.answerId !== null) {
        return {
          questionId: item.questionId,
          answerId: item.answerId.value,
          answer: item.answerId.label,
        };
      } else {
        return {
          questionId: item.questionId,
          data: item.data,
        };
      }
    });
    setStep(step + 1);
    const updatedAnsweredQuestions = [...prevData, ...result];
    updateFormData({ answeredQuestions: updatedAnsweredQuestions });
  };

  return (
    <>
      <main className="flex flex-col  p-2 items-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            {questions.map((item: any) => {
              return (
                <>
                  <div className="mt-4 mb-4">
                    {item.uiFieldInfo &&
                      item.uiFieldInfo.input.type === "text" && (
                        <FormField
                          control={form.control}
                          name={item.id}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="leading-5">
                                {item.translations[0].title}
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
                  <div className="mt-4 mb-4">
                    {item.uiFieldInfo &&
                      item.uiFieldInfo.input.type === "textarea" && (
                        <FormField
                          control={form.control}
                          name={item.id}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="leading-5">
                                {item.translations[0].title}
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
                            </FormItem>
                          )}
                        />
                      )}
                  </div>
                  <div className="mt-4 mb-4">
                    {item.uiFieldInfo &&
                      item.uiFieldInfo.input.type === "numeric" && (
                        <FormField
                          control={form.control}
                          name={item.id}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="leading-5">
                                {item.translations[0].title}
                              </FormLabel>
                              <FormControl>
                                <BaseInput
                                  onChange={field.onChange}
                                  type="number"
                                  {...field}
                                  hasError={!!form.formState.errors[item.id]}
                                  isSuccess={
                                    !form.formState.errors[item.id] &&
                                    form.formState.touchedFields[item.id] &&
                                    field.value !== ""
                                  }
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      )}
                  </div>
                  {item.uiFieldInfo &&
                    item.uiFieldInfo.input.type === "select" && (
                      <FormField
                        control={form.control}
                        name={item.id}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="leading-5 ">
                              {item.translations[0].title}
                            </FormLabel>
                            <Select
                              placeholder={t("select")}
                              components={{ DropdownIndicator }}
                              styles={customStyles}
                              {...field}
                              isMulti={
                                item.uiFieldInfo.input.variant === "multiple"
                              }
                              options={item.answers.map((answer) => ({
                                questionId: item.id,
                                value: answer.id,
                                label: answer.translations[0].title,
                              }))}
                              onChange={(value) => {
                                field.onChange(value);
                              }}
                            />
                          </FormItem>
                        )}
                      />
                    )}

                  {item.uiFieldInfo &&
                    item.uiFieldInfo.input.type === "button" && (
                      <FormField
                        control={form.control}
                        name={item.id}
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="leading-5">
                              {item.translations[0].title}
                            </FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="calendar"
                                    className={cn(
                                      "w-[200px] md:w-[240px] px-3 py-5  text-left font-normal flex justify-start",
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
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </FormItem>
                        )}
                      />
                    )}
                </>
              );
            })}
            <div className="flex flex-col justify-between items-start mt-8 ">
              <Button variant="default" size="default" type="submit">
                Send
              </Button>
              <div
                className="mt-6 flex flex-row items-center pointer text-base"
                onClick={() => setStep(step - 1)}
              >
                <Image width={24} height={24} src={arroLeft} alt="Arrow back" />
                <p className="ml-4 text-[#838CAC] leading-6">{t("back")}</p>
              </div>
            </div>
          </form>
        </Form>
      </main>
    </>
  );
}
