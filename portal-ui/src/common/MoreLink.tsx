// This file is part of MinIO Console Server
// Copyright (c) 2023 MinIO, Inc.
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
import { ArrowIcon, Box } from "mds";

const MoreLink = ({
  LeadingIcon,
  text,
  link,
  color,
}: {
  LeadingIcon?: React.FunctionComponent;
  text: string;
  link: string;
  color: string;
}) => {
  return (
    <a
      style={{
        color: color,
        font: "normal normal bold 12px/55px Inter",
        display: "block",
        textDecoration: "none",
      }}
      href={link}
      target={"_blank"}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          height: 20,
          gap: 2,
        }}
      >
        {LeadingIcon && (
          <Box
            sx={{
              flexGrow: 0,
              flexShrink: 1,
              lineHeight: "12px",
              "& svg": {
                height: 16,
                width: 16,
              },
            }}
          >
            <LeadingIcon />
          </Box>
        )}
        <Box sx={{ flexGrow: 0, flexShrink: 1, lineHeight: "12px" }}>
          {text}
        </Box>
        <Box
          sx={{
            flexGrow: 0,
            flexShrink: 1,
            lineHeight: "12px",
            marginTop: 2,
          }}
        >
          <ArrowIcon style={{ width: 12 }} />
        </Box>
      </Box>
    </a>
  );
};

export default MoreLink;
