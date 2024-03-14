// export const BASE_URL = "https://test-api.roommategeorgia.ge";
// export const BASE_URL_GRAPHQL = "https://test-api.roommategeorgia.ge/graphql";
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const BASE_URL_GRAPHQL = process.env.NEXT_PUBLIC_BASE_URL_GRAPHQL;

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
