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
import clsx from "clsx";
import {
  ICloseEvent,
  IMessageEvent,
  w3cwebsocket as W3CWebSocket,
} from "websocket";
import { AppState, useAppDispatch } from "../../../store";
import { useSelector } from "react-redux";
import {
  DiagStatError,
  DiagStatInProgress,
  DiagStatSuccess,
  HealthInfoMessage,
  ReportMessage,
} from "./types";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import {
  WSCloseAbnormalClosure,
  WSCloseInternalServerErr,
  WSClosePolicyViolation,
  wsProtocol,
} from "../../../utils/wsUtils";
import {
  actionsTray,
  containerForHeader,
} from "../Common/FormComponents/common/styleLibrary";
import { Button, Grid } from "@mui/material";
import PageHeader from "../Common/PageHeader/PageHeader";

import TestWrapper from "../Common/TestWrapper/TestWrapper";
import PageLayout from "../Common/Layout/PageLayout";
import HelpBox from "../../../common/HelpBox";
import WarnIcon from "../../../icons/WarnIcon";
import Loader from "../Common/Loader/Loader";
import { setServerDiagStat } from "../../../systemSlice";
import {
  healthInfoMessageReceived,
  healthInfoResetMessage,
} from "./healthInfoSlice";

const styles = (theme: Theme) =>
  createStyles({
    loading: {
      paddingTop: 8,
      paddingLeft: 40,
    },
    buttons: {
      justifyContent: "flex-start",
      gap: 20,
    },
    localMessage: {
      fontSize: 24,
      color: "#07193E",
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 10,
    },
    progressResult: {
      textAlign: "center",
      marginBottom: 25,
    },
    startDiagnostic: {
      textAlign: "right",
      margin: 25,
      marginBottom: 0,
    },
    startDiagnosticCenter: {
      textAlign: "center",
      marginTop: 0,
    },
    ...actionsTray,
    ...containerForHeader(theme.spacing(4)),
  });

interface IHealthInfo {
  classes: any;
  namespace: string;
  tenant: string;
}

const HealthInfo = ({ classes }: IHealthInfo) => {
  const dispatch = useAppDispatch();

  const message = useSelector((state: AppState) => state.healthInfo.message);

  const serverDiagnosticStatus = useSelector(
    (state: AppState) => state.system.serverDiagnosticStatus
  );
  const [startDiagnostic, setStartDiagnostic] = useState(false);
  const [downloadDisabled, setDownloadDisabled] = useState(true);
  const [localMessage, setMessage] = useState<string>("");
  const [buttonStartText, setButtonStartText] =
    useState<string>("Start Diagnostic");
  const [title, setTitle] = useState<string>("New Diagnostic");
  const [diagFileContent, setDiagFileContent] = useState<string>("");

  const isDiagnosticComplete =
    serverDiagnosticStatus === DiagStatSuccess ||
    serverDiagnosticStatus === DiagStatError;

  const download = () => {
    let element = document.createElement("a");
    element.setAttribute(
      "href",
      `data:application/gzip;base64,${diagFileContent}`
    );
    element.setAttribute("download", "diagnostic.json.gz");

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  };

  useEffect(() => {
    if (serverDiagnosticStatus === DiagStatInProgress) {
      setTitle("Diagnostic in progress...");
      setMessage(
        "Diagnostic started. Please do not refresh page during diagnosis."
      );
      return;
    }

    if (serverDiagnosticStatus === DiagStatSuccess) {
      setTitle("Diagnostic complete");
      setMessage("Diagnostic file is ready to be downloaded.");
      setButtonStartText("Start New Diagnostic");
      return;
    }

    if (serverDiagnosticStatus === DiagStatError) {
      setTitle("Error");
      setMessage("An error occurred while getting the Diagnostic file.");
      setButtonStartText("Retry Diagnostic");
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
      // Disable Start Diagnotic and Disable Download buttons
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

      const c = new W3CWebSocket(
        `${wsProt}://${url.hostname}:${port}${baseUrl}ws/health-info?deadline=1h`
      );

      let interval: any | null = null;
      if (c !== null) {
        c.onopen = () => {
          console.log("WebSocket Client Connected");
          c.send("ok");
          interval = setInterval(() => {
            c.send("ok");
          }, 10 * 1000);
          setMessage(
            "Diagnostic started. Please do not refresh page during diagnosis."
          );
          dispatch(setServerDiagStat(DiagStatInProgress));
        };
        c.onmessage = (message: IMessageEvent) => {
          let m: ReportMessage = JSON.parse(message.data.toString());
          if (m.serverHealthInfo) {
            m.serverHealthInfo.timestamp = new Date(
              m.serverHealthInfo.timestamp.toString()
            );
            dispatch(healthInfoMessageReceived(m.serverHealthInfo));
          }
          if (m.encoded !== "") {
            setDiagFileContent(m.encoded);
          }
        };
        c.onerror = (error: Error) => {
          console.log("error closing websocket:", error.message);
          c.close(1000);
          clearInterval(interval);
          dispatch(setServerDiagStat(DiagStatError));
        };
        c.onclose = (event: ICloseEvent) => {
          clearInterval(interval);
          if (
            event.code === WSCloseInternalServerErr ||
            event.code === WSClosePolicyViolation ||
            event.code === WSCloseAbnormalClosure
          ) {
            // handle close with error
            console.log("connection closed by server with code:", event.code);
            setMessage("An error occurred while getting the Diagnostic file.");
            dispatch(setServerDiagStat(DiagStatError));
          } else {
            console.log("connection closed by server");

            setMessage("Diagnostic file is ready to be downloaded.");
            dispatch(setServerDiagStat(DiagStatSuccess));
          }
        };
      }
    } else {
      // reset start status
      setStartDiagnostic(false);
    }
  }, [startDiagnostic, dispatch]);

  return (
    <Fragment>
      <PageHeader label="Health" />
      <PageLayout>
        <Grid item xs={12} className={classes.boxy}>
          <TestWrapper title={title} advancedVisible={false}>
            <Grid container className={classes.buttons}>
              <Grid
                key="start-download"
                item
                xs={12}
                className={classes.progressResult}
              >
                <div className={classes.localMessage}>{localMessage}</div>
                {serverDiagnosticStatus === DiagStatInProgress ? (
                  <div className={classes.loading}>
                    <Loader style={{ width: 25, height: 25 }} />
                  </div>
                ) : (
                  <Fragment>
                    {serverDiagnosticStatus !== DiagStatError &&
                      !downloadDisabled && (
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          onClick={() => download()}
                          disabled={downloadDisabled}
                        >
                          Download
                        </Button>
                      )}
                    <Grid
                      item
                      xs={12}
                      className={clsx(classes.startDiagnostic, {
                        [classes.startDiagnosticCenter]: !isDiagnosticComplete,
                      })}
                    >
                      <Button
                        id="start-new-diagnostic"
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={startDiagnostic}
                        onClick={() => setStartDiagnostic(true)}
                      >
                        {buttonStartText}
                      </Button>
                    </Grid>
                  </Fragment>
                )}
              </Grid>
            </Grid>
          </TestWrapper>
        </Grid>
        {!startDiagnostic && (
          <Fragment>
            <br />
            <HelpBox
              title={
                "During the health diagnostics run, all production traffic will be suspended."
              }
              iconComponent={<WarnIcon />}
              help={<Fragment />}
            />
          </Fragment>
        )}
      </PageLayout>
    </Fragment>
  );
};

export default withStyles(styles)(HealthInfo);
