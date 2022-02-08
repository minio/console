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

const styles = (theme: Theme) =>
  createStyles({
    link: {
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
      maxWidth: "300px",
      padding: "2rem 2rem 0rem 2rem",
      color: theme.palette.primary.light,
      fontSize: ".8rem",
      "&:hover": {
        textDecoration: "underline",
      },
    },
    icon: {
      marginRight: ".3rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      "& svg.min-icon": {
        width: 12,
      },
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
        <BackSettingsIcon />
      </div>
      <div className={classes.label}>{label}</div>
    </Link>
  );
};

export default withStyles(styles)(BackLink);
