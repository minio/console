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
import React, { Fragment, useState } from "react";
import { DateTime } from "luxon";
import { LogMessage } from "../types";
import {
  Box,
  BoxArrowDown,
  BoxArrowUp,
  TableCell,
  TableRow,
  WarnFilledIcon,
} from "mds";

import getByKey from "lodash/get";

const timestampDisplayFmt = "HH:mm:ss ZZZZ MM/dd/yyyy"; //make this same as server logs format.
const messageForConsoleMsg = (log: LogMessage) => {
  // regex for terminal colors like e.g. `[31;4m `
  const tColorRegex = /((\[[0-9;]+m))/g;

  let fullMessage = log.ConsoleMsg;
  // remove the 0x1B character
  /* eslint-disable no-control-regex */
  fullMessage = fullMessage.replace(/\x1B/g, " ");
  /* eslint-enable no-control-regex */
  // get substring if there was a match for to split what
  // is going to be colored and what not, here we add color
  // only to the first match.
  fullMessage = fullMessage.replace(tColorRegex, "");
  return (
    <div
      style={{
        display: "table",
        tableLayout: "fixed",
        width: "100%",
        paddingLeft: 10,
        paddingRight: 10,
      }}
    >
      <div
        style={{
          display: "table-cell",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflowX: "auto",
        }}
      >
        <pre>{fullMessage}</pre>
      </div>
    </div>
  );
};
const messageForError = (log: LogMessage) => {
  const dataStyle = {
    color: "#C83B51",
    fontWeight: 400,
    fontFamily: "monospace",
    fontSize: "12px",
  };
  const labelStyle = {
    fontFamily: "monospace",
    fontSize: "12px",
  };

  const getLogEntryKey = (keyPath: string) => {
    return getByKey(log, keyPath, "");
  };

  const logTime = DateTime.fromFormat(
    log.time.toString(),
    "HH:mm:ss z MM/dd/yyyy",
    {
      zone: "UTC",
    },
  );
  return (
    <Fragment>
      <div>
        <b style={labelStyle}>API:&nbsp;</b>
        <span style={dataStyle}>{getLogEntryKey("api.name")}</span>
      </div>
      <div>
        <b style={labelStyle}>Time:&nbsp;</b>
        <span style={dataStyle}>{logTime.toFormat(timestampDisplayFmt)}</span>
      </div>
      <div>
        <b style={labelStyle}>DeploymentID:&nbsp;</b>
        <span style={dataStyle}>{getLogEntryKey("deploymentid")}</span>
      </div>
      <div>
        <b style={labelStyle}>RequestID:&nbsp;</b>
        <span style={dataStyle}>{getLogEntryKey("requestID")}</span>
      </div>
      <div>
        <b style={labelStyle}>RemoteHost:&nbsp;</b>
        <span style={dataStyle}>{getLogEntryKey("remotehost")}</span>
      </div>
      <div>
        <b style={labelStyle}>UserAgent:&nbsp;</b>
        <span style={dataStyle}>{getLogEntryKey("userAgent")}</span>
      </div>
      <div>
        <b style={labelStyle}>Error:&nbsp;</b>
        <span style={dataStyle}>{getLogEntryKey("error.message")}</span>
      </div>
      <br />
      <div>
        <b style={labelStyle}>Backtrace:&nbsp;</b>
      </div>

      {(log.error.source || []).map((e: any, i: number) => {
        return (
          <div>
            <b style={labelStyle}>{i}:&nbsp;</b>
            <span style={dataStyle}>{e}</span>
          </div>
        );
      })}
    </Fragment>
  );
};

const LogLine = (props: { log: LogMessage }) => {
  const { log } = props;
  const [open, setOpen] = useState<boolean>(false);

  const getLogLineKey = (keyPath: string) => {
    return getByKey(log, keyPath, "");
  };

  let logMessage = "";
  let consoleMsg = getLogLineKey("ConsoleMsg");
  let errMsg = getLogLineKey("error.message");
  if (consoleMsg !== "") {
    logMessage = consoleMsg;
  } else if (errMsg !== "") {
    logMessage = errMsg;
  }
  // remove any non ascii characters, exclude any control codes
  let titleLogMessage = (logMessage || "").replace(/━|┏|┓|┃|┗|┛/g, "");
  // remove any non ascii characters, exclude any control codes
  titleLogMessage = titleLogMessage.replace(/([^\x20-\x7F])/g, "");

  // regex for terminal colors like e.g. `[31;4m `
  const tColorRegex = /((\[[0-9;]+m))/g;

  let fullMessage = <Fragment />;
  if (consoleMsg !== "") {
    fullMessage = messageForConsoleMsg(log);
  } else if (errMsg !== "") {
    fullMessage = messageForError(log);
  }

  titleLogMessage = (titleLogMessage || "").replace(tColorRegex, "");

  const logTime = DateTime.fromFormat(
    log.time.toString(),
    "HH:mm:ss z MM/dd/yyyy",
    {
      zone: "UTC",
    },
  );
  const dateOfLine = logTime.toJSDate(); //DateTime.fromJSDate(log.time);

  let dateStr = <Fragment>{logTime.toFormat(timestampDisplayFmt)}</Fragment>;

  if (dateOfLine.getFullYear() === 1) {
    dateStr = <Fragment>n/a</Fragment>;
  }

  return (
    <React.Fragment key={logTime.toString()}>
      <TableRow
        sx={{
          cursor: "pointer",
          borderLeft: "0",
          borderRight: "0",
        }}
      >
        <TableCell
          onClick={() => setOpen(!open)}
          sx={{ width: 280, color: "#989898", fontSize: 12 }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",

              "& .min-icon": { width: 12, marginRight: 1 },
              fontWeight: "bold",
              lineHeight: 1,
            }}
          >
            <WarnFilledIcon />
            <div>{dateStr}</div>
          </Box>
        </TableCell>
        <TableCell
          onClick={() => setOpen(!open)}
          sx={{ width: 200, color: "#989898", fontSize: 12 }}
        >
          <Box
            sx={{
              "& .min-icon": { width: 12, marginRight: 1 },
              fontWeight: "bold",
              lineHeight: 1,
            }}
          >
            {log.errKind}
          </Box>
        </TableCell>
        <TableCell onClick={() => setOpen(!open)}>
          <Box
            sx={{
              display: "table",
              tableLayout: "fixed",
              width: "100%",
              paddingLeft: 10,
              paddingRight: 10,
            }}
          >
            <Box
              sx={{
                display: "table-cell",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              {titleLogMessage}
            </Box>
          </Box>
        </TableCell>
        <TableCell onClick={() => setOpen(!open)} sx={{ width: 40 }}>
          <Box
            sx={{
              "& .min-icon": {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "2px",
              },
              "&:hover .min-icon": {
                fill: "#eaeaea",
              },
            }}
          >
            {open ? <BoxArrowUp /> : <BoxArrowDown />}
          </Box>
        </TableCell>
      </TableRow>
      {open ? (
        <TableRow>
          <TableCell
            sx={{
              paddingBottom: 0,
              paddingTop: 0,
              width: 200,
              textTransform: "uppercase",
              verticalAlign: "top",
              textAlign: "right",
              color: "#8399AB",
              fontWeight: "bold",
            }}
          >
            <Box sx={{ marginTop: 10 }}>Log Details</Box>
          </TableCell>
          <TableCell sx={{ paddingBottom: 0, paddingTop: 0 }} colSpan={2}>
            <Box
              sx={{
                margin: 1,
                padding: 4,
                fontSize: 14,
              }}
              withBorders
              useBackground
            >
              {fullMessage}
            </Box>
          </TableCell>
          <TableCell sx={{ paddingBottom: 0, paddingTop: 0, width: 40 }} />
        </TableRow>
      ) : null}
    </React.Fragment>
  );
};

export default LogLine;
