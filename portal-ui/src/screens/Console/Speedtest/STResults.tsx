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
import get from "lodash/get";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Grid } from "@mui/material";
import { IndvServerMetric, SpeedTestResponse, STServer } from "./types";
import { calculateBytes, prettyNumber } from "../../../common/utils";
import {
  ComputerLineIcon,
  DownloadIcon,
  DownloadStatIcon,
  JSONIcon,
  StorageIcon,
  UploadStatIcon,
  VersionIcon,
} from "../../../icons";
import BoxIconButton from "../Common/BoxIconButton/BoxIconButton";
import CodeMirrorWrapper from "../Common/FormComponents/CodeMirrorWrapper/CodeMirrorWrapper";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer } from "recharts";
import { cleanMetrics } from "./utils";

interface ISTResults {
  classes: any;
  results: SpeedTestResponse[];
  start: boolean;
  autotune: boolean;
}

const styles = (theme: Theme) =>
  createStyles({
    statContainer: {
      padding: "18px 0 18px 25px",
    },
    statBlock: {
      border: "#EEF1F4 1px solid",
      borderRadius: 4,
    },
    testedAmount: {
      display: "flex",
      justifyContent: "space-between",
      color: "#07193E",
      padding: "12px 18px",
      border: "#EEF1F4 1px solid",
      borderLeft: 0,
      borderRight: 0,
    },
    serverLength: {
      color: "#696969",
    },
    serverDescrContainer: {
      display: "flex",
      margin: "15px 5px 0",
      position: "relative",
    },
    serverDescrIcon: {
      marginRight: 10,
      "& svg": {
        width: 16,
      },
    },
    serverDescriptor: {
      color: "#696969",
      whiteSpace: "nowrap",
      maxWidth: "100%",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    serversResume: {
      marginBottom: 15,
    },
    objectGeneralTitle: {
      fontWeight: "bold",
      color: "#000",
      display: "flex",
      alignItems: "center",
      "& svg": {
        width: 14,
      },
    },
    generalContainer: {
      padding: 20,
    },
    generalUnit: {
      color: "#000",
      marginTop: 6,
      fontSize: 12,
      fontWeight: "bold",
    },
    testUnitRes: {
      fontSize: 120,
      color: "#081C42",
      fontWeight: "bold",
    },
    shareResults: {
      padding: "18px 25px",
      color: "#07193E",
      fontSize: 14,
    },
    metricValContainer: {
      lineHeight: 1,
    },
    actionButtons: {
      textAlign: "right",
    },
    descriptorLabel: {
      fontWeight: "bold",
      fontSize: 14,
    },
    resultsContainer: {
      backgroundColor: "#FBFAFA",
      borderTop: "#F1F1F1 1px solid",
      marginTop: 30,
      padding: 25,
    },
    resultsIcon: {
      display: "flex",
      alignItems: "center",
      "& svg": {
        fill: "#07193E",
      },
    },
    detailedItem: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
    },
    detailedVersion: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
    },
    serversTable: {
      width: "100%",
      marginTop: 15,
      "& thead > tr > th": {
        textAlign: "left",
        padding: 15,
        fontSize: 14,
        fontWeight: "bold",
      },
      "& tbody > tr": {
        "&:last-of-type": {
          "& > td": {
            borderBottom: "#E2E2E2 1px solid",
          },
        },
        "& > td": {
          borderTop: "#E2E2E2 1px solid",
          padding: 15,
          fontSize: 14,
          "&:first-of-type": {
            borderLeft: "#E2E2E2 1px solid",
          },
          "&:last-of-type": {
            borderRight: "#E2E2E2 1px solid",
          },
        },
      },
    },
    serverIcon: {
      width: 55,
    },
    serverValue: {
      width: 140,
    },
    serverHost: {
      maxWidth: 540,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    tableOverflow: {
      overflowX: "auto",
      paddingBottom: 15,
    },
    objectGeneral: {
      marginTop: 15,
    },
    initialResults: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#000",
      textAlign: "center",
    },
  });

const STResults = ({ classes, results, start, autotune }: ISTResults) => {
  const [jsonView, setJsonView] = useState<boolean>(false);

  const finalRes = results[results.length - 1];

  const getServers: STServer[] = get(finalRes, "GETStats.servers", []) || [];
  const putServers: STServer[] = get(finalRes, "PUTStats.servers", []) || [];

  const getThroughput = get(finalRes, "GETStats.throughputPerSec", 0);
  const getObjects = get(finalRes, "GETStats.objectsPerSec", 0);

  const putThroughput = get(finalRes, "PUTStats.throughputPerSec", 0);
  const putObjects = get(finalRes, "PUTStats.objectsPerSec", 0);

  const ObjectGeneral = ({
    title,
    throughput,
    objects,
  }: {
    title: any;
    throughput: string;
    objects: number;
  }) => {
    const avg = calculateBytes(throughput);

    return (
      <Grid container>
        <Grid item xs={12} className={classes.objectGeneralTitle}>
          {title}
        </Grid>
        <Grid item xs={12} md={6} className={classes.metricValContainer}>
          <span className={classes.testUnitRes}>{avg.total}</span>
          <span className={classes.generalUnit}>{avg.unit}/S</span>
        </Grid>
      </Grid>
    );
  };

  let statJoin: IndvServerMetric[] = [];

  getServers.forEach((item) => {
    const hostName = item.endpoint;
    const putMetric = putServers.find((item) => item.endpoint === hostName);

    let itemJoin: IndvServerMetric = {
      getUnit: "-",
      getValue: "N/A",
      host: item.endpoint,
      putUnit: "-",
      putValue: "N/A",
    };

    if (item.err && item.err !== "") {
      itemJoin.getError = item.err;
      itemJoin.getUnit = "-";
      itemJoin.getValue = "N/A";
    } else {
      const niceGet = calculateBytes(item.throughputPerSec.toString());

      itemJoin.getUnit = niceGet.unit;
      itemJoin.getValue = niceGet.total.toString();
    }

    if (putMetric) {
      if (putMetric.err && putMetric.err !== "") {
        itemJoin.putError = putMetric.err;
        itemJoin.putUnit = "-";
        itemJoin.putValue = "N/A";
      } else {
        const nicePut = calculateBytes(putMetric.throughputPerSec.toString());

        itemJoin.putUnit = nicePut.unit;
        itemJoin.putValue = nicePut.total.toString();
      }
    }

    statJoin.push(itemJoin);
  });

  const downloadResults = () => {
    const date = new Date();
    let element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + JSON.stringify(finalRes)
    );
    element.setAttribute(
      "download",
      `speedtest_results-${date.toISOString()}.log`
    );

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  };

  const toggleJSONView = () => {
    setJsonView(!jsonView);
  };

  const finalResJSON = finalRes ? JSON.stringify(finalRes, null, 4) : "";
  const clnMetrics = cleanMetrics(results);

  return (
    <Fragment>
      {clnMetrics.length <= 1 && (
        <Grid container>
          <Grid item xs={12} className={classes.initialResults}>
            Please wait while we get {autotune ? "the initial" : "the system"}{" "}
            results...
          </Grid>
        </Grid>
      )}
      {clnMetrics.length > 1 && (
        <Fragment>
          <Grid container className={classes.objectGeneral}>
            <Grid item xs={12} md={6} lg={4}>
              <ObjectGeneral
                title={
                  <Fragment>
                    <DownloadStatIcon />
                    &nbsp; GET
                  </Fragment>
                }
                throughput={getThroughput}
                objects={getObjects}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <ObjectGeneral
                title={
                  <Fragment>
                    <UploadStatIcon />
                    &nbsp; PUT
                  </Fragment>
                }
                throughput={putThroughput}
                objects={putObjects}
              />
            </Grid>
            <Grid item xs={12} md={12} lg={4}>
              <ResponsiveContainer width="99%">
                <AreaChart data={clnMetrics}>
                  <defs>
                    <linearGradient id="colorPut" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2781B0" stopOpacity={0.9} />
                      <stop offset="95%" stopColor="#fff" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorGet" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4CCB92" stopOpacity={0.9} />
                      <stop offset="95%" stopColor="#fff" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray={"0 0"}
                    strokeWidth={1}
                    strokeOpacity={0.5}
                    stroke={"#F1F1F1"}
                    vertical={false}
                  />

                  <Area
                    type="monotone"
                    dataKey={"get"}
                    stroke={"#4CCB92"}
                    fill={"url(#colorGet)"}
                    fillOpacity={0.3}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Area
                    type="monotone"
                    dataKey={"put"}
                    stroke={"#2781B0"}
                    fill={"url(#colorPut)"}
                    fillOpacity={0.3}
                    strokeWidth={2}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>
          <br />
          <Grid container>
            <Grid item xs={12} md={6} className={classes.descriptorLabel}>
              {start ? (
                <Fragment>Preliminar Results:</Fragment>
              ) : (
                <Fragment>
                  {jsonView ? "JSON Results:" : "Detailed Results:"}
                </Fragment>
              )}
            </Grid>
            <Grid item xs={12} md={6} className={classes.actionButtons}>
              {!start && (
                <Fragment>
                  <BoxIconButton
                    aria-label="Download"
                    onClick={downloadResults}
                    size="large"
                  >
                    <DownloadIcon />
                  </BoxIconButton>
                  &nbsp;
                  <BoxIconButton
                    aria-label="Download"
                    onClick={toggleJSONView}
                    size="large"
                  >
                    <JSONIcon />
                  </BoxIconButton>
                </Fragment>
              )}
            </Grid>
          </Grid>
          <Grid container className={classes.resultsContainer}>
            {jsonView ? (
              <Fragment>
                <CodeMirrorWrapper
                  value={finalResJSON}
                  readOnly
                  onBeforeChange={() => {}}
                />
              </Fragment>
            ) : (
              <Fragment>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={1}
                  lg={1}
                  className={classes.resultsIcon}
                  alignItems={"flex-end"}
                >
                  <ComputerLineIcon width={45} />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  lg={2}
                  className={classes.detailedItem}
                >
                  Nodes:&nbsp;<strong>{finalRes.servers}</strong>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  lg={2}
                  className={classes.detailedItem}
                >
                  Drives:&nbsp;<strong>{finalRes.disks}</strong>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  lg={2}
                  className={classes.detailedItem}
                >
                  Concurrent:&nbsp;<strong>{finalRes.concurrent}</strong>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={5}
                  className={classes.detailedVersion}
                >
                  <span className={classes.versionIcon}>
                    <VersionIcon />
                  </span>{" "}
                  MinIO VERSION&nbsp;<strong>{finalRes.version}</strong>
                </Grid>
                <Grid item xs={12} className={classes.tableOverflow}>
                  <table
                    className={classes.serversTable}
                    cellSpacing={0}
                    cellPadding={0}
                  >
                    <thead>
                      <tr>
                        <th colSpan={2}>Servers</th>
                        <th>GET</th>
                        <th>PUT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {statJoin.map((stats, index) => (
                        <tr key={`storage-${index.toString()}`}>
                          <td className={classes.serverIcon}>
                            <StorageIcon />
                          </td>
                          <td className={classes.serverHost}>{stats.host}</td>
                          {stats.getError && stats.getError !== "" ? (
                            <td>{stats.getError}</td>
                          ) : (
                            <Fragment>
                              <td className={classes.serverValue}>
                                {prettyNumber(parseFloat(stats.getValue))}&nbsp;
                                {stats.getUnit}/s.
                              </td>
                            </Fragment>
                          )}
                          {stats.putError && stats.putError !== "" ? (
                            <td>{stats.putError}</td>
                          ) : (
                            <Fragment>
                              <td className={classes.serverValue}>
                                {prettyNumber(parseFloat(stats.putValue))}&nbsp;
                                {stats.putUnit}/s.
                              </td>
                            </Fragment>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Grid>
              </Fragment>
            )}
          </Grid>
        </Fragment>
      )}
    </Fragment>
  );
};

export default withStyles(styles)(STResults);
