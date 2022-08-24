import React, { useState, useEffect } from "react";
import { Checkbox } from "../components/checkbox";
import { Heading } from "../components/heading";
import { IQuestions } from "../../../../services/questions/questions.http";

interface IContentProps {
  data: IQuestions;
  setData: (d) => void;
  values: { [key: string]: [] };
}

export const NumberText = ({ data, setData, values }: IContentProps) => {
  const [value, setValue] = useState([]);

  useEffect(() => {
    if (values && values[data.id] && values[data.id].length > 0) {
      setValue(values[data.id]);
    } else {
      // debugger;

      setValue([]);
    }
    console.log(data.id, "valueee");
  }, [values, data.id]);

  return (
    <div>
      <Heading text={data.title} />

      <div className="createProfile_checkboxItem_wrapper">
        <input
          value={value[0] || ""}
          onChange={(e) => {
            setValue([e.target.value]);
            setData({
              question_id: data.id,
              value: [e.target.value].filter(Boolean),
            });
          }}
          type={data.type === "password" ? "password" : "text"}
          className="form-control placeholder-active"
        />
      </div>
    </div>
  );
};
