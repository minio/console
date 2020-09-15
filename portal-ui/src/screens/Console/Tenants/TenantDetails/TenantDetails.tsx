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

import React, { useState, useEffect } from "react";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { modalBasic } from "../../Common/FormComponents/common/styleLibrary";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { Button } from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { CreateIcon } from "../../../../icons";
import TableWrapper from "../../Common/TableWrapper/TableWrapper";
import { MinTablePaginationActions } from "../../../../common/MinTablePaginationActions";
import Paper from "@material-ui/core/Paper";
import { niceBytes } from "../../../../common/utils";
import AddZoneModal from "./AddZoneModal";
import AddBucket from "../../Buckets/ListBuckets/AddBucket";
import ReplicationSetup from "./ReplicationSetup";
import api from "../../../../common/api";
import { BucketInfo } from "../../Buckets/types";
import { ITenant, IZone } from "../ListTenants/types";

interface ITenantDetailsProps {
  classes: any;
  match: any;
}

const styles = (theme: Theme) =>
  createStyles({
    errorBlock: {
      color: "red",
    },
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
    ...modalBasic,
  });

const mainPagination = {
  rowsPerPageOptions: [5, 10, 25],
  colSpan: 3,
  count: 0,
  rowsPerPage: 0,
  page: 0,
  SelectProps: {
    inputProps: { "aria-label": "rows per page" },
    native: true,
  },
  ActionsComponent: MinTablePaginationActions,
};

const TenantDetails = ({ classes, match }: ITenantDetailsProps) => {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [capacity, setCapacity] = useState<number>(0);
  const [externalIDP, setExternalIDP] = useState<boolean>(false);
  const [externalKMS, setExternalKMS] = useState<boolean>(false);
  const [zoneCount, setZoneCount] = useState<number>(0);
  const [zones, setZones] = useState<IZone[]>([]);
  const [instances, setInstances] = useState<number>(0);
  const [volumes, setVolumes] = useState<number>(0);
  const [addZoneOpen, setAddZone] = useState<boolean>(false);
  const [addBucketOpen, setAddBucketOpen] = useState<boolean>(false);
  const [addReplicationOpen, setAddReplicationOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [tenant, setTenant] = useState<ITenant | null>(null);

  const onCloseZoneAndRefresh = (reload: boolean) => {
    setAddZone(false);

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

  const loadInfo = () => {
    const tenantName = match.params["tenantName"];

    setLoading(true);

    api
      .invoke("GET", `/api/v1/tenants/${tenantName}`)
      .then((res: ITenant) => {
        const total = res.volume_count * res.volume_size;

        setCapacity(total);
        setZoneCount(res.zone_count);
        setVolumes(res.volume_count);
        setInstances(res.instance_count);
        const resZones = !res.zones ? [] : res.zones;
        for (let zone of resZones) {
          zone.volumes = res.volumes_per_server;
          const cap = res.volumes_per_server * res.volume_size * zone.servers;
          zone.capacity = niceBytes(cap + "");
        }
        setZones(resZones);

        setTenant(res);
        setError("");
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadInfo();
  }, []);

  return (
    <React.Fragment>
      {addZoneOpen && tenant !== null && (
        <AddZoneModal
          open={addZoneOpen}
          onCloseZoneAndReload={onCloseZoneAndRefresh}
          volumeSize={tenant.volume_size}
          volumesPerInstance={tenant.volumes_per_server}
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
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h6">
            {`Tenant > ${match.params["tenantName"]}`}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <br />
        </Grid>
        <Grid item xs={12} className={classes.containerHeader}>
          <Paper className={classes.paperContainer}>
            <div className={classes.infoGrid}>
              <div>Capacity:</div>
              <div>{niceBytes(capacity.toString(10))}</div>
              <div>Zones:</div>
              <div>{zoneCount}</div>
              <div>External IDP:</div>
              <div>
                {externalIDP ? "Yes" : "No"}&nbsp;&nbsp;
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => {}}
                >
                  Edit
                </Button>
              </div>
              <div>Instances:</div>
              <div>{instances}</div>
              <div>External KMS:</div>
              <div>{externalKMS ? "Yes" : "No"}&nbsp;&nbsp;</div>
              <div>Volumes:</div>
              <div>{volumes}</div>
            </div>
          </Paper>
          <div className={classes.masterActions}>
            <div>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => {}}
              >
                Warp
              </Button>
            </div>
          </div>
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
            <Tab label="Zones" />
            <Tab label="Buckets" />
            <Tab label="Replication" />
          </Tabs>
        </Grid>
        <Grid item xs={6} className={classes.actionsTray}>
          {selectedTab === 0 && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<CreateIcon />}
              onClick={() => {
                setAddZone(true);
              }}
            >
              Add Zone
            </Button>
          )}

          {selectedTab === 1 && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<CreateIcon />}
              onClick={() => {
                setAddBucketOpen(true);
              }}
            >
              Create Bucket
            </Button>
          )}

          {selectedTab === 2 && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<CreateIcon />}
              onClick={() => {
                setAddReplicationOpen(true);
              }}
            >
              Add Replication
            </Button>
          )}
        </Grid>
        <Grid item xs={12}>
          <br />
        </Grid>
        <Grid item xs={12}>
          {selectedTab === 0 && (
            <TableWrapper
              itemActions={[
                {
                  type: "view",
                  onClick: (element) => {
                    console.log(element);
                  },
                  sendOnlyId: true,
                },
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
              records={zones}
              entityName="Zones"
              idField="name"
              paginatorConfig={{
                ...mainPagination,
                onChangePage: () => {},
                onChangeRowsPerPage: () => {},
              }}
            />
          )}

          {selectedTab === 1 && (
            <TableWrapper
              itemActions={[
                {
                  type: "view",
                  onClick: (element) => {
                    console.log(element);
                  },
                  sendOnlyId: true,
                },
                {
                  type: "replicate",
                  onClick: (element) => {
                    console.log(element);
                  },
                  sendOnlyId: true,
                },
                {
                  type: "mirror",
                  onClick: (element) => {
                    console.log(element);
                  },
                  sendOnlyId: true,
                },
                {
                  type: "delete",
                  onClick: (element) => {
                    console.log(element);
                  },
                  sendOnlyId: true,
                },
              ]}
              columns={[
                {
                  label: "Status",
                  elementKey: "status",
                },
                { label: "Name", elementKey: "name" },
                { label: "AccessPolicy", elementKey: "access_policy" },
              ]}
              isLoading={false}
              records={[]}
              entityName="Buckets"
              idField="name"
              paginatorConfig={{
                ...mainPagination,
                onChangePage: () => {},
                onChangeRowsPerPage: () => {},
              }}
            />
          )}

          {selectedTab === 2 && (
            <TableWrapper
              itemActions={[
                {
                  type: "view",
                  onClick: (element) => {
                    console.log(element);
                  },
                  sendOnlyId: true,
                },
              ]}
              columns={[
                {
                  label: "Source",
                  elementKey: "source",
                },
                { label: "Source Bucket", elementKey: "source_bucket" },
                { label: "Destination", elementKey: "destination" },
                {
                  label: "Destination Bucket",
                  elementKey: "destination_bucket",
                },
              ]}
              isLoading={false}
              records={[]}
              entityName="Replication"
              idField="id"
              paginatorConfig={{
                rowsPerPageOptions: [5, 10, 25],
                colSpan: 3,
                count: 0,
                rowsPerPage: 0,
                page: 0,
                SelectProps: {
                  inputProps: { "aria-label": "rows per page" },
                  native: true,
                },
                onChangePage: () => {},
                onChangeRowsPerPage: () => {},
                ActionsComponent: MinTablePaginationActions,
              }}
            />
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default withStyles(styles)(TenantDetails);
