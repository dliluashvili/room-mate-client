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
import arroLeft from "../public/newImages/arrow-left.png";
import Image from "next/image";

export default function SignupSecond({ questions, updateFormData, setStep }) {
  let { t } = useTranslation("common") as { t: (key: string) => string };
  const form = SignupStepTwo({ questions });

  const handleSubmit = async (data: any) => {
    const answeredQuestions: {
      questionId: string;
      answerId?: any;
    }[] = [];

    questions.forEach((question: any) => {
      if (question.uiFieldInfo) {
        let answerData: { answerId?: string; data?: any };
        if (question.uiFieldInfo.input.type === "select") {
          answerData = { answerId: data[question.id] };
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
        }));
      } else if (typeof item.answerId === "object" && item.answerId !== null) {
        return {
          questionId: item.questionId,
          answerId: item.answerId.value,
        };
      }
    });
    setStep(3);

    updateFormData({ answeredQuestions: result });
  };

  return (
    <>
      <main className="flex flex-col   p-2 items-center">
        <Form {...form}>
          <form
            className="gap-y-6 flex flex-col"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            {questions.map((item: any) => {
              return (
                <>
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
                              className="text-sm rounded-lg"
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
                </>
              );
            })}
            <div className="flex flex-row justify-between items-center mt-4 gap-x-[50%]">
              <Button onClick={() => setStep(1)}>
                <Image src={arroLeft} width={25} height={25} />
                <p className="ml-2 text-white text-base">Back</p>
              </Button>
              <Button variant="default" size="default" type="submit">
                Send
              </Button>
            </div>
          </form>
        </Form>
      </main>
    </>
  );
}
