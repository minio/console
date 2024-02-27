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

import React, { useEffect, useState, Fragment } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Button,
  DataTable,
  Grid,
  InputBox,
  InputLabel,
  PageLayout,
  Select,
} from "mds";
import { AppState, useAppDispatch } from "../../../store";
import { Bucket, BucketList, EventInfo } from "./types";
import { niceBytes, timeFromDate } from "../../../common/utils";
import { wsProtocol } from "../../../utils/wsUtils";
import { ErrorResponseHandler } from "../../../common/types";
import { watchMessageReceived, watchResetMessages } from "./watchSlice";
import { setHelpName } from "../../../systemSlice";
import api from "../../../common/api";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";
import HelpMenu from "../HelpMenu";

const Watch = () => {
  const dispatch = useAppDispatch();
  const messages = useSelector((state: AppState) => state.watch.messages);

  const [start, setStart] = useState(false);
  const [bucketName, setBucketName] = useState("Select Bucket");
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [bucketList, setBucketList] = useState<Bucket[]>([]);

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

  useEffect(() => {
    dispatch(watchResetMessages());
    // begin watch if bucketName in bucketList and start pressed
    if (start && bucketList.some((bucket) => bucket.name === bucketName)) {
      const url = new URL(window.location.toString());
      const isDev = process.env.NODE_ENV === "development";
      const port = isDev ? "9090" : url.port;

      // check if we are using base path, if not this always is `/`
      const baseLocation = new URL(document.baseURI);
      const baseUrl = baseLocation.pathname;

      const wsProt = wsProtocol(url.protocol);
      const socket = new WebSocket(
        `${wsProt}://${url.hostname}:${port}${baseUrl}ws/watch/${bucketName}?prefix=${prefix}&suffix=${suffix}`,
      );

      let interval: any | null = null;
      if (socket !== null) {
        socket.onopen = () => {
          console.log("WebSocket Client Connected");
          socket.send("ok");
          interval = setInterval(() => {
            socket.send("ok");
          }, 10 * 1000);
        };
        socket.onmessage = (message: MessageEvent) => {
          let m: EventInfo = JSON.parse(message.data.toString());
          m.Time = new Date(m.Time.toString());
          m.key = Math.random();
          dispatch(watchMessageReceived(m));
        };
        socket.onclose = () => {
          clearInterval(interval);
          console.log("connection closed by server");
          // reset start status
          setStart(false);
        };
        return () => {
          // close websocket on useEffect cleanup
          socket.close(1000);
          clearInterval(interval);
          console.log("closing websockets");
        };
      }
    } else {
      // reset start status
      setStart(false);
    }
  }, [dispatch, start, bucketList, bucketName, prefix, suffix]);

  const bucketNames = bucketList.map((bucketName) => ({
    label: bucketName.name,
    value: bucketName.name,
  }));

  useEffect(() => {
    dispatch(setHelpName("watch"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const optionsArray = bucketNames.map((option) => ({
    label: option.label,
    value: option.value,
  }));

  return (
    <Fragment>
      <PageHeaderWrapper label="Watch" actions={<HelpMenu />} />
      <PageLayout>
        <Grid container>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              gap: 10,
              marginBottom: 15,
              alignItems: "center",
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <InputLabel>Bucket</InputLabel>
              <Select
                id="bucket-name"
                name="bucket-name"
                value={bucketName}
                onChange={(value) => {
                  setBucketName(value as string);
                }}
                disabled={start}
                options={optionsArray}
                placeholder={"Select Bucket"}
              />
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <InputLabel>Prefix</InputLabel>
              <InputBox
                id="prefix-resource"
                disabled={start}
                onChange={(e) => {
                  setPrefix(e.target.value);
                }}
              />
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <InputLabel>Suffix</InputLabel>
              <InputBox
                id="suffix-resource"
                disabled={start}
                onChange={(e) => {
                  setSuffix(e.target.value);
                }}
              />
            </Box>
            <Box sx={{ alignSelf: "flex-end", paddingBottom: 4 }}>
              {start ? (
                <Button
                  id={"stop-watch"}
                  type="submit"
                  variant="callAction"
                  onClick={() => setStart(false)}
                  label={"Stop"}
                />
              ) : (
                <Button
                  id={"start-watch"}
                  type="submit"
                  variant="callAction"
                  onClick={() => setStart(true)}
                  label={"Start"}
                />
              )}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <DataTable
              columns={[
                {
                  label: "Time",
                  elementKey: "Time",
                  renderFunction: timeFromDate,
                },
                {
                  label: "Size",
                  elementKey: "Size",
                  renderFunction: niceBytes,
                },
                { label: "Type", elementKey: "Type" },
                { label: "Path", elementKey: "Path" },
              ]}
              records={messages}
              entityName={"Watch"}
              customEmptyMessage={"No Changes at this time"}
              idField={"watch_table"}
              isLoading={false}
              customPaperHeight={"calc(100vh - 270px)"}
            />
          </Grid>
        </Grid>
      </PageLayout>
    </Fragment>
  );
};

export default Watch;
