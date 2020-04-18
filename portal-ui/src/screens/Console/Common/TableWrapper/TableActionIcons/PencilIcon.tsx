import React from "react";
import { IIcon, selected, unSelected } from "./common";

const PencilIcon = ({ active = false }: IIcon) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 13.833 13.833"
    >
      <path
        fill={active ? selected : unSelected}
        d="M2.934,16H0V13.066L10.607,2.459a1,1,0,0,1,1.414,0l1.52,1.52a1,1,0,0,1,0,1.414Z"
        transform="translate(0 -2.167)"
      />
    </svg>
  );
};

export default PencilIcon;
