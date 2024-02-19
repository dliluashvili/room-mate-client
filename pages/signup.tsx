import React from "react";
import axios from "axios";
import MultiStepCard from "../components/MultiStepCard";
import { BASE_URL_NEW } from "../services/api";
import NewHeader from "../components/NewHeader";
import NewFooter from "../components/NewFooter";

export async function getServerSideProps(searchParams) {
  const lang = String(searchParams.locale).toUpperCase();

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
        uiFieldInfo
        id
        translations {
          id
          lang
          title
        }
      }
      findAllGender {
      
        translations(lang: $lang) {
          id
          lang
          sex
        }
      }
      findAllCountry {
       
        translations(lang: $lang) {
          id
          lang
          name
        }
      }
    }
  `;

  const response = await axios.post(BASE_URL_NEW, {
    query,
    variables: {
      lang,
    },
  });

  const data = response.data;
  return { props: { data } };
}

export default function signup({ data }) {
  console.log(data.data.getQuestions);

  return (
    <>
      <NewHeader />
      <MultiStepCard
        countries={data.data.findAllCountry}
        gender={data.data.findAllGender}
        questions={data.data.getQuestions}
      />
      <NewFooter />
    </>
  );
}
