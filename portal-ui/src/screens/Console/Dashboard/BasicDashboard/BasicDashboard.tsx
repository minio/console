// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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

import React from "react";
import {
  ArrowRightIcon,
  Box,
  breakPoints,
  BucketsIcon,
  Button,
  DiagnosticsMenuIcon,
  DrivesIcon,
  FormatDrivesIcon,
  HealIcon,
  HelpBox,
  PrometheusErrorIcon,
  ServersIcon,
  StorageIcon,
  TotalObjectsIcon,
  UptimeIcon,
} from "mds";
import { calculateBytes, representationNumber } from "../../../../common/utils";
import StatusCountCard from "./StatusCountCard";
import groupBy from "lodash/groupBy";
import ServersList from "./ServersList";
import CounterCard from "./CounterCard";
import ReportedUsage from "./ReportedUsage";
import { Link } from "react-router-dom";
import { IAM_PAGES } from "../../../../common/SecureComponent/permissions";
import TimeStatItem from "../TimeStatItem";
import TooltipWrapper from "../../Common/TooltipWrapper/TooltipWrapper";
import { AdminInfoResponse, ServerDrives } from "api/consoleApi";

const BoxItem = ({ children }: { children: any }) => {
  return (
    <Box
      withBorders
      sx={{
        padding: 15,
        height: "136px",
        maxWidth: "100%",
        [`@media (max-width: ${breakPoints.sm}px)`]: {
          padding: 5,
          maxWidth: "initial",
        },
      }}
    >
      {children}
    </Box>
  );
};

interface IDashboardProps {
  usage: AdminInfoResponse | undefined;
}

const getServersList = (usage: AdminInfoResponse | undefined) => {
  if (usage && usage.servers) {
    return [...usage.servers].sort(function (a, b) {
      const nameA = a.endpoint?.toLowerCase() || "";
      const nameB = b.endpoint?.toLowerCase() || "";
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

const prettyUsage = (usage: string | undefined) => {
  if (usage === undefined) {
    return { total: "0", unit: "Mi" };
  }

  return calculateBytes(usage);
};

const BasicDashboard = ({ usage }: IDashboardProps) => {
  const usageValue = usage && usage.usage ? usage.usage.toString() : "0";
  const usageToRepresent = prettyUsage(usageValue);

  const { lastScan = "n/a", lastHeal = "n/a", upTime = "n/a" } = {};

  const serverList = getServersList(usage);

  let allDrivesArray: ServerDrives[] = [];

  serverList.forEach((server) => {
    const drivesInput = server.drives?.map((drive) => {
      return drive;
    });
    if (drivesInput) {
      allDrivesArray = [...allDrivesArray, ...drivesInput];
    }
  });

  const serversGroup = groupBy(serverList, "state");
  const { offline: offlineServers = [], online: onlineServers = [] } =
    serversGroup;
  const drivesGroup = groupBy(allDrivesArray, "state");
  const { offline: offlineDrives = [], ok: onlineDrives = [] } = drivesGroup;
  return (
    <Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateRows: "1fr",
          gridTemplateColumns: "1fr",
          gap: 27,
          marginBottom: 40,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "40px",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateRows: "136px",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 20,
              [`@media (max-width: ${breakPoints.sm}px)`]: {
                gridTemplateColumns: "1fr",
              },
              [`@media (max-width: ${breakPoints.md}px)`]: {
                marginBottom: 0,
              },
            }}
          >
            <BoxItem>
              <CounterCard
                label={"Buckets"}
                icon={<BucketsIcon />}
                counterValue={usage ? representationNumber(usage.buckets) : 0}
                actions={
                  <Link
                    to={IAM_PAGES.BUCKETS}
                    style={{
                      zIndex: 3,
                      textDecoration: "none",
                      top: "40px",
                      position: "relative",
                      marginRight: "75px",
                    }}
                  >
                    <TooltipWrapper tooltip={"Browse"}>
                      <Button
                        id={"browse-dashboard"}
                        onClick={() => {}}
                        label={"Browse"}
                        icon={<ArrowRightIcon />}
                        variant={"regular"}
                        style={{
                          padding: 5,
                          height: 30,
                          fontSize: 14,
                          marginTop: 20,
                        }}
                      />
                    </TooltipWrapper>
                  </Link>
                }
              />
            </BoxItem>
            <BoxItem>
              <CounterCard
                label={"Objects"}
                icon={<TotalObjectsIcon />}
                counterValue={usage ? representationNumber(usage.objects) : 0}
              />
            </BoxItem>

            <BoxItem>
              <StatusCountCard
                onlineCount={onlineServers.length}
                offlineCount={offlineServers.length}
                label={"Servers"}
                icon={<ServersIcon />}
              />
            </BoxItem>
            <BoxItem>
              <StatusCountCard
                offlineCount={
                  usage?.backend?.offlineDrives || offlineDrives.length
                }
                onlineCount={
                  usage?.backend?.onlineDrives || onlineDrives.length
                }
                label={"Drives"}
                icon={<DrivesIcon />}
              />
            </BoxItem>

            <Box
              withBorders
              sx={{
                gridRowStart: "1",
                gridRowEnd: "3",
                gridColumnStart: "3",
                padding: 15,
                display: "grid",
                justifyContent: "stretch",
              }}
            >
              <ReportedUsage
                usageValue={usageValue}
                total={usageToRepresent.total}
                unit={usageToRepresent.unit}
              />

              <Box
                sx={{
                  display: "flex",
                  flexFlow: "column",
                  gap: "14px",
                }}
              >
                <TimeStatItem
                  icon={<HealIcon />}
                  label={
                    <Box>
                      <Box
                        sx={{
                          display: "inline",
                          [`@media (max-width: ${breakPoints.sm}px)`]: {
                            display: "none",
                          },
                        }}
                      >
                        Time since last
                      </Box>{" "}
                      Heal Activity
                    </Box>
                  }
                  value={lastHeal}
                />
                <TimeStatItem
                  icon={<DiagnosticsMenuIcon />}
                  label={
                    <Box>
                      <Box
                        sx={{
                          display: "inline",
                          [`@media (max-width: ${breakPoints.sm}px)`]: {
                            display: "none",
                          },
                        }}
                      >
                        Time since last
                      </Box>{" "}
                      Scan Activity
                    </Box>
                  }
                  value={lastScan}
                />
                <TimeStatItem
                  icon={<UptimeIcon />}
                  label={"Uptime"}
                  value={upTime}
                />
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "14px",
              [`@media (max-width: ${breakPoints.lg}px)`]: {
                gridTemplateColumns: "1fr",
              },
            }}
          >
            <TimeStatItem
              icon={<StorageIcon />}
              label={"Backend type"}
              value={usage?.backend?.backendType ?? "Unknown"}
            />
            <TimeStatItem
              icon={<FormatDrivesIcon />}
              label={"Standard storage class parity"}
              value={usage?.backend?.standardSCParity?.toString() ?? "n/a"}
            />
            <TimeStatItem
              icon={<FormatDrivesIcon />}
              label={"Reduced redundancy storage class parity"}
              value={usage?.backend?.rrSCParity?.toString() ?? "n/a"}
            />
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateRows: "auto",
              gridTemplateColumns: "1fr",
              gap: "auto",
            }}
          >
            <ServersList data={serverList} />
          </Box>
        </Box>
        {usage?.advancedMetricsStatus === "not configured" && (
          <Box>
            <HelpBox
              iconComponent={<PrometheusErrorIcon />}
              title={"We can’t retrieve advanced metrics at this time."}
              help={
                <Box>
                  <Box
                    sx={{
                      fontSize: "14px",
                    }}
                  >
                    MinIO Dashboard will display basic metrics as we couldn’t
                    connect to Prometheus successfully. Please try again in a
                    few minutes. If the problem persists, you can review your
                    configuration and confirm that Prometheus server is up and
                    running.
                  </Box>
                  <Box
                    sx={{
                      paddingTop: 20,
                      fontSize: 14,
                    }}
                  >
                    <a
                      href="https://min.io/docs/minio/linux/operations/monitoring/collect-minio-metrics-using-prometheus.html"
                      target="_blank"
                      rel="noopener"
                    >
                      Read more about Prometheus on our Docs site.
                    </a>
                  </Box>
                </Box>
              }
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default BasicDashboard;
