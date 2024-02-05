import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../@/components/ui/card";
import SignupFirst from "./SignupFirst";
import SignupSecond from "./SignupSecond";

export default function MultiStepCard({ countries, gender, questions }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const updateFormData = (newData) => {
    setFormData((prevData) => ({ ...prevData, ...newData }));
  };

  const submitForm = () => {
    alert(Object.values(formData).map((item) => item));
  };

  return (
    <>
      <div className="w-full min-h-screen flex justify-center items-center lg:py-10 lg:px-[25%]">
        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Roommate register form</CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <div>
                <SignupFirst
                  countries={countries}
                  gender={gender}
                  setStep={setStep}
                  updateFormData={updateFormData}
                />
              </div>
            )}
            {step === 2 && (
              <div>
                <SignupSecond
                  questions={questions}
                  updateFormData={updateFormData}
                  submitForm={submitForm}
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
