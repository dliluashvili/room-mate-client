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

  return (
    <>
      <div className="w-full  py-10 flex justify-center items-center">
        <Card className="bg-[#e3e3de] ">
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
                />
              </div>
            )}
            {step === 2 && (
              <div>
                <SignupSecond questions={questions} />
                <button onClick={() => setStep(1)}>Back</button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
