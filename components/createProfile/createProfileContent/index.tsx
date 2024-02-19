import React from "react";
import Radio from "./contentTypes/radio";
import { TextField } from "./contentTypes/textField";
import { PhoneField } from "./contentTypes/phone";
import { IQuestions } from "../../../services/questions/questions.http";

interface IContentProps {
  data: IQuestions;
  setData: (d) => void;
  values: { [key: string]: [] };
}

const Content: React.FC<IContentProps> = ({ data, setData, values }) => {
  const GetAnswers = (data) => {
    return <> ups</>;
  };
  if (!data?.type) return <>.</>;
  switch (data.type) {
    case "choice":
      return <Radio values={values} setData={(d) => setData(d)} data={data} />;
    case data.name === "phone" ? "text" : "null":
      return (
        <PhoneField values={values} setData={(d) => setData(d)} data={data} />
      );

    case "text":
    case "textarea":
    case "password":
      return (
        <TextField values={values} setData={(d) => setData(d)} data={data} />
      );

    default:
      return <div>{data.title}</div>;
  }
};

export default Content;
