import React, { useState } from "react";
import { Card, CardContent } from "../@/components/ui/card";
import SignupFirst from "./SignupFirst";
import SignupSecond from "./SignupSecond";
import axios from "axios";
import { FormDataType } from "./types/types";
import SignupStepsHeader from "./SignupStepsHeader";
import NewHeader from "./NewHeader";

export default function MultiStepCard({ countries, gender, questions }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ answeredQuestions: [] });
  console.log(formData);
  console.log(questions.map((item) => item.id));
  const updateFormData = (newData: FormDataType) => {
    setFormData((prevData) => ({ ...prevData, ...newData }));
  };
  const submit = async () => {
    const modifiedFormData: any = {
      ...formData,
      answeredQuestions: formData.answeredQuestions.map((question) => {
        let modifiedQuestion: {
          questionId: number;
          answerId?: number;
          data?: any;
        } = { questionId: parseInt(question.questionId) };
        if (question.answerId) {
          modifiedQuestion.answerId = parseInt(question.answerId);
        } else if (question.data) {
          modifiedQuestion.data = question.data;
        }
        return modifiedQuestion;
      }),
    };
    delete modifiedFormData.code;
    const requestBody = {
      query: `mutation Mutation($input: SignUpAndAnswerQuestionsDto!) {
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
        console.log("Sending request with payload:", requestBody);
        const response = await axios.post(
          "https://test-api.roommategeorgia.ge/graphql",
          requestBody,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
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
