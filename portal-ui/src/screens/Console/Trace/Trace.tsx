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
import { traceMessageReceived, traceResetMessages } from "./actions";
import { TraceMessage } from "./types";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { niceBytes, timeFromDate } from "../../../common/utils";
import { wsProtocol } from "../../../utils/wsUtils";
import { containerForHeader } from "../Common/FormComponents/common/styleLibrary";
import PageHeader from "../Common/PageHeader/PageHeader";
import { Grid } from "@material-ui/core";
import TableWrapper from "../Common/TableWrapper/TableWrapper";

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
    sizeItem: {
      width: 150,
    },
    timeItem: {
      width: 100,
    },
    ...containerForHeader(theme.spacing(4)),
  });

interface ITrace {
  classes: any;
  traceMessageReceived: typeof traceMessageReceived;
  traceResetMessages: typeof traceResetMessages;
  messages: TraceMessage[];
}

const Trace = ({
  classes,
  traceMessageReceived,
  traceResetMessages,
  messages,
}: ITrace) => {
  useEffect(() => {
    traceResetMessages();
    const url = new URL(window.location.toString());
    const isDev = process.env.NODE_ENV === "development";
    const port = isDev ? "9090" : url.port;

    const wsProt = wsProtocol(url.protocol);
    const c = new W3CWebSocket(`${wsProt}://${url.hostname}:${port}/ws/trace`);

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
        let m: TraceMessage = JSON.parse(message.data.toString());
        m.time = new Date(m.time.toString());
        m.key = Math.random();
        traceMessageReceived(m);
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
  }, [traceMessageReceived, traceResetMessages]);

  return (
    <React.Fragment>
      <PageHeader label={"Trace"} />
      <Grid container>
        <Grid item xs={12} className={classes.container}>
          <TableWrapper
            itemActions={[]}
            columns={[
              {
                label: "Time",
                elementKey: "time",
                renderFunction: (time: Date) => {
                  const timeParse = new Date(time);
                  return timeFromDate(timeParse);
                },
                globalClass: classes.timeItem,
              },
              { label: "Name", elementKey: "api" },
              {
                label: "Status",
                elementKey: "",
                renderFunction: (fullElement: TraceMessage) =>
                  `${fullElement.statusCode} ${fullElement.statusMsg}`,
                renderFullObject: true,
              },
              {
                label: "Location",
                elementKey: "configuration_id",
                renderFunction: (fullElement: TraceMessage) =>
                  `${fullElement.host} ${fullElement.client}`,
                renderFullObject: true,
              },
              {
                label: "Load Time",
                elementKey: "callStats.duration",
                globalClass: classes.timeItem,
              },
              {
                label: "Upload",
                elementKey: "callStats.rx",
                renderFunction: niceBytes,
                globalClass: classes.sizeItem,
              },
              {
                label: "Download",
                elementKey: "callStats.tx",
                renderFunction: niceBytes,
                globalClass: classes.sizeItem,
              },
            ]}
            isLoading={false}
            records={messages}
            entityName="Traces"
            idField="api"
            customEmptyMessage="There are no traced Elements yet"
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const mapState = (state: AppState) => ({
  messages: state.trace.messages,
});

const connector = connect(mapState, {
  traceMessageReceived: traceMessageReceived,
  traceResetMessages: traceResetMessages,
});

export default connector(withStyles(styles)(Trace));
