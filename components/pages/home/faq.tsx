import React, { useState } from "react";
import classnames from "classnames";

const faqData = [
  {
    question: "რა ღირს პლატფორმის გამოყენება?",
    answer:
      "პლატფორმის ერთთვიანი პაკეტის ღირებულება 30 ლარს შეადგენს, ხოლო პარტნიორი უნივერსტეტების სტუდენტებისთვის 10 ლარს.",
  },
  {
    question: "ვისთვის არის პლატფორმა?",
    answer: "ნებისმიერი ადამიანისთვის, ვინც ეძებს ოთახის მეზობელს.",
  },
  {
    question: "რამდენად დაცულია პლატფორმა ყალბი ექაუნთებისგან?",
    answer: (
      <>
        <p className="pl-0 pb-0">
          - ყალბი ექაუნთები დიდ გამოწვევას წარმოადგენს, სწორედ ამიტომ
          პლატფორმაზე პროფილი დადასტურებამდე, მოხდება მისი გადამოწმება
          Roommategeorgia-ს გუნდის მიერ;
        </p>
        <p className="pl-0 ">
          - გარდა ამისა პროფილის შექმნის მომენტში მომხმარებელს შეეძლება თავის
          პროფილი დაფაროს მისთვის არასასურველი ჯგუფისგან.
        </p>
      </>
    ),
  },
  {
    question: "პირადი მონაცემები რამდენად დაცულია? ",
    answer:
      "ჩვენი პლატფორმა უზრუნველყოფს პირადი მონაცემების მაქსიმალურ დაცულობას. თქვენ თავად განსაზღვრავთ ვისთვის იყოს თქვენი საკონტაქტო მონაცემები ხელმისაწვდომი. ",
  },
];

function Faq() {
  const [openindex, setOpenIndex] = useState<null | number>(null);

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

                <div className="mx-2">{item.question}</div>
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
              <p>{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Faq;
