import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Questions,
  IQuestions
} from "../../../services/questions/questions.http";
import { useTypedSelector } from "../../hooks/useTypeSelector";
import { IUserProfile } from "../../../services/profile/profile.http";
import { useRouter } from "next/router";

interface IProps {
  userProfile: IUserProfile;
}

const QuestionPreview: React.FC<IProps> = ({
  userProfile: { answeredAnswers }
}) => {
  const [questions, setQuestions] = useState<IQuestions[] | null>(null);
  const router = useRouter();
  useEffect(() => {
    Questions.getQuestions({ lang: router.locale })
      .then((res) => {
        setQuestions(res.data);
        res.data;
      })
      .catch((e) => {
        console.log(e);
      });
  }, [router.locale]);

  const answers = () => {
    // debugger;
    if (!questions?.length || !answeredAnswers?.length) return [];
    return questions.map((quest) => {
      let isId = answeredAnswers.filter((el) => el.question_id === quest.id);
      if (isId.length) {
        return {
          ...quest,
          answers: quest.answers.filter((ans) => {
            if (
              answeredAnswers.filter((ans2) => ans2.answer_id === ans.id).length
            ) {
              return true;
            }
            return false;
          })
        };
      }
    });
  };

  return (
    <div className="mt-3 answersPreview_wrapper">
      {answers()
        .filter(Boolean)
        .map((el, i) => {
          return (
            <div key={i} className="answersPreview">
              <h2>{el.title}</h2>
              {el.answers.map((ans, ind) => {
                return (
                  <label
                    key={ind}
                    className="createProfile_checkboxItem d-block mb-3"
                  >
                    {ans.title}
                  </label>
                );
              })}
            </div>
          );
        })}
    </div>
  );
};

export default QuestionPreview;
