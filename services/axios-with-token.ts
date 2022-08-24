import axios from "axios";

const axiosWithToken = axios.create();
// Add a response interceptor

export const setAuthorizationToken = (token: string) => {
  // axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  axiosWithToken.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export { axiosWithToken };
