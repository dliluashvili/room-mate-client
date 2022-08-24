import React, { useState } from "react";
import { Checkbox } from "../components/checkbox";
import { Heading } from "../components/heading";
import { IQuestions } from "../../../../services/questions/questions.http";

export const Select = ({ data }: { data: IQuestions }) => {
  const [values, setValues] = useState([]);

  return (
    <div>
      <Heading text={data.title} />
      <input
        placeholder="ძებნა..."
        className="mt-4 mb-3 searchInput form-control placeholder-active "
      />
      <div className="createProfile_checkboxItem_wrapper mt-0">
        {data.answers.map((item, i) => {
          return (
            <Checkbox
              key={i}
              setValue={(v) => {
                // debugger;
                if (values.includes(v)) {
                  setValues(values.filter((el) => el !== v));
                } else {
                  setValues([...values, v]);
                }
              }}
              label={item.title}
              id={i}
              selected={!!values.find((el) => el === i)}
            />
          );
        })}
      </div>
    </div>
  );
};
