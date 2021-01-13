// This file is part of MinIO Console Server
// Copyright (c) 2020 MinIO, Inc.
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

import React, { useEffect, useState } from "react";
import get from "lodash/get";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import {
  containerForHeader,
  modalBasic,
} from "../../Common/FormComponents/common/styleLibrary";
import Grid from "@material-ui/core/Grid";
import { Button, Typography } from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { CreateIcon } from "../../../../icons";
import TableWrapper from "../../Common/TableWrapper/TableWrapper";
import Paper from "@material-ui/core/Paper";
import { niceBytes } from "../../../../common/utils";
import AddPoolModal from "./AddPoolModal";
import AddBucket from "../../Buckets/ListBuckets/AddBucket";
import ReplicationSetup from "./ReplicationSetup";
import api from "../../../../common/api";
import { IPool, ITenant } from "../ListTenants/types";
import PageHeader from "../../Common/PageHeader/PageHeader";
import UsageBarWrapper from "../../Common/UsageBarWrapper/UsageBarWrapper";
import UpdateTenantModal from "./UpdateTenantModal";
import PencilIcon from "../../Common/TableWrapper/TableActionIcons/PencilIcon";
import ErrorBlock from "../../../shared/ErrorBlock";
import { LicenseInfo } from "../../License/types";
import { Link } from "react-router-dom";

interface ITenantDetailsProps {
  classes: any;
  match: any;
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
    actionsTray: {
      textAlign: "right",
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
    noUnderLine: {
      textDecoration: "none",
    },
    ...modalBasic,
    ...containerForHeader(theme.spacing(4)),
  });

const TenantDetails = ({ classes, match }: ITenantDetailsProps) => {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [capacity, setCapacity] = useState<number>(0);
  const [poolCount, setPoolCount] = useState<number>(0);
  const [serverSets, setServerSets] = useState<IPool[]>([]);
  const [instances, setInstances] = useState<number>(0);
  const [volumes, setVolumes] = useState<number>(0);
  const [addPoolOpen, setAddPool] = useState<boolean>(false);
  const [addBucketOpen, setAddBucketOpen] = useState<boolean>(false);
  const [addReplicationOpen, setAddReplicationOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [tenant, setTenant] = useState<ITenant | null>(null);
  const [loadingUsage, setLoadingUsage] = useState<boolean>(true);
  const [usageError, setUsageError] = useState<string>("");
  const [usage, setUsage] = useState<number>(0);
  const [updateMinioVersion, setUpdateMinioVersion] = useState<boolean>(false);
  const [licenseInfo, setLicenseInfo] = useState<LicenseInfo>();
  const [loadingLicenseInfo, setLoadingLicenseInfo] = useState<boolean>(true);
  const [loadingActivateProduct, setLoadingActivateProduct] = useState<boolean>(
    false
  );

  const tenantName = match.params["tenantName"];
  const tenantNamespace = match.params["tenantNamespace"];

  const onClosePoolAndRefresh = (reload: boolean) => {
    setAddPool(false);

    if (reload) {
      console.log("reload");
    }
  };

  const closeBucketsAndRefresh = () => {
    setAddBucketOpen(false);
  };

  const closeReplicationAndRefresh = (reload: boolean) => {
    setAddReplicationOpen(false);

    if (reload) {
      console.log("reload");
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
        setError("");
        loadInfo();
      })
      .catch((err) => {
        setLoadingActivateProduct(false);
        setError(err);
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
        let count = 1;
        for (let pool of resPools) {
          const cap =
            pool.volumes_per_server *
            pool.servers *
            pool.volume_configuration.size;
          pool.name = `pool-${count}`;
          pool.capacity = niceBytes(cap + "");
          pool.volumes = pool.servers * pool.volumes_per_server;
          totalInstances += pool.servers;
          totalVolumes += pool.volumes;
          count += 1;
        }
        setCapacity(res.total_size);
        setPoolCount(resPools.length);
        setVolumes(totalVolumes);
        setInstances(totalInstances);

        setServerSets(resPools);

        setTenant(res);
        setError("");
      })
      .catch((err) => {
        setError(err);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <PageHeader label={`Tenant > ${match.params["tenantName"]}`} />
      <Grid item xs={12} className={classes.container} />
      <Grid container>
        {error !== "" && (
          <Grid item xs={12}>
            <ErrorBlock errorMessage={error} withBreak={false} />
          </Grid>
        )}
        <Grid item xs={12}>
          <br />
        </Grid>
        <Grid item xs={9} className={classes.containerHeader}>
          <Paper className={classes.paperContainer}>
            <div className={classes.infoGrid}>
              <div>Capacity:</div>
              <div>{niceBytes(capacity.toString(10))}</div>
              <div>Minio:</div>
              <div>
                {tenant ? tenant.image : ""}{" "}
                <button
                  className={classes.updateButton}
                  onClick={() => {
                    setUpdateMinioVersion(true);
                  }}
                >
                  <PencilIcon active={false} />
                </button>
              </div>
              <div>Clusters:</div>
              <div>{poolCount}</div>
              <div>Console:</div>
              <div>{tenant ? tenant.console_image : ""}</div>
              <div>Instances:</div>
              <div>{instances}</div>
              <div>Volumes:</div>
              <div>{volumes}</div>
              {tenant?.endpoints && (
                <React.Fragment>
                  <div>Endpoint:</div>
                  <div>
                    <a
                      href={tenant?.endpoints.minio}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {tenant?.endpoints.minio}
                    </a>
                  </div>
                  <div>Console:</div>
                  <div>
                    <a
                      href={tenant?.endpoints.console}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {tenant?.endpoints.console}
                    </a>
                  </div>
                </React.Fragment>
              )}
            </div>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <UsageBarWrapper
            currValue={usage}
            maxValue={tenant ? tenant.total_size : 0}
            label={"Storage"}
            renderFunction={niceBytes}
            error={usageError}
            loading={loadingUsage}
          />
        </Grid>
        <Grid item xs={12}>
          <br />
        </Grid>
        <Grid item xs={6}>
          <Tabs
            value={selectedTab}
            indicatorColor="primary"
            textColor="primary"
            onChange={(_, newValue: number) => {
              setSelectedTab(newValue);
            }}
            aria-label="tenant-tabs"
          >
            <Tab label="Clusters" />
            <Tab label="License" />
          </Tabs>
        </Grid>
        <Grid item xs={6} className={classes.actionsTray}>
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
          {selectedTab === 0 && (
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
              records={serverSets}
              entityName="Servers"
              idField="name"
            />
          )}
          {selectedTab === 1 && (
            <React.Fragment>
              <Grid container>
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    {tenant && tenant.subnet_license ? (
                      <Grid className={classes.paperContainer}>
                        <Typography
                          component="h2"
                          variant="h6"
                          className={classes.pageTitle}
                        >
                          Subscription Information
                        </Typography>
                        Account ID: {tenant.subnet_license.account_id}
                        <br />
                        <br />
                        Email: {tenant.subnet_license.email}
                        <br />
                        <br />
                        Plan: {tenant.subnet_license.plan}
                        <br />
                        <br />
                        Organization: {tenant.subnet_license.organization}
                        <br />
                        <br />
                        Storage Capacity:{" "}
                        {tenant.subnet_license.storage_capacity}
                        <br />
                        <br />
                        Expiration: {tenant.subnet_license.expires_at}
                      </Grid>
                    ) : (
                      !loadingLicenseInfo && (
                        <Grid className={classes.paperContainer}>
                          {!licenseInfo && (
                            <Link
                              to={"/license"}
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              className={classes.noUnderLine}
                            >
                              <Button
                                className={classes.licenseButton}
                                variant="contained"
                                color="primary"
                              >
                                Activate Product
                              </Button>
                            </Link>
                          )}
                          {licenseInfo && tenant && (
                            <Button
                              disabled={loadingActivateProduct}
                              className={classes.licenseButton}
                              variant="contained"
                              color="primary"
                              onClick={() =>
                                activateProduct(tenant.namespace, tenant.name)
                              }
                            >
                              Attach License
                            </Button>
                          )}
                        </Grid>
                      )
                    )}
                  </Paper>
                </Grid>
              </Grid>
            </React.Fragment>
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default withStyles(styles)(TenantDetails);
