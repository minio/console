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

import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import { BackSettingsIcon } from "../icons";
import React from "react";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import {
  actionsTray,
  containerForHeader,
  searchField,
  settingsCommon,
  typesSelection,
} from "../screens/Console/Common/FormComponents/common/styleLibrary";

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
