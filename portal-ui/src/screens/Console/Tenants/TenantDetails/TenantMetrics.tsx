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

import React, { Fragment, useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import get from "lodash/get";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import {
  containerForHeader,
  tenantDetailsStyles,
} from "../../Common/FormComponents/common/styleLibrary";
import Grid from "@material-ui/core/Grid";
import { LinearProgress } from "@material-ui/core";
import api from "../../../../common/api";
import { ITenant } from "../ListTenants/types";
import { setErrorSnackMessage } from "../../../../actions";
import { AppState } from "../../../../store";
import { Usage } from "../../Dashboard/types";
import PrDashboard from "../../Dashboard/Prometheus/PrDashboard";
import BasicDashboard from "../../Dashboard/BasicDashboard/BasicDashboard";

interface ITenantMetrics {
  classes: any;
  match: any;
  tenant: ITenant | null;

  setErrorSnackMessage: typeof setErrorSnackMessage;
}

const styles = (theme: Theme) =>
  createStyles({
    ...tenantDetailsStyles,
    redState: {
      color: theme.palette.error.main,
    },
    yellowState: {
      color: theme.palette.warning.main,
    },
    greenState: {
      color: theme.palette.success.main,
    },
    greyState: {
      color: "grey",
    },
    centerAlign: {
      textAlign: "center",
    },
    ...containerForHeader(theme.spacing(4)),
  });

const TenantMetrics = ({
  classes,
  match,
  tenant,
  setErrorSnackMessage,
}: ITenantMetrics) => {
  const [loadingWidgets, setLoadingWidgets] = useState<boolean>(true);
  const [basicResult, setBasicResult] = useState<Usage | null>(null);

  const tenantName = match.params["tenantName"];
  const tenantNamespace = match.params["tenantNamespace"];

  const fetchWidgets = useCallback(() => {
    api
      .invoke(
        "GET",
        `/api/v1/namespaces/${tenantNamespace}/tenants/${tenantName}/info`
      )
      .then((res: Usage) => {
        setBasicResult(res);
        setLoadingWidgets(false);
      })
      .catch((err) => {
        setErrorSnackMessage(err);
        setLoadingWidgets(false);
      });
  }, [
    setBasicResult,
    setLoadingWidgets,
    setErrorSnackMessage,
    tenantNamespace,
    tenantName,
  ]);

  useEffect(() => {
    if (loadingWidgets) {
      fetchWidgets();
    }
  }, [loadingWidgets, fetchWidgets, setErrorSnackMessage]);

  const widgets = get(basicResult, "widgets", null);

  return (
    <Fragment>
      <br />
      {loadingWidgets ? (
        <Grid item xs={12} className={classes.container}>
          <LinearProgress />
        </Grid>
      ) : (
        <Fragment>
          {widgets !== null ? (
            <PrDashboard
              apiPrefix={`namespaces/${tenantNamespace}/tenants/${tenantName}`}
            />
          ) : (
            <BasicDashboard usage={basicResult} />
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

const mapState = (state: AppState) => ({
  loadingTenant: state.tenants.tenantDetails.loadingTenant,
  selectedTenant: state.tenants.tenantDetails.currentTenant,
  tenant: state.tenants.tenantDetails.tenantInfo,
  logEnabled: get(state.tenants.tenantDetails.tenantInfo, "logEnabled", false),
  monitoringEnabled: get(
    state.tenants.tenantDetails.tenantInfo,
    "monitoringEnabled",
    false
  ),
  encryptionEnabled: get(
    state.tenants.tenantDetails.tenantInfo,
    "encryptionEnabled",
    false
  ),
  adEnabled: get(state.tenants.tenantDetails.tenantInfo, "idpAdEnabled", false),
  oicEnabled: get(
    state.tenants.tenantDetails.tenantInfo,
    "idpOicEnabled",
    false
  ),
});

const connector = connect(mapState, {
  setErrorSnackMessage,
});

export default withStyles(styles)(connector(TenantMetrics));
