import React, { useState, useEffect } from "react";
import axios from "axios";
import MultiStepCard from "../components/MultiStepCard";
import { BASE_URL_GRAPHQL } from "../services/api";
import NewHeader from "../components/NewHeader";
import NewFooter from "../components/NewFooter";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";

export default function Signup() {
  const [data, setData] = useState(null);
  const router = useRouter();

  const [locale, setLocale] = useState(router.locale);
  let { t } = useTranslation("common") as { t: (key: string) => string };

  useEffect(() => {
    if (router.locale !== locale) {
      setLocale(router.locale);
      window.location.reload();
    }
  }, [router.locale]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lang = router.locale.toLocaleLowerCase(); // Set your desired language here
        const getGendersLang2 = router.locale.toLocaleLowerCase();
        const query = `
          query CombinedQuery($lang: Language, $getGendersLang2: Language) {
           
            getGenders(lang: $getGendersLang2) {
              id
              translations {
                id
                lang
                sex
              }
            }
            getCountries(lang: $lang){
              id
              alpha2Code
              position
              translations {
                id
                lang
                name
              }
            }
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
          }
        `;

        const response = await axios.post(BASE_URL_GRAPHQL, {
          query,
          variables: {
            lang,
            getGendersLang2,
          },
        });
        
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  console.log(data);
  return (
    <>
      <NewHeader />
      <MultiStepCard
        countries={data?.data?.getCountries}
        gender={data?.data?.getGenders}
        questions={data?.data?.getQuestions}
      />
      <NewFooter />
    </>
  );
}
