// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
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
import { Link } from "react-router-dom";
import { createStyles, withStyles } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";
import ViewIcon from "./TableActionIcons/ViewIcon";
import ShareIcon from "./TableActionIcons/ShareIcon";
import CloudIcon from "./TableActionIcons/CloudIcon";
import ConsoleIcon from "./TableActionIcons/ConsoleIcon";
import DownloadIcon from "./TableActionIcons/DownloadIcon";
import DisableIcon from "./TableActionIcons/DisableIcon";
import FormatDriveIcon from "./TableActionIcons/FormatDriveIcon";
import EditIcon from "../../../../icons/EditIcon";
import TrashIcon from "../../../../icons/TrashIcon";
import { IAMPoliciesIcon } from "../../../../icons";

const styles = () =>
  createStyles({
    spacing: {
      margin: "0 8px",
    },
    buttonDisabled: {
      "&.MuiButtonBase-root.Mui-disabled": {
        cursor: "not-allowed",
        filter: "grayscale(100%)",
        opacity: "30%",
      },
    },
  });

interface IActionButton {
  type: string;
  onClick?: (id: string) => any;
  to?: string;
  valueToSend: any;
  selected: boolean;
  sendOnlyId?: boolean;
  idField: string;
  disabled: boolean;
  classes: any;
}

const defineIcon = (type: string, selected: boolean) => {
  switch (type) {
    case "view":
      return <ViewIcon active={selected} />;
    case "edit":
      return <EditIcon width={16} active={selected} />;
    case "delete":
      return <TrashIcon width={16} active={selected} />;
    case "description":
      return <IAMPoliciesIcon width={16} active={selected} />;
    case "share":
      return <ShareIcon active={selected} />;
    case "cloud":
      return <CloudIcon active={selected} />;
    case "console":
      return <ConsoleIcon active={selected} />;
    case "download":
      return <DownloadIcon active={selected} />;
    case "disable":
      return <DisableIcon active={selected} />;
    case "format":
      return <FormatDriveIcon active={selected} />;
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
  disabled = false,
  classes,
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
              if (!disabled) {
                onClick(valueClick);
              } else {
                e.preventDefault();
              }
            }
          : () => null
      }
      className={`${classes.spacing} ${disabled ? classes.buttonDisabled : ""}`}
      disabled={disabled}
    >
      {defineIcon(type, selected)}
    </IconButton>
  );

  if (onClick) {
    return buttonElement;
  }

  if (isString(to)) {
    if (!disabled) {
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

    return buttonElement;
  }

  return null;
};

export default withStyles(styles)(TableActionButton);
