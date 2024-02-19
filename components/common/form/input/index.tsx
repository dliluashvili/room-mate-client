import React from "react";
import classnames from "classnames";

interface IInput {
  type?: string;
  hasError?: boolean;
  className?: string;
  name?: string;
  required?: boolean;
  placeholder?: string;
  useRef?: any;
  reg?: any;
  onChange?: any;
  defaultValue?: string;
  value?: string;
  autocomplete?: any;

  //   useRef?: React.RefObject<any> | undefined | any;
}

export const Input: React.FC<IInput> = ({
  type = "input",
  hasError,
  className,
  required,
  placeholder,
  useRef,
  name,
  onChange,
  defaultValue,
  value,
  ...rest
}) => {
  return (
    <input
      {...useRef}
      // ref={useRef}
      // ref={inputRef}
      {...rest}
      required={required}
      type={type}
      name={name}
      className={classnames("form-control", className, {
        "is-invalid": hasError,
      })}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      defaultValue={defaultValue}
    />
  );
};
