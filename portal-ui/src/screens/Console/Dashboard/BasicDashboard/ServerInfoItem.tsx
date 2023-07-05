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
import React from "react";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { niceDays } from "../../../../common/utils";
import { Box } from "@mui/material";
import { CircleIcon } from "mds";
import get from "lodash/get";
import { commonDashboardInfocard } from "../../Common/FormComponents/common/styleLibrary";
import {
  getDriveStatusColor,
  getNetworkStatusColor,
  serverStatusColor,
} from "./Utils";
import { ServerProperties } from "api/consoleApi";

const styles = (theme: Theme) =>
  createStyles({
    ...commonDashboardInfocard,
  });

interface ICardProps {
  classes?: any;
  server: ServerProperties;
  index: number;
}

const ServerStatItem = ({
  label = "",
  value = "",
  statusColor = "",
  hasStatus = false,
}: {
  label?: string;
  value?: any;
  hasStatus?: boolean;
  statusColor: string | undefined;
}) => {
  return (
    <Box
      sx={{
        alignItems: "baseline",
        padding: "5px",
        display: "flex",
        gap: "5px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexFlow: "column",
          "& .stat-text": { color: "#5E5E5E", fontSize: "12px" },
          "& .stat-value": {
            fontSize: "18px",
            color: "#07193E",
            display: "flex",
            fontWeight: 500,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          },
        }}
      >
        <div className="stat-value">
          {value}{" "}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexFlow: "column",
              marginLeft: "5px",
              maxWidth: "40px",
              "&:first-of-type(svg)": {
                fill: "#848484",
              },
            }}
          >
            {hasStatus ? (
              <Box
                sx={{
                  marginRight: "0px",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  "& svg.min-icon": {
                    fill: statusColor,
                    width: "10px",
                    height: "10px",
                  },
                }}
              >
                <CircleIcon />
              </Box>
            ) : (
              <Box sx={{ width: "12px", height: "12px" }} />
            )}
          </Box>
        </div>
        <div className="stat-text">{label}</div>
      </Box>
    </Box>
  );
};

const ServerInfoItem = ({ server }: ICardProps) => {
  const networkKeys = Object.keys(get(server, "network", {}));
  const networkTotal = networkKeys.length;
  const totalDrives = server.drives ? server.drives.length : 0;
  const activeNetwork = networkKeys.reduce((acc: number, currValue: string) => {
    const item = server.network ? server.network[currValue] : "";
    if (item === "online") {
      return acc + 1;
    }
    return acc;
  }, 0);
  const activeDisks = server.drives
    ? server.drives.filter((element) => element.state === "ok").length
    : 0;
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        flexFlow: "column",
        flex: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "3px",
          gap: "15px",
          justifyContent: "space-between",
          width: "100%",
          paddingLeft: "20px",

          flexFlow: {
            sm: "row",
            xs: "column",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            {server.endpoint || ""}
          </Box>
          {server?.state && (
            <Box
              sx={{
                marginLeft: "8px",
                "& .min-icon": {
                  fill: serverStatusColor(server.state),
                  height: "14px",
                  width: "14px",
                },
              }}
            >
              <CircleIcon />
            </Box>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: "1.5",
            gap: {
              md: "5%",
              xs: "5%",
            },
          }}
        >
          <ServerStatItem
            statusColor={getDriveStatusColor(activeDisks, totalDrives)}
            label={"Drives"}
            hasStatus={true}
            value={`${activeDisks}/${totalDrives}`}
          />
          <ServerStatItem
            statusColor={getNetworkStatusColor(activeNetwork, networkTotal)}
            label={"Network"}
            hasStatus={true}
            value={`${activeNetwork}/${networkTotal}`}
          />

          <ServerStatItem
            statusColor={"green"}
            label={"Up time"}
            value={server?.uptime ? niceDays(`${server.uptime}`) : "N/A"}
          />
        </Box>
        <ServerStatItem
          statusColor={"green"}
          label={""}
          value={
            <Box
              sx={{
                background: "rgb(235, 236, 237)",
                color: "#000000",
                paddingLeft: "10px",
                paddingRight: "10px",
                borderRadius: "2px",
                fontSize: "12px",
                marginTop: "5px",

                "& .label": {
                  fontWeight: 600,
                  marginRight: "3px",
                },
              }}
            >
              <span className="label">Version:</span>
              {server.version ? server.version : "N/A"}
            </Box>
          }
        />
      </Box>
    </Box>
  );
};
export default withStyles(styles)(ServerInfoItem);
