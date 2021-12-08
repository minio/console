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
  containerForHeader,
  searchField,
  settingsCommon,
  typesSelection,
} from "../../Common/FormComponents/common/styleLibrary";
import PageHeader from "../../Common/PageHeader/PageHeader";
import { tierTypes } from "./utils";
import BackLink from "../../../../common/BackLink";
import PageLayout from "../../Common/Layout/PageLayout";

interface ITypeTiersConfig {
  classes: any;
  history: any;
}

const styles = (theme: Theme) =>
  createStyles({
    ...searchField,
    ...settingsCommon,
    ...typesSelection,
    ...containerForHeader(theme.spacing(4)),
  });

const TierTypeSelector = ({ classes, history }: ITypeTiersConfig) => {
  const typeSelect = (selectName: string) => {
    history.push(`/tiers/add/${selectName}`);
  };

  return (
    <Fragment>
      <PageHeader label="Tier Configuration" />
      <BackLink to="/tiers" label="Return to Configured Tiers" />

      <PageLayout>
        <Grid>
          <Grid item xs={12}>
            <Grid item xs={12}>
              <Grid item xs={12}>
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
      </PageLayout>
    </Fragment>
  );
};

export default withStyles(styles)(TierTypeSelector);
