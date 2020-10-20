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
import React, { useEffect } from "react";
import { IMessageEvent, w3cwebsocket as W3CWebSocket } from "websocket";
import { AppState } from "../../../store";
import { connect } from "react-redux";
import { logMessageReceived, logResetMessages } from "./actions";
import { LogMessage } from "./types";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { timeFromDate } from "../../../common/utils";
import { isNullOrUndefined } from "util";
import { wsProtocol } from "../../../utils/wsUtils";
import { containerForHeader } from "../Common/FormComponents/common/styleLibrary";
import { Grid } from "@material-ui/core";
import PageHeader from "../Common/PageHeader/PageHeader";

const styles = (theme: Theme) =>
  createStyles({
    logList: {
      background: "white",
      height: "400px",
      overflow: "auto",
      "& ul": {
        margin: "4px",
        padding: "0px",
      },
      "& ul li": {
        listStyle: "none",
        margin: "0px",
        padding: "0px",
        borderBottom: "1px solid #dedede",
      },
    },
    tab: {
      padding: "25px",
    },
    logerror: {
      color: "#A52A2A",
    },
    logerror_tab: {
      color: "#A52A2A",
      padding: "25px",
    },
    ansidefault: {
      color: "black",
    },
    ...containerForHeader(theme.spacing(4)),
  });

interface ILogs {
  classes: any;
  logMessageReceived: typeof logMessageReceived;
  logResetMessages: typeof logResetMessages;
  messages: LogMessage[];
}

const Logs = ({
  classes,
  logMessageReceived,
  logResetMessages,
  messages,
}: ILogs) => {
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
        let m: LogMessage = JSON.parse(message.data.toString());
        m.time = new Date(m.time.toString());
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
  }, [logMessageReceived]);

  // replaces a character of a string with other at a given index
  const replaceWeirdChar = (
    origString: string,
    replaceChar: string,
    index: number
  ) => {
    let firstPart = origString.substr(0, index);
    let lastPart = origString.substr(index + 1);

    let newString = firstPart + replaceChar + lastPart;
    return newString;
  };

  const renderError = (logElement: LogMessage) => {
    let errorElems = [];
    if (!isNullOrUndefined(logElement.error)) {
      if (logElement.api && logElement.api.name) {
        errorElems.push(
          <li key={`api-${logElement.key}`}>
            <span className={classes.logerror}>API: {logElement.api.name}</span>
          </li>
        );
      }
      if (logElement.time) {
        errorElems.push(
          <li key={`time-${logElement.key}`}>
            <span className={classes.logerror}>
              Time: {timeFromDate(logElement.time)}
            </span>
          </li>
        );
      }
      if (logElement.deploymentid) {
        errorElems.push(
          <li key={`deploytmentid-${logElement.key}`}>
            <span className={classes.logerror}>
              DeploymentID: {logElement.deploymentid}
            </span>
          </li>
        );
      }
      if (logElement.requestID) {
        errorElems.push(
          <li key={`requestid-${logElement.key}`}>
            <span className={classes.logerror}>
              RequestID: {logElement.requestID}
            </span>
          </li>
        );
      }
      if (logElement.remotehost) {
        errorElems.push(
          <li key={`remotehost-${logElement.key}`}>
            <span className={classes.logerror}>
              RemoteHost: {logElement.remotehost}
            </span>
          </li>
        );
      }
      if (logElement.host) {
        errorElems.push(
          <li key={`host-${logElement.key}`}>
            <span className={classes.logerror}>Host: {logElement.host}</span>
          </li>
        );
      }
      if (logElement.userAgent) {
        errorElems.push(
          <li key={`useragent-${logElement.key}`}>
            <span className={classes.logerror}>
              UserAgent: {logElement.userAgent}
            </span>
          </li>
        );
      }
      if (logElement.error.message) {
        errorElems.push(
          <li key={`message-${logElement.key}`}>
            <span className={classes.logerror}>
              Error: {logElement.error.message}
            </span>
          </li>
        );
      }
      if (logElement.error.source) {
        // for all sources add padding
        for (let s in logElement.error.source) {
          errorElems.push(
            <li key={`source-${logElement.key}-${s}`}>
              <span className={classes.logerror_tab}>
                {logElement.error.source[s]}
              </span>
            </li>
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

    // if starts with multiple spaces add padding
    if (substr.startsWith("   ")) {
      return (
        <li key={logElement.key}>
          <span className={classes.tab}>{substr}</span>
        </li>
      );
    } else if (!isNullOrUndefined(logElement.error)) {
      // list error message and all sources and error elems
      return renderError(logElement);
    } else {
      // for all remaining set default class
      return (
        <li key={logElement.key}>
          <span className={classes.ansidefault}>{substr}</span>
        </li>
      );
    }
  };

  return (
    <React.Fragment>
      <PageHeader label="Logs" />
      <Grid container>
        <Grid className={classes.container} item xs={12}>
          <div className={classes.logList}>
            <ul>
              {messages.map((m) => {
                return renderLog(m);
              })}
            </ul>
          </div>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const mapState = (state: AppState) => ({
  messages: state.logs.messages,
});

const connector = connect(mapState, {
  logMessageReceived: logMessageReceived,
  logResetMessages: logResetMessages,
});

export default connector(withStyles(styles)(Logs));
