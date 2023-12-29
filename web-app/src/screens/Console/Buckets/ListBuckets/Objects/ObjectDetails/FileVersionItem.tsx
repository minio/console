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
import { DateTime } from "luxon";
import styled from "styled-components";
import get from "lodash/get";
import { displayFileIconName } from "../ListObjects/utils";
import {
  DownloadIcon,
  PreviewIcon,
  RecoverIcon,
  ShareIcon,
  IconButton,
  Tooltip,
  Grid,
  Checkbox,
} from "mds";
import { niceBytes } from "../../../../../../common/utils";
import SpecificVersionPill from "./SpecificVersionPill";
import { BucketObject } from "api/consoleApi";

interface IFileVersionItem {
  fileName: string;
  versionInfo: BucketObject;
  index: number;
  isSelected?: boolean;
  checkable: boolean;
  isChecked: boolean;
  onCheck: (versionID: string) => void;
  onShare: (versionInfo: BucketObject) => void;
  onDownload: (versionInfo: BucketObject) => void;
  onRestore: (versionInfo: BucketObject) => void;
  onPreview: (versionInfo: BucketObject) => void;
  globalClick: (versionInfo: BucketObject) => void;
  key: any;
  style: any;
}

const FileVersionStyled = styled.div(({ theme }) => {
  return {
    "&:before": {
      content: "' '",
      display: "block",
      position: "absolute",
      width: "2px",
      height: "calc(100% + 2px)",
      backgroundColor: get(theme, "borderColor", "#F8F8F8"),
      left: "24px",
    },
    "& .mainFileVersionItem": {
      borderBottom: `${get(theme, "borderColor", "#F8F8F8")} 1px solid`,
      padding: "1rem 0",
      margin: "0 0.5rem 0 2.5rem",
      cursor: "pointer",
      "&.deleted": {
        color: "#868686",
      },
    },
    "& .intermediateLayer": {
      margin: "0 1.5rem 0 1.5rem",
      "&:hover, &.selected": {
        backgroundColor: get(theme, "boxBackground", "#F8F8F8"),
        "& > div": {
          borderBottomColor: get(theme, "boxBackground", "#F8F8F8"),
        },
      },
    },
    "& .versionContainer": {
      fontSize: 16,
      fontWeight: "bold",
      display: "flex",
      alignItems: "center",
      "& svg.min-icon": {
        width: 18,
        height: 18,
        minWidth: 18,
        minHeight: 18,
        marginRight: 10,
      },
    },
    "& .buttonContainer": {
      textAlign: "right",
      "& button": {
        marginLeft: "1.5rem",
      },
    },
    "& .versionID": {
      fontSize: "12px",
      margin: "2px 0",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      maxWidth: "95%",
      overflow: "hidden",
    },
    "& .versionData": {
      marginRight: "10px",
      fontSize: 12,
      color: "#868686",
    },
    "@media (max-width: 600px)": {
      "& .buttonContainer": {
        "& button": {
          marginLeft: "5px",
        },
      },
    },
    "@media (max-width: 799px)": {
      "&:before": {
        display: "none",
      },
      "& .mainFileVersionItem": {
        padding: "5px 0px",
        margin: 0,
      },
      "& .intermediateLayer": {
        margin: 0,
        "&:hover, &.selected": {
          backgroundColor: "transparent",
          "& > div": {
            borderBottomColor: get(theme, "boxBackground", "#F8F8F8"),
          },
        },
      },
      "& .versionContainer": {
        fontSize: 14,
        "& svg.min-icon": {
          display: "none",
        },
      },
      "& .versionData": {
        textOverflow: "ellipsis",
        maxWidth: "95%",
        overflow: "hidden",
        whiteSpace: "nowrap",
      },
      "& .collapsableInfo": {
        display: "flex",
        flexDirection: "column",
      },
      "& .versionItem": {
        display: "none",
      },
    },
  };
});

const FileVersionItem = ({
  fileName,
  versionInfo,
  isSelected,
  checkable,
  isChecked,
  onCheck,
  onShare,
  onDownload,
  onRestore,
  onPreview,
  globalClick,
  index,
  key,
  style,
}: IFileVersionItem) => {
  const disableButtons = versionInfo.is_delete_marker;

  const versionItemButtons = [
    {
      icon: <PreviewIcon />,
      action: onPreview,
      tooltip: "Preview",
    },
    {
      icon: <DownloadIcon />,
      action: onDownload,
      tooltip: "Download this version",
    },
    {
      icon: <ShareIcon />,
      action: onShare,
      tooltip: "Share this version",
    },
    {
      icon: <RecoverIcon />,
      action: onRestore,
      tooltip: "Restore this version",
    },
  ];

  let pill: "deleted" | "current" | "null" | null = null;

  if (versionInfo.is_delete_marker) {
    pill = "deleted";
  } else if (versionInfo.is_latest) {
    pill = "current";
  } else if (versionInfo.version_id === "null") {
    pill = "null";
  }

  let lastModified = DateTime.now();

  if (versionInfo.last_modified) {
    lastModified = DateTime.fromISO(
      versionInfo.last_modified,
    ) as DateTime<true>;
  }

  return (
    <FileVersionStyled>
      <Grid
        container
        className={"ctrItem"}
        onClick={() => {
          globalClick(versionInfo);
        }}
        key={key}
        style={style}
      >
        <Grid
          item
          xs={12}
          className={`${"intermediateLayer"} ${isSelected ? "selected" : ""}`}
        >
          <Grid
            item
            xs
            className={`mainFileVersionItem ${
              versionInfo.is_delete_marker ? "deleted" : ""
            }`}
          >
            <Grid item xs={12}>
              <Grid container>
                <Grid item xs md={4} className={"versionContainer"}>
                  {checkable && (
                    <Checkbox
                      checked={isChecked}
                      id={`select-${versionInfo.version_id}`}
                      name={`select-${versionInfo.version_id}`}
                      onChange={(e) => {
                        e.stopPropagation();
                        onCheck(versionInfo.version_id || "");
                      }}
                      value={versionInfo.version_id || ""}
                      disabled={versionInfo.is_delete_marker}
                      sx={{
                        width: "initial",
                      }}
                    />
                  )}
                  {displayFileIconName(fileName, true)} v{index.toString()}
                  <span className={"versionItem"}>
                    {pill && <SpecificVersionPill type={pill} />}
                  </span>
                </Grid>
                <Grid item xs={10} md={8} className={"buttonContainer"}>
                  {versionItemButtons.map((button, index) => {
                    return (
                      <Tooltip
                        tooltip={button.tooltip}
                        key={`version-action-${
                          button.tooltip
                        }-${index.toString()}`}
                      >
                        <IconButton
                          size={"small"}
                          id={`version-action-${
                            button.tooltip
                          }-${index.toString()}`}
                          className={`${"spacing"} ${
                            disableButtons ? "buttonDisabled" : ""
                          }`}
                          disabled={disableButtons}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!disableButtons) {
                              button.action(versionInfo);
                            } else {
                              e.preventDefault();
                            }
                          }}
                          sx={{
                            backgroundColor: "#F8F8F8",
                            borderRadius: "100%",
                            width: "28px",
                            height: "28px",
                            padding: "5px",
                            "& .min-icon": {
                              width: "14px",
                              height: "14px",
                            },
                          }}
                        >
                          {button.icon}
                        </IconButton>
                      </Tooltip>
                    );
                  })}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} className={"versionID"}>
              {versionInfo.version_id !== "null" ? versionInfo.version_id : "-"}
            </Grid>
            <Grid item xs={12} className={"collapsableInfo"}>
              <span className={"versionData"}>
                <strong>Last modified:</strong>{" "}
                {lastModified.toFormat("ccc, LLL dd yyyy HH:mm:ss (ZZZZ)")}
              </span>
              <span className={"versionData"}>
                <strong>Size:</strong> {niceBytes(`${versionInfo.size || "0"}`)}
              </span>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </FileVersionStyled>
  );
};

export default FileVersionItem;
