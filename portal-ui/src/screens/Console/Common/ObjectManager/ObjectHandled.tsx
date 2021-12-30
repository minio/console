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

import React, { Fragment } from "react";
import { Theme } from "@mui/material/styles";
import { Tooltip } from "@mui/material";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { IFileItem } from "../../ObjectBrowser/reducers";
import ProgressBarWrapper from "../ProgressBarWrapper/ProgressBarWrapper";
import { DownloadStatIcon, UploadStatIcon } from "../../../../icons";
import clsx from "clsx";

interface IObjectHandled {
  classes: any;
  objectToDisplay: IFileItem;
  deleteFromList: (instanceID: string) => void;
}

const styles = (theme: Theme) =>
  createStyles({
    container: {
      borderBottom: "#E2E2E2 1px solid",
      padding: "15px 5px",
      margin: "0 15px",
      position: "relative",
      "& .showOnHover": {
        opacity: 0,
        transitionDuration: "0.2s",
      },
      "&.inProgress": {
        "& .hideOnProgress": {
          visibility: "hidden",
        },
      },
      "&:hover": {
        "& .showOnHover": {
          opacity: 1,
        },
      },
    },
    headItem: {
      color: "#868686",
      fontSize: 12,
      width: "100%",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidden",
    },
    progressContainer: {
      marginTop: 5,
    },
    objectDetails: {
      display: "flex",
      alignItems: "center",
    },
    iconContainer: {
      paddingTop: 5,
      marginRight: 5,
      "& svg": {
        width: 20,
        height: 20,
      },
    },
    download: {
      color: "rgb(113,200,150)",
    },
    upload: {
      color: "rgb(66,127,172)",
    },
    closeIcon: {
      "&::before": {
        width: 1,
        height: 12,
        content: "' '",
        position: "absolute",
        transform: "rotate(45deg)",
        borderLeft: "#9c9c9c 2px solid",
      },
      "&::after": {
        width: 1,
        height: 12,
        content: "' '",
        position: "absolute",
        transform: "rotate(-45deg)",
        borderLeft: "#9c9c9c 2px solid",
      },
    },
    closeButton: {
      backgroundColor: "transparent",
      border: 0,
      right: 0,
      position: "absolute",
    },
    fileName: {
      width: 230,
    },
  });

const ObjectHandled = ({
  classes,
  objectToDisplay,
  deleteFromList,
}: IObjectHandled) => {
  const prefix = `${objectToDisplay.prefix}`;
  return (
    <Fragment>
      <div
        className={`${classes.container} ${
          !objectToDisplay.done ? "inProgress" : ""
        }`}
      >
        <div className={classes.clearListIcon}>
          <button
            onClick={() => {
              deleteFromList(objectToDisplay.instanceID);
            }}
            className={`${classes.closeButton} hideOnProgress showOnHover`}
            disabled={!objectToDisplay.done}
          >
            <span className={classes.closeIcon}></span>
          </button>
        </div>
        <div className={classes.objectDetails}>
          <div
            className={clsx(classes.iconContainer, {
              [classes.download]: objectToDisplay.type === "download",
              [classes.upload]: objectToDisplay.type !== "download",
            })}
          >
            {objectToDisplay.type === "download" ? (
              <DownloadStatIcon />
            ) : (
              <UploadStatIcon />
            )}
          </div>
          <div className={classes.fileName}>
            <div className={classes.headItem}>
              <strong>Bucket: </strong>
              {objectToDisplay.bucketName}
            </div>
            <Tooltip title={prefix} placement="top-start">
              <div className={classes.headItem}>{prefix}</div>
            </Tooltip>
          </div>
        </div>
        <div className={classes.progressContainer}>
          {objectToDisplay.waitingForFile ? (
            <ProgressBarWrapper indeterminate value={0} ready={false} />
          ) : (
            <ProgressBarWrapper
              value={objectToDisplay.percentage}
              ready={objectToDisplay.done}
              withLabel
            />
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default withStyles(styles)(ObjectHandled);
