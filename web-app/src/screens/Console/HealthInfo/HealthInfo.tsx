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
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Button, Grid, HelpBox, InfoIcon, Loader, PageLayout } from "mds";
import {
  DiagStatError,
  DiagStatInProgress,
  DiagStatSuccess,
  HealthInfoMessage,
  ReportMessage,
} from "./types";
import { AppState, useAppDispatch } from "../../../store";
import {
  WSCloseAbnormalClosure,
  WSCloseInternalServerErr,
  WSClosePolicyViolation,
  wsProtocol,
} from "../../../utils/wsUtils";
import { setHelpName, setServerDiagStat } from "../../../systemSlice";
import {
  healthInfoMessageReceived,
  healthInfoResetMessage,
} from "./healthInfoSlice";
import { registeredCluster } from "../../../config";
import TestWrapper from "../Common/TestWrapper/TestWrapper";
import RegisterCluster from "../Support/RegisterCluster";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";
import HelpMenu from "../HelpMenu";

const HealthInfo = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const message = useSelector((state: AppState) => state.healthInfo.message);

  const serverDiagnosticStatus = useSelector(
    (state: AppState) => state.system.serverDiagnosticStatus,
  );
  const [startDiagnostic, setStartDiagnostic] = useState(false);

  const [downloadDisabled, setDownloadDisabled] = useState(true);
  const [localMessage, setMessage] = useState<string>("");
  const [buttonStartText, setButtonStartText] = useState<string>(
    "Start Health Report",
  );
  const [title, setTitle] = useState<string>("Health Report");
  const [diagFileContent, setDiagFileContent] = useState<string>("");
  const [subnetResponse, setSubnetResponse] = useState<string>("");
  const clusterRegistered = registeredCluster();

  const download = () => {
    let element = document.createElement("a");
    element.setAttribute(
      "href",
      `data:application/gzip;base64,${diagFileContent}`,
    );
    element.setAttribute("download", "diagnostic.json.gz");

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  };

  useEffect(() => {
    if (serverDiagnosticStatus === DiagStatInProgress) {
      setTitle("Health Report in progress...");
      setMessage(
        "Health Report started. Please do not refresh page during diagnosis.",
      );
      return;
    }

    if (serverDiagnosticStatus === DiagStatSuccess) {
      setTitle("Health Report complete");
      setMessage("Health Report file is ready to be downloaded.");
      setButtonStartText("Start Health Report");
      return;
    }

    if (serverDiagnosticStatus === DiagStatError) {
      setTitle("Error");
      setMessage("An error occurred while getting the Health Report file.");
      setButtonStartText("Retry Health Report");
      return;
    }
  }, [serverDiagnosticStatus, startDiagnostic]);

  useEffect(() => {
    if (
      serverDiagnosticStatus === DiagStatSuccess &&
      message !== ({} as HealthInfoMessage)
    ) {
      // Allow download of diagnostics file only when
      // it succeded fetching all the results and info is not empty.
      setDownloadDisabled(false);
    }
    if (serverDiagnosticStatus === DiagStatInProgress) {
      // Disable Start Health Report and Disable Download buttons
      // if a Diagnosis is in progress.
      setDownloadDisabled(true);
    }
    setStartDiagnostic(false);
  }, [serverDiagnosticStatus, message]);

  useEffect(() => {
    if (startDiagnostic) {
      dispatch(healthInfoResetMessage());
      setDiagFileContent("");
      const url = new URL(window.location.toString());
      const isDev = process.env.NODE_ENV === "development";
      const port = isDev ? "9090" : url.port;

      const wsProt = wsProtocol(url.protocol);

      // check if we are using base path, if not this always is `/`
      const baseLocation = new URL(document.baseURI);
      const baseUrl = baseLocation.pathname;

      const socket = new WebSocket(
        `${wsProt}://${url.hostname}:${port}${baseUrl}ws/health-info?deadline=1h`,
      );
      let interval: any | null = null;
      if (socket !== null) {
        socket.onopen = () => {
          console.log("WebSocket Client Connected");
          socket.send("ok");
          interval = setInterval(() => {
            socket.send("ok");
          }, 10 * 1000);
          setMessage(
            "Health Report started. Please do not refresh page during diagnosis.",
          );
          dispatch(setServerDiagStat(DiagStatInProgress));
        };
        socket.onmessage = (message: MessageEvent) => {
          let m: ReportMessage = JSON.parse(message.data.toString());
          if (m.serverHealthInfo) {
            dispatch(healthInfoMessageReceived(m.serverHealthInfo));
          }
          if (m.encoded !== "") {
            setDiagFileContent(m.encoded);
          }
          if (m.subnetResponse) {
            setSubnetResponse(m.subnetResponse);
          }
        };
        socket.onerror = (error) => {
          console.error("error closing websocket:", error);
          socket.close(1000);
          clearInterval(interval);
          dispatch(setServerDiagStat(DiagStatError));
        };
        socket.onclose = (event: CloseEvent) => {
          clearInterval(interval);
          if (
            event.code === WSCloseInternalServerErr ||
            event.code === WSClosePolicyViolation ||
            event.code === WSCloseAbnormalClosure
          ) {
            // handle close with error
            console.log("connection closed by server with code:", event.code);
            setMessage(
              "An error occurred while getting the Health Report file.",
            );
            dispatch(setServerDiagStat(DiagStatError));
          } else {
            console.log("connection closed by server");

            setMessage("Health Report file is ready to be downloaded.");
            dispatch(setServerDiagStat(DiagStatSuccess));
          }
        };
      }
    } else {
      // reset start status
      setStartDiagnostic(false);
    }
  }, [startDiagnostic, dispatch]);

  const startDiagnosticAction = () => {
    if (!clusterRegistered) {
      navigate("/support/register");
      return;
    }
    setStartDiagnostic(true);
  };

  useEffect(() => {
    dispatch(setHelpName("health_info"));
  }, [dispatch]);

  return (
    <Fragment>
      <PageHeaderWrapper label="Health" actions={<HelpMenu />} />

      <PageLayout>
        {!clusterRegistered && <RegisterCluster compactMode />}
        <Box withBorders>
          <TestWrapper title={title}>
            <Grid
              container
              sx={{
                justifyContent: "flex-start",
                gap: 20,
              }}
            >
              <Grid
                key="start-download"
                item
                xs={12}
                sx={{
                  textAlign: "center",
                  marginBottom: 25,
                }}
              >
                <h2>{localMessage}</h2>
                <Box
                  sx={{
                    textAlign: "center",
                    marginBottom: 25,
                  }}
                >
                  {" "}
                  {subnetResponse !== "" &&
                    !subnetResponse.toLowerCase().includes("error") && (
                      <Grid item xs={12}>
                        <strong>
                          Health report uploaded to SUBNET successfully!
                        </strong>
                        &nbsp;{" "}
                        <strong>
                          See the results on your{" "}
                          <a href={subnetResponse}>SUBNET Dashboard</a>{" "}
                        </strong>
                      </Grid>
                    )}
                  {(subnetResponse === "" ||
                    subnetResponse.toLowerCase().includes("error")) &&
                    serverDiagnosticStatus === DiagStatSuccess && (
                      <Grid item xs={12}>
                        <strong>
                          Something went wrong uploading your Health report to
                          SUBNET.
                        </strong>
                        &nbsp;{" "}
                        <strong>
                          Log into your{" "}
                          <a href="https://subnet.min.io">SUBNET Account</a> to
                          manually upload your Health report.
                        </strong>
                      </Grid>
                    )}
                </Box>
                {serverDiagnosticStatus === DiagStatInProgress ? (
                  <Box
                    sx={{
                      paddingTop: 8,
                      paddingLeft: 40,
                    }}
                  >
                    <Loader style={{ width: 25, height: 25 }} />
                  </Box>
                ) : (
                  <Fragment>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 10,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Box>
                        {serverDiagnosticStatus !== DiagStatError &&
                          !downloadDisabled && (
                            <Button
                              id={"download"}
                              type="submit"
                              variant="callAction"
                              onClick={() => download()}
                              disabled={downloadDisabled}
                              label={"Download"}
                            />
                          )}
                      </Box>
                      <Box>
                        <Button
                          id="start-new-diagnostic"
                          type="submit"
                          variant={
                            !clusterRegistered ? "regular" : "callAction"
                          }
                          disabled={startDiagnostic || !clusterRegistered}
                          onClick={startDiagnosticAction}
                          label={buttonStartText}
                        />
                      </Box>
                    </Box>
                  </Fragment>
                )}
              </Grid>
            </Grid>
          </TestWrapper>
        </Box>
        {!startDiagnostic && clusterRegistered && (
          <Fragment>
            <br />
            <HelpBox
              title={
                "Cluster Health Report will be uploaded to SUBNET, and is viewable from your SUBNET Diagnostics dashboard."
              }
              iconComponent={<InfoIcon />}
              help={
                "If the Health report cannot be generated at this time, please wait a moment and try again."
              }
            />
          </Fragment>
        )}
      </PageLayout>
    </Fragment>
  );
};

export default HealthInfo;
