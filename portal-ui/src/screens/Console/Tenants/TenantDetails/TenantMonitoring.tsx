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
  tenantDetailsStyles,
} from "../../Common/FormComponents/common/styleLibrary";
import { CircularProgress, DialogContentText } from "@mui/material";
import Paper from "@mui/material/Paper";
import { ITenant } from "../ListTenants/types";
import { setErrorSnackMessage } from "../../../../actions";
import { ErrorResponseHandler } from "../../../../common/types";
import EditTenantMonitoringModal from "./EditTenantMonitoringModal";

import api from "../../../../common/api";
import { EditIcon } from "../../../../icons";
import FormSwitchWrapper from "../../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import { ITenantMonitoringStruct } from "../ListTenants/types";
import KeyPairView from "./KeyPairView";
import ConfirmDialog from "../../Common/ModalWrapper/ConfirmDialog";
import RBIconButton from "../../Buckets/BucketDetails/SummaryItems/RBIconButton";

interface ITenantMonitoring {
  classes: any;
  match: any;
  tenant: ITenant | null;
  loadingTenant: boolean;
}

const styles = (theme: Theme) =>
  createStyles({
    ...tenantDetailsStyles,
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
  const [monitoringInfo, setMonitoringInfo] =
    useState<ITenantMonitoringStruct>();
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [refreshMonitoringInfo, setRefreshMonitoringInfo] =
    useState<boolean>(true);

  const tenantName = match.params["tenantName"];
  const tenantNamespace = match.params["tenantNamespace"];

  const onCloseEditAndRefresh = () => {
    setEdit(false);
    setRefreshMonitoringInfo(true);
  };

  useEffect(() => {
    if (refreshMonitoringInfo) {
      api
        .invoke(
          "GET",
          `/api/v1/namespaces/${tenantNamespace}/tenants/${tenantName}/monitoring`
        )
        .then((res: ITenantMonitoringStruct) => {
          setPrometheusMonitoringEnabled(res.prometheusEnabled);
          setMonitoringInfo(res);
          setRefreshMonitoringInfo(false);
        })
        .catch((err: ErrorResponseHandler) => {
          setErrorSnackMessage(err);
          setRefreshMonitoringInfo(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshMonitoringInfo]);

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
        setRefreshMonitoringInfo(true);
        setConfirmOpen(false);
        setRefreshMonitoringInfo(true);
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
          image={monitoringInfo?.image || ""}
          sidecarImage={monitoringInfo?.sidecarImage || ""}
          initImage={monitoringInfo?.initImage || ""}
          diskCapacityGB={
            monitoringInfo?.diskCapacityGB
              ? parseInt(monitoringInfo?.diskCapacityGB)
              : 5
          }
          labels={monitoringInfo?.labels || []}
          annotations={monitoringInfo?.annotations || []}
          nodeSelector={monitoringInfo?.nodeSelector || []}
          serviceAccountName={monitoringInfo?.serviceAccountName || ""}
          tenantName={tenantName}
          tenantNamespace={tenantNamespace}
          storageClassName={monitoringInfo?.storageClassName || ""}
        />
      )}
      {confirmOpen && (
        <ConfirmDialog
          isOpen={confirmOpen}
          title={
            prometheusMonitoringEnabled
              ? "Disable Prometheus monitoring?"
              : "Enable Prometheus monitoring?"
          }
          confirmText={prometheusMonitoringEnabled ? "Disable" : "Enable"}
          cancelText="Cancel"
          onClose={() => setConfirmOpen(false)}
          onConfirm={togglePrometheus}
          confirmationContent={
            <DialogContentText>
              {prometheusMonitoringEnabled
                ? "Disabling monitoring will erase any custom values you have used to configure Prometheus monitoring"
                : "Prometheus monitoring will be enabled with default values"}
            </DialogContentText>
          }
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
          }}
          description=""
        />
        {prometheusMonitoringEnabled && (
          <RBIconButton
            tooltip={"Edit Monitoring configuration"}
            text={"Edit"}
            onClick={() => {
              setEdit(true);
            }}
            icon={<EditIcon />}
            color="primary"
            variant={"contained"}
          />
        )}
      </div>
      {prometheusMonitoringEnabled && monitoringInfo !== undefined && (
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
                      {monitoringInfo.labels != null &&
                        monitoringInfo.labels.length > 0 && (
                          <>
                            <tr>
                              <td>
                                <h4>Labels</h4>
                              </td>
                            </tr>
                            <tr>
                              <td className={classes.titleCol}>
                                <KeyPairView
                                  records={monitoringInfo.labels}
                                  recordName="Labels"
                                />
                              </td>
                            </tr>
                          </>
                        )}
                      {monitoringInfo.annotations != null &&
                        monitoringInfo.annotations.length > 0 && (
                          <>
                            <tr>
                              <td>
                                <h4>Annotations</h4>
                              </td>
                            </tr>
                            <tr>
                              <td className={classes.titleCol}>
                                <KeyPairView
                                  records={monitoringInfo.annotations}
                                  recordName="Annotations"
                                />
                              </td>
                            </tr>
                          </>
                        )}
                      {monitoringInfo.nodeSelector != null &&
                        monitoringInfo.nodeSelector.length > 0 && (
                          <tr>
                            <h4>Node Seletor</h4>
                            <td className={classes.titleCol}>
                              <KeyPairView
                                records={monitoringInfo.nodeSelector}
                                recordName="Node Selector"
                              />
                            </td>
                          </tr>
                        )}
                    </Fragment>
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
