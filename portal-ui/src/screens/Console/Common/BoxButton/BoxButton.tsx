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

import React, { Fragment } from "react";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Box, Button, ButtonProps, IconButtonProps } from "@mui/material";
import BoxIconButton from "../BoxIconButton/BoxIconButton";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: 8,
      marginLeft: 8,
      borderWidth: 1,
      borderColor: "#696969",
      color: "#696969",
      borderStyle: "solid",
      borderRadius: 3,
      "& .min-icon": {
        width: 20,
      },
      "& .MuiTouchRipple-root span": {
        backgroundColor: theme.palette.primary.main,
        borderRadius: 3,
        opacity: 0.3,
      },
      "&:disabled": {
        color: "#EBEBEB",
        borderColor: "#EBEBEB",
      },
    },
    contained: {
      borderColor: theme.palette.primary.main,
      background: theme.palette.primary.main,
      color: "white",
      "& .MuiTouchRipple-root span": {
        backgroundColor: theme.palette.primary.dark,
        borderRadius: 3,
        opacity: 0.3,
      },
      "&:hover": {
        backgroundColor: theme.palette.primary.light,
        color: "#FFF",
      },
    },
  });

interface IBoxButton extends ButtonProps {
  classes: any;
  label?: string;
}

const BoxButton = ({ classes, children, label = "", ...rest }: IBoxButton) => {
  const altRest = rest as IconButtonProps;
  return (
    <Fragment>
      <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
        <Button {...rest} endIcon={children}>
          {label}
        </Button>
      </Box>
      <Box sx={{ display: { xs: "block", sm: "block", md: "none" } }}>
        <BoxIconButton {...altRest} tooltip={label}>
          {children}
        </BoxIconButton>
      </Box>
    </Fragment>
  );
};

export default withStyles(styles)(BoxButton);
