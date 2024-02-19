import React from "react";
import ProfileTab from "../../components/pages/profile/components/profileTab";

import ProfileWrapper from "../../components/pages/profile/profileWrapper";
import ResetPassword from "../../components/pages/profile/resetPsswors";

const tabs = [
  {
    label: "პროფილის რედაქტირება",
    path: "/profile/edit",
  },
  {
    label: "პაროლის შეცვლა",
    path: "/profile/resetpassword",
  },
];

function Edit(props) {
  return (
    <ProfileWrapper consumerPage={"edit"}>
      <ProfileTab tabs={tabs} />
      <ResetPassword />
    </ProfileWrapper>
  );
}

export default Edit;
