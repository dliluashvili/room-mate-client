import React from "react";
import CreateProfileWrapper from "../components/createProfile";
import Header from "../components/Header";
import { SmsCheckProvider } from "../components/createProfile/createProfileContent/context/smsCheckContext";

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
