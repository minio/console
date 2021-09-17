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

import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import Grid from "@mui/material/Grid";
import {
  actionsTray,
  containerForHeader,
  searchField,
} from "../../Common/FormComponents/common/styleLibrary";
import { IPVCsResponse, IStoragePVCs } from "../../Storage/types";
import Paper from "@mui/material/Paper";
import { setErrorSnackMessage } from "../../../../actions";
import { ErrorResponseHandler } from "../../../../common/types";
import api from "../../../../common/api";
import TableWrapper from "../../Common/TableWrapper/TableWrapper";
import SearchIcon from "../../../../icons/SearchIcon";
import FormSwitchWrapper from "../../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import { IMonitoringInfo } from "../ListTenants/types";

interface ITenantVolumesProps {
  classes: any;
  setErrorSnackMessage: typeof setErrorSnackMessage;
  match: any;
}

const styles = (theme: Theme) =>
  createStyles({
    headerLabel: {
      fontSize: 22,
      fontWeight: 600,
      color: "#000",
      marginTop: 4,
    },
    breadcrumLink: {
      textDecoration: "none",
      color: "black",
    },
    tableWrapper: {
      height: "calc(100vh - 267px)",
    },
    paperContainer: {
      padding: "15px 15px 15px 50px",
    },
    ...actionsTray,
    ...searchField,
    ...containerForHeader(theme.spacing(4)),
  });

const MonitoringDetails = ({
  classes,
  setErrorSnackMessage,
  match,
}: ITenantVolumesProps) => {
  const [prometheusMonitoringEnabled, setPrometheusMonitoringEnabled] =
    useState<boolean>(false);

  const tenantName = match.params["tenantName"];
  const tenantNamespace = match.params["tenantNamespace"];

  useEffect(() => {
    api
      .invoke(
        "GET",
        `/api/v1/namespaces/${tenantNamespace}/tenants/${tenantName}/monitoring`
      )
      .then((res: IMonitoringInfo) => {
        setPrometheusMonitoringEnabled(res.prometheusEnabled);
      })
      .catch((err: ErrorResponseHandler) => {
        setErrorSnackMessage(err);
      });
  }, []);

  const togglePrometheus = () => {
    const configInfo = {
      namespace: tenantNamespace,
      tenant: tenantName,
      body: { prometheusEnabled: prometheusMonitoringEnabled },
    };
    api
      .invoke(
        "POST",
        `/api/v1/namespaces/${tenantNamespace}/tenants/${tenantName}/monitoring`,
        configInfo
      )
      .catch((err: ErrorResponseHandler) => {
        setErrorSnackMessage(err);
      });
  };

  return (
    <Fragment>
      <h1 className={classes.sectionTitle}>Monitoring</h1>
      <Paper className={classes.paperContainer}>
        <Grid item xs={12} className={classes.title}>
          <FormSwitchWrapper
            indicatorLabels={[
              "Prometheus Monitoring Enabled",
              "Prometheus Monitoring Disabled",
            ]}
            checked={prometheusMonitoringEnabled}
            value={"monitoring_status"}
            id="monitoring-status"
            name="monitoring-status"
            onChange={(e) => {
              setPrometheusMonitoringEnabled(e.target.checked);
              togglePrometheus();
            }}
            description=""
            switchOnly
          />
        </Grid>
      </Paper>
    </Fragment>
  );
};

const mapDispatchToProps = {
  setErrorSnackMessage,
};

const connector = connect(null, mapDispatchToProps);

export default withStyles(styles)(connector(MonitoringDetails));
