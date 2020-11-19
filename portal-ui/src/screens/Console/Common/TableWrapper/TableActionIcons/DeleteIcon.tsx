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
      <path
        fill={active ? selected : unSelected}
        d="M6.761 1V0H3.64v1H.004v1h10.4V1zM.004 2.998l1.672 10h7.052l1.673-10zm3.412 8.243l-.552-6.478h.653l.553 6.472zm3.569 0h-.653l.551-6.472h.654z"
      />
    </svg>
  );
};

export default DeleteIcon;
