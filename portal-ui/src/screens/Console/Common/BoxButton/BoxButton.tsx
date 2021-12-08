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
import { Box, Button, ButtonProps, IconButtonProps } from "@mui/material";
import BoxIconButton from "../BoxIconButton/BoxIconButton";

interface IBoxButton extends ButtonProps {
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

export default BoxButton;
