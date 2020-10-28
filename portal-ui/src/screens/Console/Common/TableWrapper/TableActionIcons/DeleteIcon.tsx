import React from "react";
import { IIcon, selected, unSelected } from "./common";

const DeleteIcon = ({ active = false }: IIcon) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 10.402 13"
    >
      <g transform="translate(0.004 -28.959)">
        <path
          fill={active ? selected : unSelected}
          d="M6.757,29.959v-1H3.636v1H0v1H10.4v-1Z"
        />
        <path
          fill={active ? selected : unSelected}
          d="M0,31.957l1.672,10H8.724l1.673-10ZM3.412,40.2,2.86,33.722h.653l.553,6.472Zm3.569,0H6.328l.551-6.472h.654Z"
          transform="translate(0 0)"
        />
      </g>
    </svg>
  );
};

export default DeleteIcon;
