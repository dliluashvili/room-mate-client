import React from "react";
import classnames from "classnames";

interface Props {
  options: string[];
  active: string;
  changeHandler: (d: string) => void;
}

const index: React.FC<Props> = ({ options = [], active, changeHandler }) => {
  return (
    <div className="multiRadio">
      {options.map((el) => {
        return (
          <span
            key={el}
            className={classnames({
              active: active === el,
            })}
            onClick={() => changeHandler(el)}
          >
            {el}
          </span>
        );
      })}
    </div>
  );
};

export default index;
