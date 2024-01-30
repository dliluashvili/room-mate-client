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

export default function SignupFirst({ countries, gender }) {
  let { t } = useTranslation("common") as { t: (key: string) => string };
  const form = SignupForm();
  const router = useRouter();
  const [clicked, setClicked] = useState(false);
  const [resend, setResend] = useState(false);
  const handleSubmit = (data: any) => {
    data.phone = Number(data.phone);
    data.age = Number(data.age);
    if (!form.formState.isValid) {
      console.log("doneee");
    }
  };

  const getCodeHandler = async () => {
    await form.handleSubmit(async () => {
      if (form.formState.errors) {
        setClicked(true);
        setResend(true);
      }
    })();
  };
  const labels = router.locale === "ka" ? ge.ge : undefined;

  return (
    <>
      <main className="flex flex-col p-20 items-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="grid lg:grid-cols-2  gap-x-2 gap-y-2 mb-3 items-start justify-center  ">
              <FormField
                control={form.control}
                name="name"
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
                name="surname"
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
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("country")}</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("country")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries.map((item) => {
                          const translation = item.translations.find(
                            (t) =>
                              t.lang.toLowerCase() ===
                              router.locale.toLowerCase()
                          );
                          if (translation) {
                            return (
                              <SelectItem
                                key={`${item.id}-${translation.name}`} // Unique key // must check key errors/warnings
                                value={translation.name}
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
                name="gender"
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
                        {gender.map((item) => {
                          const translation = item.translations.find(
                            (t) =>
                              t.lang.toLowerCase() ===
                              router.locale.toLowerCase()
                          );
                          if (translation) {
                            return (
                              <SelectItem key={item.id} value={translation.sex}>
                                {translation.sex}
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
                name="mail"
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
                  placeholder="შეიყვანე კოდი"
                  disabled={!clicked}
                  getCode={!clicked}
                  resendButton={clicked}
                  onGetCodeClick={getCodeHandler}
                  formState={form.formState.errors.name}
                />
                <FormMessage></FormMessage>
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
