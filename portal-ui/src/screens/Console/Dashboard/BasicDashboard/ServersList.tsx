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
import ServerInfoItem from "./ServerInfoItem";
import { Box } from "@mui/material";
import DriveInfoItem from "./DriveInfoItem";
import { MenuCollapsedIcon, MenuExpandedIcon } from "mds";
import { ServerProperties } from "api/consoleApi";

const ServersList = ({ data }: { data: ServerProperties[] }) => {
  const [expanded, setExpanded] = React.useState<string>(
    data.length > 1 ? "" : data[0].endpoint + "-0",
  );

  const handleClick = (key: string) => {
    setExpanded(key);
  };

  return (
    <Box>
      <Box
        sx={{
          marginBottom: "10px",
        }}
      >
        Servers ({data.length})
      </Box>
      <List
        sx={{ width: "100%", flex: 1, padding: "0" }}
        component="nav"
        aria-labelledby="nested-list-subheader"
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
                  borderTop: index === 0 ? "1px solid #f1f1f1" : "",
                  borderBottom: "1px solid #f1f1f1",
                  borderLeft: "1px solid #f1f1f1",
                  borderRight: "1px solid #f1f1f1",
                  padding: "3px 10px 3px 10px",

                  "&:hover": {
                    background: "#bebbbb0d",
                  },
                }}
              >
                <ServerInfoItem server={serverInfo} index={index} />
                <Box
                  sx={{
                    height: "25px",
                    width: "25px",
                    background: "#FBFAFA",
                    borderRadius: "2px",
                    "&:hover": {
                      background: "#fafafa",
                    },
                    display: {
                      md: "block",
                      xs: "none",
                    },
                    "& .collapse-icon": {
                      fill: "#494949",
                      "& g  rect": {
                        fill: "#ffffff",
                      },
                    },
                    "& .expand-icon": {
                      fill: "#494949",
                      "& rect": {
                        fill: "#ffffff",
                      },
                    },
                  }}
                >
                  {isExpanded ? (
                    <MenuCollapsedIcon className="collapse-icon" />
                  ) : (
                    <MenuExpandedIcon className="expand-icon" />
                  )}
                </Box>
              </ListItemButton>
              {isExpanded ? (
                <Box
                  key={`${serverInfo.endpoint}-${index}`}
                  sx={{
                    border: "1px solid #f1f1f1",
                    borderTop: "0",
                  }}
                >
                  <ListSubheader
                    key={`${index}-drive-details`}
                    component="div"
                    sx={{ paddingLeft: "30px" }}
                  >
                    Drives ({serverInfo.drives?.length})
                  </ListSubheader>

                  <Collapse
                    in={isExpanded}
                    timeout="auto"
                    unmountOnExit
                    sx={{
                      width: "100%",
                      flex: 1,
                      display: "flex",
                      padding: { md: "15px 30px", xs: "10px 10px" },
                      "& .MuiCollapse-wrapperInner": {
                        display: "flex",
                        flexFlow: "column",
                        gap: "15px",
                      },
                    }}
                  >
                    {serverInfo.drives?.map((driveInfo, index) => {
                      return (
                        <DriveInfoItem
                          drive={driveInfo}
                          key={`${driveInfo.endpoint}-${index}`}
                        />
                      );
                    })}
                  </Collapse>
                </Box>
              ) : null}
            </React.Fragment>
          );
        })}
      </List>
    </Box>
  );
};

export default ServersList;
