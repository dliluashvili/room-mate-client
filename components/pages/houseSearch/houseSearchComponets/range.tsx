import React, { useContext, useState } from "react";
import { ToastContainer } from "react-toastify";
import { HouseSearchContext } from "./houseSearchContext";

interface IProps {
  data: {
    title: string;
    name: string;
  };
  setValue?: (val: any) => void;
}

const Range: React.FC<IProps> = ({ data: { title, name } }) => {
  const [rangeValues, setRangeValues] = useState(["", ""]);

  const {
    openSearchItemId,
    setOpenSearchItemId,
    setSearchObject,
    searchObject,
  } = useContext(HouseSearchContext);

  return (
    <div className="search_item search_item-choice ">
      <ToastContainer />
      <label>{title}</label>
      <div className="d-flex inputsWrapper">
        <input
          min="0"
          step="1"
          onChange={(e) => {
            setSearchObject({
              [`${name}_from`]: e.target.value,
            });
          }}
          value={searchObject[`${name}_from`]}
          type="number"
          placeholder="დან"
        />

        <input
          onChange={(e) => {
            setSearchObject({
              [`${name}_to`]: e.target.value,
            });
          }}
          value={searchObject[`${name}_to`]}
          type="number"
          placeholder="მდე"
        />
      </div>
    </div>
  );
};

export default Range;
