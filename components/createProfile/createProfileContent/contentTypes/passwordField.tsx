import React, { useState } from "react";
import { Heading } from "../components/heading";
import { IQuestions } from "../../../../services/questions/questions.http";

export const PasswordField = ({ data }: { data: IQuestions }) => {
  const [values, setValues] = useState([]);

  return (
    <div>
      <Heading text={data.title} />

      <div className="createProfile_checkboxItem_wrapper">
        <input
          type="password"
          className="form-control placeholder-active w-50"
        />
      </div>
    </div>
  );
};
