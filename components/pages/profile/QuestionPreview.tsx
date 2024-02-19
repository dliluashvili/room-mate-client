import React, { useEffect, useState } from 'react';

const QuestionPreview = ({ userProfile: { answeredQuestions } }: any) => {
    const [structuredAnsweredQuestions, setStructuredAnsweredQuestions] =
        useState<any[]>([]);

    const structureAnsweredQuestions = (answeredQuestions) => {
        let transformedAnsweredQuestions = [];

        answeredQuestions.forEach((answeredQuestion) => {
            let transformedAnsweredQuestion = transformedAnsweredQuestions.find(
                (answeredQuestionItem) =>
                    answeredQuestionItem.questionId ===
                    answeredQuestion.question.id
            );

            const answerTranslations = answeredQuestion.answer?.translations;
            const questionTranslations = answeredQuestion.question.translations;

            if (!transformedAnsweredQuestion) {
                let result = {
                    question: '',
                    answers: [],
                    questionId: answeredQuestion.question.id,
                };

                if (questionTranslations.length) {
                    result = {
                        ...result,
                        question: questionTranslations[0].title,
                    };
                }

                if (answerTranslations?.length) {
                    result = {
                        ...result,
                        answers: [answerTranslations[0].title],
                    };
                } else if (answeredQuestion.data) {
                    result = {
                        ...result,
                        answers: [answeredQuestion.data],
                    };
                }

                transformedAnsweredQuestions.push(result);
            } else {
                if (answerTranslations?.length) {
                    transformedAnsweredQuestion = {
                        ...transformedAnsweredQuestion,
                        answers: [
                            ...transformedAnsweredQuestion.answers,
                            answerTranslations[0].title,
                        ],
                    };
                } else if (answeredQuestion.data) {
                    transformedAnsweredQuestion = {
                        ...transformedAnsweredQuestion,
                        answers: [
                            ...transformedAnsweredQuestion.answers,
                            answeredQuestion.data,
                        ],
                    };
                }

                transformedAnsweredQuestions = transformedAnsweredQuestions.map(
                    (answeredQuestionItem) => {
                        if (
                            answeredQuestionItem.questionId ===
                            answeredQuestion.question.id
                        ) {
                            return transformedAnsweredQuestion;
                        }

                        return answeredQuestionItem;
                    }
                );
            }
        });

        const sortedTransformedAnsweredQuestions =
            transformedAnsweredQuestions.sort(
                (a, b) => a.questionId - b.questionId
            );
        setStructuredAnsweredQuestions(sortedTransformedAnsweredQuestions);
    };

    useEffect(() => {
        structureAnsweredQuestions(answeredQuestions);
    }, [answeredQuestions]);

    return (
        <div className="mt-3 answersPreview_wrapper">
            {structuredAnsweredQuestions.map((answeredQuestion, index) => {
                return (
                    <div
                        key={index}
                        className="answersPreview"
                    >
                        <h2>{answeredQuestion.question}</h2>
                        {answeredQuestion.answers.map((answer, index) => {
                            return (
                                <label
                                    key={index}
                                    className="createProfile_checkboxItem d-block mb-3"
                                >
                                    {answer}
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
