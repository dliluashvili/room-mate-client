import React, { useEffect, useState } from "react";
import { DatePickerWithRange } from "./DateRange";
import Select from "react-select";
import { customStyles, DropdownIndicator } from "./SelectUI";
import axios from "axios";
import { BASE_URL_GRAPHQL } from "../services/api";
import { useRouter } from "next/router";

import { Slider } from "../@/components/ui/slider";
import { Button } from "../@/components/ui/button";
import useTranslation from "next-translate/useTranslation";

export default function UserFilter({
  setFilterData,

  setSearch,
  search,

  setShowFilter,
}) {
  const router = useRouter();
  const [questions, setQuestions] = useState(null);
  let { t } = useTranslation("common") as { t: (key: string) => string };
  const [filterDataBefore, setFilterDataBefore] = useState([]);

  const getFilterQuestions = async () => {
    try {
      const query = `
            query GetQuestions($getFor: QuestionsWithAnswersFor, $lang: Language) {
                getQuestions(getFor: $getFor, lang: $lang) {
                    id
                    uiFieldInfo
                    translations {
                        id
                        lang
                        title
                    }
                    answers {
                        id
                        questionId
                        translations {
                          id
                          lang
                          title
                        }
                      }
                }
            }
        `;

      const response = await axios.post(BASE_URL_GRAPHQL, {
        query,
        variables: {
          lang: router.locale === "en" ? "en" : "ka",
          getFor: "FILTER",
        },
      });

      setQuestions(response?.data?.data?.getQuestions);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getFilterQuestions();
  }, [router.locale]);

  return (
    <>
      <div className="w-full lg:w-[370px] flex flex-col gap-y-6">
        {questions &&
          questions
            .sort((a, b) => {
              if (a.uiFieldInfo.input.type === "numeric") return 1;
              if (b.uiFieldInfo.input.type === "numeric") return -1;
              return 0;
            })
            .map((item) => (
              <div key={item.id}>
                {item.uiFieldInfo.input.type === "select" && (
                  <>
                    <label className="w-full text-sm">
                      {item?.translations[0]?.title}
                    </label>
                    <Select
                      styles={customStyles}
                      components={{ DropdownIndicator }}
                      className="w-full mt-2 text-sm"
                      placeholder={t("select")}
                      isMulti={item.uiFieldInfo.input.variant === "multiple"}
                      options={item.answers.map((answer) => ({
                        questionId: item.id,
                        value: answer.id,
                        label: answer.translations[0].title,
                      }))}
                      onChange={(value: any) => {
                        setFilterDataBefore((prevFilterData) => {
                          const newFilterData = [...prevFilterData];
                          const existingIndex = newFilterData.findIndex(
                            (item) => item.questionId === value.questionId
                          );
                          if (item.uiFieldInfo.input.variant === "multiple") {
                            if (existingIndex !== -1) {
                              const existingAnswerIndex = newFilterData[
                                existingIndex
                              ].answerIds.findIndex((id) => id === value.value);
                              if (existingAnswerIndex !== -1) {
                                newFilterData[existingIndex].answerIds.splice(
                                  existingAnswerIndex,
                                  1
                                );
                              } else {
                                newFilterData[existingIndex].answerIds.push(
                                  value.value
                                );
                              }
                            } else {
                              newFilterData.push({
                                questionId: value.questionId,
                                answerIds: [value.value],
                              });
                            }
                          } else {
                            if (existingIndex !== -1) {
                              newFilterData[existingIndex].answerIds = [
                                value.value,
                              ];
                            } else {
                              newFilterData.push({
                                questionId: value.questionId,
                                answerIds: [value.value],
                              });
                            }
                          }
                          return newFilterData;
                        });
                      }}
                    />
                  </>
                )}
                {item.uiFieldInfo.input.type === "button" && (
                  <>
                    <label className="w-full text-sm">
                      {item?.translations[0]?.title}
                    </label>
                    <DatePickerWithRange
                      filterDataBefore={filterDataBefore}
                      setFilterDataBefore={setFilterDataBefore}
                      id={item.id}
                      className="w-full mt-2"
                    />
                  </>
                )}
                {item.uiFieldInfo.input.type === "numeric" && (
                  <>
                    <label className="w-full text-sm mb-4">
                      {item?.translations[0]?.title}
                    </label>
                    <Slider
                      id={item.id}
                      filterDataBefore={filterDataBefore}
                      setFilterDataBefore={setFilterDataBefore}
                    />
                  </>
                )}
              </div>
            ))}
        <Button
          variant="default"
          className="mt-6 "
          onClick={() => {
            setSearch(!search);
            setShowFilter(false);
            setFilterData(filterDataBefore);
          }}
        >
          {t("searchBtn")}
        </Button>
      </div>
    </>
  );
}
