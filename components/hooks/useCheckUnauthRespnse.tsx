import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/action-creators";

export const useCheckUnAuthResponse = () => {
  const dispatch = useDispatch();

  return () => {
    dispatch(logout());
    window.location.replace("/login");
  };
};
