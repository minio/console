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
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import {
  containerForHeader,
  tenantDetailsStyles,
} from "../../Common/FormComponents/common/styleLibrary";
import Grid from "@mui/material/Grid";
import { Button, CircularProgress } from "@mui/material";
import Paper from "@mui/material/Paper";
import { niceBytes } from "../../../../common/utils";
import { ITenant } from "../ListTenants/types";
import UsageBarWrapper from "../../Common/UsageBarWrapper/UsageBarWrapper";
import UpdateTenantModal from "./UpdateTenantModal";
import { AppState } from "../../../../store";
import history from "./../../../../history";
import { CircleIcon } from "../../../../icons";
import { tenantIsOnline } from "../ListTenants/utils";
import AButton from "../../Common/AButton/AButton";

interface ITenantsSummary {
  classes: any;
  match: any;
  tenant: ITenant | null;
  logEnabled: boolean;
  monitoringEnabled: boolean;
  encryptionEnabled: boolean;
  minioTLS: boolean;
  consoleTLS: boolean;
  consoleEnabled: boolean;
  adEnabled: boolean;
  oidcEnabled: boolean;
  loadingTenant: boolean;
}

const styles = (theme: Theme) =>
  createStyles({
    ...tenantDetailsStyles,
    redState: {
      color: theme.palette.error.main,
      "& .min-icon": {
        width: 16,
        height: 16,
        marginRight: 4,
      },
    },
    yellowState: {
      color: theme.palette.warning.main,
      "& .min-icon": {
        width: 16,
        height: 16,
        marginRight: 4,
      },
    },
    greenState: {
      color: theme.palette.success.main,
      "& .min-icon": {
        width: 16,
        height: 16,
        marginRight: 4,
      },
    },
    greyState: {
      color: "grey",
      "& .min-icon": {
        width: 16,
        height: 16,
        marginRight: 4,
      },
    },
    centerAlign: {
      textAlign: "center",
    },
    detailSection: {
      "& div": {
        "& b,i": {
          minWidth: 80,
          display: "block",
          float: "left",
        },
        "& i": {
          fontStyle: "normal",
          wordWrap: "break-word",
          overflowWrap: "break-word",
        },
        "& div": {
          clear: "both",
        },
        clear: "both",
        marginBottom: 2,
      },
    },
    linkedSection: {
      color: theme.palette.info.main,
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
  minioTLS,
  consoleTLS,
  consoleEnabled,
  adEnabled,
  oidcEnabled,
  loadingTenant,
}: ITenantsSummary) => {
  const [capacity, setCapacity] = useState<number>(0);
  const [poolCount, setPoolCount] = useState<number>(0);
  const [instances, setInstances] = useState<number>(0);
  const [volumes, setVolumes] = useState<number>(0);
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
    if (tenant) {
      setCapacity(tenant.total_size || 0);
      setPoolCount(tenant.pools.length);
      setVolumes(tenant.total_volumes || 0);
      setInstances(tenant.total_instances || 0);
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
      <h1 className={classes.sectionTitle}>Summary</h1>
      <Paper className={classes.paperContainer}>
        <Grid container>
          <Grid item xs={12} sm={8}>
            <Grid container>
              <Grid item xs={12}>
                <h2>Details</h2>
                <hr className={classes.hrClass} />
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                className={classes.detailSection}
              >
                <div>
                  <b>Capacity:</b>
                  <i>{niceBytes(capacity.toString(10))}</i>
                  <div />
                </div>
                <div>
                  <b>Instances:</b>
                  <i>{instances}</i>
                  <div />
                </div>
                <div>
                  <b>Endpoint:</b>
                  <i>
                    <a
                      href={tenant?.endpoints?.minio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={classes.linkedSection}
                    >
                      {tenant?.endpoints?.minio}
                    </a>
                  </i>
                  <div />
                </div>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                className={classes.detailSection}
              >
                <div>
                  <b>Clusters:</b>
                  <i>{poolCount}</i>
                  <div />
                </div>
                <div>
                  <b>Volumes:</b>
                  <i>{volumes}</i>
                  <div />
                </div>
                <div>
                  <b>Console:</b>
                  <i>
                    <a
                      href={tenant?.endpoints?.console}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={classes.linkedSection}
                    >
                      {tenant?.endpoints?.console}
                    </a>
                  </i>
                  <div />
                </div>
              </Grid>
              <Grid item xs={12} className={classes.detailSection}>
                <div>
                  <b>MinIO:</b>
                  <i>
                    <AButton
                      onClick={() => {
                        setUpdateMinioVersion(true);
                      }}
                    >
                      {tenant ? tenant.image : ""}
                    </AButton>
                  </i>
                  <div />
                </div>
              </Grid>
              <Grid item xs={12} className={classes.detailSection}>
                <div>
                  <b>State:</b>
                  <i>{tenant?.currentState}</i>
                  <div />
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={4}>
            {loadingTenant ? (
              <div className={classes.centerAlign}>
                <CircularProgress />
              </div>
            ) : (
              <Fragment>
                <UsageBarWrapper
                  currValue={tenant?.status?.usage?.raw_usage ?? 0}
                  maxValue={tenant?.status?.usage?.raw ?? 1}
                  label={"Storage"}
                  renderFunction={niceBytes}
                  error={""}
                  loading={false}
                />
                <h4>
                  {tenant && tenant.status && (
                    <span
                      className={healthStatusToClass(
                        tenant?.status?.health_status
                      )}
                    >
                      <CircleIcon />
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
                <Button
                  size={"small"}
                  color={"primary"}
                  variant="contained"
                  style={{ textDecoration: "none !important" }}
                  onClick={() => {
                    history.push(
                      `/namespaces/${tenantNamespace}/tenants/${tenantName}/hop`
                    );
                  }}
                  disabled={!tenant || !tenantIsOnline(tenant)}
                >
                  Manage Tenant
                </Button>
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
            <h2>Features</h2>
            <hr className={classes.hrClass} />
          </Grid>
          {loadingTenant ? (
            <Grid item xs={12} className={classes.centerAlign}>
              <CircularProgress />
            </Grid>
          ) : (
            <Fragment>
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                className={classes.detailSection}
              >
                <div>
                  <b>Logs:</b>
                  <i>
                    <Button color="primary" className={classes.anchorButton}>
                      {logEnabled ? "Enabled" : "Disabled"}
                    </Button>
                  </i>
                  <div />
                </div>
                <div>
                  <b>MinIO TLS:</b>
                  <i>
                    <Button color="primary" className={classes.anchorButton}>
                      {minioTLS ? "Enabled" : "Disabled"}
                    </Button>
                  </i>
                  <div />
                </div>
                <div>
                  <b>AD/LDAP:</b>
                  <i>
                    <Button color="primary" className={classes.anchorButton}>
                      {adEnabled ? "Enabled" : "Disabled"}
                    </Button>
                  </i>
                  <div />
                </div>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                className={classes.detailSection}
              >
                <div>
                  <b>Monitoring:</b>
                  <i>
                    <Button color="primary" className={classes.anchorButton}>
                      {monitoringEnabled ? "Enabled" : "Disabled"}
                    </Button>
                  </i>
                  <div />
                </div>
                <div>
                  <b>Encryption:</b>
                  <i>
                    <Button color="primary" className={classes.anchorButton}>
                      {encryptionEnabled ? "Enabled" : "Disabled"}
                    </Button>
                  </i>
                  <div />
                </div>
                <div>
                  <b>OpenID:</b>
                  <i>
                    <Button color="primary" className={classes.anchorButton}>
                      {oidcEnabled ? "Enabled" : "Disabled"}
                    </Button>
                  </i>
                  <div />
                </div>
              </Grid>
            </Fragment>
          )}
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
  minioTLS: get(state.tenants.tenantDetails.tenantInfo, "minioTLS", false),
  consoleTLS: get(state.tenants.tenantDetails.tenantInfo, "consoleTLS", false),
  consoleEnabled: get(
    state.tenants.tenantDetails.tenantInfo,
    "consoleEnabled",
    false
  ),
  adEnabled: get(state.tenants.tenantDetails.tenantInfo, "idpAdEnabled", false),
  oidcEnabled: get(
    state.tenants.tenantDetails.tenantInfo,
    "idpOidcEnabled",
    false
  ),
});

const connector = connect(mapState, null);

export default withStyles(styles)(connector(TenantSummary));
