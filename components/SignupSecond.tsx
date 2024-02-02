import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { AwardIcon, CalendarIcon } from "lucide-react";
import { format } from "date-fns/format";

export default function SignupSecond({
  questions,
  updateFormData,
  submitForm,
}) {
  const router = useRouter();

  // Create a mapping of item IDs to valid variable names:

  // Build the Zod schema using the valid names:
  // const formSchema = z.object(
  //   questions.reduce((acc, item) => {
  //     acc[item.id] = z.string().optional();

  //     return acc;
  //   }, {})
  // );

  const formSchema = z.object(
    questions.reduce((acc, item) => {
      acc[item.id] = item.uiFieldInfo.required
        ? z.string().min(1, { message: "error" })
        : z.string().optional();
      return acc;
    }, {})
  );

  // Use the valid names in the defaultValues and form:
  const defaultValues = {
    ...questions.reduce((acc, item) => {
      acc[item.id] = "";
      return acc;
    }, {}),
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const handleSubmit = async (data) => {
    updateFormData(data);
  };

  return (
    <>
      <main className="flex flex-col  p-2 items-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            {questions.map((item) => {
              const translation = item.translations.find(
                (t) => t.lang.toLowerCase() === router.locale.toLowerCase()
              );

              return (
                <>
                  <div className="mt-4 mb-4">
                    {item.uiFieldInfo.input_type.type === "text" && (
                      <FormField
                        control={form.control}
                        name={item.id} //
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{translation.title}</FormLabel>
                            <FormControl>
                              <BaseInput
                                onChange={field.onChange}
                                type="text"
                                {...field}
                                placeholder={translation.title}
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
                      name={item.id} // Append '_select' to the name property
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={(value) => field.onChange(value)}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={translation.title} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {item.answers.map((answer, answerIndex) => {
                                const answerTranslation =
                                  answer.translations.find(
                                    (t) =>
                                      t.lang.toLowerCase() ===
                                      router.locale.toLowerCase()
                                  );

                                return (
                                  <SelectItem
                                    key={answerIndex}
                                    value={answerTranslation.title}
                                  >
                                    {answerTranslation.title}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <>
                    {item.uiFieldInfo.input_type.type === "button" && (
                      <FormField
                        control={form.control}
                        name={item.id}
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>
                              მონიშნე თარიღი, როცა გინდა ოთახის მეზობლის მოძიება
                              ან ბინაში გადასვლა?
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
                                    const dateString = date.toISOString(); // convert date to string
                                    field.onChange(dateString);
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
                </>
              );
            })}
            <Button
              className="mt-4"
              variant="default"
              size="default"
              type="submit"
              onClick={async () => {
                if (form.formState.isValid) {
                  submitForm();
                }
              }}
            >
              Submit
            </Button>
          </form>
        </Form>
      </main>
    </>
  );
}
