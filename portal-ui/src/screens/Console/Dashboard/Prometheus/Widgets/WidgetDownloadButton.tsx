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

import { DownloadIcon } from "../../../../../icons";
import RBIconButton from "../../../../Console/Buckets/BucketDetails/SummaryItems/RBIconButton";
import { setErrorSnackMessage } from "../../../../../../src/systemSlice";
import { ErrorResponseHandler } from "../../../../../../src/common/types";
import { useAppDispatch } from "../../../../../../src/store";

interface IWidgetDownloadButton {
  data: any;
  title: string;
}

export const WidgetDownloadButton = ({
  data,
  title,
}: IWidgetDownloadButton) => {
  const dispatch = useAppDispatch();
  const onDownloadError = (err: ErrorResponseHandler) =>
    dispatch(setErrorSnackMessage(err));

  const download = (filename: string, text: string) => {
    let element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + text);
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();
    document.body.removeChild(element);
  };

  const convertToCSV = (objectToConvert: any) => {
    const array = [Object.keys(objectToConvert[0])].concat(objectToConvert);
    return array
      .map((it) => {
        return Object.values(it).toString();
      })
      .join(",");
  };

  const widgetDataFileName = () => {
    if (title !== null) {
      return (title + "_" + Date.now().toString() + ".csv")
        .replace(/\s+/g, "")
        .trim()
        .toLowerCase();
    } else {
      return "widgetData_" + Date.now().toString() + ".csv";
    }
  };

  const downloadWidgetData = () => {
    if (data !== null) {
      download(widgetDataFileName(), convertToCSV(data));
    } else {
      let err: ErrorResponseHandler;
      err = {
        errorMessage: "Unable to download widget data",
        detailedError: "Unable to download widget data - data not available",
      };
      onDownloadError(err);
    }
  };

  return (
    <RBIconButton
      id={"download-button"}
      tooltip={"Download data for this widget"}
      marginRight=".9rem"
      onClick={() => {
        downloadWidgetData();
      }}
      icon={<DownloadIcon />}
      variant="outlined"
      color="primary"
    />
  );
};

export default WidgetDownloadButton;
