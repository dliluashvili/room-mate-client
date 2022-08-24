import React, { useState, useEffect } from "react";
import { Checkbox } from "../components/checkbox";
import { Heading } from "../components/heading";
import { IQuestions } from "../../../../services/questions/questions.http";

interface IRadioProps {
  data: IQuestions;
  setData: (d) => void;
  values: { [key: string]: [] };
}

export default function Radio({ data, setData, values }: IRadioProps) {
  const [value, setValue] = useState<number[]>([]);

  useEffect(() => {
    console.log(value, "vvvvvvvvvvvvvvvvv");
    if (values && values[data.id] && values[data.id].length > 0) {
      setValue(values[data.id]);
    } else {
      setValue([]);
    }
    console.log(data.id);
  }, [values, data.id]);

  useEffect(() => {}, []);

  return (
    <div>
      <Heading text={data.title} />
      <div className="createProfile_checkboxItem_wrapper">
        {data.answers.map((item, i) => {
          let answerId = item.real_id ? item.real_id : item.id;
          return (
            <Checkbox
              key={item.id}
              setValue={(v) => {
                if (value.includes(answerId)) {
                  setValue(value.filter((id) => id !== answerId));
                  setData({
                    question_id: item.question_id,
                    value: value.filter((id) => id !== answerId),
                  });
                } else {
                  if (data.is_multiple) {
                    setValue([...value, answerId]);
                    setData({
                      question_id: item.question_id,
                      value: [...value, answerId],
                    });
                  } else {
                    setValue([answerId]);
                    setData({
                      question_id: item.question_id,
                      value: [answerId],
                    });
                  }
                }
              }}
              label={item.title}
              id={answerId}
              selected={value.includes(answerId)}
            />
          );
        })}
      </div>
    </div>
  );
}
