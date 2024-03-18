import { useRouter } from "next/router";
import { useEffect } from "react";

const withAuth = (WrappedComponent, redirectTo = "/") => {
  return (props) => {
    // checks whether we are on client / browser or server.
    if (typeof window !== "undefined") {
      const Router = useRouter();

      const token = localStorage.getItem("token");

      // If there is an access token we redirect to "/" page.
      if (token) {
        Router.replace(redirectTo);
        return null;
      }

      // If this condition is true, that means the user is not authenticated and hence we return the original component
      return <WrappedComponent {...props} />;
    }

    // If we are on server, return original component. Server-side rendering does not have access to window
    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
