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
import BoxIconButton from "../../../Common/BoxIconButton/BoxIconButton";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { IconButtonProps } from "@mui/material";

type DeleteButtonProps = {
  onClick: (e: any) => void;
  text?: string;
  disabled?: boolean;
  size?: string;
  tooltip?: string;
  classes?: any;
  icon?: React.ReactNode;
  [x: string]: any;
};

const styles = (theme: Theme) =>
  createStyles({
    root: {
      "& .min-icon": {
        width: 12,
        marginLeft: "5px",
        "@media (max-width: 900px)": {
          width: 16,
          marginLeft: 0,
        },
      },
    },
  });

const RBIconButton = ({
  onClick,
  text = "",
  disabled = false,
  tooltip,
  classes,
  icon = null,
  ...restProps
}: Partial<IconButtonProps> & DeleteButtonProps) => {
  return (
    <BoxIconButton
      classes={classes}
      tooltip={tooltip || text}
      variant="outlined"
      onClick={onClick}
      disabled={disabled}
      color="secondary"
      size="medium"
      sx={{
        border: "1px solid #f44336",
        "& span": {
          fontSize: 14,
          "@media (max-width: 900px)": {
            display: "none",
          },
        },
      }}
      {...restProps}
    >
      <span>{text}</span> {icon}
    </BoxIconButton>
  );
};
export default withStyles(styles)(RBIconButton);
