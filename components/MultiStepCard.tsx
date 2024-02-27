import React, { useState } from "react";
import { Card, CardContent } from "../@/components/ui/card";
import SignupFirst from "./SignupFirst";
import SignupSecond from "./SignupSecond";
import axios from "axios";
import SignupStepsHeader from "./SignupStepsHeader";
import { setCurrentUser } from "../redux/action-creators";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { BASE_URL_GRAPHQL } from "../services/api";
import useTranslation from "next-translate/useTranslation";

export default function MultiStepCard({ countries, gender, questions }) {
  let { t } = useTranslation("common") as { t: (key: string) => string };
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();
  const router = useRouter();
  const [formData, setFormData] = useState({ answeredQuestions: {} });
  let secondStep = questions.slice(0, 7);
  let thirthStep = questions.slice(8, 13);
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
    if (modifiedFormData.age) {
      modifiedFormData.age = Number(modifiedFormData.age);
    }
    if (modifiedFormData.countryId) {
      modifiedFormData.countryId = Number(modifiedFormData.countryId.value);
    }
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
      }
 
      else if (typeof value === "object" && !Array.isArray(value)) {
        answeredQuestions.push({
          questionId: value["questionId"],
          answerId: value["value"],
        });
      }
      else if (Array.isArray(value)) {
        for (let item of value) {
          answeredQuestions.push({
            questionId: item["questionId"],
            answerId: item["value"],
          });
        }
      }
    }
    modifiedFormData.answeredQuestions = answeredQuestions;

    const requestBody = {
      query: `mutation Mutation($input: SignUpAndAnswerQuestionsInput!) {
        signUpAndAnswerQuestion(input: $input) {
          accessToken
        }
      }`,
      variables: {
        input: modifiedFormData,
      },
    };

    try {
      const response = await axios.post(BASE_URL_GRAPHQL, requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (
        response?.data?.data &&
        response?.data?.data?.signUpAndAnswerQuestion.accessToken
      ) {
        dispatch(
          setCurrentUser({
            user: null,
            token: response.data.data.signUpAndAnswerQuestion.accessToken,
          })
        );
        router.push("/");
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
                  next={"Next"}
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
                  next={"Finish"}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
