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
  actionsTray,
  buttonsStyles,
  containerForHeader,
  hrClass,
  modalBasic,
  searchField,
} from "../../Common/FormComponents/common/styleLibrary";
import Grid from "@material-ui/core/Grid";
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  TextField,
} from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { CreateIcon } from "../../../../icons";
import TableWrapper from "../../Common/TableWrapper/TableWrapper";
import Paper from "@material-ui/core/Paper";
import { niceBytes, niceDays } from "../../../../common/utils";
import AddPoolModal from "./AddPoolModal";
import AddBucket from "../../Buckets/ListBuckets/AddBucket";
import ReplicationSetup from "./ReplicationSetup";
import api from "../../../../common/api";
import { IPodListElement, IPool, ITenant } from "../ListTenants/types";
import PageHeader from "../../Common/PageHeader/PageHeader";
import UsageBarWrapper from "../../Common/UsageBarWrapper/UsageBarWrapper";
import UpdateTenantModal from "./UpdateTenantModal";
import { LicenseInfo } from "../../License/types";
import { Link } from "react-router-dom";
import { setErrorSnackMessage } from "../../../../actions";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import TenantYAML from "./TenantYAML";
import SubnetLicenseTenant from "./SubnetLicenseTenant";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";

interface ITenantDetailsProps {
  classes: any;
  match: any;
  setErrorSnackMessage: typeof setErrorSnackMessage;
}

interface ITenantUsage {
  used: string;
  disk_used: string;
}

const styles = (theme: Theme) =>
  createStyles({
    buttonContainer: {
      textAlign: "right",
    },
    multiContainer: {
      display: "flex",
      alignItems: "center" as const,
      justifyContent: "flex-start" as const,
    },
    sizeFactorContainer: {
      marginLeft: 8,
    },
    containerHeader: {
      display: "flex",
      justifyContent: "space-between",
    },
    paperContainer: {
      padding: "15px 15px 15px 50px",
    },
    infoGrid: {
      display: "grid",
      gridTemplateColumns: "auto auto auto auto",
      gridGap: 8,
      "& div": {
        display: "flex",
        alignItems: "center",
      },
      "& div:nth-child(odd)": {
        justifyContent: "flex-end",
        fontWeight: 700,
      },
      "& div:nth-child(2n)": {
        paddingRight: 35,
      },
    },
    masterActions: {
      width: "25%",
      minWidth: "120px",
      "& div": {
        margin: "5px 0px",
      },
    },
    updateButton: {
      backgroundColor: "transparent",
      border: 0,
      padding: "0 6px",
      cursor: "pointer",
      "&:focus, &:active": {
        outline: "none",
      },
      "& svg": {
        height: 12,
      },
    },
    poolLabel: {
      color: "#666666",
    },
    breadcrumLink: {
      textDecoration: "none",
      color: "black",
    },
    ...modalBasic,
    ...actionsTray,
    ...buttonsStyles,
    ...searchField,
    ...hrClass,
    actionsTray: {
      ...actionsTray.actionsTray,
      padding: "15px 0 0",
    },
    ...containerForHeader(theme.spacing(4)),
  });

const TenantDetails = ({
  classes,
  match,
  setErrorSnackMessage,
}: ITenantDetailsProps) => {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [capacity, setCapacity] = useState<number>(0);
  const [poolCount, setPoolCount] = useState<number>(0);
  const [pools, setPools] = useState<IPool[]>([]);
  const [pods, setPods] = useState<IPodListElement[]>([]);
  const [instances, setInstances] = useState<number>(0);
  const [volumes, setVolumes] = useState<number>(0);
  const [addPoolOpen, setAddPool] = useState<boolean>(false);
  const [addBucketOpen, setAddBucketOpen] = useState<boolean>(false);
  const [addReplicationOpen, setAddReplicationOpen] = useState<boolean>(false);
  const [tenant, setTenant] = useState<ITenant | null>(null);
  const [loadingUsage, setLoadingUsage] = useState<boolean>(true);
  const [usageError, setUsageError] = useState<string>("");
  const [usage, setUsage] = useState<number>(0);
  const [updateMinioVersion, setUpdateMinioVersion] = useState<boolean>(false);
  const [yamlScreenOpen, setYamlScreenOpen] = useState<boolean>(false);
  const [licenseInfo, setLicenseInfo] = useState<LicenseInfo>();
  const [loadingLicenseInfo, setLoadingLicenseInfo] = useState<boolean>(true);
  const [loadingActivateProduct, setLoadingActivateProduct] =
    useState<boolean>(false);
  const [logEnabled, setLogEnabled] = useState<boolean>(false);
  const [monitoringEnabled, setMonitoringEnabled] = useState<boolean>(false);
  const [encryptionEnabled, setEncryptionEnabled] = useState<boolean>(false);
  const [adEnabled, setAdEnabled] = useState<boolean>(false);
  const [oicEnabled, setOicEnabled] = useState<boolean>(false);

  const tenantName = match.params["tenantName"];
  const tenantNamespace = match.params["tenantNamespace"];

  const onClosePoolAndRefresh = (reload: boolean) => {
    setAddPool(false);

    if (reload) {
      loadInfo();
      loadUsage();
    }
  };

  const closeBucketsAndRefresh = () => {
    setAddBucketOpen(false);
  };

  const closeReplicationAndRefresh = (reload: boolean) => {
    setAddReplicationOpen(false);

    if (reload) {
      loadInfo();
      loadUsage();
    }
  };

  const activateProduct = (namespace: string, tenant: string) => {
    if (loadingActivateProduct) {
      return;
    }
    setLoadingActivateProduct(true);
    api
      .invoke(
        "POST",
        `/api/v1/subscription/namespaces/${namespace}/tenants/${tenant}/activate`,
        {}
      )
      .then(() => {
        setLoadingActivateProduct(false);
        loadInfo();
      })
      .catch((err) => {
        setLoadingActivateProduct(false);
        setErrorSnackMessage(err);
      });
  };

  const loadInfo = () => {
    api
      .invoke(
        "GET",
        `/api/v1/namespaces/${tenantNamespace}/tenants/${tenantName}`
      )
      .then((res: ITenant) => {
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

        setPools(resPools);

        setLogEnabled(res.logEnabled);
        setMonitoringEnabled(res.monitoringEnabled);
        setEncryptionEnabled(res.encryptionEnabled);
        setAdEnabled(res.idpAdEnabled);
        setOicEnabled(res.idpOicEnabled);

        setTenant(res);
      })
      .catch((err) => {
        setErrorSnackMessage(err);
      });
  };

  const loadUsage = () => {
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
  };

  const loadPods = () => {
    api
      .invoke(
        "GET",
        `/api/v1/namespaces/${tenantNamespace}/tenants/${tenantName}/pods`
      )
      .then((result: IPodListElement[]) => {
        for (let i = 0; i < result.length; i++) {
          let currentTime = new Date().getSeconds();
          result[i].time = niceDays(
            (currentTime - parseInt(result[i].timeCreated)).toString()
          );
        }
        setPods(result);
      })
      .catch((err) => {
        setErrorSnackMessage("Error loading pods");
      });
  };

  const fetchLicenseInfo = () => {
    setLoadingLicenseInfo(true);
    api
      .invoke("GET", `/api/v1/subscription/info`)
      .then((res: LicenseInfo) => {
        setLicenseInfo(res);
        setLoadingLicenseInfo(false);
      })
      .catch((err: any) => {
        setLoadingLicenseInfo(false);
      });
  };

  useEffect(() => {
    loadInfo();
    loadUsage();
    fetchLicenseInfo();
    loadPods();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleTenantMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const editYaml = () => {
    setAnchorEl(null);
    setYamlScreenOpen(true);
  };

  const closeYAMLModalAndRefresh = () => {
    setYamlScreenOpen(false);
    loadInfo();
  };

  return (
    <React.Fragment>
      {addPoolOpen && tenant !== null && (
        <AddPoolModal
          open={addPoolOpen}
          onClosePoolAndReload={onClosePoolAndRefresh}
          tenant={tenant}
        />
      )}
      {addBucketOpen && (
        <AddBucket
          open={addBucketOpen}
          closeModalAndRefresh={closeBucketsAndRefresh}
        />
      )}
      {addReplicationOpen && (
        <ReplicationSetup
          open={addReplicationOpen}
          closeModalAndRefresh={closeReplicationAndRefresh}
        />
      )}
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
      {yamlScreenOpen && (
        <TenantYAML
          open={yamlScreenOpen}
          closeModalAndRefresh={closeYAMLModalAndRefresh}
          tenant={tenantName}
          namespace={tenantNamespace}
        />
      )}
      <PageHeader
        label={
          <Fragment>
            <Link to={"/tenants"} className={classes.breadcrumLink}>
              Tenant
            </Link>
            {` > ${match.params["tenantName"]}`}
            <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={handleTenantMenu}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="long-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={editYaml}
            >
              <MenuItem key="yaml" onClick={editYaml}>
                Edit YAML
              </MenuItem>
            </Menu>
          </Fragment>
        }
      />
      <Grid item xs={12} className={classes.container} />
      <Grid container>
        <Grid item xs={12}>
          <Tabs
            value={selectedTab}
            indicatorColor="primary"
            textColor="primary"
            onChange={(_, newValue: number) => {
              setSelectedTab(newValue);
            }}
            aria-label="tenant-tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Summary" />
            <Tab label="Pools" />
            <Tab label="Pods" />
            <Tab label="License" />
          </Tabs>
        </Grid>
        <Grid item xs={12}>
          {selectedTab === 0 && (
            <React.Fragment>
              <br />
              <Paper className={classes.paperContainer}>
                <Grid container>
                  <Grid item xs={8}>
                    <table width={"100%"}>
                      <tr>
                        <td colSpan={4}>
                          <h2>Details</h2>
                          <hr className={classes.hrClass} />
                        </td>
                      </tr>
                      <tr>
                        <td>Capacity:</td>
                        <td>{niceBytes(capacity.toString(10))}</td>
                        <td>MinIO:</td>
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
                        <td>Clusters:</td>
                        <td>{poolCount}</td>
                        <td>Console:</td>
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
                        <td>Instances:</td>
                        <td>{instances}</td>
                        <td>Volumes:</td>
                        <td>{volumes}</td>
                        {tenant?.endpoints && (
                          <React.Fragment>
                            <td>Endpoint:</td>
                            <td>
                              <a
                                href={tenant?.endpoints.minio}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {tenant?.endpoints.minio}
                              </a>
                            </td>
                            <td>Console:</td>
                            <td>
                              <a
                                href={tenant?.endpoints.console}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {tenant?.endpoints.console}
                              </a>
                            </td>
                          </React.Fragment>
                        )}
                      </tr>
                      <tr>
                        <td>State:</td>
                        <td colSpan={3}>{tenant?.currentState}</td>
                      </tr>
                    </table>
                  </Grid>
                  <Grid item xs={4}>
                    <UsageBarWrapper
                      currValue={usage}
                      maxValue={tenant ? tenant.total_size : 0}
                      label={"Storage"}
                      renderFunction={niceBytes}
                      error={usageError}
                      loading={loadingUsage}
                    />
                  </Grid>
                </Grid>
              </Paper>
              <br />
              <br />
              <Paper className={classes.paperContainer}>
                <Grid container>
                  <Grid item xs={12}>
                    <table width={"100%"}>
                      <tr>
                        <td colSpan={4}>
                          <h2>Features</h2>
                          <hr className={classes.hrClass} />
                        </td>
                      </tr>
                      <tr>
                        <td>Logs:</td>
                        <td>
                          <Button
                            color="primary"
                            className={classes.anchorButton}
                          >
                            {logEnabled ? "Enabled" : "Disabled"}
                          </Button>
                        </td>
                        <td>Monitoring:</td>
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
                        <td>Encryption:</td>
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
                              <td>Active Directory:</td>
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
                              <td>OpenID:</td>
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
                    </table>
                  </Grid>
                </Grid>
              </Paper>
            </React.Fragment>
          )}
          {selectedTab === 1 && (
            <Grid container>
              <Grid item xs={12} className={classes.actionsTray}>
                <TextField
                  placeholder="Filter"
                  className={classes.searchField}
                  id="search-resource"
                  label=""
                  onChange={(event) => {
                    // setFilter(event.target.value);
                  }}
                  InputProps={{
                    disableUnderline: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CreateIcon />}
                  onClick={() => {
                    setAddPool(true);
                  }}
                >
                  Expand Tenant
                </Button>
              </Grid>
              <Grid item xs={12}>
                <br />
              </Grid>

              <Grid item xs={12}>
                <TableWrapper
                  itemActions={[
                    {
                      type: "delete",
                      onClick: (element) => {
                        console.log(element);
                      },
                      sendOnlyId: true,
                    },
                  ]}
                  columns={[
                    { label: "Name", elementKey: "name" },
                    { label: "Capacity", elementKey: "capacity" },
                    { label: "# of Instances", elementKey: "servers" },
                    { label: "# of Drives", elementKey: "volumes" },
                  ]}
                  isLoading={false}
                  records={pools}
                  entityName="Servers"
                  idField="name"
                />
              </Grid>
            </Grid>
          )}
          {selectedTab === 2 && (
            <React.Fragment>
              <br />
              <TableWrapper
                columns={[
                  { label: "Name", elementKey: "name" },
                  { label: "Status", elementKey: "status" },
                  { label: "Age", elementKey: "time" },
                  { label: "Pod IP", elementKey: "podIP" },
                  {
                    label: "Restarts",
                    elementKey: "restarts",
                    renderFunction: (input) => {
                      return input != null ? input : 0;
                    },
                  },
                  { label: "Node", elementKey: "node" },
                ]}
                isLoading={false}
                records={pods}
                entityName="Servers"
                idField="name"
              />
            </React.Fragment>
          )}
          {selectedTab === 3 && (
            <React.Fragment>
              <br />
              <Grid container>
                <Grid item xs={12}>
                  <SubnetLicenseTenant
                    tenant={tenant}
                    loadingLicenseInfo={loadingLicenseInfo}
                    loadingActivateProduct={loadingActivateProduct}
                    licenseInfo={licenseInfo}
                    activateProduct={activateProduct}
                  />
                </Grid>
              </Grid>
            </React.Fragment>
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const connector = connect(null, {
  setErrorSnackMessage,
});

export default withStyles(styles)(connector(TenantDetails));
