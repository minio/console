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
import get from "lodash/get";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import {
  containerForHeader,
  tenantDetailsStyles,
} from "../../Common/FormComponents/common/styleLibrary";
import Grid from "@material-ui/core/Grid";
import { Button, CircularProgress } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { niceBytes } from "../../../../common/utils";
import api from "../../../../common/api";
import { ITenant } from "../ListTenants/types";
import UsageBarWrapper from "../../Common/UsageBarWrapper/UsageBarWrapper";
import UpdateTenantModal from "./UpdateTenantModal";
import { setErrorSnackMessage } from "../../../../actions";
import { AppState } from "../../../../store";

interface ITenantsSummary {
  classes: any;
  match: any;
  tenant: ITenant | null;
  logEnabled: boolean;
  monitoringEnabled: boolean;
  encryptionEnabled: boolean;
  adEnabled: boolean;
  oicEnabled: boolean;
  loadingTenant: boolean;
  setErrorSnackMessage: typeof setErrorSnackMessage;
}

interface ITenantUsage {
  used: string;
  disk_used: string;
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

const TenantSummary = ({
  classes,
  match,
  tenant,
  logEnabled,
  monitoringEnabled,
  encryptionEnabled,
  adEnabled,
  oicEnabled,
  loadingTenant,
  setErrorSnackMessage,
}: ITenantsSummary) => {
  const [capacity, setCapacity] = useState<number>(0);
  const [poolCount, setPoolCount] = useState<number>(0);
  const [instances, setInstances] = useState<number>(0);
  const [volumes, setVolumes] = useState<number>(0);
  const [loadingUsage, setLoadingUsage] = useState<boolean>(true);
  const [usageError, setUsageError] = useState<string>("");
  const [usage, setUsage] = useState<number>(0);
  const [updateMinioVersion, setUpdateMinioVersion] = useState<boolean>(false);

  const tenantName = match.params["tenantName"];
  const tenantNamespace = match.params["tenantNamespace"];

  const healthStatusToClass = (health_status: string) => {
    return health_status === "red"
      ? classes.redState
      : health_status === "yellow"
      ? classes.yellowState
      : health_status === "green"
      ? classes.greenState
      : classes.greyState;
  };

  useEffect(() => {
    if (loadingUsage) {
      api
        .invoke(
          "GET",
          `/api/v1/namespaces/${tenantNamespace}/tenants/${tenantName}/usage`
        )
        .then((result: ITenantUsage) => {
          const usage = get(result, "disk_used", "0");
          setUsage(parseInt(usage));
          setUsageError("");
          setLoadingUsage(false);
        })
        .catch((err) => {
          setUsageError(err);
          setUsage(0);
          setLoadingUsage(false);
        });
    }
  }, [tenantName, tenantNamespace, loadingUsage]);

  useEffect(() => {
    if (tenant) {
      const res = tenant;

      const resPools = !res.pools ? [] : res.pools;

      let totalInstances = 0;
      let totalVolumes = 0;
      let poolNamedIndex = 0;
      for (let pool of resPools) {
        const cap =
          pool.volumes_per_server *
          pool.servers *
          pool.volume_configuration.size;
        pool.label = `pool-${poolNamedIndex}`;
        if (pool.name === undefined || pool.name === "") {
          pool.name = pool.label;
        }
        pool.capacity = niceBytes(cap + "");
        pool.volumes = pool.servers * pool.volumes_per_server;
        totalInstances += pool.servers;
        totalVolumes += pool.volumes;
        poolNamedIndex += 1;
      }
      setCapacity(res.total_size || 0);
      setPoolCount(resPools.length);
      setVolumes(totalVolumes);
      setInstances(totalInstances);
    }
  }, [tenant]);

  return (
    <Fragment>
      {updateMinioVersion && (
        <UpdateTenantModal
          open={updateMinioVersion}
          closeModalAndRefresh={() => {
            setUpdateMinioVersion(false);
          }}
          idTenant={tenantName}
          namespace={tenantNamespace}
        />
      )}
      <br />
      <Paper className={classes.paperContainer}>
        <Grid container>
          <Grid item xs={8}>
            <table width={"100%"}>
              <tbody>
                <tr>
                  <td colSpan={4}>
                    <h2>Details</h2>
                    <hr className={classes.hrClass} />
                  </td>
                </tr>
                {loadingTenant ? (
                  <tr>
                    <td colSpan={4} className={classes.centerAlign}>
                      <CircularProgress />
                    </td>
                  </tr>
                ) : (
                  <Fragment>
                    <tr>
                      <td className={classes.titleCol}>Capacity:</td>
                      <td>{niceBytes(capacity.toString(10))}</td>
                      <td className={classes.titleCol}>MinIO:</td>
                      <td>
                        <Button
                          color="primary"
                          className={classes.anchorButton}
                          onClick={() => {
                            setUpdateMinioVersion(true);
                          }}
                        >
                          {tenant ? tenant.image : ""}
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td className={classes.titleCol}>Clusters:</td>
                      <td>{poolCount}</td>
                      <td className={classes.titleCol}>Console:</td>
                      <td>
                        <Button
                          color="primary"
                          className={classes.anchorButton}
                          onClick={() => {
                            setUpdateMinioVersion(true);
                          }}
                        >
                          {tenant ? tenant.console_image : ""}
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td className={classes.titleCol}>Instances:</td>
                      <td>{instances}</td>
                      <td className={classes.titleCol}>Volumes:</td>
                      <td>{volumes}</td>
                    </tr>
                    {tenant?.endpoints && (
                      <tr>
                        <td className={classes.titleCol}>Endpoint:</td>
                        <td>
                          <a
                            href={tenant?.endpoints.minio}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {tenant?.endpoints.minio}
                          </a>
                        </td>
                        <td className={classes.titleCol}>Console:</td>
                        <td>
                          <a
                            href={tenant?.endpoints.console}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {tenant?.endpoints.console}
                          </a>
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td className={classes.titleCol}>State:</td>
                      <td colSpan={3}>{tenant?.currentState}</td>
                    </tr>
                  </Fragment>
                )}
              </tbody>
            </table>
          </Grid>
          <Grid item xs={4}>
            {loadingTenant ? (
              <div className={classes.centerAlign}>
                <CircularProgress />
              </div>
            ) : (
              <Fragment>
                <UsageBarWrapper
                  currValue={usage}
                  maxValue={tenant ? tenant.total_size : 0}
                  label={"Storage"}
                  renderFunction={niceBytes}
                  error={usageError}
                  loading={loadingUsage}
                />
                <h4>
                  {tenant && tenant.status && (
                    <span
                      className={healthStatusToClass(
                        tenant.status.health_status
                      )}
                    >
                      ⬤&nbsp;
                    </span>
                  )}
                  Health
                </h4>
                <table>
                  <tbody>
                    <tr>
                      <td className={classes.healthCol}>Drives Online</td>
                      <td>
                        {tenant?.status?.drives_online
                          ? tenant?.status?.drives_online
                          : 0}
                      </td>
                    </tr>
                    <tr>
                      <td className={classes.healthCol}>Drives Offline</td>
                      <td>
                        {tenant?.status?.drives_offline
                          ? tenant?.status?.drives_offline
                          : 0}
                      </td>
                    </tr>
                    <tr>
                      <td className={classes.healthCol}>Write Quorum</td>
                      <td>
                        {tenant?.status?.write_quorum
                          ? tenant?.status?.write_quorum
                          : 0}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Fragment>
            )}
          </Grid>
        </Grid>
      </Paper>
      <br />
      <br />
      <Paper className={classes.paperContainer}>
        <Grid container>
          <Grid item xs={12}>
            <table width={"100%"}>
              <tbody>
                <tr>
                  <td colSpan={4}>
                    <h2>Features</h2>
                    <hr className={classes.hrClass} />
                  </td>
                </tr>
                {loadingTenant ? (
                  <tr>
                    <td className={classes.centerAlign} colSpan={4}>
                      <CircularProgress />
                    </td>
                  </tr>
                ) : (
                  <Fragment>
                    <tr>
                      <td className={classes.titleCol}>Logs:</td>
                      <td>
                        <Button
                          color="primary"
                          className={classes.anchorButton}
                        >
                          {logEnabled ? "Enabled" : "Disabled"}
                        </Button>
                      </td>
                      <td className={classes.titleCol}>Monitoring:</td>
                      <td>
                        <Button
                          color="primary"
                          className={classes.anchorButton}
                        >
                          {monitoringEnabled ? "Enabled" : "Disabled"}
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td className={classes.titleCol}>Encryption:</td>
                      <td>
                        <Button
                          color="primary"
                          className={classes.anchorButton}
                        >
                          {encryptionEnabled ? "Enabled" : "Disabled"}
                        </Button>
                      </td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      {adEnabled ||
                        (!adEnabled && !oicEnabled && (
                          <React.Fragment>
                            <td className={classes.titleCol}>
                              Active Directory:
                            </td>
                            <td>
                              <Button
                                color="primary"
                                className={classes.anchorButton}
                              >
                                {adEnabled ? "Enabled" : "Disabled"}
                              </Button>
                            </td>
                          </React.Fragment>
                        ))}
                      {oicEnabled ||
                        (!oicEnabled && !adEnabled && (
                          <React.Fragment>
                            <td className={classes.titleCol}>OpenID:</td>
                            <td>
                              <Button
                                color="primary"
                                className={classes.anchorButton}
                              >
                                {oicEnabled ? "Enabled" : "Disabled"}
                              </Button>
                            </td>
                          </React.Fragment>
                        ))}
                    </tr>
                  </Fragment>
                )}
              </tbody>
            </table>
          </Grid>
        </Grid>
      </Paper>
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

export default withStyles(styles)(connector(TenantSummary));
