import React, { useState } from "react";
import classnames from "classnames";
import useTranslation from "next-translate/useTranslation";

const faqData = [
  {
    question: (t) => t("faq1"),
    answer: (t) => t("faq2"),
  },
  {
    question: (t) => t("faq3"),
    answer: (t) => t("faq4"),
  },
  {
    question: (t) => t("faq5"),
    answer: (t) => (
      <>
        <p className="pl-0 pb-0">- {t("faq6")}</p>
        <p className="pl-0 ">- {t("faq7")}</p>
      </>
    ),
  },
  {
    question: (t) => t("faq8"),
    answer: (t) => t("faq9"),
  },
];

function Faq() {
  const [openindex, setOpenIndex] = useState<null | number>(null);

  let { t } = useTranslation("common");

  const toggleIndex = (i: number) => {
    if (i === openindex) {
      setOpenIndex(null);
    } else {
      setOpenIndex(i);
    }
  };

  return (
    <div>
      {faqData.map((item, i) => {
        return (
          <div
            key={i}
            onClick={() => toggleIndex(i)}
            className={classnames("faq_wrapper", {
              open: i === openindex,
            })}
          >
            <div className="faq_question d-flex align-items-center justify-between">
              <div className="d-flex align-items-center">
                <svg
                  className="dot"
                  width="7"
                  height="8"
                  viewBox="0 0 7 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="3.5" cy="4" r="3.5" fill="#5E666E" />
                </svg>

                <div className="mx-2">{item.question(t)}</div>
              </div>
              <svg
                className="arrow"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 9L11 13L15 9"
                  stroke="#5E666E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11 1C5.47715 1 0.999999 5.47715 0.999999 11C1 16.5228 5.47715 21 11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1Z"
                  stroke="#5E666E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="faq_answer">
              <p> {item.answer(t)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Faq;
