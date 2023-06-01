import React from "react";

interface IButton {
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  className?: string;
  children: React.ReactNode;
  loading?: boolean;
  type?: "submit" | "button" | "reset";
  disabled?: boolean;
  style?: any;
}

export const Button: React.FC<IButton> = ({
  children,
  type = "submit",
  loading,
  disabled,
  ...rest
}) => {
  return (
    <button disabled={loading || disabled} type={type} {...rest}>
      {loading ? "load..." : children}
    </button>
  );
};
