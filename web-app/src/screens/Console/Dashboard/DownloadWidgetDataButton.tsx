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

import React, { Fragment } from "react";
import { Box, DownloadIcon, DropdownSelector } from "mds";
import { exportComponentAsPNG } from "react-component-export-image";
import { ErrorResponseHandler } from "../../../common/types";
import { useAppDispatch } from "../../../../src/store";
import { setErrorSnackMessage } from "../../../../src/systemSlice";

interface IDownloadWidgetDataButton {
  title: any;
  componentRef: any;
  data: any;
}

const DownloadWidgetDataButton = ({
  title,
  componentRef,
  data,
}: IDownloadWidgetDataButton) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openDownloadMenu = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseDownload = () => {
    setAnchorEl(null);
  };
  const download = (filename: string, text: string) => {
    let element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + text);
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();
    document.body.removeChild(element);
  };

  const dispatch = useAppDispatch();
  const onDownloadError = (err: ErrorResponseHandler) =>
    dispatch(setErrorSnackMessage(err));

  const convertToCSV = (objectToConvert: any) => {
    const array = [Object.keys(objectToConvert[0])].concat(objectToConvert);
    return array
      .map((it) => {
        return Object.values(it).toString();
      })
      .join("\n");
  };

  const widgetDataCSVFileName = () => {
    if (title !== null) {
      return (title + "_" + Date.now().toString() + ".csv")
        .replace(/\s+/g, "")
        .trim()
        .toLowerCase();
    } else {
      return "widgetData_" + Date.now().toString() + ".csv";
    }
  };

  const downloadAsCSV = () => {
    if (data !== null && data.length > 0) {
      download(widgetDataCSVFileName(), convertToCSV(data));
    } else {
      let err: ErrorResponseHandler;
      err = {
        errorMessage: "Unable to download widget data",
        detailedError: "Unable to download widget data - data not available",
      };
      onDownloadError(err);
    }
  };

  const downloadAsPNG = () => {
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

  const handleSelectedOption = (selectOption: string) => {
    if (selectOption === "csv") {
      downloadAsCSV();
    } else if (selectOption === "png") {
      downloadAsPNG();
    }
  };

  return (
    <Fragment>
      <Box
        sx={{
          justifyItems: "center",
          "& .download-icon": {
            backgroundColor: "transparent",
            border: 0,
            padding: 0,
            cursor: "pointer",
            "& svg": {
              color: "#D0D0D0",
              height: 16,
            },
            "&:hover": {
              "& svg": {
                color: "#404143",
              },
            },
          },
        }}
      >
        <button className={"download-icon"} onClick={handleClick}>
          <DownloadIcon />
        </button>
        <DropdownSelector
          id={"download-widget-main-menu"}
          options={[
            { label: "Download as CSV", value: "csv" },
            { label: "Download as PNG", value: "png" },
          ]}
          selectedOption={""}
          onSelect={(value) => handleSelectedOption(value)}
          hideTriggerAction={() => {
            handleCloseDownload();
          }}
          open={openDownloadMenu}
          anchorEl={anchorEl}
          anchorOrigin={"end"}
        />
      </Box>
    </Fragment>
  );
};

export default DownloadWidgetDataButton;
