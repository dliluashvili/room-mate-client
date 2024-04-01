import React, { useState } from "react";
import { Card, CardContent } from "../@/components/ui/card";
import dynamic from "next/dynamic";
import axios from "axios";

import { setCurrentUser } from "../redux/action-creators";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { BASE_URL_GRAPHQL } from "../services/api";
import useTranslation from "next-translate/useTranslation";

import { PopUp } from "./PopUp";
const SignupFirst = dynamic(() => import("./SignupFirst"));
const SignupSecond = dynamic(() => import("./SignupSecond"));
const SignupStepsHeader = dynamic(() => import("./SignupStepsHeader"));

export default function MultiStepCard({ countries, gender, questions }) {
  let { t } = useTranslation("common") as { t: (key: string) => string };
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();
  const router = useRouter();
  const [formData, setFormData] = useState<any>({ answeredQuestions: {} });
  const [isOpen, setIsOpen] = useState(false);

  let secondStep = questions?.slice(0, 7);
  let thirthStep = questions?.slice(8, 13);
  const showErrorWithHelp = () => {
    alert(t("serverError"));
    if (confirm("Go to support")) {
      window.open(
        "https://www.facebook.com/share/E3WJ5xzYtAQ4itRd/?mibextid=WC7FNe",
        "_blank"
      );
    }
  };

  const updateFormData = (newData: any) => {
    setFormData((prevData) => ({ ...prevData, ...newData }));
  };

  const submit = async () => {
    const modifiedFormData: any = {
      ...formData,
    };

    delete modifiedFormData.code;

    if (modifiedFormData.countryId) {
      modifiedFormData.countryId = Number(modifiedFormData.countryId.value);
    }
    // if (modifiedFormData.birthDate) {
    //   modifiedFormData.birthDate = Number(modifiedFormData.birthDate.value);
    // }
    if (modifiedFormData.genderId) {
      modifiedFormData.genderId = Number(modifiedFormData.genderId.value);
    }
    if (modifiedFormData.email === "") {
      delete modifiedFormData.email;
    }
    let answeredQuestions = [];

    for (let key in modifiedFormData.answeredQuestions) {
      let value = modifiedFormData.answeredQuestions[key];

      if (typeof value === "string") {
        answeredQuestions.push({ questionId: key, data: value });
      } else if (Array.isArray(value)) {
        if (typeof value[0] === "object") {
          // Array of objects
          let questionId = value[0]["questionId"];
          let answerIds = value.map((item) => item["value"]);
          answeredQuestions.push({
            questionId: questionId,
            answerIds: answerIds,
          });
        } else {
          answeredQuestions.push({
            questionId: key,
            dataRange: value,
          });
        }
      } else if (typeof value === "object" && !Array.isArray(value)) {
        answeredQuestions.push({
          questionId: value["questionId"],
          answerIds: [value["value"]],
        });
      }
    }

    modifiedFormData.answeredQuestions = answeredQuestions;

    const requestBody = {
      query: `mutation SignUp($userAndAnsweredQuestions: UserAndAnsweredQuestionsInput!) {
        signUp(userAndAnsweredQuestions: $userAndAnsweredQuestions) {
          accessToken
        }
      }`,
      variables: {
        userAndAnsweredQuestions: modifiedFormData,
      },
    };

    try {
      const response = await axios.post(BASE_URL_GRAPHQL, requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response?.data?.data && response?.data?.data?.signUp.accessToken) {
        dispatch(
          setCurrentUser({
            user: null,
            token: response.data.data.signUp.accessToken,
          })
        );

        setIsOpen(true);
      } else if (response?.data?.errors[0]?.message === "PHONE_EXISTS") {
        alert(t("phoneExist"));
      } else if (response?.data?.errors[0]?.message === "EMAIL_EXISTS") {
        alert(t("emailExist"));
      }
    } catch (error) {
      showErrorWithHelp();
    }
  };

  return (
    <>
      <div className="w-full min-h-screen flex justify-center items-center  md:pt-20 md:pb-16 lg:pt-36 md:px-[10%] lg:px-[15%] xl:px-[334px]">
        <Card>
          <PopUp
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            range={formData.answeredQuestions[7]}
            country={formData?.countryId?.value}
          />
          <SignupStepsHeader step={step} />
          <CardContent className="bg-white pt-8 pb-16  px-10  sm:px-28">
            {step === 1 && (
              <div>
                <SignupFirst
                  countries={countries}
                  gender={gender}
                  setStep={setStep}
                  formData={formData}
                  updateFormData={updateFormData}
                />
              </div>
            )}
            {step === 2 && (
              <div>
                <SignupSecond
                  questions={secondStep}
                  updateFormData={updateFormData}
                  submit={submit}
                  setStep={setStep}
                  formData={formData}
                  step={step}
                  next={t("next")}
                />
              </div>
            )}
            {step === 3 && (
              <div>
                <SignupSecond
                  questions={thirthStep}
                  updateFormData={updateFormData}
                  submit={submit}
                  setStep={setStep}
                  formData={formData}
                  step={step}
                  next={t("submit")}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
