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
import { Box, Button, Grid, PageLayout, Select, Table, TableBody } from "mds";
import { useSelector } from "react-redux";
import { ErrorResponseHandler } from "../../../../common/types";
import { AppState, useAppDispatch } from "../../../../store";
import { wsProtocol } from "../../../../utils/wsUtils";
import {
  logMessageReceived,
  logResetMessages,
  setLogsStarted,
} from "../logsSlice";
import { setHelpName } from "../../../../systemSlice";
import SearchBox from "../../Common/SearchBox";
import api from "../../../../../src/common/api";
import LogLine from "./LogLine";
import PageHeaderWrapper from "../../Common/PageHeaderWrapper/PageHeaderWrapper";
import HelpMenu from "../../HelpMenu";

var socket: any = null;

const ErrorLogs = () => {
  const dispatch = useAppDispatch();

  const messages = useSelector((state: AppState) => state.logs.logMessages);
  const logsStarted = useSelector((state: AppState) => state.logs.logsStarted);

  const [filter, setFilter] = useState<string>("");
  const [nodes, setNodes] = useState<string[]>([""]);
  const [selectedNode, setSelectedNode] = useState<string>("all");
  const [selectedUserAgent, setSelectedUserAgent] =
    useState<string>("Select user agent");
  const [userAgents, setUserAgents] = useState<string[]>(["All User Agents"]);
  const [logType, setLogType] = useState<string>("all");
  const [loadingNodes, setLoadingNodes] = useState<boolean>(false);

  const startLogs = () => {
    dispatch(logResetMessages());
    const url = new URL(window.location.toString());
    const isDev = process.env.NODE_ENV === "development";
    const port = isDev ? "9090" : url.port;

    const wsProt = wsProtocol(url.protocol);
    // check if we are using base path, if not this always is `/`
    const baseLocation = new URL(document.baseURI);
    const baseUrl = baseLocation.pathname;

    socket = new WebSocket(
      `${wsProt}://${
        url.hostname
      }:${port}${baseUrl}ws/console/?logType=${logType}&node=${
        selectedNode === "Select node" ? "" : selectedNode
      }`,
    );
    let interval: any | null = null;
    if (socket !== null) {
      socket.onopen = () => {
        console.log("WebSocket Client Connected");
        dispatch(setLogsStarted(true));
        socket.send("ok");
        interval = setInterval(() => {
          socket.send("ok");
        }, 10 * 1000);
      };
      socket.onmessage = (message: MessageEvent) => {
        // console.log(message.data.toString())
        // FORMAT: 00:35:17 UTC 01/01/2021

        let m: any = JSON.parse(message.data.toString());
        let isValidEntry = true;
        if (
          m.level === "" &&
          m.errKind === "" &&
          //@ts-ignore
          m.time === "00:00:00 UTC 01/01/0001" &&
          m.ConsoleMsg === "" &&
          m.node === ""
        ) {
          isValidEntry = false;
        }

        m.key = Math.random();
        if (userAgents.indexOf(m.userAgent) < 0 && m.userAgent !== undefined) {
          userAgents.push(m.userAgent);
          setUserAgents(userAgents);
        }
        if (isValidEntry) {
          dispatch(logMessageReceived(m));
        }
      };
      socket.onclose = () => {
        clearInterval(interval);
        console.log("connection closed by server");
        dispatch(setLogsStarted(false));
      };
      return () => {
        socket.close(1000);
        clearInterval(interval);
        console.log("closing websockets");
        dispatch(setLogsStarted(false));
      };
    }
  };

  const stopLogs = () => {
    if (socket !== null && socket !== undefined) {
      socket.close(1000);
      dispatch(setLogsStarted(false));
    }
  };

  const filtLow = filter.toLowerCase();
  let filteredMessages = messages.filter((m) => {
    if (
      m.userAgent === selectedUserAgent ||
      selectedUserAgent === "All User Agents" ||
      selectedUserAgent === "Select user agent"
    ) {
      if (filter !== "") {
        if (m.ConsoleMsg.toLowerCase().indexOf(filtLow) >= 0) {
          return true;
        } else if (
          m.error &&
          m.error.source &&
          m.error.source.filter((x) => {
            return x.toLowerCase().indexOf(filtLow) >= 0;
          }).length > 0
        ) {
          return true;
        } else if (
          m.error &&
          m.error.message.toLowerCase().indexOf(filtLow) >= 0
        ) {
          return true;
        } else if (m.api && m.api.name.toLowerCase().indexOf(filtLow) >= 0) {
          return true;
        }
        return false;
      }
      return true;
    } else return false;
  });

  useEffect(() => {
    setLoadingNodes(true);
    api
      .invoke("GET", `/api/v1/nodes`)
      .then((res: string[]) => {
        setNodes(res);
        setLoadingNodes(false);
      })
      .catch((err: ErrorResponseHandler) => {
        setLoadingNodes(false);
      });
  }, []);

  useEffect(() => {
    dispatch(setHelpName("error_logs"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <PageHeaderWrapper label="Logs" actions={<HelpMenu />} />

      <PageLayout>
        <Grid container sx={{ gap: 15 }}>
          <Grid item xs={3}>
            {!loadingNodes ? (
              <Select
                id="node-selector"
                name="node"
                data-test-id="node-selector"
                value={selectedNode}
                onChange={(value) => {
                  setSelectedNode(value as string);
                }}
                disabled={loadingNodes || logsStarted}
                options={[
                  { label: "All Nodes", value: "all" },
                  ...nodes.map((aNode) => ({ label: aNode, value: aNode })),
                ]}
              />
            ) : (
              <h3> Loading nodes</h3>
            )}
          </Grid>

          <Grid item xs={3}>
            <Select
              id="logType"
              name="logType"
              data-test-id="log-type"
              value={logType}
              onChange={(value) => {
                setLogType(value as string);
              }}
              disabled={loadingNodes || logsStarted}
              options={[
                { value: "all", label: "All Log Types" },
                {
                  value: "minio",
                  label: "MinIO",
                },
                { value: "application", label: "Application" },
              ]}
            />
          </Grid>
          <Grid item xs={3}>
            {userAgents.length > 1 && (
              <Select
                id="userAgent"
                name="userAgent"
                data-test-id="user-agent"
                value={selectedUserAgent}
                onChange={(value) => {
                  setSelectedUserAgent(value as string);
                }}
                disabled={userAgents.length < 1 || logsStarted}
                options={userAgents.map((anAgent) => ({
                  label: anAgent,
                  value: anAgent,
                }))}
              />
            )}
          </Grid>
          <Grid
            item
            xs={2}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            {!logsStarted && (
              <Button
                id={"start-logs"}
                type="submit"
                variant="callAction"
                disabled={false}
                onClick={startLogs}
                label={"Start Logs"}
              />
            )}
            {logsStarted && (
              <Button
                id={"stop-logs"}
                type="button"
                variant="callAction"
                onClick={stopLogs}
                label={"Stop Logs"}
              />
            )}
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex" as const,
              justifyContent: "space-between" as const,
              alignItems: "center",
              marginBottom: "1rem",
              "& button": {
                flexGrow: 0,
                marginLeft: 8,
                marginBottom: 0,
              },
            }}
          >
            <SearchBox
              placeholder="Filter"
              onChange={(e) => {
                setFilter(e);
              }}
              value={filter}
            />
          </Grid>
          <Grid item xs={12}>
            <Box
              id="logs-container"
              data-test-id="logs-list-container"
              sx={{
                minHeight: 400,
                height: "calc(100vh - 200px)",
                overflow: "auto",
                fontSize: 13,
                borderRadius: 4,
              }}
            >
              <Box withBorders customBorderPadding={"0px"} useBackground>
                <Table aria-label="collapsible table">
                  <TableBody>
                    {filteredMessages.map((m) => {
                      return <LogLine log={m} />;
                    })}
                  </TableBody>
                </Table>
                {filteredMessages.length === 0 && (
                  <Box sx={{ padding: 20, textAlign: "center" }}>
                    No logs to display
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </PageLayout>
    </Fragment>
  );
};

export default ErrorLogs;
