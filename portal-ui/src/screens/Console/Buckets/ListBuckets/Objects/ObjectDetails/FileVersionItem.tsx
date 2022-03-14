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
import * as reactMoment from "react-moment";
import Grid from "@mui/material/Grid";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import { withStyles } from "@mui/styles";
import { displayFileIconName } from "../ListObjects/utils";
import { IFileInfo } from "./types";
import { IconButton, Tooltip } from "@mui/material";
import {
  DownloadIcon,
  PreviewIcon,
  RecoverIcon,
  ShareIcon,
} from "../../../../../../icons";

interface IFileVersionItem {
  fileName: string;
  versionInfo: IFileInfo;
  index: number;
  onShare: (versionInfo: IFileInfo) => void;
  onDownload: (versionInfo: IFileInfo) => void;
  onRestore: (versionInfo: IFileInfo) => void;
  onPreview: (versionInfo: IFileInfo) => void;
  globalClick: (versionInfo: IFileInfo) => void;
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    mainFileVersionItem: {
      borderBottom: "#E2E2E2 1px solid",
      padding: "1rem 0",
      margin: "0 2rem 0 3.5rem",
      cursor: "pointer",
    },
    versionContainer: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#000",
      display: "flex",
      alignItems: "center",
      "& svg.min-icon": {
        width: 18,
        height: 18,
        marginRight: 10,
      },
    },
    buttonContainer: {
      textAlign: "right",
      "& button": {
        marginLeft: "1.5rem",
      },
    },
    versionID: {
      fontSize: "12px",
      color: "#000",
      margin: "2px 0",
    },
    versionData: {
      marginRight: "10px",
      fontSize: 12,
      color: "#868686",
    },
    ctrItem: {
      position: "relative",
      "&::before": {
        content: "' '",
        display: "block",
        position: "absolute",
        width: "2px",
        height: "calc(100% + 2px)",
        backgroundColor: "#F8F8F8",
        left: "24px",
      },
    },
  });

const FileVersionItem = ({
  classes,
  fileName,
  versionInfo,
  onShare,
  onDownload,
  onRestore,
  onPreview,
  globalClick,
  index,
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

  return (
    <Grid
      container
      flex={1}
      className={classes.ctrItem}
      onClick={() => {
        globalClick(versionInfo);
      }}
    >
      <Grid item xs={12} className={classes.mainFileVersionItem}>
        <Grid item xs={12} justifyContent={"space-between"}>
          <Grid container>
            <Grid item xs={4} className={classes.versionContainer}>
              {displayFileIconName(fileName, true)} v{index.toString()}
            </Grid>
            <Grid item xs={8} className={classes.buttonContainer}>
              {versionItemButtons.map((button, index) => {
                return (
                  <Tooltip
                    title={button.tooltip}
                    key={`version-action-${button.tooltip}-${index.toString()}`}
                  >
                    <IconButton
                      size={"small"}
                      id={`version-action-${
                        button.tooltip
                      }-${index.toString()}`}
                      className={`${classes.spacing} ${
                        disableButtons ? classes.buttonDisabled : ""
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
        <Grid item xs={12} className={classes.versionID}>
          {versionInfo.version_id}
        </Grid>
        <Grid item xs={12}>
          <span className={classes.versionData}>
            <strong>Last modified:</strong>{" "}
            <reactMoment.default>
              {versionInfo.last_modified}
            </reactMoment.default>
          </span>
          <span className={classes.versionData}>
            <strong>Deleted:</strong>{" "}
            {versionInfo.is_delete_marker ? "Yes" : "No"}
          </span>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(FileVersionItem);
