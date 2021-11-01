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
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { IconButton, IconButtonProps } from "@mui/material";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: 8,
      marginLeft: 14,
      borderWidth: 1,
      borderColor: theme.palette.primary.main,
      borderStyle: "solid",
      borderRadius: 3,
      "& .MuiSvgIcon-root": {
        fontSize: 20,
      },
      "& .MuiTouchRipple-root span": {
        backgroundColor: theme.palette.primary.main,
        borderRadius: 3,
        opacity: 0.3,
      },
    },
  });

interface IBoxIconButton extends IconButtonProps {
  classes: any;
  children: any;
}

const BoxIconButton = ({ classes, children, ...rest }: IBoxIconButton) => {
  return (
    <IconButton {...rest} className={classes.root}>
      {children}
    </IconButton>
  );
};

export default withStyles(styles)(BoxIconButton);
