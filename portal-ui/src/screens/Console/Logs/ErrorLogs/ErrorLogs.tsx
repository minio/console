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
import { Grid } from "@mui/material";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import moment from "moment/moment";
import { AppState } from "../../../../store";
import { logMessageReceived, logResetMessages } from "../actions";
import { LogMessage } from "../types";
import { timeFromDate } from "../../../../common/utils";
import { wsProtocol } from "../../../../utils/wsUtils";
import {
  actionsTray,
  containerForHeader,
  logsCommon,
  searchField,
} from "../../Common/FormComponents/common/styleLibrary";
import SearchIcon from "../../../../icons/SearchIcon";
import PageHeader from "../../Common/PageHeader/PageHeader";
import BackLink from "../../../../common/BackLink";

const styles = (theme: Theme) =>
  createStyles({
    logList: {
      background: "#fff",
      minHeight: 400,
      height: "calc(100vh - 304px)",
      overflow: "auto",
      fontSize: 13,
      padding: "25px 45px 0",
      border: "1px solid #EAEDEE",
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
    ansidefault: {
      color: "#000",
    },
    highlight: {
      "& span": {
        backgroundColor: "#082F5238",
      },
    },
    ...actionsTray,
    ...searchField,
    ...logsCommon,
    ...containerForHeader(theme.spacing(4)),
  });

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
  const [highlight, setHighlight] = useState("");

  useEffect(() => {
    logResetMessages();
    const url = new URL(window.location.toString());
    const isDev = process.env.NODE_ENV === "development";
    const port = isDev ? "9090" : url.port;

    const wsProt = wsProtocol(url.protocol);

    const c = new W3CWebSocket(
      `${wsProt}://${url.hostname}:${port}/ws/console`
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
  }, [logMessageReceived, logResetMessages]);

  const renderError = (logElement: LogMessage) => {
    let errorElems = [];
    if (logElement.error !== null && logElement.error !== undefined) {
      if (logElement.api && logElement.api.name) {
        const errorText = `API: ${logElement.api.name}`;

        const highlightedLine =
          highlight !== ""
            ? errorText.toLowerCase().includes(highlight.toLowerCase())
            : false;

        errorElems.push(
          <div
            key={`api-${logElement.key}`}
            className={`${highlightedLine ? classes.highlight : ""}`}
          >
            <br />
            <span className={classes.logerror}>{errorText}</span>
          </div>
        );
      }
      if (logElement.time) {
        const errorText = `Time: ${timeFromDate(logElement.time)}`;
        const highlightedLine =
          highlight !== ""
            ? errorText.toLowerCase().includes(highlight.toLowerCase())
            : false;
        errorElems.push(
          <div
            key={`time-${logElement.key}`}
            className={`${highlightedLine ? classes.highlight : ""}`}
          >
            <span className={classes.logerror}>{errorText}</span>
          </div>
        );
      }
      if (logElement.deploymentid) {
        const errorText = `DeploymentID: ${logElement.deploymentid}`;
        const highlightedLine =
          highlight !== ""
            ? errorText.toLowerCase().includes(highlight.toLowerCase())
            : false;
        errorElems.push(
          <div
            key={`deploytmentid-${logElement.key}`}
            className={`${highlightedLine ? classes.highlight : ""}`}
          >
            <span className={classes.logerror}>{errorText}</span>
          </div>
        );
      }
      if (logElement.requestID) {
        const errorText = `RequestID: ${logElement.requestID}`;
        const highlightedLine =
          highlight !== ""
            ? errorText.toLowerCase().includes(highlight.toLowerCase())
            : false;
        errorElems.push(
          <div
            key={`requestid-${logElement.key}`}
            className={`${highlightedLine ? classes.highlight : ""}`}
          >
            <span className={classes.logerror}>{errorText}</span>
          </div>
        );
      }
      if (logElement.remotehost) {
        const errorText = `RemoteHost: ${logElement.remotehost}`;
        const highlightedLine =
          highlight !== ""
            ? errorText.toLowerCase().includes(highlight.toLowerCase())
            : false;
        errorElems.push(
          <div
            key={`remotehost-${logElement.key}`}
            className={`${highlightedLine ? classes.highlight : ""}`}
          >
            <span className={classes.logerror}>{errorText}</span>
          </div>
        );
      }
      if (logElement.host) {
        const errorText = `Host: ${logElement.host}`;
        const highlightedLine =
          highlight !== ""
            ? errorText.toLowerCase().includes(highlight.toLowerCase())
            : false;
        errorElems.push(
          <div
            key={`host-${logElement.key}`}
            className={`${highlightedLine ? classes.highlight : ""}`}
          >
            <span className={classes.logerror}>{errorText}</span>
          </div>
        );
      }
      if (logElement.userAgent) {
        const errorText = `UserAgent: ${logElement.userAgent}`;
        const highlightedLine =
          highlight !== ""
            ? errorText.toLowerCase().includes(highlight.toLowerCase())
            : false;
        errorElems.push(
          <div
            key={`useragent-${logElement.key}`}
            className={`${highlightedLine ? classes.highlight : ""}`}
          >
            <span className={classes.logerror}>{errorText}</span>
          </div>
        );
      }
      if (logElement.error.message) {
        const errorText = `Error: ${logElement.error.message}`;
        const highlightedLine =
          highlight !== ""
            ? errorText.toLowerCase().includes(highlight.toLowerCase())
            : false;
        errorElems.push(
          <div
            key={`message-${logElement.key}`}
            className={`${highlightedLine ? classes.highlight : ""}`}
          >
            <span className={classes.logerror}>{errorText}</span>
          </div>
        );
      }
      if (logElement.error.source) {
        // for all sources add padding
        for (let s in logElement.error.source) {
          const errorText = logElement.error.source[s];
          const highlightedLine =
            highlight !== ""
              ? errorText.toLowerCase().includes(highlight.toLowerCase())
              : false;
          errorElems.push(
            <div
              key={`source-${logElement.key}-${s}`}
              className={`${highlightedLine ? classes.highlight : ""}`}
            >
              <span className={classes.logerror_tab}>{errorText}</span>
            </div>
          );
        }
      }
    }
    return errorElems;
  };

  const renderLog = (logElement: LogMessage) => {
    let logMessage = logElement.ConsoleMsg;
    // remove any non ascii characters, exclude any control codes
    logMessage = logMessage.replace(/([^\x20-\x7F])/g, "");

    // regex for terminal colors like e.g. `[31;4m `
    const tColorRegex = /((\[[0-9;]+m))/g;

    // get substring if there was a match for to split what
    // is going to be colored and what not, here we add color
    // only to the first match.
    let substr = logMessage.replace(tColorRegex, "");

    // in case highlight is set, we select the line that contains the requested string
    let highlightedLine =
      highlight !== ""
        ? logMessage.toLowerCase().includes(highlight.toLowerCase())
        : false;

    // if starts with multiple spaces add padding
    if (substr.startsWith("   ")) {
      return (
        <div
          key={logElement.key}
          className={`${highlightedLine ? classes.highlight : ""}`}
        >
          <span className={classes.tab}>{substr}</span>
        </div>
      );
    } else if (logElement.error !== null && logElement.error !== undefined) {
      // list error message and all sources and error elems
      return renderError(logElement);
    } else {
      // for all remaining set default class
      return (
        <div
          key={logElement.key}
          className={`${highlightedLine ? classes.highlight : ""}`}
        >
          <span className={classes.ansidefault}>{substr}</span>
        </div>
      );
    }
  };

  const renderLines = messages.map((m) => {
    return renderLog(m);
  });

  return (
    <Fragment>
      <PageHeader label="Logs" />
      <Grid container className={classes.container}>
        <Grid item xs={12}>
          <BackLink to="/tools" label="Return to Tools" />
        </Grid>
        <Grid item xs={12}>
          <Grid container className={classes.logsSubContainer}>
            <Grid item xs={12} className={classes.actionsTray}>
              <TextField
                placeholder="Highlight Line"
                className={classes.searchField}
                id="search-resource"
                label=""
                onChange={(val) => {
                  setHighlight(val.target.value);
                }}
                InputProps={{
                  disableUnderline: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                variant="standard"
              />
            </Grid>
            <Grid item xs={12}>
              <br />
            </Grid>
            <Grid item xs={12}>
              <div className={classes.logList}>{renderLines}</div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
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
