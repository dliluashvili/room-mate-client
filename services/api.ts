// export const BASE_URL = "https://test-api.roommategeorgia.ge";
// export const BASE_URL_NEW = "https://test-api.roommategeorgia.ge/graphql";
export const BASE_URL = "http://localhost:3000";
export const BASE_URL_NEW = "http://localhost:3000/graphql";

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
