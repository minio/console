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
import { DrivesIcon, Loader, SectionTitle, VersionIcon, Grid } from "mds";
import { api } from "api";
import { ServerProperties } from "api/consoleApi";

interface ITestWrapper {
  title: any;
  children: any;
}

const TestWrapper = ({ title, children }: ITestWrapper) => {
  const [version, setVersion] = useState<string>("N/A");
  const [totalNodes, setTotalNodes] = useState<number>(0);
  const [totalDrives, setTotalDrives] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (loading) {
      api.admin
        .adminInfo({
          defaultOnly: true,
        })
        .then((res) => {
          const totalServers = res.data.servers?.length;
          setTotalNodes(totalServers || 0);

          if (res.data.servers && res.data.servers.length > 0) {
            setVersion(res.data.servers[0].version || "N/A");

            const totalServers = res.data.servers.reduce(
              (prevTotal: number, currentElement: ServerProperties) => {
                let c = currentElement.drives
                  ? currentElement.drives.length
                  : 0;
                return prevTotal + c;
              },
              0,
            );
            setTotalDrives(totalServers);
          }

          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [loading]);

  return (
    <Grid item xs={12}>
      <SectionTitle separator>{title}</SectionTitle>
      <Grid item xs={12}>
        <Grid
          item
          xs={12}
          sx={{
            padding: 0,
            marginBottom: 25,
          }}
        >
          <Grid
            container
            sx={{
              padding: 25,
            }}
          >
            {!loading ? (
              <Fragment>
                <Grid
                  item
                  xs={12}
                  md={4}
                  sx={{
                    fontSize: 18,
                    display: "flex",
                    alignItems: "center",
                    "& svg": {
                      marginRight: 10,
                    },
                  }}
                >
                  <DrivesIcon /> <strong>{totalNodes}</strong>
                  &nbsp;nodes,&nbsp;
                  <strong>{totalDrives}</strong>&nbsp; drives
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={4}
                  sx={{
                    fontSize: 12,
                    justifyContent: "center",
                    alignSelf: "center",
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <span
                    style={{
                      marginRight: 20,
                    }}
                  >
                    <VersionIcon />
                  </span>{" "}
                  MinIO VERSION&nbsp;<strong>{version}</strong>
                </Grid>
              </Fragment>
            ) : (
              <Fragment>
                <Grid item xs={12} sx={{ textAlign: "center" }}>
                  <Loader style={{ width: 25, height: 25 }} />
                </Grid>
              </Fragment>
            )}
          </Grid>
        </Grid>
        {children}
      </Grid>
    </Grid>
  );
};

export default TestWrapper;
