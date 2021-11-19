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
import get from "lodash/get";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import Grid from "@mui/material/Grid";
import { configurationElements } from "../utils";
import EditConfiguration from "../../NotificationEndpoints/CustomForms/EditConfiguration";
import {
  actionsTray,
  containerForHeader,
  searchField,
  settingsCommon,
} from "../../Common/FormComponents/common/styleLibrary";

interface IListConfiguration {
  classes: any;
  match: any;
  history: any;
}

const styles = (theme: Theme) =>
  createStyles({
    ...searchField,
    ...actionsTray,
    ...settingsCommon,
    ...containerForHeader(theme.spacing(4)),
    strongText: {
      fontWeight: 700,
    },
    keyName: {
      marginLeft: 5,
    },
    iconText: {
      lineHeight: "24px",
    },
    customConfigurationPage: {
      height: "calc(100vh - 324px)",
      scrollbarWidth: "none" as const,
      "&::-webkit-scrollbar": {
        display: "none",
      },
    },
    mainCont: {
      ...settingsCommon.mainCont,
      maxWidth: 1180,
    },
  });

const ConfigurationsList = ({ match, history }: IListConfiguration) => {
  const activeConfRoute = get(match, "url", "");

  const configName = activeConfRoute.substring(
    activeConfRoute.lastIndexOf("/") + 1
  );

  const validActiveConfig = configurationElements.find(
    (element) => element.configuration_id === configName
  );
  const containerClassName = `${configName}`;
  return (
    <Grid item xs={12}>
      {validActiveConfig && (
        <EditConfiguration
          className={`${containerClassName}`}
          selectedConfiguration={validActiveConfig}
          history={history}
        />
      )}
    </Grid>
  );
};

export default withStyles(styles)(ConfigurationsList);
