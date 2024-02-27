import React, { useState, useEffect } from "react";
import axios from "axios";
import MultiStepCard from "../components/MultiStepCard";
import { BASE_URL_GRAPHQL } from "../services/api";
import NewHeader from "../components/NewHeader";
import NewFooter from "../components/NewFooter";
import { useRouter } from "next/router";

export default function Signup() {
  const [data, setData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lang = router.locale.toLocaleUpperCase(); // Set your desired language here

        const query = `
          query CombinedQuery($lang: LangEnum) {
            getQuestions(lang: $lang) {
              answers {
                id
                questionId
                translations {
                  id
                  lang
                  title
                }
              }
              position
              uiFieldInfo
              id
              translations {
                id
                lang
                title
              }
            }
            findAllGender {
              id
              translations(lang: $lang) {
                id
                lang
                sex
              }
            }
            findAllCountry {
              id
              alpha2Code
              position
              translations(lang: $lang) {
                id
                lang
                name
              }
            }
          }
        `;

        const response = await axios.post(BASE_URL_GRAPHQL, {
          query,
          variables: {
            lang,
          },
        });

        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
 
  return (
    <>
      <NewHeader />
      <MultiStepCard
        countries={data?.data?.findAllCountry}
        gender={data?.data?.findAllGender}
        questions={data?.data?.getQuestions}
      />
      <NewFooter />
    </>
  );
}
