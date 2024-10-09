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

import { Fragment, useEffect, useState } from "react";
import { DateTime } from "luxon";
import { useSelector } from "react-redux";
import {
  Box,
  breakPoints,
  Button,
  Checkbox,
  DataTable,
  FilterIcon,
  Grid,
  InputBox,
  PageLayout,
} from "mds";
import { AppState, useAppDispatch } from "../../../store";
import { TraceMessage } from "./types";
import { niceBytes, timeFromDate } from "../../../common/utils";
import { wsProtocol } from "../../../utils/wsUtils";
import {
  setTraceStarted,
  traceMessageReceived,
  traceResetMessages,
} from "./traceSlice";
import { setHelpName } from "../../../systemSlice";
import TooltipWrapper from "../Common/TooltipWrapper/TooltipWrapper";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";
import HelpMenu from "../HelpMenu";
import useWebSocket, { ReadyState } from "react-use-websocket";

const Trace = () => {
  const dispatch = useAppDispatch();

  const messages = useSelector((state: AppState) => state.trace.messages);
  const traceStarted = useSelector(
    (state: AppState) => state.trace.traceStarted,
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
  const [logActive, setLogActive] = useState(false);
  const [wsUrl, setWsUrl] = useState<string>("");

  useEffect(() => {
    const url = new URL(window.location.toString());
    const wsProt = wsProtocol(url.protocol);
    const port = process.env.NODE_ENV === "development" ? "9090" : url.port;
    const calls = all
      ? "all"
      : (() => {
          const c = [];
          if (s3) c.push("s3");
          if (internal) c.push("internal");
          if (storage) c.push("storage");
          if (os) c.push("os");
          return c.join(",");
        })();

    // check if we are using base path, if not this always is `/`
    const baseLocation = new URL(document.baseURI).pathname;

    const wsUrl = new URL(
      `${wsProt}://${url.hostname}:${port}${baseLocation}ws/trace`,
    );
    wsUrl.searchParams.append("calls", calls);
    wsUrl.searchParams.append("threshold", threshold.toString());
    wsUrl.searchParams.append("onlyErrors", errors ? "yes" : "no");
    wsUrl.searchParams.append("statusCode", statusCode);
    wsUrl.searchParams.append("method", method);
    wsUrl.searchParams.append("funcname", func);
    wsUrl.searchParams.append("path", path);
    setWsUrl(wsUrl.href);
  }, [
    all,
    s3,
    internal,
    storage,
    os,
    threshold,
    errors,
    statusCode,
    method,
    func,
    path,
  ]);

  const { sendMessage, lastJsonMessage, readyState } =
    useWebSocket<TraceMessage>(
      wsUrl,
      {
        heartbeat: {
          message: "ok",
          interval: 10 * 1000, // send ok every 10 seconds
          timeout: 365 * 24 * 60 * 60 * 1000, // disconnect after 365 days (workaround, because heartbeat gets no response)
        },
      },
      logActive,
    );

  useEffect(() => {
    if (readyState === ReadyState.CONNECTING) {
      dispatch(traceResetMessages());
    } else if (readyState === ReadyState.OPEN) {
      dispatch(setTraceStarted(true));
    } else if (readyState === ReadyState.CLOSED) {
      dispatch(setTraceStarted(false));
    }
  }, [readyState, dispatch, sendMessage]);

  useEffect(() => {
    if (lastJsonMessage) {
      lastJsonMessage.ptime = DateTime.fromISO(lastJsonMessage.time).toJSDate();
      lastJsonMessage.key = Math.random();
      dispatch(traceMessageReceived(lastJsonMessage));
    }
  }, [lastJsonMessage, dispatch]);

  useEffect(() => {
    dispatch(setHelpName("trace"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <PageHeaderWrapper label={"Trace"} actions={<HelpMenu />} />

      <PageLayout>
        <Box withBorders>
          <Grid container>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                flexFlow: "column",

                "& .trace-Checkbox-label": {
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
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexFlow: "row",
                    "& .trace-checked-icon": {
                      border: "1px solid red",
                    },
                    [`@media (min-width: ${breakPoints.md}px)`]: {
                      gap: 30,
                    },
                  }}
                >
                  <Checkbox
                    checked={all}
                    id={"all_calls"}
                    name={"all_calls"}
                    label={"All"}
                    onChange={() => setAll(!all)}
                    value={"all"}
                    disabled={traceStarted}
                  />
                  <Checkbox
                    checked={s3 || all}
                    id={"s3_calls"}
                    name={"s3_calls"}
                    label={"S3"}
                    onChange={() => setS3(!s3)}
                    value={"s3"}
                    disabled={all || traceStarted}
                  />
                  <Checkbox
                    checked={internal || all}
                    id={"internal_calls"}
                    name={"internal_calls"}
                    label={"Internal"}
                    onChange={() => setInternal(!internal)}
                    value={"internal"}
                    disabled={all || traceStarted}
                  />
                  <Checkbox
                    checked={storage || all}
                    id={"storage_calls"}
                    name={"storage_calls"}
                    label={"Storage"}
                    onChange={() => setStorage(!storage)}
                    value={"storage"}
                    disabled={all || traceStarted}
                  />
                  <Checkbox
                    checked={os || all}
                    id={"os_calls"}
                    name={"os_calls"}
                    label={"OS"}
                    onChange={() => setOS(!os)}
                    value={"os"}
                    disabled={all || traceStarted}
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
                      onClick={() => setToggleFilter(!toggleFilter)}
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
                      onClick={() => setLogActive(true)}
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
                      onClick={() => setLogActive(false)}
                      style={{
                        width: "118px",
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Grid>
            {toggleFilter ? (
              <Box
                useBackground
                className={`${traceStarted ? "inactive-state" : ""}`}
                sx={{
                  marginTop: "25px",
                  display: "flex",
                  flexFlow: "column",
                  padding: "30px",
                  width: "100%",

                  "& .orient-vertical": {
                    flexFlow: "column",
                    "& label": {
                      marginBottom: "10px",
                      fontWeight: 600,
                    },
                    "& .inputRebase": {
                      width: "90%",
                    },
                  },

                  "& .trace-Checkbox-label": {
                    fontSize: "14px",
                    fontWeight: "normal",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                  }}
                >
                  <InputBox
                    className="orient-vertical"
                    id="trace-status-code"
                    name="trace-status-code"
                    label="Status Code"
                    placeholder="e.g. 503"
                    value={statusCode}
                    onChange={(e) => setStatusCode(e.target.value)}
                    disabled={traceStarted}
                  />

                  <InputBox
                    className="orient-vertical"
                    id="trace-function-name"
                    name="trace-function-name"
                    label="Function Name"
                    placeholder="e.g. FunctionName2055"
                    value={func}
                    onChange={(e) => setFunc(e.target.value)}
                    disabled={traceStarted}
                  />

                  <InputBox
                    className="orient-vertical"
                    id="trace-method"
                    name="trace-method"
                    label="Method"
                    placeholder="e.g. Method 2056"
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
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
                    sx={{
                      flex: 2,
                      width: "calc( 100% + 10px)",
                    }}
                  >
                    <InputBox
                      className="orient-vertical"
                      id="trace-path"
                      name="trace-path"
                      label="Path"
                      placeholder="e.g. my-bucket/my-prefix/*"
                      value={path}
                      onChange={(e) => setPath(e.target.value)}
                      disabled={traceStarted}
                    />
                  </Box>
                  <Box
                    sx={{
                      marginLeft: "15px",
                    }}
                  >
                    <InputBox
                      className="orient-vertical"
                      id="trace-fthreshold"
                      name="trace-fthreshold"
                      label="Response Threshold"
                      type="number"
                      placeholder="e.g. website.io.3249.114.12"
                      value={`${threshold}`}
                      onChange={(e) => setThreshold(parseInt(e.target.value))}
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
                  <Checkbox
                    checked={errors}
                    id={"only_errors"}
                    name={"only_errors"}
                    label={"Display only Errors"}
                    onChange={() => setErrors(!errors)}
                    value={"only_errors"}
                    disabled={traceStarted}
                  />
                </Box>
              </Box>
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
            <Grid item xs={12}>
              <DataTable
                columns={[
                  {
                    label: "Time",
                    elementKey: "ptime",
                    renderFunction: (time: Date) => {
                      const timeParse = new Date(time);
                      return timeFromDate(timeParse);
                    },
                    width: 100,
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
                    width: 150,
                  },
                  {
                    label: "Upload",
                    elementKey: "callStats.rx",
                    renderFunction: niceBytes,
                    width: 150,
                  },
                  {
                    label: "Download",
                    elementKey: "callStats.tx",
                    renderFunction: niceBytes,
                    width: 150,
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
                customPaperHeight={"calc(100vh - 292px)"}
                autoScrollToBottom
              />
            </Grid>
          </Grid>
        </Box>
      </PageLayout>
    </Fragment>
  );
};

export default Trace;
