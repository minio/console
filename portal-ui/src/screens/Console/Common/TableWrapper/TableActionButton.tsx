// This file is part of MinIO Console Server
// Copyright (c) 2020 MinIO, Inc.
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
import isString from "lodash/isString";
import { IconButton } from "@material-ui/core";
import ViewIcon from "./TableActionIcons/ViewIcon";
import PencilIcon from "./TableActionIcons/PencilIcon";
import DeleteIcon from "./TableActionIcons/DeleteIcon";
import DescriptionIcon from "./TableActionIcons/DescriptionIcon";
import CloudIcon from "./TableActionIcons/CloudIcon";
import ConsoleIcon from "./TableActionIcons/ConsoleIcon";
import { Link } from "react-router-dom";

interface IActionButton {
  type: string;
  onClick?: (id: string) => any;
  to?: string;
  valueToSend: any;
  selected: boolean;
  sendOnlyId?: boolean;
  idField: string;
}

const defineIcon = (type: string, selected: boolean) => {
  switch (type) {
    case "view":
      return <ViewIcon active={selected} />;
    case "edit":
      return <PencilIcon active={selected} />;
    case "delete":
      return <DeleteIcon active={selected} />;
    case "description":
      return <DescriptionIcon active={selected} />;
    case "cloud":
      return <CloudIcon active={selected} />;
    case "console":
      return <ConsoleIcon active={selected} />;
  }

  return null;
};

const TableActionButton = ({
  type,
  onClick,
  valueToSend,
  idField,
  selected,
  to,
  sendOnlyId = false,
}: IActionButton) => {
  const valueClick = sendOnlyId ? valueToSend[idField] : valueToSend;

  const buttonElement = (
    <IconButton
      aria-label={type}
      size={"small"}
      onClick={
        onClick
          ? (e) => {
              e.stopPropagation();
              onClick(valueClick);
            }
          : () => null
      }
    >
      {defineIcon(type, selected)}
    </IconButton>
  );

  if (onClick) {
    return buttonElement;
  }

  if (isString(to)) {
    return (
      <Link
        to={`${to}/${valueClick}`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {buttonElement}
      </Link>
    );
  }

  return null;
};

export default TableActionButton;
