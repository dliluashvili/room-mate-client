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
import Select from "react-select";
import { Button } from "../@/components/ui/button";
import useTranslation from "next-translate/useTranslation";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { SignupStepOne } from "./validations/SignupStepOne";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { BASE_URL_GRAPHQL } from "../services/api";

export default function SignupFirst({
  countries,
  gender,
  setStep,
  updateFormData,
  formData,
  step,
}) {
  const form = SignupStepOne({ formData });

  const router = useRouter();
  let { t } = useTranslation("common") as { t: (key: string) => string };
  const labels = router.locale === "ka" ? ge.ge : undefined;
  const [clicked, setClicked] = useState(false);
  const [resend, setResend] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [selectedGenderLabel, setSelectedGenderLabel] = useState("");

  useEffect(() => {
    const savedLabel = localStorage.getItem("selectedLabel");
    if (savedLabel) {
      setSelectedLabel(savedLabel);
    }
    const savedGenderLabel = localStorage.getItem("selectedGenderLabel");
    if (savedGenderLabel) {
      setSelectedGenderLabel(savedGenderLabel);
    }
  }, [step]);

  

  const handleSubmit = async (data: any) => {
    let modifiedFormData = {
      ...data,
    };
    let modifedForCode = {
      ...data,
      code: Number(data.code),
    };
    updateFormData(modifiedFormData);
    try {
      const response = await axios.post(BASE_URL_GRAPHQL, {
        query: `
          mutation Mutation($input: CheckSmsCodeDto!) {
            checkCode(input: $input)
          }
          `,
        variables: {
          input: {
            phone: form.watch("phone"),
            code: modifedForCode.code,
          },
        },
      });
      setStep(2);
      if (response.data.data.checkCode === "VALID") {
        setStep(2);
      } else if (response.data.data.checkCode === "INVALID") {
        form.setError("code", { message: t("codeExpired") });
      } else if (response.data.data.checkCode === "NOT_FOUND") {
        form.setError("code", { message: t("incorrectCode") });
      }
    } catch (error) {
      console.error(error);
      form.setError("code", { message: t("fillCode") });
    }
  };

  const getCodeHandler = async () => {
    await form.handleSubmit(async () => {
      setClicked(true);
      setResend(true);
      try {
        const response = await axios.post(BASE_URL_GRAPHQL, {
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
        if (response.data.data.sendCode === "ALREADY_SENT") {
          form.setError("code", { message: t("codeAlreadySent") });
        }
      } catch (error) {
        console.error("GraphQL error:", error);
      }
    })();
  };

  return (
    <>
      <main className="flex flex-col  items-center ">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className=" w-full">
            <div className="grid  grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 mb-3 items-start lg:justify-center">
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("name")}</FormLabel>
                    <FormControl>
                      <BaseInput
                        {...field}
                        hasError={form.formState.errors.firstname}
                        isSuccess={
                          !form.formState.errors.firstname &&
                          form.formState.touchedFields.firstname &&
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
                        {...field}
                        hasError={form.formState.errors.lastname}
                        isSuccess={
                          !form.formState.errors.lastname &&
                          form.formState.touchedFields.lastname &&
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
                      className="text-sm rounded-lg"
                      placeholder={selectedLabel || t("selectCountry")}
                      value={countries.find(
                        (option) => option.id === field.value.value
                      )}
                      onChange={(option) => {
                        field.onChange(option.value);
                        setSelectedLabel(option.label); // Save the label when an option is selected
                        localStorage.setItem("selectedLabel", option.label); // Save the label in local storage
                    
                      }}
                      options={countries.map((country) => ({
                        value: country.id,
                        label: country?.translations[0]?.name,
                      }))}
                    />
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
                      className="text-sm rounded-lg "
                      placeholder={selectedGenderLabel || t("selectGender")}
                      value={gender.find(
                        (option) => option.id === field.value.value
                      )}
                      onChange={(option) => {
                        field.onChange(option.value);
                        setSelectedGenderLabel(option.label); // Save the label when an option is selected
                        localStorage.setItem(
                          "selectedGenderLabel",
                          option.label
                        ); // Save the label in local storage
                      }}
                      options={gender.map((gender) => ({
                        value: gender.id,
                        label: gender?.translations[0].sex,
                      }))}
                    />
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
                        {...field}
                        hasError={form.formState.errors.age}
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
                      <BaseInput {...field} />
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
                        type="password"
                        {...field}
                        hasError={form.formState.errors.password}
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
                        type="password"
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
                        defaultCountry="GE"
                        international
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
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fillCode")}</FormLabel>
                    <FormControl>
                      <BaseInput
                        type="number"
                        {...field}
                        resend={resend}
                        setResend={setResend}
                        getCode={!clicked}
                        resendButton={clicked}
                        onGetCodeClick={getCodeHandler}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
