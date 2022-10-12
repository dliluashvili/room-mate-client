import { useContext } from "react";
import { HouseSearchContext } from "./houseSearchContext";
import React from "react";

const Checkbox = ({ title, name }) => {
  const { searchObject, setSearchObject } = useContext(HouseSearchContext);
  return (
    <div key={"el.id"}>
      <label className="d-flex checkbox_wrapper pointer checkbox_wrapper-search">
        <div className="checkbox_item ">
          <input
            onChange={
              () => {
                setSearchObject({
                  [name]: searchObject[name] === 1 ? 0 : 1,
                });
              }
              //   setSearchObject({
              //     ...el,
              //     is_multiple: data.is_multiple,
              //   })
            }
            checked={!!searchObject[name]}
            type="checkbox"
          />
          <span className="checkmark"></span>
        </div>
        <div className=""> {title} </div>
      </label>
    </div>
  );
};

export default Checkbox;
