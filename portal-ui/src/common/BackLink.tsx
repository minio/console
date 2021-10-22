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
import Grid from "@mui/material/Grid";
import { BackSettingsIcon } from "../icons";

const styles = (theme: Theme) =>
  createStyles({
    link: {
      textDecoration: "none",
      color: theme.palette.primary.main,
    },
  });

interface IBackLink {
  classes: any;
  to: string;
  label: string;
}

const BackLink = ({ to, label, classes }: IBackLink) => {
  return (
    <Link to={to} className={classes.link}>
      <Grid container spacing={1}>
        <Grid item>
          <BackSettingsIcon />
        </Grid>
        <Grid item>{label}</Grid>
      </Grid>
    </Link>
  );
};

export default withStyles(styles)(BackLink);
