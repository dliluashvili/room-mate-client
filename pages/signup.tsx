import React from "react";
import Signup from "../components/Signup";
import axios from "axios";

export async function getServerSideProps() {
  const query = `
    query FindAllCountry {
      getQuestions {
        id
        translations {
          id
          title
          lang
        }
      }
    }
  `;

  const response = await axios.post(
    "https://test-api.roommategeorgia.ge/graphql",
    {
      query: query,
    }
  );

  const questions = response.data;
  return { props: { questions } };
}

export default function signup({ questions }) {
  return <Signup questions={questions} />;
}
