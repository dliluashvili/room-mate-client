import * as ge from "../locales/country.json";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../@/components/ui/form";
import { BaseInput } from "../@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../@/components/ui/select";
import { Button } from "../@/components/ui/button";
import useTranslation from "next-translate/useTranslation";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { SignupForm } from "./validations/SignupForm";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function SignupFirst({
  countries,
  gender,
  setStep,
  updateFormData,
}) {
  const form = SignupForm();
  const router = useRouter();
  let { t } = useTranslation("common") as { t: (key: string) => string };
  const labels = router.locale === "ka" ? ge.ge : undefined;
  const [clicked, setClicked] = useState(false);
  const [resend, setResend] = useState(false);
  const [code, setCode] = useState(null);
  const [sms, setSms] = useState(true);

  const handleSubmit = async (data: any) => {
    data.phone = Number(data.phone);
    data.age = Number(data.age);
    data.gender = Number(data.gender);
    data.country = Number(data.country);
    updateFormData(data);
    try {
      const response = await axios.post(
        "https://test-api.roommategeorgia.ge/graphql",
        {
          query: `
          mutation Mutation($input: CheckSmsCodeDto!) {
            checkCode(input: $input)
          }
          
          `,
          variables: {
            input: {
              phone: form.watch("phone"),
              code: code,
            },
          },
        }
      );
      if (response.data.data.checkCode === "VALID") {
        setStep(2);
      } else {
        setSms(false);
      }
    } catch (error) {
      console.error(error);
      setSms(false);
    }
  };

  const getCodeHandler = async () => {
    await form.handleSubmit(async () => {
      setClicked(true);
      setResend(true);
      try {
        await axios.post("https://test-api.roommategeorgia.ge/graphql", {
          query: `
                mutation SendCode($input: SendSmsCodeDto!) {
                  sendCode(input: $input)
                }
              `,
          variables: {
            input: {
              phone: form.watch("phone"),
            },
          },
        });
      } catch (error) {
        console.error("GraphQL error:", error.response.data);
      }
    })();
  };

  const translateGender = (item, locale) => {
    const translation = item.translations.find(
      (t) => t.lang.toLowerCase() === locale.toLowerCase()
    );

    return translation ? translation.sex : "";
  };

  return (
    <>
      <main className="flex flex-col p-2 items-center ">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className=" w-full">
            <div className="grid  grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-2 mb-3 items-start lg:justify-center">
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("name")}</FormLabel>
                    <FormControl>
                      <BaseInput
                        placeholder={t("name")}
                        {...field}
                        hasError={!!form.formState.errors.name}
                        isSuccess={
                          !form.formState.errors.name &&
                          form.formState.touchedFields.name &&
                          field.value !== ""
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("surname")}</FormLabel>
                    <FormControl>
                      <BaseInput
                        placeholder={t("surname")}
                        {...field}
                        hasError={!!form.formState.errors.surname}
                        isSuccess={
                          !form.formState.errors.surname &&
                          form.formState.touchedFields.surname &&
                          field.value !== ""
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="countryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("country")}</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        form.setValue("countryId", value)
                      }
                      defaultValue={form.getValues("countryId")}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("country")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries?.map((item) => {
                          const translation = item.translations.find(
                            (t) =>
                              t.lang.toLowerCase() ===
                              router.locale.toLowerCase()
                          );

                          if (translation) {
                            return (
                              <SelectItem
                                key={`${item.id}-${translation.name}`}
                                value={translation.id}
                                onClick={() =>
                                  form.setValue("countryId", translation.id)
                                }
                              >
                                {translation.name}
                              </SelectItem>
                            );
                          }

                          return null;
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="genderId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("gender")}</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("gender")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {gender?.map((item) => (
                          <SelectItem
                            key={`${item.id}-${translateGender(
                              item,
                              router.locale
                            )}`}
                            value={item.id}
                          >
                            {translateGender(item, router.locale)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("age")}</FormLabel>
                    <FormControl>
                      <BaseInput
                        type="number"
                        placeholder={t("age")}
                        {...field}
                        hasError={!!form.formState.errors.age}
                        isSuccess={
                          !form.formState.errors.age &&
                          form.formState.touchedFields.age &&
                          field.value !== ""
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("mail")}</FormLabel>
                    <FormControl>
                      <BaseInput placeholder={t("mailProvide")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Password")}</FormLabel>
                    <FormControl>
                      <BaseInput
                        placeholder={t("Password")}
                        {...field}
                        hasError={!!form.formState.errors.password}
                        isSuccess={
                          !form.formState.errors.password &&
                          form.formState.touchedFields.password &&
                          field.value !== ""
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("PasswordRepeat")}</FormLabel>
                    <FormControl>
                      <BaseInput
                        placeholder={t("PasswordRepeat")}
                        {...field}
                        hasError={!!form.formState.errors.confirmPassword}
                        isSuccess={
                          !form.formState.errors.confirmPassword &&
                          form.formState.touchedFields.confirmPassword &&
                          field.value !== ""
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Phonenumber")}</FormLabel>
                    <FormControl>
                      <PhoneInput
                        {...field}
                        labels={labels}
                        inputComponent={BaseInput}
                        defaultCountry="GE"
                        international
                        placeholder="Enter phone number"
                        value={field.value}
                        onChange={(phone) => {
                          form.setValue("phone", phone);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <label className="mb-2 text-sm">შეიყვანე კოდი</label>
                <BaseInput
                  resend={resend}
                  setResend={setResend}
                  type="number"
                  onChange={(e) => setCode(Number(e.target.value))}
                  placeholder="შეიყვანე კოდი"
                  getCode={!clicked}
                  resendButton={clicked}
                  onGetCodeClick={getCodeHandler}
                />
                <FormMessage style={{ marginTop: "8px" }}>
                  {sms ? "" : "არასწორი კოდი"}
                </FormMessage>
              </div>
            </div>
            <Button
              className="mt-4"
              variant="default"
              size="default"
              type="submit"
            >
              {t("next")}
            </Button>
          </form>
        </Form>
      </main>
    </>
  );
}
