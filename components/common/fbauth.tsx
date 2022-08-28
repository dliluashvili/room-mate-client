import React from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { AuthService } from "../../services/auth/auth.http";
import { ToastContainer, toast } from "react-toastify";
import { useTypedSelector } from "../hooks/useTypeSelector";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../../redux/action-creators";

const FbLoginButton: React.FC<{}> = ({ children }) => {
  const { user } = useTypedSelector((state) => state.profile);
  const dispatch = useDispatch();

  const responseFacebook = (res) => {
    const userData = {
      accessToken: res.accessToken,
      facebookId: res.userID
    };

    AuthService.fbAuth(userData)
      .then((res) => {
        toast.success("წარმატებით დაუკავშირდა", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        });
        dispatch(setCurrentUser({ user: { ...user, socials: ["fb"] } }));
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="social_auth">
      <ToastContainer />

      <FacebookLogin
        appId={1116841412243862}
        isMobile={false}
        fields="name,email,picture"
        callback={responseFacebook}
        render={(renderProps) => (
          <a
            onClick={(e) => {
              e.preventDefault();
              renderProps.onClick();
            }}
            className="facebook_auth_social"
          >
            <img src="/imgs/facebook.svg" alt="fb" />
            {children}
          </a>
        )}
      />
    </div>
  );
};

export default FbLoginButton;
