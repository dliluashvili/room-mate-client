import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
  setStep,
  formData,
  step,
  next,
  updateFormData,
  submit,
}) {
  let { t } = useTranslation("common") as { t: (key: string) => string };
  const form = SignupStepTwo({ questions, formData });

  const handleSubmit = async (data: any) => {
    if (step < 3) {
      setStep(step + 1);
    }
    if (step === 3) {
      submit();
    }
  };

  const updateUseForm = async (data: any) => {
    const { answeredQuestions } = formData;
    const updatedData = { ...answeredQuestions, ...data };
    updateFormData({ ...formData, answeredQuestions: updatedData });
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
                                  {...field}
                                  onChange={(e) => {
                                    updateUseForm({
                                      [item.id]: e.target.value,
                                    });
                                    field.onChange(e);
                                  }}
                                  value={field.value}
                                  type="text"
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
                                <textarea
                                  className="w-full py-2 px-3 text-sm border rounded-md border-[#828bab]  focus:outline-none focus:border-2 focus:border-[#c5758a]"
                                  rows={4}
                                  {...field}
                                  onChange={(e) => {
                                    updateUseForm({
                                      [item.id]: e.target.value,
                                    });
                                    field.onChange(e);
                                  }}
                                  value={field.value}
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
                                  {...field}
                                  onChange={(e) => {
                                    updateUseForm({
                                      [item.id]: e.target.value,
                                    });
                                    field.onChange(e);
                                  }}
                                  value={field.value}
                                  type="number"
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
                                updateUseForm({ [item.id]: value });
                              
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
                                    {...field}
                                    value={field.value}
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
                                    field.onChange(date.toISOString()),
                                      updateUseForm({
                                        [item.id]: date.toISOString(),
                                      });
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
                {next}
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
