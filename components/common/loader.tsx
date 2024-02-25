import classNames from "classnames";
import React from "react";

type Props = {
  className?: string;
};

function Loader({ className }: Props) {
  return (
    <div className={classNames("loader_wrapper", className)}>
      <div className="loader"></div>
    </div>
  );
}

export default Loader;
