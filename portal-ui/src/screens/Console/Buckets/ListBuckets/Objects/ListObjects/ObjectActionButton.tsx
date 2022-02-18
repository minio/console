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
import { Button } from "@mui/material";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";

type ObjectActionButtonProps = {
  disabled?: boolean;
  onClick: () => void | any;
  icon: React.ReactNode;
  label: string;
  [x: string]: any;
};

const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: "0 15px",
      height: 22,
      margin: 0,
      color: "#5E5E5E",
      fontWeight: "normal",
      fontSize: 14,
      whiteSpace: "nowrap",
      width: "100%",
      justifyContent: "flex-start",
      "&:hover": {
        backgroundColor: "transparent",
        color: "#000",
      },
      "& .min-icon": {
        width: 11,
      },
      "&:disabled": {
        color: "#EBEBEB",
        borderColor: "#EBEBEB",
      },
    },
  });

const ObjectActionButton = ({
  disabled,
  onClick,
  icon,
  label,
  classes,
  ...restProps
}: ObjectActionButtonProps) => {
  return (
    <Button
      {...restProps}
      disabled={disabled}
      onClick={onClick}
      className={classes.root}
      startIcon={icon}
    >
      <span className={"buttonItem"}>{label}</span>
    </Button>
  );
};

export default withStyles(styles)(ObjectActionButton);
