import React from "react";

interface ICheckbox {
  label: string;
  setValue?: (v: any) => void;
  id?: any;
  selected?: boolean;
}

export const Checkbox = ({ label, setValue, id, selected }: ICheckbox) => {
  return (
    <label className="createProfile_checkboxItem">
      <div className="checkbox_wrapper">
        <input
          onChange={() => {
            setValue(id);
          }}
          readOnly
          checked={selected}
          type="checkbox"
        ></input>
        <span className="checkmark"></span>
      </div>

      <div>{label}</div>
    </label>
  );
};
