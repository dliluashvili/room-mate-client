import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import ProfileWrapper from "../../components/pages/profile/profileWrapper";
import {
  ProfileService,
  IUserProfile,
} from "../../services/profile/profile.http";
import QuestionPreview from "../../components/pages/profile/QuestionPreview";

const UserId = () => {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<IUserProfile | null>(null);
  ///
  console.log(router, "rrrrrrrrrrr");
  useEffect(() => {
    ProfileService.getUserById(router.query.userId as string)
      .then((res) => {
        // console.log(res);
        setUserProfile(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  ///
  return (
    <div className="profile">
      {/* <Header /> */}

      <ProfileWrapper myProfile={false} userProfile={userProfile}>
        {userProfile ? <QuestionPreview userProfile={userProfile} /> : null}
      </ProfileWrapper>
    </div>
  );
};

export default UserId;
