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
import BackLink from "../../../../common/BackLink";
import PageHeader from "../../Common/PageHeader/PageHeader";

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

const ConfigurationsList = ({
  classes,
  match,
  history,
}: IListConfiguration) => {
  const configurationName = get(match, "params.option", "");

  const findConfiguration = configurationElements.find(
    (element) => element.configuration_id === configurationName
  );

  return (
    <Fragment>
      <PageHeader
        label={`${findConfiguration?.configuration_label} Settings`}
      />
      <Grid container className={classes.container}>
        <Grid item xs={12} className={classes.mainTitle}>
          <BackLink to="/settings" label="Return to Settings" />
        </Grid>
        <Grid item xs={12}>
          {findConfiguration && (
            <EditConfiguration
              selectedConfiguration={findConfiguration}
              history={history}
            />
          )}
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default withStyles(styles)(ConfigurationsList);
