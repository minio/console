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
import {
  Button,
  ComputerLineIcon,
  DownloadIcon,
  DownloadStatIcon,
  JSONIcon,
  StorageIcon,
  UploadStatIcon,
  VersionIcon,
  Grid,
  Box,
} from "mds";
import { IndvServerMetric, SpeedTestResponse, STServer } from "./types";
import { calculateBytes, prettyNumber } from "../../../common/utils";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer } from "recharts";
import { cleanMetrics } from "./utils";
import CodeMirrorWrapper from "../Common/FormComponents/CodeMirrorWrapper/CodeMirrorWrapper";
import SpeedTestUnit from "./SpeedTestUnit";
import styled from "styled-components";

const STResultsContainer = styled.div(({ theme }) => ({
  "& .actionButtons": {
    textAlign: "right",
  },
  "& .descriptorLabel": {
    fontWeight: "bold",
    fontSize: 14,
  },
  "& .resultsContainer": {
    backgroundColor: get(theme, "boxBackground", "#FBFAFA"),
    borderTop: `${get(theme, "borderColor", "#E2E2E2")} 1px solid`,
    marginTop: 30,
    padding: 25,
  },
  "& .resultsIcon": {
    display: "flex",
    alignItems: "center",
    "& svg": {
      fill: get(theme, `screenTitle.iconColor`, "#07193E"),
    },
  },
  "& .detailedItem": {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  "& .detailedVersion": {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  "& .serversTable": {
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
          borderBottom: `${get(theme, "borderColor", "#E2E2E2")} 1px solid`,
        },
      },
      "& > td": {
        borderTop: `${get(theme, "borderColor", "#E2E2E2")} 1px solid`,
        padding: 15,
        fontSize: 14,
        "&:first-of-type": {
          borderLeft: `${get(theme, "borderColor", "#E2E2E2")} 1px solid`,
        },
        "&:last-of-type": {
          borderRight: `${get(theme, "borderColor", "#E2E2E2")} 1px solid`,
        },
      },
    },
  },
  "& .serverIcon": {
    width: 55,
  },
  "& .serverValue": {
    width: 140,
  },
  "& .serverHost": {
    maxWidth: 540,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  "& .tableOverflow": {
    overflowX: "auto",
    paddingBottom: 15,
  },
  "& .objectGeneral": {
    marginTop: 15,
  },
  "& .download": {
    "& .min-icon": {
      width: 35,
      height: 35,
      color: get(theme, "signalColors.good", "#4CCB92"),
    },
  },
  "& .upload": {
    "& .min-icon": {
      width: 35,
      height: 35,
      color: get(theme, "signalColors.info", "#2781B0"),
    },
  },
  "& .versionIcon": {
    color: get(theme, `screenTitle.iconColor`, "#07193E"),
    marginRight: 20,
  },
}));

interface ISTResults {
  results: SpeedTestResponse[];
  start: boolean;
}

const STResults = ({ results, start }: ISTResults) => {
  const [jsonView, setJsonView] = useState<boolean>(false);

  const finalRes = results[results.length - 1] || [];

  const getServers: STServer[] = get(finalRes, "GETStats.servers", []) || [];
  const putServers: STServer[] = get(finalRes, "PUTStats.servers", []) || [];

  const getThroughput = get(finalRes, "GETStats.throughputPerSec", 0);
  const getObjects = get(finalRes, "GETStats.objectsPerSec", 0);

  const putThroughput = get(finalRes, "PUTStats.throughputPerSec", 0);
  const putObjects = get(finalRes, "PUTStats.objectsPerSec", 0);

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
      "data:text/plain;charset=utf-8," + JSON.stringify(finalRes),
    );
    element.setAttribute(
      "download",
      `speedtest_results-${date.toISOString()}.log`,
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
    <STResultsContainer>
      <Grid container className={"objectGeneral"}>
        <Grid item xs={12} md={6} lg={6}>
          <Grid container className={"objectGeneral"}>
            <Grid item xs={12} md={6} lg={6}>
              <SpeedTestUnit
                icon={
                  <div className={"download"}>
                    <DownloadStatIcon />
                  </div>
                }
                title={"GET"}
                throughput={`${getThroughput}`}
                objects={getObjects}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <SpeedTestUnit
                icon={
                  <div className={"upload"}>
                    <UploadStatIcon />
                  </div>
                }
                title={"PUT"}
                throughput={`${putThroughput}`}
                objects={putObjects}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
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
      {clnMetrics.length > 1 && (
        <Fragment>
          <Grid container>
            <Grid item xs={12} md={6} className={"descriptorLabel"}>
              {start ? (
                <Fragment>Preliminar Results:</Fragment>
              ) : (
                <Fragment>
                  {jsonView ? "JSON Results:" : "Detailed Results:"}
                </Fragment>
              )}
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{ display: "flex", justifyContent: "right", gap: 8 }}
            >
              {!start && (
                <Fragment>
                  <Button
                    id={"download-results"}
                    aria-label="Download Results"
                    onClick={downloadResults}
                    icon={<DownloadIcon />}
                  />
                  &nbsp;
                  <Button
                    id={"toggle-json"}
                    aria-label="Toogle JSON"
                    onClick={toggleJSONView}
                    icon={<JSONIcon />}
                  />
                </Fragment>
              )}
            </Grid>
          </Grid>
          <Box withBorders useBackground sx={{ marginTop: 15 }}>
            <Grid container>
              {jsonView ? (
                <Fragment>
                  <CodeMirrorWrapper value={finalResJSON} onChange={() => {}} />
                </Fragment>
              ) : (
                <Fragment>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={1}
                    lg={1}
                    className={"resultsIcon"}
                  >
                    <ComputerLineIcon width={45} />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    lg={2}
                    className={"detailedItem"}
                  >
                    Nodes:&nbsp;<strong>{finalRes.servers}</strong>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    lg={2}
                    className={"detailedItem"}
                  >
                    Drives:&nbsp;<strong>{finalRes.disks}</strong>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    lg={2}
                    className={"detailedItem"}
                  >
                    Concurrent:&nbsp;<strong>{finalRes.concurrent}</strong>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={5}
                    className={"detailedVersion"}
                  >
                    <span className={"versionIcon"}>
                      <VersionIcon />
                    </span>{" "}
                    MinIO VERSION&nbsp;<strong>{finalRes.version}</strong>
                  </Grid>
                  <Grid item xs={12} className={"tableOverflow"}>
                    <table
                      className={"serversTable"}
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
                            <td className={"serverIcon"}>
                              <StorageIcon />
                            </td>
                            <td className={"serverHost"}>{stats.host}</td>
                            {stats.getError && stats.getError !== "" ? (
                              <td>{stats.getError}</td>
                            ) : (
                              <Fragment>
                                <td className={"serverValue"}>
                                  {prettyNumber(parseFloat(stats.getValue))}
                                  &nbsp;
                                  {stats.getUnit}/s.
                                </td>
                              </Fragment>
                            )}
                            {stats.putError && stats.putError !== "" ? (
                              <td>{stats.putError}</td>
                            ) : (
                              <Fragment>
                                <td className={"serverValue"}>
                                  {prettyNumber(parseFloat(stats.putValue))}
                                  &nbsp;
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
          </Box>
        </Fragment>
      )}
    </STResultsContainer>
  );
};

export default STResults;
