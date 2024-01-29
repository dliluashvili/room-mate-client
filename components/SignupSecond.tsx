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
  FormDescription,
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

export default function SignupSecond({ questions }) {
  const router = useRouter();
  const inputFormSchema = z.object(
    questions.reduce((acc, item) => {
      acc[item.id] = z.string().min(1);
      return acc;
    }, {})
  );

  const selectFormSchema = z.object(
    questions.reduce((acc, item) => {
      acc[`${item.id}_select`] = z.string().min(1);
      return acc;
    }, {})
  );

  // Combine the two schemas
  const formSchema = inputFormSchema.and(selectFormSchema);

  const defaultValues = {
    ...questions.reduce((acc, item) => {
      acc[item.id] = "";
      return acc;
    }, {}),
    ...questions.reduce((acc, item) => {
      acc[`${item.id}_select`] = "";
      return acc;
    }, {}),
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const handleSubmit = (data) => {
    console.log("ggg", data);
  };

  return (
    <>
      <main className="flex flex-col  p-24 items-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            {questions.map((item) => {
              const translation = item.translations.find(
                (t) => t.lang.toLowerCase() === router.locale.toLowerCase()
              );

              return (
                <>
                  <div className="mt-4">
                    {item.ui_field_info.input_type.type === "text" && (
                      <FormField
                        control={form.control}
                        name={item.id}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{translation.title}</FormLabel>
                            <FormControl>
                              <BaseInput
                                type="text"
                                placeholder={translation.title}
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
                  {item.ui_field_info.input_type.type === "select" && (
                    <FormField
                      control={form.control}
                      name={`${item.id}_select`} // Append '_select' to the name property
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
                    {item.ui_field_info.input_type.sub_type === "calendar" && (
                      <FormField
                        control={form.control}
                        name="dob"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Date of birth</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"default"}
                                    className={cn(
                                      "w-[240px] pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
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
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date > new Date() ||
                                    date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormDescription>
                              Your date of birth is used to calculate your age.
                            </FormDescription>
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
              onClick={handleSubmit}
            >
              clickkkkk
            </Button>
          </form>
        </Form>
      </main>
    </>
  );
}
