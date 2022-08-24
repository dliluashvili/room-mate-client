export const BASE_URL = "https://roomate.herokuapp.com";
// export const STORE_API_BASE_URL = "http://127.0.0.1:8001/store";

// eslint-disable-next-line no-useless-escape
// const domain = document.domain.match(/[^\.]*\.[^.]*$/);
// const parseDomain = domain && domain.length > 0 ? domain[0] : document.domain;
// export const COOKIE_DOMAIN =
//   parseDomain === "localhost" ? parseDomain : `.${parseDomain}`;
export const axiosHeaderConfig = () => {
  return {
    headers: {
      token: `Bearer ${localStorage.getItem("token")}`,
    },
  };
};
