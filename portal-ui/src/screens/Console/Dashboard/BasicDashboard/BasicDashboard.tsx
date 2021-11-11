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

import React, { Fragment, useState } from "react";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import Grid from "@mui/material/Grid";
import { IDriveInfo, Usage } from "../types";
import { calculateBytes } from "../../../../common/utils";
import { TabPanel } from "../../../shared/tabs";
import ServerInfoCard from "./ServerInfoCard";
import DriveInfoCard from "./DriveInfoCard";
import CommonCard from "../CommonCard";
import TabSelector from "../../Common/TabSelector/TabSelector";
import GeneralUsePaginator from "../../Common/GeneralUsePaginator/GeneralUsePaginator";
import { widgetContainerCommon } from "../../Common/FormComponents/common/styleLibrary";
import { PrometheusIcon } from "../../../../icons";
import HelpBox from "../../../../common/HelpBox";

const styles = (theme: Theme) =>
  createStyles({
    cardsContainer: {
      maxHeight: 440,
      overflowY: "auto",
      overflowX: "hidden",
    },
    generalStatusCards: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
    },
    generalStatusTitle: {
      color: "#767676",
      fontSize: 16,
      fontWeight: "bold",
      margin: "15px 10px 0 10px",
    },
    paginatorContainer: {
      maxWidth: 1185,
      width: "100%",
    },
    ...widgetContainerCommon,
  });

interface IDashboardProps {
  classes: any;
  usage: Usage | null;
}

const itemsPerPage = 5;

const BasicDashboard = ({ classes, usage }: IDashboardProps) => {
  const [curTab, setCurTab] = useState<number>(0);
  const [serversPageNumber, setServersPageNumber] = useState<number>(1);
  const [drivesPageNumber, setDrivesPageNumber] = useState<number>(1);

  const prettyUsage = (usage: string | undefined) => {
    if (usage === undefined) {
      return { total: "0", unit: "Mi" };
    }

    const calculatedBytes = calculateBytes(usage);

    return calculatedBytes;
  };

  const prettyNumber = (usage: number | undefined) => {
    if (usage === undefined) {
      return 0;
    }

    return usage.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const makeServerArray = (usage: Usage | null) => {
    if (usage !== null) {
      return usage.servers.sort(function (a, b) {
        var nameA = a.endpoint.toLowerCase();
        var nameB = b.endpoint.toLowerCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
    }

    return [];
  };

  const serverArray = makeServerArray(usage || null);

  const usageToRepresent = prettyUsage(
    usage && usage.usage ? usage.usage.toString() : "0"
  );

  let allDrivesArray: IDriveInfo[] = [];

  serverArray.forEach((server) => {
    const drivesInput = server.drives.map((drive) => {
      return drive;
    });

    allDrivesArray = [...allDrivesArray, ...drivesInput];
  });

  const splitedServers = serverArray.slice(
    serversPageNumber * itemsPerPage - itemsPerPage,
    serversPageNumber * itemsPerPage
  );

  const splitedDrives = allDrivesArray.slice(
    drivesPageNumber * itemsPerPage - itemsPerPage,
    drivesPageNumber * itemsPerPage
  );

  return (
    <Fragment>
      <div className={classes.dashboardBG} />
      <Grid container spacing={2}>
        <Grid item xs={12} className={classes.generalStatusTitle}>
          General Status
        </Grid>
        <Grid item xs={12} className={classes.dashboardRow}>
          <Grid
            item
            xs={7}
            sm={8}
            md={6}
            lg={3}
            className={classes.widgetPanelDelimiter}
          >
            <CommonCard
              title={"All Buckets"}
              metricValue={usage ? prettyNumber(usage.buckets) : 0}
              extraMargin
            />
          </Grid>
          <Grid
            item
            xs={7}
            sm={8}
            md={6}
            lg={3}
            className={classes.widgetPanelDelimiter}
          >
            <CommonCard
              title={"Usage"}
              metricValue={usageToRepresent.total}
              metricUnit={usageToRepresent.unit}
              extraMargin
            />
          </Grid>
          <Grid
            item
            xs={7}
            sm={8}
            md={6}
            lg={3}
            className={classes.widgetPanelDelimiter}
          >
            <CommonCard
              title={"Total Objects"}
              metricValue={usage ? prettyNumber(usage.objects) : 0}
              extraMargin
            />
          </Grid>
          <Grid
            item
            xs={7}
            sm={8}
            md={6}
            lg={3}
            className={classes.widgetPanelDelimiter}
          >
            <CommonCard
              title={"Servers"}
              metricValue={usage ? prettyNumber(serverArray.length) : 0}
              subMessage={{ message: "Total" }}
              extraMargin
            />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <TabSelector
            selectedTab={curTab}
            onChange={(newValue: number) => {
              setCurTab(newValue);
            }}
            tabOptions={[{ label: "Servers" }, { label: "Drives" }]}
          />
        </Grid>
        <Grid item xs={12} className={classes.widgetsContainer}>
          <TabPanel index={0} value={curTab}>
            <div className={classes.paginatorContainer}>
              <GeneralUsePaginator
                page={serversPageNumber}
                entity={"Servers"}
                totalItems={serverArray.length}
                onChange={setServersPageNumber}
                itemsPerPage={itemsPerPage}
              />
            </div>
            {splitedServers.map((server, index) => (
              <Grid item xs={12} key={`serverDS-${index.toString()}`}>
                <ServerInfoCard server={server} index={index + 1} />
              </Grid>
            ))}
          </TabPanel>
          <TabPanel index={1} value={curTab}>
            <div className={classes.paginatorContainer}>
              <GeneralUsePaginator
                page={drivesPageNumber}
                entity={"Drives"}
                totalItems={allDrivesArray.length}
                onChange={setDrivesPageNumber}
                itemsPerPage={itemsPerPage}
              />
            </div>
            {splitedDrives.map((drive, index) => (
              <Grid item xs={12} key={`drive-${index}-${drive.uuid}`}>
                <DriveInfoCard drive={drive} />
              </Grid>
            ))}
          </TabPanel>
        </Grid>
      </Grid>
      <Grid
        container
        justifyContent={"center"}
        alignContent={"center"}
        alignItems={"center"}
      >
        <Grid item xs={8}>
          <HelpBox
            iconComponent={<PrometheusIcon />}
            title={"Monitoring"}
            help={
              <Fragment>
                The MinIO Dashboard is displaying basic metrics only due to
                missing the{" "}
                <a
                  href="https://docs.min.io/minio/baremetal/console/minio-console.html?ref=con#configuration"
                  target="_blank"
                  rel="noreferrer"
                >
                  necessary settings
                </a>{" "}
                for displaying extended metrics.
                <br />
                <br />
                See{" "}
                <a
                  href="https://docs.min.io/minio/baremetal/monitoring/metrics-alerts/collect-minio-metrics-using-prometheus.html?ref=con#minio-metrics-collect-using-prometheus"
                  target="_blank"
                  rel="noreferrer"
                >
                  Collect MinIO Metrics Using Prometheus
                </a>{" "}
                for a complete tutorial on scraping and visualizing MinIO
                metrics with Prometheus.
              </Fragment>
            }
          />
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default withStyles(styles)(BasicDashboard);
