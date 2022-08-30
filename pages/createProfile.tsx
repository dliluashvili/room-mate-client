import React from "react";
import CreateProfileWrapper from "../components/createProfile";
import Header from "../components/Header";
import { SmsCheckProvider } from "../components/createProfile/createProfileContent/context/smsCheckContext";
import axios from "axios";
export async function getServerSideProps(context) {
  console.log(
    context,
    "contextcontextttttttttttttttttttttttttttttttttttttttttttttttttttttttttt"
  );
  axios.defaults.headers.common["locales"] = "outer.locale";
  return {
    props: { t: "v" }, // will be passed to the page component as props
  };
}

function createProfile(props) {
  return (
    <div>
      <Header />

      <div className="createProfile d-flex align-items-center justify-content-center">
        <SmsCheckProvider>
          <CreateProfileWrapper />
        </SmsCheckProvider>
      </div>
    </div>
  );
}

export default createProfile;
