import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Questions,
  IQuestions,
} from "../../../services/questions/questions.http";
import { useTypedSelector } from "../../hooks/useTypeSelector";
import { IUserProfile } from "../../../services/profile/profile.http";

interface IProps {
  userProfile: IUserProfile;
}

const QuestionPreview: React.FC<IProps> = ({
  userProfile: { answeredAnswers },
}) => {
  const [questions, setQuestions] = useState<IQuestions[] | null>(null);

  useEffect(() => {
    Questions.getQuestions()
      .then((res) => {
        setQuestions(res.data);
        console.log(res.data);
        res.data;
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const answers = () => {
    // debugger;
    if (!questions?.length || !answeredAnswers?.length) return [];
    return questions.map((quest) => {
      let isId = answeredAnswers.filter((el) => el.question_id === quest.id);
      // if(answeredAnswers.includes() quest.id)
      // debugger;
      console.log(isId, "isId");
      if (isId.length) {
        return {
          ...quest,
          answers: quest.answers.filter((ans) => {
            // console.log(
            //   answeredAnswers.filter((ans2) => ans2.answer_id === ans.id),
            //   "answeredAnswers.filter((ans2) => ans2.answer_id === ans.id).length"
            // );
            if (
              answeredAnswers.filter((ans2) => ans2.answer_id === ans.id).length
            ) {
              return true;
            }
            return false;
          }),
        };
      }
    });
  };

  // console.log(questions, "pppppppppppp");
  // console.log(answeredAnswers, "answeredAnswerspppppppppppp");
  // console.log(answers().filter(Boolean), "xxxxxxxxxxxxxxxxxxx");

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
