import React from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { AuthService } from "../../services/auth/auth.http";
import { ToastContainer, toast } from "react-toastify";
import { useTypedSelector } from "../hooks/useTypeSelector";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../../redux/action-creators";
import { AlertIcon } from "../svg/statusIcon";

const FbLoginButton: React.FC<{}> = ({ children }) => {
  const { user } = useTypedSelector((state) => state.profile);
  const dispatch = useDispatch();

  const responseFacebook = (res) => {
    // debugger;
    const userData = {
      accessToken: res.accessToken,
      facebookId: res.userID,
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
          progress: undefined,
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
              // debugger;
              e.preventDefault();
              renderProps.onClick();
            }}
            className="facebook_auth_social"
          >
            <img height={10} src="/imgs/facebook.svg" alt="fb" />
            <span className="me-3">{children}</span>

            <span className="pointer toltipWrapper">
              <AlertIcon stroke="#fff" fill="#fff" />
              <p>
                ჩვენი გუნდი მომდევნო 24 საათის განმავლობაში გადაამოწმებს თქვენს
                პროფილს. იმისთვის, რომ მოხდეს ანგარიშის ნამდვილობის დადასტურება,
                გთხოვთ შეხვიდეთ თქვენს Facebook პროფილზე. თუ არ გაქვს
                Facebook-ის ანგარიში, გთხოვთ დაგვიკავშირდე მეილზე -
                roommatetbilisi@gmail.com
              </p>
            </span>
          </a>
        )}
      />
    </div>
  );
};

export default FbLoginButton;
