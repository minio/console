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
import {
  Box,
  Button,
  Checkbox,
  Grid,
  HealIcon,
  InputBox,
  InputLabel,
  PageLayout,
  Select,
} from "mds";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { api } from "api";
import { Bucket } from "api/consoleApi";
import { errorToHandler } from "api/errors";
import { wsProtocol } from "../../../utils/wsUtils";
import { colorH, HealStatus } from "./types";
import { niceBytes } from "../../../common/utils";
import { modalStyleUtils } from "../Common/FormComponents/common/styleLibrary";
import {
  CONSOLE_UI_RESOURCE,
  IAM_SCOPES,
} from "../../../common/SecureComponent/permissions";
import { selDistSet, setHelpName } from "../../../systemSlice";
import { SecureComponent } from "../../../common/SecureComponent";
import { useAppDispatch } from "../../../store";
import DistributedOnly from "../Common/DistributedOnly/DistributedOnly";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";
import HelpMenu from "../HelpMenu";

const Heal = () => {
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
    api.buckets
      .listBuckets()
      .then((res) => {
        let buckets: Bucket[] = [];
        if (res.data.buckets) {
          buckets = res.data.buckets;
        }
        setBucketList(buckets);
      })
      .catch((err) => {
        console.error(errorToHandler(err.error));
      });
  };

  useEffect(() => {
    fetchBucketList();
  }, []);

  // forceStart and forceStop need to be mutually exclusive
  useEffect(() => {
    if (forceStart) {
      setForceStop(false);
    }
  }, [forceStart]);

  useEffect(() => {
    if (forceStop) {
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
        `${wsProt}://${url.hostname}:${port}${baseUrl}ws/heal/${bucketName}?prefix=${prefix}&recursive=${recursive}&force-start=${forceStart}&force-stop=${forceStop}`,
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
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setHelpName("heal"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <PageHeaderWrapper label="Drives" actions={<HelpMenu />} />

      <PageLayout>
        {!distributedSetup ? (
          <DistributedOnly entity={"Heal"} iconComponent={<HealIcon />} />
        ) : (
          <SecureComponent
            scopes={[IAM_SCOPES.ADMIN_HEAL]}
            resource={CONSOLE_UI_RESOURCE}
          >
            <Box withBorders>
              <Box
                sx={{
                  display: "flex" as const,
                  alignItems: "center",
                  marginBottom: 15,
                  gap: 15,
                }}
              >
                <Box sx={{ flexGrow: 1, width: "100%" }}>
                  <InputLabel>Bucket</InputLabel>
                  <Select
                    id="bucket-name"
                    name="bucket-name"
                    value={bucketName}
                    onChange={(value) => {
                      setBucketName(value as string);
                    }}
                    options={bucketNames}
                    placeholder={"Select Bucket"}
                  />
                </Box>
                <Box sx={{ flexGrow: 1, width: "100%" }}>
                  <InputLabel>Prefix</InputLabel>
                  <InputBox
                    id="prefix-resource"
                    disabled={false}
                    onChange={(e) => {
                      setPrefix(e.target.value);
                    }}
                  />
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 20 }}>
                <Box>
                  <Checkbox
                    name="recursive"
                    id="recursive"
                    value="recursive"
                    checked={recursive}
                    onChange={() => {
                      setRecursive(!recursive);
                    }}
                    disabled={false}
                    label="Recursive"
                  />
                </Box>
                <Box>
                  <Checkbox
                    name="forceStart"
                    id="forceStart"
                    value="forceStart"
                    checked={forceStart}
                    onChange={() => {
                      setForceStart(!forceStart);
                    }}
                    disabled={false}
                    label="Force Start"
                  />
                </Box>
                <Box>
                  <Checkbox
                    name="forceStop"
                    id="forceStop"
                    value="forceStop"
                    checked={forceStop}
                    onChange={() => {
                      setForceStop(!forceStop);
                    }}
                    disabled={false}
                    label="Force Stop"
                  />
                </Box>
              </Box>
              <Box sx={modalStyleUtils.modalButtonBar}>
                <Button
                  id={"start-heal"}
                  type="submit"
                  variant="callAction"
                  color="primary"
                  disabled={start}
                  onClick={() => setStart(true)}
                  label={"Start"}
                />
              </Box>
            </Box>
            <Box
              withBorders
              sx={{
                marginTop: 15,
                '& ul li:not([class*="Mui"])::before': {
                  listStyle: "none",
                  content: "' '",
                },
              }}
            >
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
                  <Legend
                    verticalAlign={"top"}
                    layout={"horizontal"}
                    className={"noLi"}
                  />
                  <Bar
                    dataKey="ah"
                    name={"After Healing"}
                    fill="#2781B060"
                    stroke="#2781B0"
                  />
                  <Bar
                    dataKey="bh"
                    name={"Before Healing"}
                    fill="#C83B5160"
                    stroke="#C83B51"
                  />
                </BarChart>
              </ResponsiveContainer>
              <Grid
                item
                xs={12}
                sx={{
                  marginTop: 20,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  "& .scanData": {},
                }}
              >
                <Box className={"scanData"}>
                  <strong>Size scanned:</strong> {hStatus.sizeScanned}
                </Box>
                <Box className={"scanData"}>
                  <strong>Objects healed:</strong> {hStatus.objectsHealed} /{" "}
                  {hStatus.objectsScanned}
                </Box>
                <Box className={"scanData"}>
                  <strong>Healing time:</strong> {hStatus.healDuration}s
                </Box>
              </Grid>
            </Box>
          </SecureComponent>
        )}
      </PageLayout>
    </Fragment>
  );
};

export default Heal;
