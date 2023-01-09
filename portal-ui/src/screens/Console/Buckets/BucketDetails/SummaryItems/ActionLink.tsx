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
import { Loader } from "mds";

type ActionLinkProps = {
  isLoading: boolean;
  onClick: () => void;
  classes?: any;
  label: any;
  [x: string]: any;
};

// TODO: Create an mds version of this.
const ActionLink = ({
  isLoading,
  onClick,
  label,
  ...restProps
}: ActionLinkProps) => {
  return (
    <Button
      color="primary"
      onClick={onClick}
      variant="text"
      sx={{
        padding: 0,
        margin: 0,
        alignItems: "flex-start",
        justifyContent: "flex-start",
        display: "inline-flex",
        height: "auto",
        textDecoration: "underline",
        color: "#2781B0",

        "&:hover": {
          background: "#ffffff",
          textDecoration: "underline",
        },
      }}
      disableRipple
      disableFocusRipple
      {...restProps}
    >
      {isLoading ? <Loader style={{ width: 16, height: 16 }} /> : label}
    </Button>
  );
};

export default ActionLink;
