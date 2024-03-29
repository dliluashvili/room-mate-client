import React from "react";
import { useCheckAuth } from "../../hooks/useCheckAuth";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/action-creators";
import { useTypedSelector } from "../../hooks/useTypeSelector";
import Header from "../../Header";
import Loader from "../../common/loader";
import classnames from "classnames";
import SideBar from "./components/sideBar";
import { IUserProfile } from ".../../../services/profile/profile.http";

interface IProps {
  consumerPage?: "edit" | "balance" | "profile";
  myProfile?: boolean;
  userProfile?: IUserProfile;
}

const ProfileWrapper: React.FC<IProps> = ({
  children,
  consumerPage,
  userProfile,
  myProfile = true
}) => {
  useCheckAuth();
  const { user } = useTypedSelector((state: any) => state.profile);

  const dispatch = useDispatch();

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
          [consumerPage]: consumerPage
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
