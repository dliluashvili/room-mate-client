import React from "react";
import PropTypes from "prop-types";
import { useCheckAuth } from "../../hooks/useCheckAuth";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser, logout } from "../../../redux/action-creators";
import { useTypedSelector } from "../../hooks/useTypeSelector";
import Header from "../../Header";
import Link from "next/link";
import { useRouter } from "next/router";
import Loader from "../../common/loader";
import classnames from "classnames";
import SideBar from "./components/sideBar";
import { IUserProfile } from ".../../../services/profile/profile.http";

interface IProps {
  consumerPage?: "edit" | "balance" | "profile";
  myProfile?: boolean;
  // children: React.ReactNode;
  userProfile?: IUserProfile;
}

const ProfileWrapper: React.FC<IProps> = ({
  children,
  consumerPage,
  userProfile,
  myProfile = true,
}) => {
  useCheckAuth();
  const { user } = useTypedSelector((state: any) => state.profile);
  console.log(userProfile, "userProfileuserProfile");

  const dispatch = useDispatch();
  const router = useRouter();

  const signOut = () => {
    dispatch(logout());
    // router.push("/login");
    window.location.replace("/login");
  };

  if (!user) {
    return <Loader />;
  }
  return (
    <div>
      <Header type="profile" />
      <div
        className={classnames("profile_wrapper", {
          [consumerPage]: consumerPage,
        })}
      >
        {!myProfile ? (
          <SideBar {...userProfile} myProfile={myProfile} />
        ) : (
          <SideBar {...user} signOut={signOut} myProfile={myProfile} />
        )}
        {/* <SideBar {myProfile ? {...user} : {...userProfile}  }  myProfile={myProfile} /> */}
        <div className="profile_mainContent">{children}</div>
      </div>
    </div>
  );
};

export default ProfileWrapper;
