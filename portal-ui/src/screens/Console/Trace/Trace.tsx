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
import { Button, Grid, TextField } from "@mui/material";
import { IMessageEvent, w3cwebsocket as W3CWebSocket } from "websocket";
import { AppState } from "../../../store";
import { connect } from "react-redux";
import {
  setTraceStarted,
  traceMessageReceived,
  traceResetMessages,
} from "./actions";
import { TraceMessage } from "./types";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { niceBytes, timeFromDate } from "../../../common/utils";
import { wsProtocol } from "../../../utils/wsUtils";
import {
  actionsTray,
  containerForHeader,
  hrClass,
  inlineCheckboxes,
  searchField,
} from "../Common/FormComponents/common/styleLibrary";
import TableWrapper from "../Common/TableWrapper/TableWrapper";
import PageHeader from "../Common/PageHeader/PageHeader";
import CheckboxWrapper from "../Common/FormComponents/CheckboxWrapper/CheckboxWrapper";
import moment from "moment/moment";
import BackLink from "../../../common/BackLink";

const styles = (theme: Theme) =>
  createStyles({
    paperContainer: {
      padding: 15,
      paddingLeft: 50,
      display: "flex",
    },
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
    labelCheckboxes: {
      fontSize: 16,
      fontWeight: 700,
      paddingTop: 19,
    },
    startButton: {
      textAlign: "right",
    },
    ...actionsTray,
    ...searchField,
    ...hrClass,
    ...inlineCheckboxes,
    searchField: {
      ...searchField.searchField,
      margin: "0 5px",
      "&:first-of-type": {
        marginLeft: 0,
      },
      "&:last-of-type": {
        marginRight: 0,
      },
    },
    tableWrapper: {
      height: "calc(100vh - 292px)",
    },
    ...containerForHeader(theme.spacing(4)),
  });

interface ITrace {
  classes: any;
  traceMessageReceived: typeof traceMessageReceived;
  traceResetMessages: typeof traceResetMessages;
  setTraceStarted: typeof setTraceStarted;
  messages: TraceMessage[];
  namespace: string;
  tenant: string;
  traceStarted: boolean;
}

var c: any = null;

const Trace = ({
  classes,
  traceMessageReceived,
  traceResetMessages,
  setTraceStarted,
  traceStarted,
  messages,
}: ITrace) => {
  const [statusCode, setStatusCode] = useState<string>("");
  const [method, setMethod] = useState<string>("");
  const [func, setFunc] = useState<string>("");
  const [path, setPath] = useState<string>("");
  const [threshold, setThreshold] = useState<number>(0);
  const [all, setAll] = useState<boolean>(false);
  const [s3, setS3] = useState<boolean>(true);
  const [internal, setInternal] = useState<boolean>(false);
  const [storage, setStorage] = useState<boolean>(false);
  const [os, setOS] = useState<boolean>(false);
  const [errors, setErrors] = useState<boolean>(false);

  const startTrace = () => {
    traceResetMessages();
    const url = new URL(window.location.toString());
    const isDev = process.env.NODE_ENV === "development";
    const port = isDev ? "9090" : url.port;

    let calls = `${s3 ? "s3," : ""}${internal ? "internal," : ""}${
      storage ? "storage," : ""
    }${os ? "os," : ""}`;

    if (all) {
      calls = "all";
    }

    const wsProt = wsProtocol(url.protocol);
    c = new W3CWebSocket(
      `${wsProt}://${
        url.hostname
      }:${port}/ws/trace?calls=${calls}&threshold=${threshold}&onlyErrors=${
        errors ? "yes" : "no"
      }&statusCode=${statusCode}&method=${method}&funcname=${func}&path=${path}`
    );

    let interval: any | null = null;
    if (c !== null) {
      c.onopen = () => {
        console.log("WebSocket Client Connected");
        setTraceStarted(true);
        c.send("ok");
        interval = setInterval(() => {
          c.send("ok");
        }, 10 * 1000);
      };
      c.onmessage = (message: IMessageEvent) => {
        let m: TraceMessage = JSON.parse(message.data.toString());
        m.ptime = moment(m.time, "YYYY-MM-DD HH:mm:s.SSSS +0000 UTC").toDate();
        m.key = Math.random();
        traceMessageReceived(m);
      };
      c.onclose = () => {
        clearInterval(interval);
        console.log("connection closed by server");
        setTraceStarted(false);
      };
      return () => {
        c.close(1000);
        clearInterval(interval);
        console.log("closing websockets");
        setTraceStarted(false);
      };
    }
  };

  const stopTrace = () => {
    c.close(1000);
    setTraceStarted(false);
  };

  return (
    <Fragment>
      <PageHeader label={"Trace"} />
      <Grid container className={classes.container}>
        <Grid item xs={12}>
          <BackLink to="/tools" label="Return to Tools" />
        </Grid>
        <Grid item xs={12} className={classes.actionsTray}>
          <TextField
            placeholder="Status Code"
            className={classes.searchField}
            id="status-code"
            label=""
            InputProps={{
              disableUnderline: true,
            }}
            value={statusCode}
            onChange={(e) => {
              setStatusCode(e.target.value);
            }}
            disabled={traceStarted}
            variant="standard"
          />
          <TextField
            placeholder="Method"
            className={classes.searchField}
            id="method"
            label=""
            InputProps={{
              disableUnderline: true,
            }}
            value={method}
            onChange={(e) => {
              setMethod(e.target.value);
            }}
            disabled={traceStarted}
            variant="standard"
          />
          <TextField
            placeholder="Function Name"
            className={classes.searchField}
            id="func-name"
            label=""
            disabled={traceStarted}
            InputProps={{
              disableUnderline: true,
            }}
            value={func}
            onChange={(e) => {
              setFunc(e.target.value);
            }}
            variant="standard"
          />
          <TextField
            placeholder="Path"
            className={classes.searchField}
            id="path"
            label=""
            disabled={traceStarted}
            InputProps={{
              disableUnderline: true,
            }}
            value={path}
            onChange={(e) => {
              setPath(e.target.value);
            }}
            variant="standard"
          />
          <TextField
            type="number"
            className={classes.searchField}
            id="fthreshold"
            label="Response Threshold"
            disabled={traceStarted}
            InputProps={{
              disableUnderline: true,
            }}
            inputProps={{
              min: 0,
            }}
            value={threshold}
            onChange={(e) => {
              setThreshold(parseInt(e.target.value));
            }}
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} className={classes.inlineCheckboxes}>
          <span className={classes.labelCheckboxes}>Calls to trace:</span>
          <CheckboxWrapper
            checked={all}
            id={"all_calls"}
            name={"all_calls"}
            label={"All"}
            onChange={(item) => {
              setAll(item.target.checked);
            }}
            value={"all"}
            disabled={traceStarted}
          />
          <CheckboxWrapper
            checked={s3 || all}
            id={"s3_calls"}
            name={"s3_calls"}
            label={"S3"}
            onChange={(item) => {
              setS3(item.target.checked);
            }}
            value={"s3"}
            disabled={all || traceStarted}
          />
          <CheckboxWrapper
            checked={internal || all}
            id={"internal_calls"}
            name={"internal_calls"}
            label={"Internal"}
            onChange={(item) => {
              setInternal(item.target.checked);
            }}
            value={"internal"}
            disabled={all || traceStarted}
          />
          <CheckboxWrapper
            checked={storage || all}
            id={"storage_calls"}
            name={"storage_calls"}
            label={"Storage"}
            onChange={(item) => {
              setStorage(item.target.checked);
            }}
            value={"storage"}
            disabled={all || traceStarted}
          />
          <CheckboxWrapper
            checked={os || all}
            id={"os_calls"}
            name={"os_calls"}
            label={"OS"}
            onChange={(item) => {
              setOS(item.target.checked);
            }}
            value={"os"}
            disabled={all || traceStarted}
          />
          <span className={classes.labelCheckboxes}>
            &nbsp; &nbsp; &nbsp; | &nbsp; &nbsp; &nbsp;
          </span>
          <CheckboxWrapper
            checked={errors}
            id={"only_errors"}
            name={"only_errors"}
            label={"Display only Errors"}
            onChange={(item) => {
              setErrors(item.target.checked);
            }}
            value={"only_errors"}
            disabled={traceStarted}
          />
        </Grid>
        <Grid item xs={12} className={classes.startButton}>
          {!traceStarted && (
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={traceStarted}
              onClick={startTrace}
            >
              Start
            </Button>
          )}
          {traceStarted && (
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={stopTrace}
            >
              Stop
            </Button>
          )}
        </Grid>

        <Grid item xs={12}>
          <br />
        </Grid>

        <TableWrapper
          itemActions={[]}
          columns={[
            {
              label: "Time",
              elementKey: "ptime",
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
          customEmptyMessage={
            traceStarted
              ? "No Traced elements received yet"
              : "Trace is not started yet"
          }
          customPaperHeight={classes.tableWrapper}
          autoScrollToBottom
        />
      </Grid>
    </Fragment>
  );
};

const mapState = (state: AppState) => ({
  messages: state.trace.messages,
  traceStarted: state.trace.traceStarted,
});

const connector = connect(mapState, {
  traceMessageReceived: traceMessageReceived,
  traceResetMessages: traceResetMessages,
  setTraceStarted,
});

export default connector(withStyles(styles)(Trace));
