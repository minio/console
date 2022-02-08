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
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { ServerInfo } from "../types";
import ServerInfoItem from "./ServerInfoItem";
import { Box } from "@mui/material";
import DriveInfoItem from "./DriveInfoItem";

const ServersList = ({ data }: { data: ServerInfo[] }) => {
  const [expanded, setExpanded] = React.useState<string>("");

  const handleClick = (key: string) => {
    setExpanded(key);
  };

  return (
    <List
      sx={{ width: "100%", flex: 1 }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader
          component="div"
          sx={{
            borderBottom: "1px solid #F8F8F8",
          }}
        >
          Servers ({data.length})
        </ListSubheader>
      }
    >
      {data.map((serverInfo, index) => {
        const key = `${serverInfo.endpoint}-${index}`;
        const isExpanded = expanded === key;
        return (
          <React.Fragment key={key}>
            <ListItemButton
              disableRipple
              onClick={() => {
                if (!isExpanded) {
                  handleClick(key);
                } else {
                  handleClick("");
                }
              }}
              className={isExpanded ? "expanded" : ""}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid #eaeaea",
                "&:hover": {
                  background: "#F8F8F8",
                },
                "&.expanded": {
                  borderBottom: "none",
                },
              }}
            >
              <ServerInfoItem server={serverInfo} index={index} />
              <Box
                sx={{
                  height: "25px",
                  width: "25px",
                  marginLeft: "25px",
                  background: "#FBFAFA",
                  borderRadius: "2px",
                  "&:hover": {
                    background: "#fafafa",
                  },
                  display: {
                    md: "block",
                    xs: "none",
                  },
                }}
              >
                {isExpanded ? <ExpandLess /> : <ExpandMore />}
              </Box>
            </ListItemButton>
            {isExpanded ? (
              <React.Fragment key={`${serverInfo.endpoint}-${index}`}>
                <ListSubheader
                  key={`${index}-drive-details`}
                  component="div"
                  sx={{
                    borderBottom: "1px solid #F8F8F8",
                  }}
                >
                  Drives ({serverInfo.drives.length})
                </ListSubheader>

                <Collapse
                  in={isExpanded}
                  timeout="auto"
                  unmountOnExit
                  sx={{
                    width: "100%",
                    flex: 1,
                    display: "flex",
                    padding: { md: "20px 50px", xs: "15px 15px" },
                    "& .MuiCollapse-wrapperInner": {
                      display: "flex",
                      flexFlow: "column",
                      gap: "15px",
                    },
                  }}
                >
                  {serverInfo.drives.map((driveInfo, index) => {
                    return (
                      <DriveInfoItem
                        drive={driveInfo}
                        key={`${driveInfo.endpoint}-${index}`}
                      />
                    );
                  })}
                </Collapse>
              </React.Fragment>
            ) : null}
          </React.Fragment>
        );
      })}
    </List>
  );
};

export default ServersList;
