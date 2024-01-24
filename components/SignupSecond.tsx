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

export default function SignupSecond({ questions }) {
  const formSchema = z.object(
    questions.reduce((acc, item) => {
      acc[item.id] = z.string().min(1);
      return acc;
    }, {})
  );

  const defaultValues = questions.reduce((acc, item) => {
    acc[item.id] = ""; // set default value to empty string
    return acc;
  }, {});

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });


  const handleSubmit = (data) => {
    console.log(data);
    console.log(form.formState);
    console.log("agaegqe");
  };
  const lang = "EN"; // or 'EN'

  console.log("questions", questions);
  return (
    <>
      <main className="flex flex-col p-24 items-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            {questions.map((item) => {
              // Find the correct translation
              const translation = item.translations.find(
                (t) => t.lang === lang
              );

              return (
                <>
                  <div className="mb-4">
                    {item.answers.length === 0 && (
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
                  {item.answers.length > 0 && (
                    <FormField
                      control={form.control}
                      name={`${item.id}_select`} // Append '_select' to the name property
                      render={({ field }) => (
                        <FormItem>
                          {/* <FormLabel>{translation.title}</FormLabel> */}
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
                                // Find the correct answer translation
                                const answerTranslation =
                                  answer.translations.find(
                                    (t) => t.lang === lang
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
                </>
              );
            })}
            <Button
              className="mt-4"
              variant="default"
              size="default"
              type="submit"
            >
              clickkkkk
            </Button>
          </form>
        </Form>
      </main>
    </>
  );
}
