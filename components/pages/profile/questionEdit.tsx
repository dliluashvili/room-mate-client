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
    [key: string]: any[];
  }>({});

  const router = useRouter();

  const { answeredAnswers } = useTypedSelector((state) => state.profile.user);
  const { user } = useTypedSelector((state) => state.profile);

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
      setAnswersContainer({ ...formattedAnswers, 14: [user.about_me] });
    });
  }, [answeredAnswers]);

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
    if (!questions?.length || !answeredAnswers?.length) return [];
    return [
      ...questions.map((quest) => {
        let isId = answeredAnswers.filter((el) => el.question_id === quest.id);
        if (isId.length) {
          return quest;
        }
      }),
      {
        id: 14,
        is_editable: true,
        name: "about_me",
        title: "მოკლე აღწერა შენს შესახებ",
        type: "textarea",
        // values: { 14: [user.about_me] },
      },
    ] as IQuestions[];
  };

  const handleEdit = () => {
    setLoad(true);
    Questions.updateAnswers({ answers: answersContainer })
      .then((res) => {
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
                values={answersContainer as { [key: string]: [] }}
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
