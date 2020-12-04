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
import get from "lodash/get";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import {
  containerForHeader,
  modalBasic,
} from "../../Common/FormComponents/common/styleLibrary";
import Grid from "@material-ui/core/Grid";
import { Button } from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { CreateIcon } from "../../../../icons";
import TableWrapper from "../../Common/TableWrapper/TableWrapper";
import Paper from "@material-ui/core/Paper";
import { niceBytes } from "../../../../common/utils";
import AddZoneModal from "./AddZoneModal";
import AddBucket from "../../Buckets/ListBuckets/AddBucket";
import ReplicationSetup from "./ReplicationSetup";
import api from "../../../../common/api";
import { ITenant, IZone } from "../ListTenants/types";
import Logs from "./Logs/Logs";
import Trace from "./Trace/Trace";
import Watch from "./Watch/Watch";
import Heal from "./Heal/Heal";
import PageHeader from "../../Common/PageHeader/PageHeader";
import UsageBarWrapper from "../../Common/UsageBarWrapper/UsageBarWrapper";

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
    ...containerForHeader(theme.spacing(4)),
  });

const TenantDetails = ({ classes, match }: ITenantDetailsProps) => {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [capacity, setCapacity] = useState<number>(0);
  const [zoneCount, setZoneCount] = useState<number>(0);
  const [serverSets, setServerSets] = useState<IZone[]>([]);
  const [instances, setInstances] = useState<number>(0);
  const [volumes, setVolumes] = useState<number>(0);
  const [addZoneOpen, setAddZone] = useState<boolean>(false);
  const [addBucketOpen, setAddBucketOpen] = useState<boolean>(false);
  const [addReplicationOpen, setAddReplicationOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [tenant, setTenant] = useState<ITenant | null>(null);
  const [loadingUsage, setLoadingUsage] = useState<boolean>(true);
  const [usageError, setUsageError] = useState<string>("");
  const [usage, setUsage] = useState<number>(0);

  const tenantName = match.params["tenantName"];
  const tenantNamespace = match.params["tenantNamespace"];

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
    api
      .invoke(
        "GET",
        `/api/v1/namespaces/${tenantNamespace}/tenants/${tenantName}`
      )
      .then((res: ITenant) => {
        const resZones = !res.zones ? [] : res.zones;

        let totalInstances = 0;
        let totalVolumes = 0;
        let count = 1;
        for (let zone of resZones) {
          const cap =
            zone.volumes_per_server *
            zone.servers *
            zone.volume_configuration.size;
          zone.name = `zone-${count}`;
          zone.capacity = niceBytes(cap + "");
          zone.volumes = zone.servers * zone.volumes_per_server;
          totalInstances += zone.servers;
          totalVolumes += zone.volumes;
          count += 1;
        }
        setCapacity(res.total_size);
        setZoneCount(resZones.length);
        setVolumes(totalVolumes);
        setInstances(totalInstances);

        setServerSets(resZones);

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

  useEffect(() => {
    loadInfo();
    loadUsage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      {addZoneOpen && tenant !== null && (
        <AddZoneModal
          open={addZoneOpen}
          onCloseZoneAndReload={onCloseZoneAndRefresh}
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
      <PageHeader label={`Tenant > ${match.params["tenantName"]}`} />
      <Grid item xs={12} className={classes.container} />
      <Grid container>
        {error !== "" && (
          <Grid item xs={12}>
            {error}
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
              <div>{tenant ? tenant.image : ""}</div>
              <div>Clusters:</div>
              <div>{zoneCount}</div>
              <div>Console:</div>
              <div>{tenant ? tenant.console_image : ""}</div>
              <div>Instances:</div>
              <div>{instances}</div>
              <div>Volumes:</div>
              <div>{volumes}</div>
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
        <Grid item xs={7}>
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
            <Tab label="Logs" />
            <Tab label="Trace" />
            <Tab label="Watch" />
            <Tab label="Heal" />
          </Tabs>
        </Grid>
        <Grid item xs={5} className={classes.actionsTray}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CreateIcon />}
            onClick={() => {
              setAddZone(true);
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
        </Grid>
        {selectedTab === 1 && tenant !== null && (
          <Logs namespace={tenant.namespace} tenant={tenant.name} />
        )}
        {selectedTab === 2 && tenant !== null && (
          <Trace namespace={tenant.namespace} tenant={tenant.name} />
        )}
        {selectedTab === 3 && tenant !== null && (
          <Watch namespace={tenant.namespace} tenant={tenant.name} />
        )}
        {selectedTab === 4 && tenant !== null && (
          <Heal namespace={tenant.namespace} tenant={tenant.name} />
        )}
      </Grid>
    </React.Fragment>
  );
};

export default withStyles(styles)(TenantDetails);
