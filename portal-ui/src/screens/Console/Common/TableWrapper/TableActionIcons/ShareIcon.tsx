import React from "react";
import { IIcon, selected, unSelected } from "./common";

const ShareIcon = ({ active = false }: IIcon) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 13 13"
    >
      <path
        fill={active ? selected : unSelected}
        d="M11.05 8.617v2.429h-9.1v-9.1h2.429v-1.95H0v13h13V8.617z"
        className="a"
      ></path>
      <path
        fill={active ? selected : unSelected}
        d="M3.854 9.256h1.95a4.945 4.945 0 013.6-4.74v1.3l.6-.487 2.474-2.012L9.4.817v1.7a6.9 6.9 0 00-5.546 6.739z"
        className="a"
      ></path>
    </svg>
  );
};

export default ShareIcon;
