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
import { IMessageEvent, w3cwebsocket as W3CWebSocket } from "websocket";
import { Grid } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import {
  Button,
  HelpBox,
  Loader,
  PageHeader,
  SpeedtestIcon,
  WarnIcon,
} from "mds";
import { DateTime } from "luxon";
import createStyles from "@mui/styles/createStyles";
import {
  actionsTray,
  advancedFilterToggleStyles,
  containerForHeader,
  formFieldStyles,
  searchField,
} from "../Common/FormComponents/common/styleLibrary";
import { wsProtocol } from "../../../utils/wsUtils";
import { SpeedTestResponse } from "./types";
import {
  CONSOLE_UI_RESOURCE,
  IAM_SCOPES,
} from "../../../common/SecureComponent/permissions";
import STResults from "./STResults";
import InputBoxWrapper from "../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import ProgressBarWrapper from "../Common/ProgressBarWrapper/ProgressBarWrapper";
import InputUnitMenu from "../Common/FormComponents/InputUnitMenu/InputUnitMenu";
import PageLayout from "../Common/Layout/PageLayout";
import { SecureComponent } from "../../../common/SecureComponent";
import DistributedOnly from "../Common/DistributedOnly/DistributedOnly";
import { selDistSet } from "../../../systemSlice";
import makeStyles from "@mui/styles/makeStyles";
import RegisterCluster from "../Support/RegisterCluster";
import { registeredCluster } from "../../../config";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    advancedContent: {
      backgroundColor: "#FBFAFA",
      maxHeight: 0,
      transitionDuration: "0.3s",
      overflow: "hidden",
      padding: "0 15px",
      marginTop: 15,
      justifyContent: "space-between",
      "&.open": {
        maxHeight: 400,
        paddingBottom: 15,
      },
    },

    stepProgressText: {
      fontSize: 13,
      marginBottom: 8,
    },
    ...advancedFilterToggleStyles,
    ...actionsTray,
    ...searchField,
    ...formFieldStyles,
    ...containerForHeader(theme.spacing(4)),
  })
);

const Speedtest = () => {
  const distributedSetup = useSelector(selDistSet);

  const navigate = useNavigate();

  const classes = useStyles();
  const [start, setStart] = useState<boolean>(false);

  const [currStatus, setCurrStatus] = useState<SpeedTestResponse[] | null>(
    null
  );

  const [size, setSize] = useState<string>("64");
  const [sizeUnit, setSizeUnit] = useState<string>("MB");
  const [duration, setDuration] = useState<string>("10");

  const [topDate, setTopDate] = useState<number>(0);
  const [currentValue, setCurrentValue] = useState<number>(0);
  const [totalSeconds, setTotalSeconds] = useState<number>(0);
  const [speedometerValue, setSpeedometerValue] = useState<number>(0);
  const clusterRegistered = registeredCluster();

  useEffect(() => {
    // begin watch if bucketName in bucketList and start pressed
    if (start) {
      const url = new URL(window.location.toString());
      const isDev = process.env.NODE_ENV === "development";
      const port = isDev ? "9090" : url.port;

      // check if we are using base path, if not this always is `/`
      const baseLocation = new URL(document.baseURI);
      const baseUrl = baseLocation.pathname;

      const wsProt = wsProtocol(url.protocol);
      const c = new W3CWebSocket(
        `${wsProt}://${url.hostname}:${port}${baseUrl}ws/speedtest?&size=${size}${sizeUnit}&duration=${duration}s`
      );

      const baseDate = DateTime.now();

      const currentTime = baseDate.toUnixInteger() / 1000;

      const incrementDate =
        baseDate.plus({ seconds: parseInt("10") * 2 }).toUnixInteger() / 1000;

      const totalSeconds = (incrementDate - currentTime) / 1000;

      setTopDate(incrementDate);
      setCurrentValue(currentTime);
      setTotalSeconds(totalSeconds);

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
          const data: SpeedTestResponse = JSON.parse(message.data.toString());

          setCurrStatus((prevStatus) => {
            let prSt: SpeedTestResponse[] = [];
            if (prevStatus) {
              prSt = [...prevStatus];
            }

            const insertData = data.servers !== 0 ? [data] : [];
            return [...prSt, ...insertData];
          });

          const currTime = DateTime.now().toUnixInteger() / 1000;
          setCurrentValue(currTime);
        };
        c.onclose = () => {
          clearInterval(interval);
          console.log("connection closed by server");
          // reset start status
          setStart(false);
        };
        return () => {
          // close websocket on useEffect cleanup
          c.close(1000);
          clearInterval(interval);
          console.log("closing websockets");
        };
      }
    } else {
      // reset start status
      setStart(false);
    }
  }, [size, sizeUnit, start, duration]);

  useEffect(() => {
    const actualSeconds = (topDate - currentValue) / 1000;

    let percToDisplay = 100 - (actualSeconds * 100) / totalSeconds;

    if (percToDisplay > 100) {
      percToDisplay = 100;
    }

    setSpeedometerValue(percToDisplay);
  }, [start, currentValue, topDate, totalSeconds]);

  const stoppedLabel = currStatus !== null ? "Retest" : "Start";

  const buttonLabel = start ? "Start" : stoppedLabel;

  const startSpeedtestButton = () => {
    if (!clusterRegistered) {
      navigate("/support/register");
      return;
    }

    setCurrStatus(null);
    setStart(true);
  };

  return (
    <Fragment>
      <PageHeader label="Performance" />
      <PageLayout>
        {!clusterRegistered && <RegisterCluster compactMode />}
        {!distributedSetup ? (
          <DistributedOnly
            iconComponent={<SpeedtestIcon />}
            entity={"Speedtest"}
          />
        ) : (
          <SecureComponent
            scopes={[IAM_SCOPES.ADMIN_HEAL]}
            resource={CONSOLE_UI_RESOURCE}
          >
            <Grid item xs={12} className={classes.boxy}>
              <Grid container>
                <Grid item md={4} sm={12}>
                  <div className={classes.stepProgressText}>
                    {start ? (
                      <Fragment>
                        Speedtest in progress...
                        <Loader style={{ width: 15, height: 15 }} />
                      </Fragment>
                    ) : (
                      <Fragment>
                        {currStatus && !start ? (
                          <b>Speed Test results:</b>
                        ) : (
                          <b>Performance test</b>
                        )}
                      </Fragment>
                    )}
                  </div>
                  <div>
                    <ProgressBarWrapper
                      value={speedometerValue}
                      ready={currStatus !== null && !start}
                      indeterminate={start}
                      size={"small"}
                    />
                  </div>
                </Grid>
                <Grid item md sm={12}>
                  <div style={{ marginLeft: 10, width: 300 }}>
                    <InputBoxWrapper
                      id={"size"}
                      name={"size"}
                      label={"Object Size"}
                      onChange={(e) => {
                        setSize(e.target.value);
                      }}
                      noLabelMinWidth={true}
                      value={size}
                      disabled={start}
                      overlayObject={
                        <InputUnitMenu
                          id={"size-unit"}
                          onUnitChange={setSizeUnit}
                          unitSelected={sizeUnit}
                          unitsList={[
                            { label: "KiB", value: "KiB" },
                            { label: "MiB", value: "MiB" },
                            { label: "GiB", value: "GiB" },
                          ]}
                          disabled={start}
                        />
                      }
                    />
                  </div>
                </Grid>
                <Grid item md sm={12}>
                  <div style={{ marginLeft: 10, width: 300 }}>
                    <InputBoxWrapper
                      id={"duration"}
                      name={"duration"}
                      label={"Duration"}
                      onChange={(e) => {
                        if (e.target.validity.valid) {
                          setDuration(e.target.value);
                        }
                      }}
                      noLabelMinWidth={true}
                      value={duration}
                      disabled={start}
                      overlayObject={
                        <InputUnitMenu
                          id={"size-unit"}
                          onUnitChange={() => {}}
                          unitSelected={"s"}
                          unitsList={[{ label: "s", value: "s" }]}
                          disabled={start}
                        />
                      }
                      pattern={"[0-9]*"}
                    />
                  </div>
                </Grid>
                <Grid item md={1} sm={12} textAlign={"right"}>
                  <Button
                    onClick={startSpeedtestButton}
                    color="primary"
                    type="button"
                    id={"start-speed-test"}
                    variant={
                      clusterRegistered && currStatus !== null && !start
                        ? "callAction"
                        : "regular"
                    }
                    className={`${classes.buttonBackground} ${classes.speedStart}`}
                    disabled={
                      duration.trim() === "" || size.trim() === "" || start
                    }
                    label={buttonLabel}
                  />
                </Grid>
              </Grid>
              <Grid container className={classes.multiModule}>
                <Grid item xs={12}>
                  <Fragment>
                    <Grid item xs={12}>
                      {currStatus !== null && (
                        <Fragment>
                          <STResults results={currStatus} start={start} />
                        </Fragment>
                      )}
                    </Grid>
                  </Fragment>
                </Grid>
              </Grid>
            </Grid>

            {!start && !currStatus && clusterRegistered && (
              <Fragment>
                <br />
                <HelpBox
                  title={
                    "During the speed test all your production traffic will be temporarily suspended."
                  }
                  iconComponent={<WarnIcon />}
                  help={<Fragment />}
                />
              </Fragment>
            )}
          </SecureComponent>
        )}
      </PageLayout>
    </Fragment>
  );
};

export default Speedtest;
