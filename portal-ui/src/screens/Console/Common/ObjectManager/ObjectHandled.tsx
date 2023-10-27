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
import { IFileItem } from "../../ObjectBrowser/types";
import ProgressBarWrapper from "../ProgressBarWrapper/ProgressBarWrapper";
import {
  Box,
  CancelledIcon,
  DisabledIcon,
  DownloadStatIcon,
  EnabledIcon,
  UploadStatIcon,
  Tooltip,
} from "mds";
import clsx from "clsx";
import { callForObjectID } from "../../ObjectBrowser/transferManager";
import styled from "styled-components";
import get from "lodash/get";

interface IObjectHandled {
  objectToDisplay: IFileItem;
  deleteFromList: (instanceID: string) => void;
}

const ObjectHandledCloseButton = styled.button(({ theme }) => ({
  backgroundColor: "transparent",
  border: 0,
  right: 0,
  top: 5,
  marginTop: 15,
  position: "absolute",
  cursor: "pointer",
  "& .closeIcon": {
    backgroundColor: get(theme, "buttons.regular.hover.background", "#E6EAEB"),
    display: "block",
    width: 18,
    height: 18,
    borderRadius: "100%",
    "&:hover": {
      backgroundColor: get(theme, "mutedText", "#E9EDEE"),
    },
    "&::before": {
      width: 1,
      height: 9,
      top: "50%",
      content: "' '",
      position: "absolute",
      transform: "translate(-50%, -50%) rotate(45deg)",
      borderLeft: `${get(theme, "fontColor", "#000")} 2px solid`,
    },
    "&::after": {
      width: 1,
      height: 9,
      top: "50%",
      content: "' '",
      position: "absolute",
      transform: "translate(-50%, -50%) rotate(-45deg)",
      borderLeft: `${get(theme, "fontColor", "#000")} 2px solid`,
    },
  },
}));

const ObjectInformation = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  width: "100%",
  "span.headItem": {
    fontSize: 14,
    fontWeight: "bold",
    width: 270,
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
  "& .iconContainer": {
    paddingTop: 5,
    marginRight: 5,
    "& svg": {
      width: 16,
      height: 16,
    },
  },
  "& .completedSuccess": {
    color: get(theme, "signalColors.good", "#4CCB92"),
  },
  "& .inProgress": {
    color: get(theme, "signalColors.main", "#2781B0"),
  },
  "& .completedError": {
    color: get(theme, "signalColors.danger", "#C83B51"),
  },
  "& .cancelledAction": {
    color: get(theme, "signalColors.warning", "#FFBD62"),
  },
}));

const ObjectHandled = ({ objectToDisplay, deleteFromList }: IObjectHandled) => {
  const prefix = `${objectToDisplay.prefix}`;
  return (
    <Fragment>
      <Box
        sx={{
          borderBottom: "#E2E2E2 1px solid",
          padding: "15px 5px",
          margin: "0 30px",
          position: "relative",
          "& .showOnHover": {
            opacity: 1,
            transitionDuration: "0.2s",
          },
          "&:hover": {
            "& .showOnHover": {
              opacity: 1,
            },
          },
        }}
        className={objectToDisplay.percentage !== 100 ? "inProgress" : ""}
      >
        <Box
          sx={{
            "& .closeButton": {
              backgroundColor: "transparent",
              border: 0,
              right: 0,
              top: 5,
              marginTop: 15,
              position: "absolute",
            },
          }}
        >
          <ObjectHandledCloseButton
            onClick={() => {
              if (!objectToDisplay.done) {
                const call = callForObjectID(objectToDisplay.ID);
                if (call) {
                  call.abort();
                }
              } else {
                deleteFromList(objectToDisplay.instanceID);
              }
            }}
            className={`closeButton hideOnProgress`}
          >
            <span className={"closeIcon"} />
          </ObjectHandledCloseButton>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: 295,
              "& .bucketName": {
                fontSize: 12,
              },
            }}
          >
            <Tooltip tooltip={prefix} placement="top">
              <ObjectInformation>
                <span
                  className={clsx("iconContainer", {
                    inProgress:
                      !objectToDisplay.done &&
                      !objectToDisplay.failed &&
                      !objectToDisplay.cancelled,
                    completedSuccess:
                      objectToDisplay.done &&
                      !objectToDisplay.failed &&
                      !objectToDisplay.cancelled,
                    completedError: objectToDisplay.failed,
                    cancelledAction: objectToDisplay.cancelled,
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
                  className={`headItem ${
                    objectToDisplay.failed ? "completedError" : ""
                  }`}
                >
                  {prefix}
                </span>
              </ObjectInformation>
            </Tooltip>
            <Box className={"muted bucketName"}>
              <strong>Bucket: </strong>
              {objectToDisplay.bucketName}
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            marginTop: 5,
          }}
        >
          {objectToDisplay.waitingForFile ? (
            <ProgressBarWrapper indeterminate value={0} ready={false} />
          ) : (
            <ProgressBarWrapper
              value={objectToDisplay.percentage}
              ready={objectToDisplay.done}
              error={objectToDisplay.failed}
              cancelled={objectToDisplay.cancelled}
              withLabel
              notificationLabel={
                objectToDisplay.errorMessage !== ""
                  ? objectToDisplay.errorMessage
                  : ""
              }
            />
          )}
        </Box>
      </Box>
    </Fragment>
  );
};

export default ObjectHandled;
