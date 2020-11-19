import React from "react";
import { IIcon, selected, unSelected } from "./common";

const DeleteIcon = ({ active = false }: IIcon) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 13 12.996"
    >
      <path
        fill={active ? selected : unSelected}
        d="M11.05 9.096v1.95h-9.1v-1.95H0v3.9h13v-3.9z"
      ></path>
      <path
        fill={active ? selected : unSelected}
        d="M6.5 9.75L9 6.672H7.475V0h-1.95v6.672H4z"
      ></path>
    </svg>
  );
};

export default DeleteIcon;
