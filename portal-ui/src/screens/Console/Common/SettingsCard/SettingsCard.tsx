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
import { IElement } from "../../Configurations/types";

interface ISettingsCard {
  classes: any;
  configuration: IElement;
  prefix?: string;
}

const styles = (theme: Theme) =>
  createStyles({
    configurationLink: {
      border: "#E5E5E5 1px solid",
      borderRadius: 2,
      padding: 20,
      width: 190,
      maxWidth: 190,
      height: 80,
      margin: 14,
      display: "flex",
      alignItems: "center",
      color: "#072C4F",
      fontSize: 14,
      fontWeight: 700,
      textDecoration: "none",
      overflow: "hidden",
      textOverflow: "ellipsis",
      lineClamp: 2,
      "& svg": {
        fontSize: 35,
        marginRight: 15,
      },
      "&:hover": {
        backgroundColor: "#FBFAFA",
      },
    },
  });

const SettingsCard = ({
  classes,
  configuration,
  prefix = "settings",
}: ISettingsCard) => {
  return (
    <Link
      to={`/${prefix}/${configuration.configuration_id}`}
      className={classes.configurationLink}
    >
      {configuration.icon}
      {configuration.configuration_label}
    </Link>
  );
};

export default withStyles(styles)(SettingsCard);
