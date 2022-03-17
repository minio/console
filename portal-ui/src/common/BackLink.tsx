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
import { Link } from "react-router-dom";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { BackIcon } from "../icons";
import { Box } from "@mui/material";

const styles = (theme: Theme) =>
  createStyles({
    link: {
      display: "inline-block",
      alignItems: "center",
      justifyContent: "center",
      textDecoration: "none",
      maxWidth: "40px",
      "&:active": {
        color: theme.palette.primary.light,
      },
    },
    icon: {
      marginRight: "11px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "35px",
      width: "35px",
      borderRadius: "2px",
      "&:hover": {
        background: "rgba(234,237,238)",
      },
      "& svg.min-icon": {
        width: "18px",
        height: "12px",
      },
    },
    label: {
      display: "flex",
      alignItems: "center",
      height: "35px",
      padding: "0 0px 0 5px",
      fontSize: "18px",
      fontWeight: 600,
      color: theme.palette.primary.light,
    },
  });

interface IBackLink {
  classes: any;
  to: string;
  label: string;
  className?: any;
  executeOnClick?: () => void;
}

const BackLink = ({
  to,
  label,
  classes,
  className,
  executeOnClick,
}: IBackLink) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <Link
        to={to}
        className={`${classes.link} ${className ? className : ""}`}
        onClick={() => {
          if (executeOnClick) {
            executeOnClick();
          }
        }}
      >
        <div className={classes.icon}>
          <BackIcon />
        </div>
      </Link>
      <div className={classes.label}>{label}</div>
    </Box>
  );
};

export default withStyles(styles)(BackLink);
