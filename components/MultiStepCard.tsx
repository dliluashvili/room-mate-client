import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../@/components/ui/card";
import SignupFirst from "./SignupFirst";
import SignupSecond from "./SignupSecond";
import axios from "axios";
import SignupStepsHeader from "./SignupStepsHeader";
import { setCurrentUser } from "../redux/action-creators";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { BASE_URL_GRAPHQL } from "../services/api";

export default function MultiStepCard({ countries, gender, questions }) {
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();
  const router = useRouter();
  const [formData, setFormData] = useState({ answeredQuestions: [] });
  let secondStep = questions.slice(0, 7);
  let thirthStep = questions.slice(8, 13);

  const updateFormData = (newData: any) => {
    setFormData((prevData) => ({ ...prevData, ...newData }));
  };
  useEffect(() => {
    if (formData.answeredQuestions.length > 7) {
      submit();
    }
  }, [formData]);

  const submit = async () => {
    const modifiedFormData: any = {
      ...formData,
    };
    delete modifiedFormData.code;

    if (modifiedFormData.age) {
      modifiedFormData.age = Number(modifiedFormData.age);
    }
    if (modifiedFormData.countryId) {
      modifiedFormData.countryId = Number(modifiedFormData.countryId);
    }
    if (modifiedFormData.genderId) {
      modifiedFormData.genderId = Number(modifiedFormData.genderId);
    }
    if (modifiedFormData.email === "") {
      delete modifiedFormData.email;
    }

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

    if (step === 3) {
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
          console.log(response);
        } else {
          alert("Phone exist");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <>
      <div className="w-full min-h-screen flex justify-center items-center  md:pt-20 md:pb-10 lg:pt-36 md:px-[10%] lg:px-[15%] xl:px-[334px]">
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
                  step={step}
                />
              </div>
            )}
            {step === 2 && (
              <div>
                <SignupSecond
                  questions={secondStep}
                  updateFormData={updateFormData}
                  setStep={setStep}
                  formData={formData}
                  step={step}
                />
              </div>
            )}
            {step === 3 && (
              <div>
                <SignupSecond
                  questions={thirthStep}
                  updateFormData={updateFormData}
                  setStep={setStep}
                  formData={formData}
                  step={step}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
