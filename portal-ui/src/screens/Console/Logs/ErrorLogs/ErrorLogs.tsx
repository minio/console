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
import { IMessageEvent, w3cwebsocket as W3CWebSocket } from "websocket";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { connect } from "react-redux";
import { Grid, FormControl, MenuItem, Select, InputBase } from "@mui/material";

import moment from "moment/moment";
import { ErrorResponseHandler } from "../../../../../src/common/types";
import api from "../../../../../src/common/api";
import { AppState } from "../../../../store";
import { logMessageReceived, logResetMessages } from "../actions";
import { LogMessage } from "../types";
import { wsProtocol } from "../../../../utils/wsUtils";
import {
  actionsTray,
  containerForHeader,
  logsCommon,
  searchField,
  inlineCheckboxes,
} from "../../Common/FormComponents/common/styleLibrary";
import PageHeader from "../../Common/PageHeader/PageHeader";
import PageLayout from "../../Common/Layout/PageLayout";
import SearchBox from "../../Common/SearchBox";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import LogLine from "./LogLine";
import CheckboxWrapper from "../../Common/FormComponents/CheckboxWrapper/CheckboxWrapper";

const styles = (theme: Theme) =>
  createStyles({
    logList: {
      background: "#fff",
      minHeight: 400,
      height: "calc(100vh - 200px)",
      overflow: "auto",
      fontSize: 13,
      borderRadius: 4,
    },
    tab: {
      paddingLeft: 25,
    },
    logerror: {
      color: "#A52A2A",
    },
    logerror_tab: {
      color: "#A52A2A",
      paddingLeft: 25,
    },
    nodeField: {
      flexGrow: 2,
      minWidth: 200,
    },
    ansidefault: {
      color: "#000",
    },
    midColumnCheckboxes: {
      display: "flex",
    },
    checkBoxLabel: {
      marginTop: 10,
      fontSize: 16,
      fontWeight: 500,
    },
    highlight: {
      "& span": {
        backgroundColor: "#082F5238",
      },
    },
    ...actionsTray,
    ...searchField,
    ...logsCommon,
    ...inlineCheckboxes,
    ...containerForHeader(theme.spacing(4)),
  });

const SelectStyled = withStyles((theme: Theme) =>
  createStyles({
    root: {
      lineHeight: "50px",
      "label + &": {
        marginTop: theme.spacing(3),
      },
      "& .MuiSelect-select:focus": {
        backgroundColor: "transparent",
      },
    },
    input: {
      height: 50,
      fontSize: 13,
      lineHeight: "50px",
    },
  })
)(InputBase);

interface ILogs {
  classes: any;
  logMessageReceived: typeof logMessageReceived;
  logResetMessages: typeof logResetMessages;
  messages: LogMessage[];
}

const ErrorLogs = ({
  classes,
  logMessageReceived,
  logResetMessages,
  messages,
}: ILogs) => {
  const [filter, setFilter] = useState<string>("");
  const [nodes, setNodes] = useState<string[]>([""]);
  const [selectedNode, setSelectedNode] = useState<string>("Select node");
  const [selectedUserAgent, setSelectedUserAgent] =
    useState<string>("Select user agent");
  const [userAgents, setUserAgents] = useState<string[]>([
    "All User Agents",
    "fake",
  ]);
  const [allTypes, setAllTypes] = useState<boolean>(false);
  const [logType, setLogType] = useState<string>("all");
  const [loadingNodes, setLoadingNodes] = useState<boolean>(false);

  useEffect(() => {
    logResetMessages();
    const url = new URL(window.location.toString());
    const isDev = process.env.NODE_ENV === "development";
    const port = isDev ? "9090" : url.port;

    const wsProt = wsProtocol(url.protocol);

    const c = new W3CWebSocket(
      `${wsProt}://${
        url.hostname
      }:${port}/ws/console/?logType=${logType}&?node=${
        selectedNode === "Select node" ? "" : selectedNode
      }`
    );

    let interval: any | null = null;
    if (c !== null) {
      c.onopen = () => {
        console.log("WebSocket Client Connected");

        c.send("ok");
        interval = setInterval(() => {
          c.send("ok");
        }, 10 * 1000);
      };
      c.onmessage = (message: IMessageEvent) => {
        // console.log(message.data.toString())
        // FORMAT: 00:35:17 UTC 01/01/2021

        let m: LogMessage = JSON.parse(message.data.toString());
        m.time = moment(m.time, "HH:mm:s UTC MM/DD/YYYY").toDate();
        m.key = Math.random();
        if (userAgents.indexOf(m.userAgent) < 0 && m.userAgent != undefined) {
          userAgents.push(m.userAgent);
          setUserAgents(userAgents);
        }
        logMessageReceived(m);
      };
      c.onclose = () => {
        clearInterval(interval);
        console.log("connection closed by server");
      };
      return () => {
        c.close(1000);
        clearInterval(interval);
        console.log("closing websockets");
      };
    }
  }, [logMessageReceived, logResetMessages, selectedNode, logType]);

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
    }
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

  return (
    <Fragment>
      <PageHeader label="Logs" />
      <PageLayout>
        <Grid container>
          <Grid item xs={12} className={classes.actionsTray}>
            <SearchBox
              placeholder="Filter"
              onChange={(e) => {
                setFilter(e);
              }}
              value={filter}
            />
          </Grid>
          <Grid>
            {!loadingNodes ? (
              <FormControl variant="outlined" className={classes.nodeField}>
                <Select
                  id="node"
                  name="node"
                  data-test-id="node-selector"
                  value={selectedNode}
                  onChange={(e) => {
                    setSelectedNode(e.target.value as string);
                  }}
                  className={classes.searchField}
                  disabled={loadingNodes}
                  input={<SelectStyled />}
                >
                  <MenuItem
                    value={selectedNode}
                    key={`select-node-default`}
                    disabled={true}
                  >
                    Select Node
                  </MenuItem>
                  {nodes.map((aNode) => (
                    <MenuItem value={aNode} key={`select-node-name-${aNode}`}>
                      {aNode}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <h3> Loading nodes</h3>
            )}
            <FormControl variant="outlined" className={classes.nodeField}>
              <Select
                id="userAgent"
                name="userAgent"
                data-test-id="user-agent"
                value={selectedUserAgent}
                onChange={(e) => {
                  setSelectedUserAgent(e.target.value as string);
                }}
                className={classes.searchField}
                disabled={userAgents.length < 1}
                input={<SelectStyled />}
              >
                <MenuItem
                  value={selectedUserAgent}
                  key={`select-user-agent-default`}
                  disabled={true}
                >
                  Select User Agent
                </MenuItem>
                {userAgents.map((anAgent) => (
                  <MenuItem
                    value={anAgent}
                    key={`select-user-agent-${anAgent}`}
                  >
                    {anAgent}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div className={classes.checkBoxLabel}>Log type to display:</div>
            <div className={classes.midColumnCheckboxes}>
              <CheckboxWrapper
                checked={allTypes}
                id={"all_calls"}
                name={"all_calls"}
                label={"All"}
                onChange={(item) => {
                  setAllTypes(!allTypes);
                  item.target.checked ? setLogType("all") : setLogType("");
                }}
                value={"all"}
                disabled={false}
              />
              <CheckboxWrapper
                checked={logType === "application" || allTypes}
                id={"application_type"}
                name={"application_type"}
                label={"Application"}
                onChange={(item) => {
                  setAllTypes(false);
                  item.target.checked
                    ? setLogType("application")
                    : setLogType("");
                }}
                value={"s3"}
                disabled={false}
              />
              <CheckboxWrapper
                checked={logType === "minio" || allTypes}
                id={"minio_type"}
                name={"minio_type"}
                label={"MinIO"}
                onChange={(item) => {
                  setAllTypes(false);
                  item.target.checked ? setLogType("minio") : setLogType("");
                }}
                value={"MinIO"}
                disabled={false}
              />
            </div>
          </Grid>
          <Grid item xs={12}>
            <div
              id="logs-container"
              className={classes.logList}
              data-test-id="logs-list-container"
            >
              <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                  <TableBody>
                    {filteredMessages.map((m) => {
                      return <LogLine log={m} />;
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </Grid>
        </Grid>
      </PageLayout>
    </Fragment>
  );
};

const mapState = (state: AppState) => ({
  messages: state.logs.messages,
});

const connector = connect(mapState, {
  logMessageReceived: logMessageReceived,
  logResetMessages: logResetMessages,
});

export default withStyles(styles)(connector(ErrorLogs));
