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
import { IFileItem } from "../../ObjectBrowser/types";
import ProgressBarWrapper from "../ProgressBarWrapper/ProgressBarWrapper";
import {
  CancelledIcon,
  DisabledIcon,
  DownloadStatIcon,
  EnabledIcon,
  UploadStatIcon,
} from "../../../../icons";
import clsx from "clsx";
import { callForObjectID } from "../../ObjectBrowser/transferManager";

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
      margin: "0 30px",
      position: "relative",
      "& .showOnHover": {
        opacity: 1,
        transitionDuration: "0.2s",
      },
      "&.inProgress": {
        "& .hideOnProgress": {
          //visibility: "hidden",
        },
      },
      "&:hover": {
        "& .showOnHover": {
          opacity: 1,
        },
      },
    },
    headItem: {
      color: "#000",
      fontSize: 14,
      fontWeight: "bold",
      width: "100%",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidden",
    },
    downloadHeader: {
      display: "flex",
      alignItems: "center",
      width: "100%",
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
        width: 16,
        height: 16,
      },
    },
    completedSuccess: {
      color: "#4CCB92",
    },
    inProgress: {
      color: "#2781B0",
    },
    completedError: {
      color: "#C83B51",
    },
    cancelledAction: {
      color: "#FFBD62",
    },
    closeIcon: {
      backgroundColor: "#E9EDEE",
      display: "block",
      width: 18,
      height: 18,
      borderRadius: "100%",
      "&:hover": {
        backgroundColor: "#cecbcb",
      },
      "&::before": {
        width: 1,
        height: 9,
        top: "50%",
        content: "' '",
        position: "absolute",
        transform: "translate(-50%, -50%) rotate(45deg)",
        borderLeft: "#000 2px solid",
      },
      "&::after": {
        width: 1,
        height: 9,
        top: "50%",
        content: "' '",
        position: "absolute",
        transform: "translate(-50%, -50%) rotate(-45deg)",
        borderLeft: "#000 2px solid",
      },
    },
    closeButton: {
      backgroundColor: "transparent",
      border: 0,
      right: 0,
      top: 5,
      marginTop: 15,
      position: "absolute",
    },
    fileName: {
      width: 295,
    },
    bucketName: {
      fontSize: 12,
      color: "#696969",
      fontWeight: "normal",
    },
    errorMessage: {
      fontSize: 12,
      color: "#C83B51",
      fontWeight: "normal",
      marginTop: 6,
      overflowWrap: "break-word",
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
          objectToDisplay.percentage !== 100 ? "inProgress" : ""
        }`}
      >
        <div className={classes.clearListIcon}>
          <button
            onClick={() => {
              if (!objectToDisplay.done) {
                console.log("//abort");
                const call = callForObjectID(objectToDisplay.ID);
                if (call) {
                  call.abort();
                }
              } else {
                deleteFromList(objectToDisplay.instanceID);
              }
            }}
            className={`${classes.closeButton} hideOnProgress`}
          >
            <span className={classes.closeIcon} />
          </button>
        </div>
        <div className={classes.objectDetails}>
          <div className={classes.fileName}>
            <Tooltip title={prefix} placement="top-start">
              <div className={classes.downloadHeader}>
                <span
                  className={clsx(classes.iconContainer, {
                    [classes.inProgress]:
                      !objectToDisplay.done &&
                      !objectToDisplay.failed &&
                      !objectToDisplay.cancelled,
                    [classes.completedSuccess]:
                      objectToDisplay.done &&
                      !objectToDisplay.failed &&
                      !objectToDisplay.cancelled,
                    [classes.completedError]: objectToDisplay.failed,
                    [classes.cancelledAction]: objectToDisplay.cancelled,
                  })}
                >
                  {objectToDisplay.cancelled ? (
                    <CancelledIcon />
                  ) : (
                    <Fragment>
                      {objectToDisplay.failed ? (
                        <DisabledIcon />
                      ) : (
                        <Fragment>
                          {objectToDisplay.done ? (
                            <EnabledIcon />
                          ) : (
                            <Fragment>
                              {objectToDisplay.type === "download" ? (
                                <DownloadStatIcon />
                              ) : (
                                <UploadStatIcon />
                              )}
                            </Fragment>
                          )}
                        </Fragment>
                      )}
                    </Fragment>
                  )}
                </span>
                <span
                  className={clsx(classes.headItem, {
                    [classes.completedError]: objectToDisplay.failed,
                  })}
                >
                  {prefix}
                </span>
              </div>
            </Tooltip>
            <span className={classes.bucketName}>
              <strong>Bucket: </strong>
              {objectToDisplay.bucketName}
            </span>
          </div>
        </div>
        <div className={classes.progressContainer}>
          {objectToDisplay.waitingForFile ? (
            <ProgressBarWrapper indeterminate value={0} ready={false} />
          ) : (
            <ProgressBarWrapper
              value={objectToDisplay.percentage}
              ready={objectToDisplay.done}
              error={objectToDisplay.failed}
              cancelled={objectToDisplay.cancelled}
              withLabel
            />
          )}
        </div>
        {objectToDisplay.errorMessage !== "" && (
          <div className={classes.errorMessage}>
            <strong>Error: </strong>
            {objectToDisplay.errorMessage}
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default withStyles(styles)(ObjectHandled);
