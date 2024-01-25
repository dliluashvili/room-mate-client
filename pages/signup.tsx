import React from "react";
import axios from "axios";
import SignupFirst from "../components/SignupFirst";
import SignupSecond from "../components/SignupSecond";

export async function getServerSideProps() {
  const query = `
  query ExampleQuery {
    getQuestions {
      id
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

  const response = await axios.post(
    "https://test-api.roommategeorgia.ge/graphql",
    {
      query: query,
    }
  );

  const data = response.data;
  return { props: { data } };
}

export default function signup({ data }) {
  return (
    <>
      <SignupFirst
        countries={data.data.findAllCountry}
        gender={data.data.findAllGender}
      />
      <SignupSecond questions={data.data.getQuestions} />
    </>
  );
}
