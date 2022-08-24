import React from "react";

const Layout: React.FC<{ title?: string }> = ({ children }) => {
  return <div>{children}</div>;
};

export default Layout;
