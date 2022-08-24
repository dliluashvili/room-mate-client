import axios from "axios";
import { Dispatch } from "redux";
import { EActionTypes } from "../action-types";
import { TActions } from "../actions";
import Router from "next/router";
import { setAuthorizationToken } from "../../services/axios-with-token";

export const setCurrentUser = (user: any) => {
  // Router.push("/profile");
  // debugger;
  if (user?.token) {
    window.localStorage.setItem("token", user.token);
    setAuthorizationToken(user.token);
  } else {
    if (window.localStorage.getItem("token"))
      setAuthorizationToken(window.localStorage.getItem("token"));
  }
  if (user.user) {
    window.localStorage.setItem("user", JSON.stringify(user.user));
    return {
      type: EActionTypes.SET_USER_ACTION,
      payload: { ...user.user },
    };
  } else {
    return {
      type: EActionTypes.SET_USER_ACTION,
      payload: null,
    };
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  return {
    type: EActionTypes.LOGOUT,
    payload: null,
  };
};
