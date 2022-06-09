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
import { connect, useDispatch, useSelector } from "react-redux";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Theme } from "@mui/material/styles";
import {
  actionsTray,
  containerForHeader,
  searchField,
  tenantDetailsStyles,
} from "../../Common/FormComponents/common/styleLibrary";
import Grid from "@mui/material/Grid";
import { DialogContentText } from "@mui/material";
import Paper from "@mui/material/Paper";
import api from "../../../../common/api";
import { ITenantLogsStruct } from "../ListTenants/types";
import { AppState } from "../../../../store";
import { ErrorResponseHandler } from "../../../../common/types";
import { EditIcon } from "../../../../icons";
import EditTenantLogsModal from "./EditTenantLogsModal";
import KeyPairView from "./KeyPairView";
import ConfirmDialog from "../../Common/ModalWrapper/ConfirmDialog";
import FormSwitchWrapper from "../../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import RBIconButton from "../../Buckets/BucketDetails/SummaryItems/RBIconButton";
import { niceBytes } from "../../../../common/utils";
import Loader from "../../Common/Loader/Loader";
import { setErrorSnackMessage } from "../../../../systemSlice";
import { useParams } from "react-router-dom";

interface ITenantLogs {
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    ...tenantDetailsStyles,
    paperContainer: {
      padding: "15px 15px 15px 50px",
    },
    ...actionsTray,
    ...searchField,
    ...containerForHeader(theme.spacing(4)),
  });

const TenantLogging = ({ classes }: ITenantLogs) => {
  const dispatch = useDispatch();
  const params = useParams();

  const loadingTenant = useSelector(
    (state: AppState) => state.tenants.loadingTenant
  );
  const tenant = useSelector((state: AppState) => state.tenants.tenantInfo);

  const [loadingTenantLogs, setLoadingTenantLogs] = useState<boolean>(true);
  const [logInfo, setLogInfo] = useState<ITenantLogsStruct>();
  const [edit, setEdit] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [preDisabled, setPreDisabled] = useState<boolean>(false);
  const [disableDialogOpen, setDisableDialogOpen] = useState<boolean>(false);
  const [enableDialogOpen, setEnableDialogOpen] = useState<boolean>(false);

  const tenantName = params.tenantName;
  const tenantNamespace = params.tenantNamespace;

  useEffect(() => {
    if (loadingTenantLogs) {
      api
        .invoke(
          "GET",
          `/api/v1/namespaces/${tenantNamespace}/tenants/${tenantName}/log`
        )
        .then((result: ITenantLogsStruct) => {
          setLogInfo(result);
          setPreDisabled(result.disabled);
          setDisabled(result.disabled);
          setLoadingTenantLogs(false);
        })
        .catch((err: ErrorResponseHandler) => {
          dispatch(
            setErrorSnackMessage({
              errorMessage: "Error getting tenant logs",
              detailedError: err.detailedError,
            })
          );
        });
    }
  }, [
    tenantName,
    tenantNamespace,
    loadingTenantLogs,
    setDisabled,
    disabled,
    dispatch,
  ]);

  const onCloseEditAndRefresh = () => {
    setDisableDialogOpen(false);
    setEdit(false);
    setLoadingTenantLogs(true);
  };

  const onCloseEnableAndRefresh = () => {
    setEnableDialogOpen(false);
    setDisabled(false);
    setLoadingTenantLogs(true);
  };

  return (
    <Fragment>
      <ConfirmDialog
        title="Disable Logging?"
        confirmText="Disable"
        isOpen={disableDialogOpen}
        onConfirm={() => {
          api
            .invoke(
              "POST",
              `/api/v1/namespaces/${tenantNamespace}/tenants/${tenantName}/disable-logging`
            )
            .then(() => {
              setPreDisabled(true);
              setDisabled(true);
            })
            .catch((err: ErrorResponseHandler) => {
              dispatch(
                setErrorSnackMessage({
                  errorMessage: "Error disabling logging",
                  detailedError: err.detailedError,
                })
              );
            });
          onCloseEditAndRefresh();
        }}
        onClose={() => setDisableDialogOpen(false)}
        confirmationContent={
          <DialogContentText>
            Disabling logging will erase any custom values you have used to
            configure logging
          </DialogContentText>
        }
      />
      <ConfirmDialog
        title="Enable Logging?"
        confirmText="Enable"
        isOpen={enableDialogOpen}
        onConfirm={() => {
          api
            .invoke(
              "POST",
              `/api/v1/namespaces/${tenantNamespace}/tenants/${tenantName}/enable-logging`
            )
            .then(() => {
              setPreDisabled(false);
            })
            .catch((err: ErrorResponseHandler) => {
              dispatch(
                setErrorSnackMessage({
                  errorMessage: "Error enabling logging",
                  detailedError: err.detailedError,
                })
              );
            });
          onCloseEnableAndRefresh();
        }}
        onClose={() => setEnableDialogOpen(false)}
        confirmationContent={
          <DialogContentText>
            Logging will be enabled with default values
          </DialogContentText>
        }
      />
      {edit && tenant !== null && logInfo != null && !disabled && (
        <EditTenantLogsModal
          open={edit}
          onClose={onCloseEditAndRefresh}
          tenant={tenant}
          image={logInfo.image}
          labels={logInfo.labels}
          annotations={logInfo.annotations}
          nodeSelector={logInfo.nodeSelector}
          diskCapacityGB={logInfo.diskCapacityGB}
          serviceAccountName={logInfo.serviceAccountName}
          dbImage={logInfo.dbImage}
          dbLabels={logInfo.dbLabels}
          dbAnnotations={logInfo.dbAnnotations}
          dbNodeSelector={logInfo.dbNodeSelector}
          dbServiceAccountName={logInfo.dbServiceAccountName}
          cpuRequest={logInfo.logCPURequest}
          memRequest={logInfo.logMemRequest}
          dbCPURequest={logInfo.logDBCPURequest}
          dbMemRequest={logInfo.logDBMemRequest}
        />
      )}
      <Grid container alignItems={"center"}>
        <Grid item xs>
          <h1 className={classes.sectionTitle}>Audit Log</h1>
        </Grid>
        <Grid item xs={4}>
          <FormSwitchWrapper
            value="enableLogging"
            id="enableLogging"
            name="enableLogging"
            checked={!preDisabled}
            onChange={(e) => {
              const targetD = e.target;
              const checked = targetD.checked;
              if (checked) {
                setEnableDialogOpen(true);
              } else {
                setDisableDialogOpen(true);
              }
            }}
            indicatorLabels={["Enabled", "Disabled"]}
          />
        </Grid>
      </Grid>
      {!disabled && !loadingTenantLogs && (
        <Paper className={classes.paperContainer}>
          <Grid container>
            <Grid item xs={12}>
              <Grid container alignItems={"center"}>
                <Grid xs={8}>
                  <h3>Configuration</h3>
                </Grid>
                <Grid xs={4} justifyContent={"end"} textAlign={"right"}>
                  <RBIconButton
                    tooltip={"Edit Logging configuration"}
                    text={"Edit"}
                    onClick={() => {
                      setEdit(true);
                    }}
                    icon={<EditIcon />}
                    color="primary"
                    variant={"contained"}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <hr className={classes.hrClass} />
              <table width={"100%"}>
                <tbody>
                  {loadingTenant ? (
                    <tr>
                      <td className={classes.centerAlign} colSpan={4}>
                        <Loader />
                      </td>
                    </tr>
                  ) : (
                    <Fragment>
                      {logInfo?.logCPURequest != null && (
                        <tr>
                          <td className={classes.titleCol}>CPU Request:</td>
                          <td>{logInfo?.logCPURequest}</td>
                        </tr>
                      )}
                      {logInfo?.logMemRequest != null && (
                        <tr>
                          <td className={classes.titleCol}>Memory Request:</td>
                          <td>{niceBytes(logInfo?.logMemRequest, true)}</td>
                        </tr>
                      )}
                      {logInfo?.image != null && (
                        <tr>
                          <td className={classes.titleCol}>Image:</td>
                          <td>{logInfo?.image}</td>
                        </tr>
                      )}
                      {logInfo?.diskCapacityGB != null && (
                        <tr>
                          <td className={classes.titleCol}>
                            Disk Capacity (GB):
                          </td>
                          <td>{logInfo?.diskCapacityGB}</td>
                        </tr>
                      )}
                      {logInfo?.serviceAccountName != null && (
                        <tr>
                          <td className={classes.titleCol}>Service Account:</td>
                          <td>{logInfo?.serviceAccountName}</td>
                        </tr>
                      )}
                      {logInfo?.labels != null && logInfo.labels.length > 0 && (
                        <Fragment>
                          <tr>
                            <td>
                              <h4>Labels</h4>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <KeyPairView
                                records={
                                  logInfo != null && logInfo.labels.length > 0
                                    ? logInfo.labels
                                    : []
                                }
                                recordName="Labels"
                              />
                            </td>
                          </tr>
                        </Fragment>
                      )}
                      {logInfo?.annotations != null &&
                        logInfo.annotations.length > 0 && (
                          <Fragment>
                            <tr>
                              <td>
                                <h4>Annotations</h4>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <KeyPairView
                                  records={
                                    logInfo != null &&
                                    logInfo.annotations.length > 0
                                      ? logInfo.annotations
                                      : []
                                  }
                                  recordName="Annotations"
                                />
                              </td>
                            </tr>
                          </Fragment>
                        )}
                      {logInfo?.nodeSelector != null &&
                        logInfo.nodeSelector.length > 0 && (
                          <Fragment>
                            <tr>
                              <td>
                                <h4>Node Selector</h4>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <KeyPairView
                                  records={
                                    logInfo != null &&
                                    logInfo.nodeSelector.length > 0
                                      ? logInfo.nodeSelector
                                      : []
                                  }
                                  recordName="Node Selector"
                                />
                              </td>
                            </tr>
                          </Fragment>
                        )}
                    </Fragment>
                  )}
                </tbody>
              </table>

              <h2>Database Details</h2>
              <hr className={classes.hrClass} />
              <table width={"100%"}>
                <tbody>
                  {loadingTenant ? (
                    <tr>
                      <td className={classes.centerAlign} colSpan={4}>
                        <Loader />
                      </td>
                    </tr>
                  ) : (
                    <Fragment>
                      {logInfo?.logDBCPURequest != null && (
                        <tr>
                          <td className={classes.titleCol}>DB CPU Request:</td>
                          <td>{logInfo?.logDBCPURequest}</td>
                        </tr>
                      )}
                      {logInfo?.logDBMemRequest != null && (
                        <tr>
                          <td className={classes.titleCol}>
                            DB Memory Request:
                          </td>
                          <td>{niceBytes(logInfo?.logDBMemRequest, true)}</td>
                        </tr>
                      )}
                      {logInfo?.dbImage != null && (
                        <tr>
                          <td className={classes.titleCol}>Postgres Image:</td>
                          <td>{logInfo?.dbImage}</td>
                        </tr>
                      )}
                      {logInfo?.dbServiceAccountName != null && (
                        <tr>
                          <td className={classes.titleCol}>Service Account:</td>
                          <td>{logInfo?.dbServiceAccountName}</td>
                        </tr>
                      )}
                      {logInfo?.dbLabels != null &&
                        logInfo.dbLabels.length > 0 && (
                          <Fragment>
                            <tr>
                              <td>
                                <h4>Labels</h4>
                              </td>
                            </tr>

                            <tr>
                              <td>
                                <KeyPairView
                                  records={
                                    logInfo != null &&
                                    logInfo.dbLabels?.length > 0
                                      ? logInfo.dbLabels
                                      : []
                                  }
                                  recordName="labels"
                                />
                              </td>
                            </tr>
                          </Fragment>
                        )}
                      {logInfo?.annotations != null &&
                        logInfo.dbAnnotations.length > 0 && (
                          <Fragment>
                            <tr>
                              <td>
                                <h4>Annotations</h4>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <KeyPairView
                                  records={
                                    logInfo != null &&
                                    logInfo.dbAnnotations?.length > 0
                                      ? logInfo.dbAnnotations
                                      : []
                                  }
                                  recordName="annotations"
                                />
                              </td>
                            </tr>
                          </Fragment>
                        )}
                      {logInfo?.nodeSelector != null &&
                        logInfo.dbNodeSelector.length > 0 && (
                          <Fragment>
                            <tr>
                              <td>
                                <h4>Node Selector </h4>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <KeyPairView
                                  records={
                                    logInfo != null &&
                                    logInfo.dbNodeSelector?.length > 0
                                      ? logInfo.dbNodeSelector
                                      : []
                                  }
                                  recordName="node selectors"
                                />
                              </td>
                            </tr>
                          </Fragment>
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

const mapState = (state: AppState) => ({
  loadingTenant: state.tenants.loadingTenant,
  selectedTenant: state.tenants.currentTenant,
  tenant: state.tenants.tenantInfo,
});

const connector = connect(mapState, null);

export default withStyles(styles)(connector(TenantLogging));
