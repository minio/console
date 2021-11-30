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
import { Button, CircularProgress, Divider } from "@mui/material";
import Paper from "@mui/material/Paper";
import { ITenant } from "../ListTenants/types";
import { setErrorSnackMessage } from "../../../../actions";
import { ErrorResponseHandler } from "../../../../common/types";
import EditTenantMonitoringModal from "./EditTenantMonitoringModal";
import api from "../../../../common/api";
import { EditIcon } from "../../../../icons";
import FormSwitchWrapper from "../../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import { IMonitoringInfo, ITenantMonitoringStruct } from "../ListTenants/types";
import { IKeyValue } from "../ListTenants/types";
import KeyPairView from "./KeyPairView";
import ConfirmationDialog from "./ConfirmationDialog";

interface ITenantMonitoring {
  classes: any;
  match: any;
  tenant: ITenant | null;
  loadingTenant: boolean;
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

const TenantMonitoring = ({
  classes,
  match,
  tenant,
  loadingTenant,
}: ITenantMonitoring) => {
  const [prometheusMonitoringEnabled, setPrometheusMonitoringEnabled] =
    useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [loadingTenantLogs, setLoadingTenantLogs] = useState<boolean>(false);
  const [monitoringInfo, setMonitoringInfo] =
    useState<ITenantMonitoringStruct>();
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);

  const tenantName = match.params["tenantName"];
  const tenantNamespace = match.params["tenantNamespace"];
  const testingKeyVal: IKeyValue[] = [{ key: "", value: "" }];

  const onCloseEditAndRefresh = () => {
    setEdit(false);
  };

  useEffect(() => {
    api
      .invoke(
        "GET",
        `/api/v1/namespaces/${tenantNamespace}/tenants/${tenantName}/monitoring`
      )
      .then((res: ITenantMonitoringStruct) => {
        setPrometheusMonitoringEnabled(res.prometheusEnabled);
        setDisabled(!prometheusMonitoringEnabled);
        setMonitoringInfo(res);
      })
      .catch((err: ErrorResponseHandler) => {
        setErrorSnackMessage(err);
      });
  }, [prometheusMonitoringEnabled, edit]);

  const togglePrometheus = () => {
    const configInfo = {
      prometheusEnabled: prometheusMonitoringEnabled,
      toggle: true,
    };
    api
      .invoke(
        "PUT",
        `/api/v1/namespaces/${tenantNamespace}/tenants/${tenantName}/monitoring`,
        configInfo
      )
      .then(() => {
        setPrometheusMonitoringEnabled(!prometheusMonitoringEnabled);
        setConfirmOpen(false);
      })
      .catch((err: ErrorResponseHandler) => {
        setErrorSnackMessage(err);
      });
  };

  return (
    <Fragment>
      {edit && tenant !== null && prometheusMonitoringEnabled && (
        <EditTenantMonitoringModal
          classes={classes}
          open={edit}
          onClose={onCloseEditAndRefresh}
          tenant={tenant}
          image={""}
          diskCapacityGB={0}
          labels={testingKeyVal}
          annotations={testingKeyVal}
          nodeSelector={testingKeyVal}
          serviceAccountName={""}
          tenantName={tenantName}
          tenantNamespace={tenantNamespace}
        />
      )}
      {confirmOpen && (
        <ConfirmationDialog
          open={confirmOpen}
          okLabel={prometheusMonitoringEnabled ? "Disable" : "Enable"}
          onClose={() => setConfirmOpen(false)}
          cancelOnClick={() => setConfirmOpen(false)}
          okOnClick={togglePrometheus}
          title={
            prometheusMonitoringEnabled
              ? "Confirm disabling Prometheus monitoring?"
              : "Confirm enabling Prometheus monitoring?"
          }
          description={
            prometheusMonitoringEnabled
              ? "Disabling monitoring will erase any custom values you have used to configure Prometheus monitoring"
              : "Prometheus monitoring will be enabled with default values"
          }
          cancelLabel="Cancel"
        />
      )}

      <h1 className={classes.sectionTitle}>Monitoring</h1>
      <div className={classes.actionsTray}>
        <FormSwitchWrapper
          label={"Prometheus Monitoring"}
          indicatorLabels={["Enabled", "Disabled"]}
          checked={prometheusMonitoringEnabled}
          value={"monitoring_status"}
          id="monitoring-status"
          name="monitoring-status"
          onChange={(e) => {
            setConfirmOpen(true);
            console.log("You hit the switch");
          }}
          description=""
        />
        {prometheusMonitoringEnabled && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => {
              setEdit(true);
            }}
          >
            Edit
          </Button>
        )}
      </div>
      {prometheusMonitoringEnabled && !loadingTenantLogs && (
        <Paper className={classes.paperContainer}>
          <Grid container>
            <Grid item xs={12}>
              <table width={"100%"}>
                <tbody>
                  {loadingTenant ? (
                    <tr>
                      <td className={classes.centerAlign} colSpan={4}>
                        <CircularProgress />
                      </td>
                    </tr>
                  ) : (
                    monitoringInfo !== undefined && (
                      <Fragment>
                        {monitoringInfo.image != null && (
                          <tr>
                            <td className={classes.titleCol}>Image:</td>
                            <td>{monitoringInfo.image}</td>
                          </tr>
                        )}
                        {monitoringInfo.sidecarImage != null && (
                          <tr>
                            <td className={classes.titleCol}>Sidecar Image:</td>
                            <td>{monitoringInfo?.sidecarImage}</td>
                          </tr>
                        )}
                        {monitoringInfo.initImage != null && (
                          <tr>
                            <td className={classes.titleCol}>Init Image:</td>
                            <td>{monitoringInfo?.initImage}</td>
                          </tr>
                        )}
                        {monitoringInfo.diskCapacityGB != null && (
                          <tr>
                            <td className={classes.titleCol}>
                              Disk Capacity (GB):
                            </td>
                            <td>{monitoringInfo?.diskCapacityGB}</td>
                          </tr>
                        )}
                        {monitoringInfo.serviceAccountName != null && (
                          <tr>
                            <td className={classes.titleCol}>
                              Service Account Name:
                            </td>
                            <td>{monitoringInfo?.serviceAccountName}</td>
                          </tr>
                        )}
                        {monitoringInfo.storageClassName != null && (
                          <tr>
                            <td className={classes.titleCol}>
                              Storage Class Name:
                            </td>
                            <td>{monitoringInfo?.storageClassName}</td>
                          </tr>
                        )}
                      </Fragment>
                    )
                  )}
                </tbody>
              </table>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Fragment>
  );
};

const mapDispatchToProps = {
  setErrorSnackMessage,
};

const connector = connect(null, mapDispatchToProps);

export default withStyles(styles)(connector(TenantMonitoring));
