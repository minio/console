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
import { LogMessage } from "../types";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Moment from "react-moment";
import BoxArrowUp from "../../../../icons/BoxArrowUp";
import BoxArrowDown from "../../../../icons/BoxArrowDown";
import WarnFilledIcon from "../../../../icons/WarnFilledIcon";

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
  const dataStyle = { color: "green" };
  return (
    <Fragment>
      <div>
        <b>API:&nbsp;</b>
        <span style={dataStyle}>{log.api.name}</span>
      </div>
      <div>
        <b>Time:&nbsp;</b>
        <span style={dataStyle}>{log.time.toString()}</span>
      </div>
      <div>
        <b>DeploymentID:&nbsp;</b>
        <span style={dataStyle}>{log.deploymentid}</span>
      </div>
      <div>
        <b>RequestID:&nbsp;</b>
        <span style={dataStyle}>{log.requestID}</span>
      </div>
      <div>
        <b>RemoteHost:&nbsp;</b>
        <span style={dataStyle}>{log.remotehost}</span>
      </div>
      <div>
        <b>UserAgent:&nbsp;</b>
        <span style={dataStyle}>{log.userAgent}</span>
      </div>
      <div>
        <b>Error:&nbsp;</b>
        <span style={dataStyle}>{log.error && log.error.message}</span>
      </div>
      <br />
      <div>
        <b>Backtrace:&nbsp;</b>
      </div>
      {log.error &&
        log.error.source.map((e, i) => {
          return (
            <div>
              <b>{i}:&nbsp;</b>
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

  let logMessage = "";
  if (log.ConsoleMsg !== "") {
    logMessage = log.ConsoleMsg;
  } else if (log.error !== null && log.error.message !== "") {
    logMessage = log.error.message;
  }
  // remove any non ascii characters, exclude any control codes
  let titleLogMessage = logMessage.replace(/━|┏|┓|┃|┗|┛/g, "");
  // remove any non ascii characters, exclude any control codes
  titleLogMessage = titleLogMessage.replace(/([^\x20-\x7F])/g, "");

  // regex for terminal colors like e.g. `[31;4m `
  const tColorRegex = /((\[[0-9;]+m))/g;

  let fullMessage = <Fragment />;
  if (log.ConsoleMsg !== "") {
    fullMessage = messageForConsoleMsg(log);
  } else if (log.error !== null && log.error.message !== "") {
    fullMessage = messageForError(log);
  }

  titleLogMessage = titleLogMessage.replace(tColorRegex, "");

  let dateStr = <Moment format="YYYY/MM/DD UTC HH:mm:ss">{log.time}</Moment>;
  if (log.time.getFullYear() === 1) {
    dateStr = <Fragment>n/a</Fragment>;
  }

  return (
    <React.Fragment key={log.time.toString()}>
      <TableRow
        sx={{ "& > *": { borderBottom: "unset" }, cursor: "pointer" }}
        style={{ backgroundColor: "#FDFDFD" }}
      >
        <TableCell
          onClick={() => setOpen(!open)}
          style={{ width: 200, color: "#989898", fontSize: 12 }}
        >
          <Box
            sx={{
              "& .min-icon": { width: 12, marginRight: 1 },
              fontWeight: "bold",
              lineHeight: 1,
            }}
          >
            <WarnFilledIcon />
            {dateStr}
          </Box>
        </TableCell>
        <TableCell onClick={() => setOpen(!open)}>
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
                overflow: "hidden",
              }}
            >
              {titleLogMessage}
            </div>
          </div>
        </TableCell>
        <TableCell onClick={() => setOpen(!open)} style={{ width: 40 }}>
          {open ? <BoxArrowUp /> : <BoxArrowDown />}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{
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
          <Collapse in={open} timeout="auto" unmountOnExit>
            <div style={{ marginTop: 10 }}>Log Details</div>
          </Collapse>
        </TableCell>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography
                style={{
                  background: "#efefef",
                  border: "1px solid #dedede",
                  padding: 4,
                  fontSize: 14,
                  color: "#666666",
                }}
              >
                {fullMessage}
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0, width: 40 }} />
      </TableRow>
    </React.Fragment>
  );
};

export default LogLine;
