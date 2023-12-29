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
import get from "lodash/get";
import styled from "styled-components";
import { Box } from "mds";

interface ITargetTitle {
  logoSrc: string;
  title: string;
}

const TargetBase = styled.div(({ theme }) => ({
  background: get(theme, "boxBackground", "#fff"),
  border: `${get(theme, "borderColor", "#E5E5E5")} 1px solid`,
  borderRadius: 5,
  height: 80,
  display: "flex",
  alignItems: "center",
  justifyContent: "start",
  marginBottom: 16,
  cursor: "pointer",
  padding: 0,
  overflow: "hidden",
  "& .logoButton": {
    height: "80px",
  },
  "& .imageContainer": {
    backgroundColor: get(theme, "bgColor", "#fff"),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 80,
    height: 80,

    "& img": {
      maxWidth: 46,
      maxHeight: 46,
      filter: "drop-shadow(1px 1px 8px #fff)",
    },
  },
  "& .titleBox": {
    color: get(theme, "fontColor", "#000"),
    fontSize: 16,
    fontFamily: "Inter,sans-serif",
    paddingLeft: 18,
  },
}));

const TargetTitle = ({ logoSrc, title }: ITargetTitle) => {
  return (
    <TargetBase>
      <Box className={"imageContainer"}>
        <img src={logoSrc} className={"logoButton"} alt={title} />
      </Box>

      <Box className={"titleBox"}>
        <b>{title} Event Destination</b>
      </Box>
    </TargetBase>
  );
};

export default TargetTitle;
