import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Questions,
  IQuestions,
} from "../../../services/questions/questions.http";
import { useTypedSelector } from "../../hooks/useTypeSelector";
import CreateProfileContent from "../../createProfile/createProfileContent";
import { Button } from "../../common/form";
import { setCurrentUser } from "../../../redux/action-creators/index";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { Router, useRouter } from "next/router";

const QuestionEdit = () => {
  const [questions, setQuestions] = useState<IQuestions[] | null>(null);
  const [load, setLoad] = useState(false);
  const [answersContainer, setAnswersContainer] = useState<{
    [key: string]: [];
  }>({});

  const router = useRouter();

  const { answeredAnswers } = useTypedSelector((state) => state.profile.user);

  const dispatch = useDispatch();

  useEffect(() => {
    let formattedAnswers: {
      [key: string]: [];
    } = {};
    answeredAnswers.map((el) => {
      if (!formattedAnswers[el.question_id]) {
        formattedAnswers = {
          ...formattedAnswers,
          [el.question_id]: [el.answer_id],
        };
      } else {
        formattedAnswers = {
          ...formattedAnswers,
          [el.question_id]: [...formattedAnswers[el.question_id], el.answer_id],
        };
      }
      setAnswersContainer(formattedAnswers);
    });
  }, [answeredAnswers]);

  useEffect(() => {
    Questions.getQuestions({ lang: router.locale })
      .then((res) => {
        setQuestions(res.data);
        console.log(res.data);
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
      // if(answeredAnswers.includes() quest.id)
      // debugger;
      console.log(isId, "isId");
      if (isId.length) {
        return quest;
      }
    });
  };

  // console.log(questions, "pppppppppppp");
  // console.log(answeredAnswers, "answeredAnswerspppppppppppp");
  // console.log(answers().filter(Boolean), "xxxxxxxxxxxxxxxxxxx");

  const handleEdit = () => {
    setLoad(true);
    console.log(answersContainer);
    Questions.updateAnswers({ answers: answersContainer })
      .then((res) => {
        console.log(res.data);

        dispatch(setCurrentUser({ user: res.data }));
        setLoad(false);
        toast.success("წარმატებით განახლდა", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch((err) => {
        setLoad(false);

        console.log(err);
      });
  };

  return (
    <div className="mt-3">
      <ToastContainer />
      {/* <button onClick={handleEdit}>edit</button> */}
      {answers()
        .filter(Boolean)
        .map((question, i) => {
          if (!question.is_editable) return;
          return (
            <div key={i} className="answersPreview">
              <CreateProfileContent
                setData={(data) => {
                  setAnswersContainer({
                    ...answersContainer,
                    [data.question_id]: [...data.value],
                  });
                }}
                data={question}
                values={answersContainer}
              />
            </div>
          );
        })}

      <div className="py-3 pb-5 text-right w-100 mb-5 d-flex justify-content-end">
        <Button onClick={handleEdit} loading={load} className="btn btn-primary">
          შენახვა
        </Button>
      </div>
    </div>
  );
};

export default QuestionEdit;
