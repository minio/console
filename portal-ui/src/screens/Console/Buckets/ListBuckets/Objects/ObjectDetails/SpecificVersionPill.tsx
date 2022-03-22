// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from "react";

interface ISpecificVersionPillProps {
  type: "null" | "current" | "deleted";
}

const SpecificVersionPill = ({ type }: ISpecificVersionPillProps) => {
  let bgColor = "#000";
  let message = "";

  switch (type) {
    case "null":
      bgColor = "#07193E";
      message = "NULL VERSION";
      break;
    case "deleted":
      bgColor = "#868686";
      message = "DELETED";
      break;
    default:
      bgColor = "#174551";
      message = "CURRENT VERSION";
  }

  return (
    <span
      style={{
        backgroundColor: bgColor,
        padding: "0 5px",
        display: "inline-block",
        color: "#FFF",
        fontWeight: "bold",
        fontSize: 12,
        borderRadius: 2,
        whiteSpace: "nowrap",
        margin: "0 10px",
      }}
    >
      {message}
    </span>
  );
};

export default SpecificVersionPill;
