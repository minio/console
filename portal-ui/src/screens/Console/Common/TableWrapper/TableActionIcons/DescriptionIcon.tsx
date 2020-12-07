import React from "react";
import { IIcon, selected, unSelected } from "./common";

const DescriptionIcon = ({ active = false }: IIcon) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 10 11.429"
    >
      <path
        fill={active ? selected : unSelected}
        d="M-43.375,11.429-48.35,8.664l-5.025,2.764V0h10Z"
        transform="translate(53.375)"
      />
    </svg>
  );
};

export default DescriptionIcon;
