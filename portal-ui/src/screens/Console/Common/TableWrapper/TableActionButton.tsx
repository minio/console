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
import { IconButton } from "@material-ui/core";
import ViewIcon from "./TableActionIcons/ViewIcon";
import PencilIcon from "./TableActionIcons/PencilIcon";
import DeleteIcon from "./TableActionIcons/DeleteIcon";

interface IActionButton {
  type: string;
  onClick: (id: string) => any;
  valueToSend: any;
  selected: boolean;
}

const defineIcon = (type: string, selected: boolean) => {
  switch (type) {
    case "view":
      return <ViewIcon active={selected} />;
    case "edit":
      return <PencilIcon active={selected} />;
    case "delete":
      return <DeleteIcon active={selected} />;
  }

  return null;
};

const TableActionButton = ({
  type,
  onClick,
  valueToSend,
  selected
}: IActionButton) => {
  return (
    <IconButton
      aria-label={type}
      onClick={() => {
        onClick(valueToSend);
      }}
    >
      {defineIcon(type, selected)}
    </IconButton>
  );
};

export default TableActionButton;
