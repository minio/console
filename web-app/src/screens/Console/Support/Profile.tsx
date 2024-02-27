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

import React, { Fragment, useEffect, useState } from "react";
import { Button, PageLayout, FormLayout, Box, Checkbox, InputLabel } from "mds";
import { wsProtocol } from "../../../utils/wsUtils";
import { useNavigate } from "react-router-dom";
import { registeredCluster } from "../../../config";
import { useAppDispatch } from "../../../store";
import { setHelpName } from "../../../systemSlice";
import RegisterCluster from "./RegisterCluster";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";
import HelpMenu from "../HelpMenu";

var socket: any = null;

const Profile = () => {
  const navigate = useNavigate();

  const [profilingStarted, setProfilingStarted] = useState<boolean>(false);
  const [types, setTypes] = useState<string[]>([
    "cpu",
    "mem",
    "block",
    "mutex",
    "goroutines",
  ]);
  const clusterRegistered = registeredCluster();
  const typesList = [
    { label: "cpu", value: "cpu" },
    { label: "mem", value: "mem" },
    { label: "block", value: "block" },
    { label: "mutex", value: "mutex" },
    { label: "goroutines", value: "goroutines" },
  ];

  const onCheckboxClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newArr: string[] = [];
    if (types.indexOf(e.target.value) > -1) {
      newArr = types.filter((type) => type !== e.target.value);
    } else {
      newArr = [...types, e.target.value];
    }
    setTypes(newArr);
  };

  const startProfiling = () => {
    const typeString = types.join(",");

    const url = new URL(window.location.toString());
    const isDev = process.env.NODE_ENV === "development";
    const port = isDev ? "9090" : url.port;

    // check if we are using base path, if not this always is `/`
    const baseLocation = new URL(document.baseURI);
    const baseUrl = baseLocation.pathname;

    const wsProt = wsProtocol(url.protocol);
    socket = new WebSocket(
      `${wsProt}://${url.hostname}:${port}${baseUrl}ws/profile?types=${typeString}`,
    );

    if (socket !== null) {
      socket.onopen = () => {
        setProfilingStarted(true);
        socket.send("ok");
      };
      socket.onmessage = (message: MessageEvent) => {
        // process received message
        let response = new Blob([message.data], { type: "application/zip" });
        let filename = "profile.zip";
        setProfilingStarted(false);
        var link = document.createElement("a");
        link.href = window.URL.createObjectURL(response);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
      socket.onclose = () => {
        console.log("connection closed by server");
        setProfilingStarted(false);
      };
      return () => {
        socket.close(1000);
        console.log("closing websockets");
        setProfilingStarted(false);
      };
    }
  };

  const stopProfiling = () => {
    socket.close(1000);
    setProfilingStarted(false);
  };

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setHelpName("profile"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <PageHeaderWrapper label="Profile" actions={<HelpMenu />} />
      <PageLayout>
        {!clusterRegistered && <RegisterCluster compactMode />}
        <FormLayout>
          <Box
            sx={{
              display: "flex",
              gap: 10,
              "& div": { width: "initial" },
              "& .inputItem:not(:last-of-type)": { marginBottom: 0 },
            }}
          >
            <InputLabel noMinWidth>Types to profile:</InputLabel>
            {typesList.map((t) => (
              <Checkbox
                checked={types.indexOf(t.value) > -1}
                disabled={profilingStarted || !clusterRegistered}
                key={`checkbox-${t.label}`}
                id={`checkbox-${t.label}`}
                label={t.label}
                name={`checkbox-${t.label}`}
                onChange={onCheckboxClick}
                value={t.value}
              />
            ))}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 24,
              gap: 10,
            }}
          >
            <Button
              id={"start-profiling"}
              type="submit"
              variant={clusterRegistered ? "callAction" : "regular"}
              disabled={
                profilingStarted || types.length < 1 || !clusterRegistered
              }
              onClick={() => {
                if (!clusterRegistered) {
                  navigate("/support/register");
                  return;
                }
                startProfiling();
              }}
              label={"Start Profiling"}
            />
            <Button
              id={"stop-profiling"}
              type="submit"
              variant="callAction"
              color="primary"
              disabled={!profilingStarted || !clusterRegistered}
              onClick={() => {
                stopProfiling();
              }}
              label={"Stop Profiling"}
            />
          </Box>
        </FormLayout>
      </PageLayout>
    </Fragment>
  );
};

export default Profile;
