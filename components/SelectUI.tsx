import Image from "next/image";
import { components } from "react-select";
import arrow from "../public/newImages/icon-dropdown.svg";

export const DropdownIndicator = (props) => {
  return (
    components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        <Image
          src={arrow}
          style={{ transform: props.isFocused ? null : "rotate(180deg)" }}
        />
      </components.DropdownIndicator>
    )
  );
};
export const customStyles = {
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? "#c5758a" : "#828bab",
    boxShadow: state.isFocused ? "0 0 0 1px #c5758a" : "#828bab",
    padding: state.isFocused ? "8px 12px 8px 12px" : "8px 12px 8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    outline: "none",

    "&:hover": {
      borderColor: state.isFocused ? "#c5758a" : "#828bab",
    },
  }),
  DropdownIndicator,
  indicatorSeparator: (provided) => ({
    ...provided,
    display: "none",
  }),
};
