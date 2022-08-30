import React, { useContext, useEffect, useState } from "react";
import { IQuestions } from "../../../../services/questions/questions.http";
import classnames from "classnames";
import { ToastContainer, toast } from "react-toastify";
import { SearchContext } from "../context/searchContext";

interface IProps {
  data: IQuestions;
  setValue?: (val: any) => void;
}

const Range: React.FC<IProps> = ({
  data: { title, searchable_title, id, search_type },
}) => {
  const [rangeValues, setRangeValues] = useState(["", ""]);

  const {
    openSearchItemId,
    setOpenSearchItemId,
    setSearchObject,
    searchObject,
  } = useContext(SearchContext);

  return (
    <div className="search_item search_item-choice ">
      <ToastContainer />
      <label>{searchable_title || title}</label>
      <div className="d-flex inputsWrapper">
        <input
          min={18}
          onChange={(e) => {
            if (Number(e.target.value) > 80) {
              toast.error("მაქსიმუმ 80 წელი", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
              return;
            }
            setRangeValues([e.target.value, rangeValues[1]]);
            console.log(rangeValues, "rangeValues");
            setSearchObject({
              question_id: id,
              type: "range",
              value: [Number(e.target.value), Number(rangeValues[1])],
            });
          }}
          value={rangeValues[0]}
          type="number"
          placeholder="დან"
        />

        <input
          max={80}
          onChange={(e) => {
            if (Number(e.target.value) > 80) {
              toast.error("მაქსიმუმ 80 წელი", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
              return;
            }
            setRangeValues([rangeValues[0], e.target.value]);
            setSearchObject({
              question_id: id,
              type: "range",
              value: [Number(rangeValues[0]), Number(e.target.value)],
            });
          }}
          value={rangeValues[1]}
          type="number"
          placeholder="მდე"
        />
      </div>
    </div>
  );
};

export default Range;
