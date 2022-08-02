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

import React, { useRef } from "react";
import { DownloadIcon } from "../../../icons";
import RBIconButton from "../../Console/Buckets/BucketDetails/SummaryItems/RBIconButton";
import { exportComponentAsPNG } from "react-component-export-image";
import { Box } from "@mui/material";

interface IPNGDownloadButton {
  title: any;
  componentRef: any;
}

const PNGDownloadButton = ({ title, componentRef }: IPNGDownloadButton) => {
  const handleButton = (componentRef: any) => {
    if (title !== null) {
      const pngFileName = (title + "_" + Date.now().toString() + ".png")
        .replace(/\s+/g, "")
        .trim()
        .toLowerCase();
      exportComponentAsPNG(componentRef, { fileName: pngFileName });
    } else {
      const pngFileName = "widgetData_" + Date.now().toString() + ".png";
      exportComponentAsPNG(componentRef, { fileName: pngFileName });
    }
  };

  return (
    <Box>
      <RBIconButton
        tooltip={"Download as PNG"}
        text={"PNG"}
        onClick={() => {
          handleButton(componentRef);
        }}
        color="primary"
        variant={"contained"}
        icon={<DownloadIcon />}
      />
    </Box>
  );
};
export default PNGDownloadButton;
