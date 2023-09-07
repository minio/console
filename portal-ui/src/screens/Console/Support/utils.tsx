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
import { CopyIcon, SettingsIcon, Box, Grid, Switch, InputBox } from "mds";
import RegistrationStatusBanner from "./RegistrationStatusBanner";

export const ClusterRegistered = ({ email }: { email: string }) => {
  return (
    <Fragment>
      <RegistrationStatusBanner email={email} />
      <Grid item xs={12} sx={{ marginTop: 25 }}>
        <Box
          sx={{
            padding: "20px",
          }}
        >
          Login to{" "}
          <a href="https://subnet.min.io" target="_blank">
            SUBNET
          </a>{" "}
          to avail support for this MinIO cluster
        </Box>
      </Grid>
    </Fragment>
  );
};

export const ProxyConfiguration = () => {
  const proxyConfigurationCommand =
    "mc admin config set {alias} subnet proxy={proxy}";
  const [displaySubnetProxy, setDisplaySubnetProxy] = useState(false);
  return (
    <Fragment>
      <Box
        withBorders
        sx={{
          display: "flex",
          padding: "23px",
          marginTop: "40px",
          alignItems: "start",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexFlow: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              "& .min-icon": {
                height: "22px",
                width: "22px",
              },
            }}
          >
            <SettingsIcon />
            <div style={{ marginLeft: "10px", fontWeight: 600 }}>
              Proxy Configuration
            </div>
          </Box>
          <Box
            sx={{
              marginTop: "10px",
              marginBottom: "10px",
              fontSize: "14px",
            }}
          >
            For airgap/firewalled environments it is possible to{" "}
            <a
              href="https://min.io/docs/minio/linux/reference/minio-mc-admin/mc-admin-config.html?ref=con"
              target="_blank"
            >
              configure a proxy
            </a>{" "}
            to connect to SUBNET .
          </Box>
          <Box>
            {displaySubnetProxy && (
              <InputBox
                disabled
                id="subnetProxy"
                name="subnetProxy"
                placeholder=""
                onChange={() => {}}
                label=""
                value={proxyConfigurationCommand}
                overlayIcon={<CopyIcon />}
                overlayAction={() =>
                  navigator.clipboard.writeText(proxyConfigurationCommand)
                }
              />
            )}
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
          }}
        >
          <Switch
            value="enableProxy"
            id="enableProxy"
            name="enableProxy"
            checked={displaySubnetProxy}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setDisplaySubnetProxy(event.target.checked);
            }}
          />
        </Box>
      </Box>
    </Fragment>
  );
};
