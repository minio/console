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
import { DateTime } from "luxon";
import { Box, Grid } from "@mui/material";
import { IMessageEvent, w3cwebsocket as W3CWebSocket } from "websocket";
import { Button, FilterIcon, PageLayout } from "mds";
import { AppState, useAppDispatch } from "../../../store";
import { useSelector } from "react-redux";
import { TraceMessage } from "./types";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { niceBytes, timeFromDate } from "../../../common/utils";
import { wsProtocol } from "../../../utils/wsUtils";
import {
  actionsTray,
  containerForHeader,
  tableStyles,
} from "../Common/FormComponents/common/styleLibrary";
import TableWrapper from "../Common/TableWrapper/TableWrapper";
import CheckboxWrapper from "../Common/FormComponents/CheckboxWrapper/CheckboxWrapper";

import InputBoxWrapper from "../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import {
  setTraceStarted,
  traceMessageReceived,
  traceResetMessages,
} from "./traceSlice";
import TooltipWrapper from "../Common/TooltipWrapper/TooltipWrapper";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";

const styles = (theme: Theme) =>
  createStyles({
    sizeItem: {
      width: 150,
    },
    timeItem: {
      width: 100,
    },
    ...actionsTray,

    ...tableStyles,
    tableWrapper: {
      height: "calc(100vh - 292px)",
    },
    formBox: {
      border: "1px solid #EAEAEA",
      padding: 25,
      marginBottom: 15,
    },
    traceCheckedIcon: {
      width: "14px",
      height: "14px",
      marginLeft: "0px",
    },
    unCheckedIcon: {
      width: "14px",
      height: "14px",
    },
    ...containerForHeader,
  });

interface ITrace {
  classes: any;
}

var c: any = null;

const Trace = ({ classes }: ITrace) => {
  const dispatch = useAppDispatch();

  const messages = useSelector((state: AppState) => state.trace.messages);
  const traceStarted = useSelector(
    (state: AppState) => state.trace.traceStarted
  );

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

  const [toggleFilter, setToggleFilter] = useState<boolean>(false);

  const startTrace = () => {
    dispatch(traceResetMessages());
    const url = new URL(window.location.toString());
    const isDev = process.env.NODE_ENV === "development";
    const port = isDev ? "9090" : url.port;

    let calls = `${s3 ? "s3," : ""}${internal ? "internal," : ""}${
      storage ? "storage," : ""
    }${os ? "os," : ""}`;

    if (all) {
      calls = "all";
    }
    // check if we are using base path, if not this always is `/`
    const baseLocation = new URL(document.baseURI);
    const baseUrl = baseLocation.pathname;

    const wsProt = wsProtocol(url.protocol);
    c = new W3CWebSocket(
      `${wsProt}://${
        url.hostname
      }:${port}${baseUrl}ws/trace?calls=${calls}&threshold=${threshold}&onlyErrors=${
        errors ? "yes" : "no"
      }&statusCode=${statusCode}&method=${method}&funcname=${func}&path=${path}`
    );

    let interval: any | null = null;
    if (c !== null) {
      c.onopen = () => {
        console.log("WebSocket Client Connected");
        dispatch(setTraceStarted(true));
        c.send("ok");
        interval = setInterval(() => {
          c.send("ok");
        }, 10 * 1000);
      };
      c.onmessage = (message: IMessageEvent) => {
        let m: TraceMessage = JSON.parse(message.data.toString());

        m.ptime = DateTime.fromISO(m.time).toJSDate();
        m.key = Math.random();
        dispatch(traceMessageReceived(m));
      };
      c.onclose = () => {
        clearInterval(interval);
        console.log("connection closed by server");
        dispatch(setTraceStarted(false));
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
    dispatch(setTraceStarted(false));
  };

  return (
    <Fragment>
      <PageHeaderWrapper label={"Trace"} />
      <PageLayout>
        <Grid container spacing={1} className={classes.formBox}>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              flexFlow: "column",

              "& .trace-checkbox-label": {
                fontSize: "14px",
                fontWeight: "normal",
              },
            }}
          >
            <Box
              sx={{
                fontSize: "16px",
                fontWeight: 600,
                padding: "20px 0px 20px 0",
              }}
            >
              Calls to Trace
            </Box>
            <Box
              className={`${traceStarted ? "inactive-state" : ""}`}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",

                "&.inactive-state .trace-checkbox-label": {
                  color: "#a6a5a5",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexFlow: "row",
                  gap: {
                    md: "30px",
                  },

                  "& .trace-checked-icon": {
                    border: "1px solid red",
                  },
                }}
              >
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
                  overrideLabelClasses="trace-checkbox-label"
                  classes={{
                    checkedIcon: classes.traceCheckedIcon,
                    unCheckedIcon: classes.unCheckedIcon,
                  }}
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
                  disabled={traceStarted}
                  overrideLabelClasses="trace-checkbox-label"
                  classes={{
                    checkedIcon: classes.traceCheckedIcon,
                    unCheckedIcon: classes.unCheckedIcon,
                  }}
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
                  overrideLabelClasses="trace-checkbox-label"
                  classes={{
                    checkedIcon: classes.traceCheckedIcon,
                    unCheckedIcon: classes.unCheckedIcon,
                  }}
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
                  overrideLabelClasses="trace-checkbox-label"
                  classes={{
                    checkedIcon: classes.traceCheckedIcon,
                    unCheckedIcon: classes.unCheckedIcon,
                  }}
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
                  overrideLabelClasses="trace-checkbox-label"
                  classes={{
                    checkedIcon: classes.traceCheckedIcon,
                    unCheckedIcon: classes.unCheckedIcon,
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "15px",
                }}
              >
                <TooltipWrapper tooltip={"More filter options"}>
                  <Button
                    id={"filter-toggle"}
                    onClick={() => {
                      setToggleFilter(!toggleFilter);
                    }}
                    label={"Filters"}
                    icon={<FilterIcon />}
                    variant={"regular"}
                    className={"filters-toggle-button"}
                    style={{
                      width: "118px",
                      background: toggleFilter ? "rgba(8, 28, 66, 0.04)" : "",
                    }}
                  />
                </TooltipWrapper>

                {!traceStarted && (
                  <Button
                    id={"start-trace"}
                    label={"Start"}
                    data-test-id={"trace-start-button"}
                    variant="callAction"
                    onClick={startTrace}
                    style={{
                      width: "118px",
                    }}
                  />
                )}
                {traceStarted && (
                  <Button
                    id={"stop-trace"}
                    label={"Stop Trace"}
                    data-test-id={"trace-stop-button"}
                    variant="callAction"
                    onClick={stopTrace}
                    style={{
                      width: "118px",
                    }}
                  />
                )}
              </Box>
            </Box>
          </Grid>
          {toggleFilter ? (
            <Grid
              item
              className={`${traceStarted ? "inactive-state" : ""}`}
              xs={12}
              sx={{
                marginTop: "25px",
                display: "flex",
                flexFlow: "column",
                background: "#FBFAFA",
                padding: "30px",

                "&.inactive-state label": {
                  color: "#a6a5a5",
                },

                "& .orient-vertical": {
                  flexFlow: "column",
                  "& label": {
                    marginBottom: "10px",
                    fontWeight: 600,
                  },
                },

                "& .trace-checkbox-label": {
                  fontSize: "14px",
                  fontWeight: "normal",
                },
              }}
            >
              <Box
                sx={{
                  gap: "30px",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  width: "100%",
                }}
              >
                <InputBoxWrapper
                  className="orient-vertical"
                  id="trace-status-code"
                  name="trace-status-code"
                  label="Status Code"
                  classes={{}}
                  placeholder="e.g. 503"
                  value={statusCode}
                  onChange={(e) => {
                    setStatusCode(e.target.value);
                  }}
                  disabled={traceStarted}
                />

                <InputBoxWrapper
                  className="orient-vertical"
                  id="trace-function-name"
                  name="trace-function-name"
                  label="Function Name"
                  classes={{}}
                  placeholder="e.g. FunctionName2055"
                  value={func}
                  onChange={(e) => {
                    setFunc(e.target.value);
                  }}
                  disabled={traceStarted}
                />

                <InputBoxWrapper
                  className="orient-vertical"
                  id="trace-method"
                  name="trace-method"
                  label="Method"
                  classes={{}}
                  placeholder="e.g. Method 2056"
                  value={method}
                  onChange={(e) => {
                    setMethod(e.target.value);
                  }}
                  disabled={traceStarted}
                />
              </Box>
              <Box
                sx={{
                  gap: "30px",
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr",
                  width: "100%",
                  marginTop: "33px",
                }}
              >
                <Box
                  flex="2"
                  style={{
                    width: "calc( 100% + 10px)",
                  }}
                >
                  <InputBoxWrapper
                    className="orient-vertical"
                    id="trace-path"
                    name="trace-path"
                    label="Path"
                    classes={{}}
                    placeholder="e.g. my-bucket/my-prefix/*"
                    value={path}
                    onChange={(e) => {
                      setPath(e.target.value);
                    }}
                    disabled={traceStarted}
                  />
                </Box>
                <Box
                  sx={{
                    marginLeft: "15px",
                  }}
                >
                  <InputBoxWrapper
                    className="orient-vertical"
                    id="trace-fthreshold"
                    name="trace-fthreshold"
                    label="Response Threshold"
                    type="number"
                    classes={{}}
                    placeholder="e.g. website.io.3249.114.12"
                    value={`${threshold}`}
                    onChange={(e) => {
                      setThreshold(parseInt(e.target.value));
                    }}
                    disabled={traceStarted}
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  marginTop: "40px",
                }}
              >
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
                  overrideLabelClasses="trace-checkbox-label"
                  classes={{
                    checkedIcon: classes.traceCheckedIcon,
                    unCheckedIcon: classes.unCheckedIcon,
                  }}
                />
              </Box>
            </Grid>
          ) : null}

          <Grid item xs={12}>
            <Box
              sx={{
                fontSize: "16px",
                fontWeight: 600,
                marginBottom: "30px",
                marginTop: "30px",
              }}
            >
              Trace Results
            </Box>
          </Grid>
          <Grid item xs={12} className={classes.tableBlock}>
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
        </Grid>
      </PageLayout>
    </Fragment>
  );
};

export default withStyles(styles)(Trace);
