import React, { useState } from "react";
import { Card, CardContent } from "../@/components/ui/card";
import SignupFirst from "./SignupFirst";
import SignupSecond from "./SignupSecond";
import axios from "axios";
import SignupStepsHeader from "./SignupStepsHeader";

export default function MultiStepCard({ countries, gender, questions }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ answeredQuestions: [] });

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
      modifiedFormData.countryId = Number(modifiedFormData.countryId);
    }
    if (modifiedFormData.genderId) {
      modifiedFormData.genderId = Number(modifiedFormData.genderId);
    }

    console.log(modifiedFormData);
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

    if (step === 2) {
      try {
        const response = await axios.post(
          "https://test-api.roommategeorgia.ge/graphql",
          requestBody,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data.errors[0].message) {
          alert(response.data.errors[0].message);
        }
        console.log(response);
      } catch (error) {
        console.error("Error:", error.response.data);
      }
    }
  };

  return (
    <>
      <div className="w-full min-h-screen flex justify-center items-center lg:py-10 lg:px-[25%]">
        <Card>
          <SignupStepsHeader step={step} />
          <CardContent className="bg-white pt-8 pb-16 px-20">
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
                  questions={questions}
                  updateFormData={updateFormData}
                  submit={submit}
                />
                <button onClick={() => setStep(1)}>Back</button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
