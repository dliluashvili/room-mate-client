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
      query GetQuestionsWithAnswers($lang: Language, $getFor: QuestionsWithAnswersFor) {
        getQuestionsWithAnswers(lang: $lang, getFor: $getFor) {
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
          uiFieldInfo
          id
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

      setQuestions(response?.data?.data?.getQuestionsWithAnswers);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getFilterQuestions();
  }, [router.locale]);

  const [key, setKey] = useState(0);

  return (
    <>
      <div className="w-full lg:w-[370px] flex flex-col gap-y-6 pt-8 relative">
        <p
          onClick={() => {
            setSearch(!search),
              setFilterDataBefore([]),
              setKey((prevKey) => prevKey + 1);
            setFilterData([]);
          }}
          className="absolute top-0 right-0 hover:underline pointer hover:text-[#535050]"
        >
          Clear filters
        </p>
        {questions &&
          questions
            .sort((a, b) => {
              if (a.uiFieldInfo.filterInput.type === "numeric") return 1;
              if (b.uiFieldInfo.filterInput.type === "numeric") return -1;
              return 0;
            })
            .map((item) => (
              <div key={item.id}>
                {item.uiFieldInfo.filterInput.type === "select" && (
                  <>
                    <label className="w-full text-sm">
                      {item?.translations[0]?.title}
                    </label>
                    <Select
                      key={key}
                      styles={customStyles}
                      components={{ DropdownIndicator }}
                      className="w-full mt-2 text-sm"
                      placeholder={t("select")}
                      isMulti={
                        item.uiFieldInfo.filterInput.variant === "multiple"
                      }
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
                          if (
                            item.uiFieldInfo.filterInput.variant === "multiple"
                          ) {
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
                {item.uiFieldInfo.filterInput.type === "button" && (
                  <>
                    <label className="w-full text-sm">
                      {item?.translations[0]?.title}
                    </label>
                    <DatePickerWithRange
                      key={key}
                      filterDataBefore={filterDataBefore}
                      setFilterDataBefore={setFilterDataBefore}
                      id={item.id}
                      className="w-full mt-2"
                    />
                  </>
                )}
                {item.uiFieldInfo.filterInput.type === "numeric" && (
                  <>
                    <label className="w-full text-sm mb-4">
                      {item?.translations[0]?.title}
                    </label>
                    <Slider
                      key={key}
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
            router.push({
              pathname: router.pathname,
              query: { ...router.query, page: 1 },
            });
          }}
        >
          {t("searchBtn")}
        </Button>
      </div>
    </>
  );
}
