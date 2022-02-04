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
import { ServerInfo } from "../types";
import { niceDays } from "../../../../common/utils";
import { Box } from "@mui/material";
import {
  CircleIcon,
  DrivesIcon,
  UptimeIcon,
  VersionIcon,
  WarpIcon,
} from "../../../../icons";
import get from "lodash/get";
import { commonDashboardInfocard } from "../../Common/FormComponents/common/styleLibrary";
import {
  getDriveStatusColor,
  getNetworkStatusColor,
  serverStatusColor,
} from "./Utils";

const styles = (theme: Theme) =>
  createStyles({
    ...commonDashboardInfocard,
  });

interface ICardProps {
  classes?: any;
  server: ServerInfo;
  index: number;
}

const ServerStatItem = ({
  label = "",
  value = "",
  statusColor = "",
  hasStatus = false,
  icon = null,
}: {
  label?: string;
  value?: any;
  hasStatus?: boolean;
  statusColor: string | undefined;
  icon?: any;
}) => {
  return (
    <Box
      sx={{
        alignItems: "center",
        padding: "5px",
        display: "flex",
        gap: "10px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexFlow: "column",
          maxWidth: "40px",
          "&:first-of-type(svg)": {
            fill: "#848484",
          },
        }}
      >
        {icon}
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
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          flexFlow: "column",
          "& .stat-text": { color: "#5E5E5E", fontSize: "14px" },
          "& .stat-value": {
            color: "#07193E",
            display: "flex",
            fontWeight: 500,
          },
        }}
      >
        <div className="stat-text">{label}</div>
        <div className="stat-value">{value}</div>
      </Box>
    </Box>
  );
};

const ServerInfoItem = ({ classes = {}, server, index }: ICardProps) => {
  const networkKeys = Object.keys(get(server, "network", {}));
  const networkTotal = networkKeys.length;
  const totalDrives = server.drives ? server.drives.length : 0;
  const activeNetwork = networkKeys.reduce((acc: number, currValue: string) => {
    const item = server.network[currValue];
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
          marginBottom: "15px",
        }}
      >
        {server?.state && (
          <Box
            sx={{
              marginRight: "8px",
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
        <Box
          sx={{
            fontWeight: 600,
            textTransform: "none",
          }}
        >
          {server.endpoint || ""}
        </Box>
      </Box>
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
        <ServerStatItem
          statusColor={getDriveStatusColor(activeDisks, totalDrives)}
          label={"Drives"}
          icon={<DrivesIcon />}
          hasStatus={true}
          value={`${activeDisks}/${totalDrives}`}
        />
        <ServerStatItem
          statusColor={getNetworkStatusColor(activeNetwork, networkTotal)}
          label={"Network"}
          icon={<WarpIcon />}
          hasStatus={true}
          value={`${activeNetwork}/${networkTotal}`}
        />

        <ServerStatItem
          statusColor={"green"}
          label={"Up time"}
          icon={<UptimeIcon />}
          value={server?.uptime ? niceDays(server.uptime) : "N/A"}
        />

        <ServerStatItem
          statusColor={"green"}
          label={"Version"}
          icon={<VersionIcon />}
          value={
            <Box
              sx={{
                background: "rgb(235, 236, 237)",
                color: "#000000",
                paddingLeft: "10px",
                paddingRight: "10px",
                borderRadius: "16px",
                fontSize: "12px",
                marginTop: "5px",
              }}
            >
              {server.version ? server.version : "N/A"}
            </Box>
          }
        />
      </Box>
    </Box>
  );
};
export default withStyles(styles)(ServerInfoItem);
