import { axiosHeaderConfig } from "../api";
import { axiosWithToken } from "../axios-with-token";
import axios from "axios";
import { backEndRoutes } from "../backend-routes";

class _AuthService {
  login = (data: any) => {
    return axios.post(backEndRoutes.auth.login(), data);
  };
  register = (data: any) => {
    return axios.post(backEndRoutes.auth.register(), data);
  };

  fbAuth = (data: { facebookId: string; accessToken: string }) => {
    return axiosWithToken.post(backEndRoutes.auth.fbAuth(), data);
  };

  sendResetCode = (phone: string) => {
    return axios.post(backEndRoutes.auth.password.sendCode(), { phone });
  };
  passwordRecover = (data: { code: any; password: string; phone: string }) => {
    return axios.post(backEndRoutes.auth.password.recover(), data);
  };

  passwordReset = (data: {
    current_password: string;
    password: string;
    confirm_password: string;
  }) => {
    return axiosWithToken.post(backEndRoutes.auth.password.reset(), data);
  };
}

export const AuthService = new _AuthService();
