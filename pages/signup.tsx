import React from "react";
import axios from "axios";
import MultiStepCard from "../components/MultiStepCard";
import { BASE_URL_NEW } from "../services/api";

export async function getServerSideProps() {
  const query = `
  query ExampleQuery {
    getQuestions {
      id
      uiFieldInfo
      translations {
        id
        lang
        title
        
      }
      answers {
        id
        translations {
          id
          lang
          title
        }
      }
    }
    findAllCountry {
      id
      translations {
        lang
        name
        id
      }
    }
    findAllGender {
      id
      translations {
        lang
        sex
        id
      }
    }
  }
  `;

  const response = await axios.post(BASE_URL_NEW, {
    query: query,
  });

  const data = response.data;
  return { props: { data } };
}

export default function signup({ data }) {
  return (
    <>
      <MultiStepCard
        countries={data.data.findAllCountry}
        gender={data.data.findAllGender}
        questions={data.data.getQuestions}
      />
    </>
  );
}
