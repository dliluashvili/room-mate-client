import React, { useState, useEffect, useContext } from "react";
import { Checkbox } from "../components/checkbox";
import { Heading } from "../components/heading";
import {
  IQuestions,
  Questions,
} from "../../../../services/questions/questions.http";
import { AuthService } from "../../../../services/auth/auth.http";
import { Button } from "../../../common/form";
import { ToastContainer, toast } from "react-toastify";
import { SmsCheckContext } from "../context/smsCheckContext";
import useTranslation from "next-translate/useTranslation";

interface IContentProps {
  data: IQuestions;
  setData: (d) => void;
  values: { [key: string]: [] };
}

export const PhoneField = ({ data, setData, values }: IContentProps) => {
  const [value, setValue] = useState([]);
  const [loadSendSms, setLoadSendSms] = useState(false);

  let { t } = useTranslation("common");

  const { smsCode, setSmsCode, setIsVerify } = useContext(SmsCheckContext);

  //   useEffect(() => {

  //   }, [])

  useEffect(() => {
    if (values && values[data.id] && values[data.id].length > 0) {
      setValue(values[data.id]);
    } else {
      // debugger;

      setValue([]);
    }
    console.log(value, "valueee");
  }, [values, data.id]);

  const sendSms = () => {
    setLoadSendSms(true);
    Questions.checkPhone(value[0])
      .then((res) => {
        setLoadSendSms(false);

        // debugger;
        if (res.data.exists) {
          toast.error(t("phoneUsed"), {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          AuthService.sendResetCode(value[0]).then((r) => {
            toast.success(t("smsCodeSent"), {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          });

          // setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
      })
      .catch((err) => {
        setLoadSendSms(false);

        console.log(err.response);
      });
  };

  return (
    <div>
      <Heading text={data.title} />
      <div className="createProfile_checkboxItem_wrapper">
        <div className="w-100 d-flex">
          <input
            value={value[0] || ""}
            // placeholder={data.title}
            placeholder={t("fillField")}
            onChange={(e) => {
              setIsVerify(false);
              setValue([e.target.value]);
              setData({
                question_id: data.id,
                value: [e.target.value].filter(Boolean),
              });
            }}
            type={data.type === "password" ? "password" : "text"}
            className="form-control placeholder-active"
          />
          <Button
            onClick={sendSms}
            loading={loadSendSms}
            className="btn btn-primary w-50 ml-3"
          >
            {t("SMSsent")}
          </Button>
        </div>
        <div className="mt-3">
          <input
            value={smsCode}
            onChange={(e) => {
              setSmsCode(e.target.value);
            }}
            className="form-control placeholder-active"
            placeholder={t("fillSmsCode")}
          />
        </div>
      </div>
    </div>
  );
};
