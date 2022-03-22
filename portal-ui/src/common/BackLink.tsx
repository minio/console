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
import { BackSettingsIcon } from "../icons";
import { Box } from "@mui/material";

const styles = (theme: Theme) =>
  createStyles({
    link: {
      display: "block",
      textDecoration: "none",
      "&:active": {
        color: theme.palette.primary.light,
      },
    },
    iconBox: {
      display: "flex",
      flexDirection: "row",
      "&:hover": {
        background: "rgba(234,237,238)",
      },
      height: "30px",
      paddingBottom: 4,
      paddingTop: 8,
      paddingRight: 16,
      paddingLeft: 0,
      borderRadius: 4,
    },
    icon: {
      lineHeight: 1,
      marginRight: "14px",
      alignItems: "center",
      width: "22px",
      "& .min-icon": {
        color: theme.palette.primary.light,
        width: "16px",
        height: "16px",
      },
    },
    label: {
      lineHeight: 1,
      alignItems: "center",
      paddingTop: 1,
      fontSize: "14px",
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
        <div className={classes.iconBox}>
          <div className={classes.icon}>
            <BackSettingsIcon />
          </div>
          <div className={classes.label}>{label}</div>
        </div>
      </Link>
    </Box>
  );
};

export default withStyles(styles)(BackLink);
