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
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Button, ButtonProps, Tooltip } from "@mui/material";
import clsx from "clsx";

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
      borderRight: "#E5E5E5 1px solid",
      borderStyle: "solid",
      borderRadius: 0,
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
      "&": {
        "@media (max-width: 1279px)": {
          padding: 0,
          display: "flex",
          justifyContent: "center",
          "& .min-icon": {
            width: 15,
          },
        },
      },
    },
    contained: {
      borderColor: "#5E5E5E",
      background: "#5E5E5E",
      color: "white",
      borderRadius: 0,
      height: 37,
      fontWeight: "bold",
      padding: "15px 25px",
      "& .MuiTouchRipple-root span": {
        backgroundColor: "#4c4c4c",
        borderRadius: 3,
        opacity: 0.3,
      },
      "&:hover": {
        backgroundColor: "#4c4c4c",
        color: "#FFF",
      },
      "& .min-icon": {
        width: 12,
        marginTop: -3,
      },
      "&": {
        "@media (max-width: 1279px)": {
          padding: 0,
          display: "flex",
          justifyContent: "center",
          "& .min-icon": {
            width: 15,
          },
        },
      },
    },
  });

interface ITopActionButton extends ButtonProps {
  classes: any;
  children: any;
  variant?: "text" | "contained";
  tooltip?: string;
}

const TopActionButton = ({
  classes,
  children,
  variant = "text",
  tooltip,
  ...rest
}: ITopActionButton) => {
  return (
    <Tooltip title={tooltip || ""}>
      <span>
        <Button
          {...rest}
          className={clsx(classes.root, {
            [classes.contained]: variant === "contained",
          })}
          sx={{
            "& span.buttonItem": {
              "@media (max-width: 1279px)": {
                display: "none",
              },
            },
            "& span": {
              "@media (max-width: 1279px)": {
                margin: 0,
              },
            },
          }}
        >
          <span className={"buttonItem"}>{children}</span>
        </Button>
      </span>
    </Tooltip>
  );
};

export default withStyles(styles)(TopActionButton);
