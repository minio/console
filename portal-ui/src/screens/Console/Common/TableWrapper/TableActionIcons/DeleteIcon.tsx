import React from "react";
import { IIcon, selected, unSelected } from "./common";

const DeleteIcon = ({ active = false }: IIcon) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
    >
      <g transform="translate(-1225 -657)">
        <path
          fill={active ? selected : unSelected}
          d="M0,8H0a8,8,0,0,0,8,8H8a8,8,0,0,0,8-8h0A8,8,0,0,0,8,0H8A8,8,0,0,0,0,8Zm10.007,3.489L8,9.482,5.993,11.489,4.511,10.007,6.518,8,4.511,5.993,5.993,4.511,8,6.518l2.007-2.007,1.482,1.482L9.482,8l2.007,2.007Z"
          transform="translate(1225 657)"
        />
      </g>
    </svg>
  );
};

export default DeleteIcon;
