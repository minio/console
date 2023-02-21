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
import {
  FormControl,
  Grid,
  InputBase,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { IMessageEvent, w3cwebsocket as W3CWebSocket } from "websocket";
import { Theme } from "@mui/material/styles";
import { Button, HealIcon } from "mds";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { wsProtocol } from "../../../utils/wsUtils";
import { Bucket, BucketList } from "../Watch/types";
import { colorH, HealStatus } from "./types";
import { niceBytes } from "../../../common/utils";
import {
  actionsTray,
  containerForHeader,
  inlineCheckboxes,
  searchField,
} from "../Common/FormComponents/common/styleLibrary";
import {
  CONSOLE_UI_RESOURCE,
  IAM_SCOPES,
} from "../../../common/SecureComponent/permissions";
import { ErrorResponseHandler } from "../../../common/types";
import CheckboxWrapper from "../Common/FormComponents/CheckboxWrapper/CheckboxWrapper";
import api from "../../../common/api";
import PageLayout from "../Common/Layout/PageLayout";
import { SecureComponent } from "../../../common/SecureComponent";
import DistributedOnly from "../Common/DistributedOnly/DistributedOnly";
import { selDistSet } from "../../../systemSlice";
import makeStyles from "@mui/styles/makeStyles";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Legend } from "recharts";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    graphContainer: {
      backgroundColor: "#fff",
      border: "#EAEDEE 1px solid",
      borderRadius: 3,
      padding: "19px 38px",
      marginTop: 15,
    },
    scanInfo: {
      marginTop: 20,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    scanData: {
      fontSize: 13,
    },
    formBox: {
      padding: 15,
      border: "1px solid #EAEAEA",
    },
    buttonBar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
    },
    bucketField: {
      flex: 1,
    },
    prefixField: {
      ...searchField.searchField,
      marginLeft: 10,
      flex: 1,
    },
    actionsTray: {
      ...actionsTray.actionsTray,
      marginBottom: 0,
    },
    ...inlineCheckboxes,
    ...searchField,
    ...containerForHeader,
  })
);

const SelectStyled = withStyles((theme: Theme) =>
  createStyles({
    root: {
      lineHeight: "50px",
      marginRight: 15,
      "label + &": {
        marginTop: theme.spacing(3),
      },
      "& .MuiSelect-select:focus": {
        backgroundColor: "transparent",
      },
    },
  })
)(InputBase);

const Heal = () => {
  const classes = useStyles();
  const distributedSetup = useSelector(selDistSet);

  const [start, setStart] = useState(false);
  const [bucketName, setBucketName] = useState("");
  const [bucketList, setBucketList] = useState<Bucket[]>([]);
  const [prefix, setPrefix] = useState("");
  const [recursive, setRecursive] = useState(false);
  const [forceStart, setForceStart] = useState(false);
  const [forceStop, setForceStop] = useState(false);
  // healStatus states
  const [hStatus, setHStatus] = useState({
    beforeHeal: [0, 0, 0, 0],
    afterHeal: [0, 0, 0, 0],
    objectsHealed: 0,
    objectsScanned: 0,
    healDuration: 0,
    sizeScanned: "",
  });

  const fetchBucketList = () => {
    api
      .invoke("GET", `/api/v1/buckets`)
      .then((res: BucketList) => {
        let buckets: Bucket[] = [];
        if (res.buckets !== null) {
          buckets = res.buckets;
        }
        setBucketList(buckets);
      })
      .catch((err: ErrorResponseHandler) => {
        console.error(err);
      });
  };

  useEffect(() => {
    fetchBucketList();
  }, []);

  // forceStart and forceStop need to be mutually exclusive
  useEffect(() => {
    if (forceStart === true) {
      setForceStop(false);
    }
  }, [forceStart]);

  useEffect(() => {
    if (forceStop === true) {
      setForceStart(false);
    }
  }, [forceStop]);

  const colorHealthArr = (color: colorH) => {
    return [color.Green, color.Yellow, color.Red, color.Grey];
  };

  useEffect(() => {
    // begin watch if bucketName in bucketList and start pressed
    if (start) {
      // values stored here to update chart
      const cB: colorH = { Green: 0, Yellow: 0, Red: 0, Grey: 0 };
      const cA: colorH = { Green: 0, Yellow: 0, Red: 0, Grey: 0 };

      const url = new URL(window.location.toString());
      const isDev = process.env.NODE_ENV === "development";
      const port = isDev ? "9090" : url.port;

      // check if we are using base path, if not this always is `/`
      const baseLocation = new URL(document.baseURI);
      const baseUrl = baseLocation.pathname;

      const wsProt = wsProtocol(url.protocol);
      const c = new W3CWebSocket(
        `${wsProt}://${url.hostname}:${port}${baseUrl}ws/heal/${bucketName}?prefix=${prefix}&recursive=${recursive}&force-start=${forceStart}&force-stop=${forceStop}`
      );

      if (c !== null) {
        c.onopen = () => {
          console.log("WebSocket Client Connected");
          c.send("ok");
        };
        c.onmessage = (message: IMessageEvent) => {
          let m: HealStatus = JSON.parse(message.data.toString());
          // Store percentage per health color
          for (const [key, value] of Object.entries(m.healthAfterCols)) {
            cA[key] = (value * 100) / m.itemsScanned;
          }
          for (const [key, value] of Object.entries(m.healthBeforeCols)) {
            cB[key] = (value * 100) / m.itemsScanned;
          }
          setHStatus({
            beforeHeal: colorHealthArr(cB),
            afterHeal: colorHealthArr(cA),
            objectsHealed: m.objectsHealed,
            objectsScanned: m.objectsScanned,
            healDuration: m.healDuration,
            sizeScanned: niceBytes(m.bytesScanned.toString()),
          });
        };
        c.onclose = () => {
          setStart(false);
          console.log("connection closed by server");
        };
        return () => {
          // close websocket on useEffect cleanup
          c.close(1000);
          console.log("closing websockets");
        };
      }
    }
  }, [start, bucketName, forceStart, forceStop, prefix, recursive]);

  let data = [
    {
      name: "Green",
      ah: hStatus.afterHeal[0],
      bh: hStatus.beforeHeal[0],
      amt: 100,
    },
    {
      name: "Yellow",
      ah: hStatus.afterHeal[1],
      bh: hStatus.beforeHeal[1],
      amt: 100,
    },
    {
      name: "Red",
      ah: hStatus.afterHeal[2],
      bh: hStatus.beforeHeal[2],
      amt: 100,
    },
    {
      name: "Grey",
      ah: hStatus.afterHeal[3],
      bh: hStatus.beforeHeal[3],
      amt: 100,
    },
  ];
  const bucketNames = bucketList.map((bucketName) => ({
    label: bucketName.name,
    value: bucketName.name,
  }));

  return (
    <Fragment>
      <PageHeaderWrapper label="Drives" />
      <PageLayout>
        {!distributedSetup ? (
          <DistributedOnly entity={"Heal"} iconComponent={<HealIcon />} />
        ) : (
          <SecureComponent
            scopes={[IAM_SCOPES.ADMIN_HEAL]}
            resource={CONSOLE_UI_RESOURCE}
          >
            <Grid xs={12} item className={classes.formBox}>
              <Grid item xs={12} className={classes.actionsTray}>
                <FormControl variant="outlined" className={classes.bucketField}>
                  <Select
                    label="Bucket"
                    id="bucket-name"
                    name="bucket-name"
                    value={bucketName}
                    onChange={(e) => {
                      setBucketName(e.target.value as string);
                    }}
                    className={classes.searchField}
                    input={<SelectStyled />}
                    displayEmpty
                  >
                    <MenuItem value="" key={`select-bucket-name-default`}>
                      Select Bucket
                    </MenuItem>
                    {bucketNames.map((option) => (
                      <MenuItem
                        value={option.value}
                        key={`select-bucket-name-${option.label}`}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Prefix"
                  className={classes.prefixField}
                  id="prefix-resource"
                  disabled={false}
                  InputProps={{
                    disableUnderline: true,
                  }}
                  onChange={(e) => {
                    setPrefix(e.target.value);
                  }}
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12} className={classes.inlineCheckboxes}>
                <CheckboxWrapper
                  name="recursive"
                  id="recursive"
                  value="recursive"
                  checked={recursive}
                  onChange={(e) => {
                    setRecursive(e.target.checked);
                  }}
                  disabled={false}
                  label="Recursive"
                />
                <CheckboxWrapper
                  name="forceStart"
                  id="forceStart"
                  value="forceStart"
                  checked={forceStart}
                  onChange={(e) => {
                    setForceStart(e.target.checked);
                  }}
                  disabled={false}
                  label="Force Start"
                />
                <CheckboxWrapper
                  name="forceStop"
                  id="forceStop"
                  value="forceStop"
                  checked={forceStop}
                  onChange={(e) => {
                    setForceStop(e.target.checked);
                  }}
                  disabled={false}
                  label="Force Stop"
                />
              </Grid>
              <Grid item xs={12} className={classes.buttonBar}>
                <Button
                  id={"start-heal"}
                  type="submit"
                  variant="callAction"
                  color="primary"
                  disabled={start}
                  onClick={() => setStart(true)}
                  label={"Start"}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} className={classes.graphContainer}>
              <ResponsiveContainer width={"90%"} height={400}>
                <BarChart
                  width={600}
                  height={400}
                  data={data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend verticalAlign={"top"} layout={"vertical"} />
                  <Bar
                    dataKey="ah"
                    name={"After Healing"}
                    fill="rgba(0, 0, 255, 0.2)"
                    stroke="rgba(0, 0, 255, 1)"
                  />
                  <Bar
                    dataKey="bh"
                    name={"Before Healing"}
                    fill="rgba(153, 102, 255, 0.2)"
                    stroke="rgba(153, 102, 255, 1)"
                  />
                </BarChart>
              </ResponsiveContainer>
              <Grid item xs={12} className={classes.scanInfo}>
                <div className={classes.scanData}>
                  <strong>Size scanned:</strong> {hStatus.sizeScanned}
                </div>
                <div className={classes.scanData}>
                  <strong>Objects healed:</strong> {hStatus.objectsHealed} /{" "}
                  {hStatus.objectsScanned}
                </div>
                <div className={classes.scanData}>
                  <strong>Healing time:</strong> {hStatus.healDuration}s
                </div>
              </Grid>
            </Grid>
          </SecureComponent>
        )}
      </PageLayout>
    </Fragment>
  );
};

export default Heal;
