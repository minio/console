import React from "react";
import { IIcon, selected, unSelected } from "./common";

const ViewIcon = ({ active = false }: IIcon) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 11.856"
    >
      <path
        fill={active ? selected : unSelected}
        d="M-54,8l1.764,2.614A7.52,7.52,0,0,0-46,13.928h0a7.52,7.52,0,0,0,6.234-3.314L-38,8l-1.764-2.614A7.52,7.52,0,0,0-46,2.072h0a7.52,7.52,0,0,0-6.234,3.314Zm10.286,0A2.285,2.285,0,0,1-46,10.286,2.285,2.285,0,0,1-48.286,8,2.285,2.285,0,0,1-46,5.714,2.285,2.285,0,0,1-43.714,8Zm1.3,0A3.59,3.59,0,0,1-46,11.59,3.59,3.59,0,0,1-49.59,8,3.59,3.59,0,0,1-46,4.41,3.59,3.59,0,0,1-42.41,8Z"
        transform="translate(54 -2.072)"
      />
    </svg>
  );
};

export default ViewIcon;
