import React from "react";

export const AlertIcon = ({
  fill,
  stroke,
  className = "",
}: {
  fill?: string;
  stroke?: string;
  className?: string;
}) => {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 19 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="9.5" cy="9.5" r="9" stroke={stroke ? stroke : "#5E666E"} />
      <path
        d="M8.375 7.08594V4.54688H10.1172V7.08594L9.71094 13.1562H8.80469L8.375 7.08594ZM8.4375 16V14.3984H10.0547V16H8.4375Z"
        fill={fill ? fill : "#5E666E"}
        // stroke={fill ? fill : "#5E666E"}
      />
    </svg>
  );
};

export const CheckIcon = ({ className = "" }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="10" cy="10" r="10" fill="#19A463" />
      <path
        d="M15.1724 6.20679L7.58622 13.793L4.13794 10.3447"
        stroke="#E2EEED"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
