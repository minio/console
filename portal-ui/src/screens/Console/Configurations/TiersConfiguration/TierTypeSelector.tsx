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
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import Grid from "@mui/material/Grid";
import {
  actionsTray,
  containerForHeader,
  searchField,
  settingsCommon,
  typesSelection,
} from "../../Common/FormComponents/common/styleLibrary";
import PageHeader from "../../Common/PageHeader/PageHeader";
import { tierTypes } from "./utils";
import BackLink from "../../../../common/BackLink";

interface ITypeTiersConfig {
  classes: any;
  history: any;
}

const styles = (theme: Theme) =>
  createStyles({
    ...actionsTray,
    ...searchField,
    ...settingsCommon,
    ...typesSelection,
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
      height: "calc(100vh - 410px)",
      scrollbarWidth: "none" as const,
      "&::-webkit-scrollbar": {
        display: "none",
      },
    },
    lambdaContainer: {
      padding: "15px 0",
    },
    actionsTray: {
      ...actionsTray.actionsTray,
      padding: "0 38px",
    },
    customTitle: {
      ...settingsCommon.customTitle,
      marginTop: 0,
    },
    mainCont: {
      ...settingsCommon.mainCont,
      maxWidth: 1180,
    },
    link: {
      textDecoration: "none",
      color: theme.palette.primary.main,
    },
  });

const TierTypeSelector = ({ classes, history }: ITypeTiersConfig) => {
  const typeSelect = (selectName: string) => {
    history.push(`/tiers/add/${selectName}`);
  };

  return (
    <Fragment>
      <PageHeader label="Tier Configuration" />
      <Grid container className={classes.mainCont}>
        <Grid item xs={12}>
          <Grid item xs={12} className={classes.mainTitle}>
            <BackLink to="/tiers" label="Return to Configured Tiers" />
          </Grid>
          <Grid item xs={12}>
            <Grid item xs={12}>
              <Grid item xs={12} className={classes.centerElements}>
                <div className={classes.iconContainer}>
                  {tierTypes.map((tierType, index) => (
                    <button
                      className={classes.lambdaNotif}
                      onClick={() => {
                        typeSelect(tierType.serviceName);
                      }}
                      key={`tierOpt-${index.toString}-${tierType.targetTitle}`}
                    >
                      <div className={classes.lambdaNotifIcon}>
                        <img
                          src={tierType.logo}
                          className={classes.logoButton}
                          alt={tierType.targetTitle}
                        />
                      </div>

                      <div className={classes.lambdaNotifTitle}>
                        <b>{tierType.targetTitle}</b>
                      </div>
                    </button>
                  ))}
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default withStyles(styles)(TierTypeSelector);
