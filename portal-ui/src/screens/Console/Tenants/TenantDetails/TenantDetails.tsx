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

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
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
import { LicenseInfo } from "../../License/types";
import { Link } from "react-router-dom";
import { setErrorSnackMessage } from "../../../../actions";
import Moment from "react-moment";
import { Fragment } from "react";

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
    poolLabel: {
      color: "#666666",
    },
    licenseContainer: {
      position: "relative",
      padding: "20px 52px 0px 28px",
      background: "#032F51",
      boxShadow: "0px 3px 7px #00000014",
      "& h2": {
        color: "#FFF",
        marginBottom: 67,
      },
      "& a": {
        textDecoration: "none",
      },
      "& h3": {
        color: "#FFFFFF",
        marginBottom: "30px",
        fontWeight: "bold",
      },
      "& h6": {
        color: "#FFFFFF !important",
      },
    },
    licenseInfo: { color: "#FFFFFF", position: "relative" },
    licenseInfoTitle: {
      textTransform: "none",
      color: "#BFBFBF",
      fontSize: 11,
    },
    licenseInfoValue: {
      textTransform: "none",
      fontSize: 14,
      fontWeight: "bold",
    },
    verifiedIcon: {
      width: 96,
      position: "absolute",
      right: 0,
      bottom: 29,
    },
    breadcrumLink: {
      textDecoration: "none",
      color: "black",
    },
    ...modalBasic,
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
        setCapacity(res.total_size);
        setPoolCount(resPools.length);
        setVolumes(totalVolumes);
        setInstances(totalInstances);

        setPools(resPools);

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
      <PageHeader
        label={
          <Fragment>
            <Link to={"/tenants"} className={classes.breadcrumLink}>
              Tenant
            </Link>
            {` > ${match.params["tenantName"]}`}
          </Fragment>
        }
      />
      <Grid item xs={12} className={classes.container} />
      <Grid container>
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
              records={pools}
              entityName="Servers"
              idField="name"
            />
          )}
          {selectedTab === 1 && (
            <React.Fragment>
              <Grid container>
                <Grid item xs={12}>
                  <Paper
                    className={
                      tenant && tenant.subnet_license
                        ? classes.licenseContainer
                        : ""
                    }
                  >
                    {tenant && tenant.subnet_license ? (
                      <React.Fragment>
                        <Grid container className={classes.licenseInfo}>
                          <Grid item xs={6}>
                            <Typography
                              variant="button"
                              display="block"
                              gutterBottom
                              className={classes.licenseInfoTitle}
                            >
                              License
                            </Typography>
                            <Typography
                              variant="overline"
                              display="block"
                              gutterBottom
                              className={classes.licenseInfoValue}
                            >
                              Commercial License
                            </Typography>
                            <Typography
                              variant="button"
                              display="block"
                              gutterBottom
                              className={classes.licenseInfoTitle}
                            >
                              Organization
                            </Typography>
                            <Typography
                              variant="overline"
                              display="block"
                              gutterBottom
                              className={classes.licenseInfoValue}
                            >
                              {tenant.subnet_license.organization}
                            </Typography>
                            <Typography
                              variant="button"
                              display="block"
                              gutterBottom
                              className={classes.licenseInfoTitle}
                            >
                              Registered Capacity
                            </Typography>
                            <Typography
                              variant="overline"
                              display="block"
                              gutterBottom
                              className={classes.licenseInfoValue}
                            >
                              {niceBytes(
                                (
                                  tenant.subnet_license.storage_capacity *
                                  1099511627776
                                ) // 1 Terabyte = 1099511627776 Bytes
                                  .toString(10)
                              )}
                            </Typography>
                            <Typography
                              variant="button"
                              display="block"
                              gutterBottom
                              className={classes.licenseInfoTitle}
                            >
                              Expiry Date
                            </Typography>
                            <Typography
                              variant="overline"
                              display="block"
                              gutterBottom
                              className={classes.licenseInfoValue}
                            >
                              <Moment format="YYYY-MM-DD">
                                {tenant.subnet_license.expires_at}
                              </Moment>
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="button"
                              display="block"
                              gutterBottom
                              className={classes.licenseInfoTitle}
                            >
                              Subscription Plan
                            </Typography>
                            <Typography
                              variant="overline"
                              display="block"
                              gutterBottom
                              className={classes.licenseInfoValue}
                            >
                              {tenant.subnet_license.plan}
                            </Typography>
                            <Typography
                              variant="button"
                              display="block"
                              gutterBottom
                              className={classes.licenseInfoTitle}
                            >
                              Requester
                            </Typography>
                            <Typography
                              variant="overline"
                              display="block"
                              gutterBottom
                              className={classes.licenseInfoValue}
                            >
                              {tenant.subnet_license.email}
                            </Typography>
                          </Grid>
                          <img
                            className={classes.verifiedIcon}
                            src={"/verified.svg"}
                          />
                        </Grid>
                      </React.Fragment>
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

const connector = connect(null, {
  setErrorSnackMessage,
});

export default withStyles(styles)(connector(TenantDetails));
