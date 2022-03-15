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

import React, { Fragment, useEffect, useState } from "react";
import get from "lodash/get";
import { connect } from "react-redux";
import { withStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import { LinearProgress, SelectChangeEvent } from "@mui/material";
import Grid from "@mui/material/Grid";
import ShareFile from "./ShareFile";
import {
  actionsTray,
  buttonsStyles,
  containerForHeader,
  hrClass,
  tableStyles,
  spacingUtils,
  textStyleUtils,
  objectBrowserExtras,
  objectBrowserCommon,
} from "../../../../Common/FormComponents/common/styleLibrary";
import { IFileInfo } from "./types";
import { download } from "../utils";
import api from "../../../../../../common/api";
import { ErrorResponseHandler } from "../../../../../../common/types";
import {
  setErrorSnackMessage,
  setSnackBarMessage,
} from "../../../../../../actions";
import { encodeFileName, niceBytesInt } from "../../../../../../common/utils";
import ScreenTitle from "../../../../Common/ScreenTitle/ScreenTitle";
import RestoreFileVersion from "./RestoreFileVersion";
import {
  completeObject,
  setNewObject,
  setSelectedVersion,
  updateProgress,
} from "../../../../ObjectBrowser/actions";

import { AppState } from "../../../../../../store";
import { VersionsIcon } from "../../../../../../icons";
import VirtualizedList from "../../../../Common/VirtualizedList/VirtualizedList";
import FileVersionItem from "./FileVersionItem";
import SelectWrapper from "../../../../Common/FormComponents/SelectWrapper/SelectWrapper";
import PreviewFileModal from "../Preview/PreviewFileModal";

const styles = (theme: Theme) =>
  createStyles({
    versionsContainer: {
      border: "#EAEDEE 1px solid",
      padding: 10,
    },
    noBottomBorder: {
      borderBottom: 0,
    },
    versionsVirtualPanel: {
      flexGrow: 1,
      height: "calc(100% - 120px)",
      overflow: "auto",
    },
    screenTitleContainer: {
      position: "relative",
      "&::before": {
        content: "' '",
        display: "block",
        position: "absolute",
        width: "2px",
        backgroundColor: "#F8F8F8",
        left: "24px",
        height: "52px",
        bottom: 0,
      },
    },
    sortByLabel: {
      color: "#838383",
      fontWeight: "bold",
      whiteSpace: "nowrap",
      marginRight: 12,
      fontSize: 14,
    },
    ...hrClass,
    ...buttonsStyles,
    ...actionsTray,
    ...tableStyles,
    ...spacingUtils,
    ...textStyleUtils,
    ...objectBrowserCommon,
    ...objectBrowserExtras,
    ...containerForHeader(theme.spacing(4)),
  });

interface IVersionsNavigatorProps {
  classes: any;
  distributedSetup: boolean;
  internalPaths: string;
  bucketName: string;
  searchVersions: string;
  setErrorSnackMessage: typeof setErrorSnackMessage;
  setSnackBarMessage: typeof setSnackBarMessage;
  setNewObject: typeof setNewObject;
  updateProgress: typeof updateProgress;
  completeObject: typeof completeObject;
  setSelectedVersion: typeof setSelectedVersion;
}

const emptyFile: IFileInfo = {
  is_latest: true,
  last_modified: "",
  legal_hold_status: "",
  name: "",
  retention_mode: "",
  retention_until_date: "",
  size: "0",
  tags: {},
  version_id: null,
};

const VersionsNavigator = ({
  classes,
  distributedSetup,
  setErrorSnackMessage,
  setNewObject,
  updateProgress,
  searchVersions,
  completeObject,
  internalPaths,
  bucketName,
  setSelectedVersion,
}: IVersionsNavigatorProps) => {
  const [loadObjectData, setLoadObjectData] = useState<boolean>(true);
  const [shareFileModalOpen, setShareFileModalOpen] = useState<boolean>(false);
  const [actualInfo, setActualInfo] = useState<IFileInfo | null>(null);
  const [objectToShare, setObjectToShare] = useState<IFileInfo | null>(null);
  const [versions, setVersions] = useState<IFileInfo[]>([]);
  const [restoreVersionOpen, setRestoreVersionOpen] = useState<boolean>(false);
  const [restoreVersion, setRestoreVersion] = useState<string>("");
  const [sortValue, setSortValue] = useState<string>("date");
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);

  // calculate object name to display
  let objectNameArray: string[] = [];
  if (actualInfo) {
    objectNameArray = actualInfo.name.split("/");
  }

  useEffect(() => {
    if (loadObjectData && internalPaths !== "") {
      api
        .invoke(
          "GET",
          `/api/v1/buckets/${bucketName}/objects?prefix=${internalPaths}${
            distributedSetup ? "&with_versions=true" : ""
          }`
        )
        .then((res: IFileInfo[]) => {
          const result = get(res, "objects", []);
          if (distributedSetup) {
            setActualInfo(
              result.find((el: IFileInfo) => el.is_latest) || emptyFile
            );
            setVersions(result);
          } else {
            setActualInfo(result[0]);
            setVersions([]);
          }

          setLoadObjectData(false);
        })
        .catch((error: ErrorResponseHandler) => {
          setErrorSnackMessage(error);
          setLoadObjectData(false);
        });
    }
  }, [
    loadObjectData,
    bucketName,
    internalPaths,
    setErrorSnackMessage,
    distributedSetup,
  ]);

  const shareObject = () => {
    setShareFileModalOpen(true);
  };

  const closeShareModal = () => {
    setObjectToShare(null);
    setShareFileModalOpen(false);
    setPreviewOpen(false);
  };

  const downloadObject = (object: IFileInfo) => {
    const identityDownload = encodeFileName(
      `${bucketName}-${object.name}-${new Date().getTime()}-${Math.random()}`
    );

    setNewObject({
      bucketName,
      done: false,
      instanceID: identityDownload,
      percentage: 0,
      prefix: object.name,
      type: "download",
      waitingForFile: true,
    });

    download(
      bucketName,
      internalPaths,
      object.version_id,
      parseInt(object.size || "0"),
      (progress) => {
        updateProgress(identityDownload, progress);
      },
      () => {
        completeObject(identityDownload);
      }
    );
  };

  const onShareItem = (item: IFileInfo) => {
    setObjectToShare(item);
    shareObject();
  };

  const onPreviewItem = (item: IFileInfo) => {
    setObjectToShare(item);
    setPreviewOpen(true);
  };

  const onRestoreItem = (item: IFileInfo) => {
    setRestoreVersion(item.version_id || "");
    setRestoreVersionOpen(true);
  };

  const onDownloadItem = (item: IFileInfo) => {
    downloadObject(item);
  };

  const onGlobalClick = (item: IFileInfo) => {
    setSelectedVersion(item.version_id || "");
  };

  const filteredRecords = versions.filter((version) => {
    if (version.version_id) {
      return version.version_id.includes(searchVersions);
    }
    return false;
  });

  const closeRestoreModal = (reloadObjectData: boolean) => {
    setRestoreVersionOpen(false);
    setRestoreVersion("");

    if (reloadObjectData) {
      setLoadObjectData(true);
    }
  };

  const totalSpace = versions.reduce((acc: number, currValue: IFileInfo) => {
    if (currValue.size) {
      return acc + parseInt(currValue.size);
    }
    return acc;
  }, 0);

  filteredRecords.sort((a, b) => {
    switch (sortValue) {
      case "version":
        if (a.version_id && b.version_id) {
          if (a.version_id < b.version_id) {
            return -1;
          }
          if (a.version_id > b.version_id) {
            return 1;
          }
          return 0;
        }
        return 0;
      case "deleted":
        if (a.is_delete_marker && !b.is_delete_marker) {
          return -1;
        }
        if (!a.is_delete_marker && b.is_delete_marker) {
          return 1;
        }
        return 0;
      default:
        const dateA = new Date(a.last_modified).getTime();
        const dateB = new Date(b.last_modified).getTime();

        if (dateA < dateB) {
          return 1;
        }
        if (dateA > dateB) {
          return -1;
        }
        return 0;
    }
  });

  const renderVersion = (elementIndex: number) => {
    const item = filteredRecords[elementIndex];
    const versOrd = versions.length - versions.indexOf(item);

    return (
      <FileVersionItem
        fileName={actualInfo?.name || ""}
        versionInfo={item}
        index={versOrd}
        onDownload={onDownloadItem}
        onRestore={onRestoreItem}
        onShare={onShareItem}
        onPreview={onPreviewItem}
        globalClick={onGlobalClick}
      />
    );
  };

  return (
    <Fragment>
      {shareFileModalOpen && actualInfo && (
        <ShareFile
          open={shareFileModalOpen}
          closeModalAndRefresh={closeShareModal}
          bucketName={bucketName}
          dataObject={objectToShare || actualInfo}
        />
      )}
      {restoreVersionOpen && actualInfo && (
        <RestoreFileVersion
          restoreOpen={restoreVersionOpen}
          bucketName={bucketName}
          versionID={restoreVersion}
          objectPath={actualInfo.name}
          onCloseAndUpdate={closeRestoreModal}
        />
      )}
      {previewOpen && actualInfo && (
        <PreviewFileModal
          open={previewOpen}
          bucketName={bucketName}
          object={{
            name: actualInfo.name,
            version_id:
              objectToShare && objectToShare.version_id
                ? objectToShare.version_id
                : "null",
            size: parseInt(
              objectToShare && objectToShare.size ? objectToShare.size : "0"
            ),
            content_type: "",
            last_modified: new Date(actualInfo.last_modified),
          }}
          onClosePreview={() => {
            setPreviewOpen(false);
          }}
        />
      )}
      <Grid container className={classes.versionsContainer}>
        {!actualInfo && (
          <Grid item xs={12}>
            <LinearProgress />
          </Grid>
        )}

        {actualInfo && (
          <Fragment>
            <Grid item xs={12} className={classes.screenTitleContainer}>
              <ScreenTitle
                icon={
                  <span className={classes.listIcon}>
                    <VersionsIcon />
                  </span>
                }
                title={
                  <span className={classes.titleSpacer}>
                    {objectNameArray.length > 0
                      ? objectNameArray[objectNameArray.length - 1]
                      : actualInfo.name}{" "}
                    Versions
                  </span>
                }
                subTitle={
                  <Fragment>
                    <Grid item xs={12} className={classes.bucketDetails}>
                      <span className={classes.detailsSpacer}>
                        <strong>
                          {versions.length} Version
                          {versions.length === 1 ? "" : "s"}&nbsp;&nbsp;&nbsp;
                        </strong>
                      </span>
                      <span className={classes.detailsSpacer}>
                        <strong>{niceBytesInt(totalSpace)}</strong>
                      </span>
                    </Grid>
                  </Fragment>
                }
                actions={
                  <Fragment>
                    <span className={classes.sortByLabel}>Sort by</span>
                    <SelectWrapper
                      id={"sort-by"}
                      label={""}
                      value={sortValue}
                      onChange={(e: SelectChangeEvent<string>) => {
                        setSortValue(e.target.value as string);
                      }}
                      name={"sort-by"}
                      options={[
                        { label: "Date", value: "date" },
                        {
                          label: "Version ID",
                          value: "version",
                        },
                        { label: "Deleted", value: "deleted" },
                      ]}
                    />
                  </Fragment>
                }
                className={classes.noBottomBorder}
              />
            </Grid>
            <Grid item xs={12} className={classes.versionsVirtualPanel}>
              {actualInfo.version_id && actualInfo.version_id !== "null" && (
                <VirtualizedList
                  rowRenderFunction={renderVersion}
                  totalItems={filteredRecords.length}
                  defaultHeight={110}
                />
              )}
            </Grid>
          </Fragment>
        )}
      </Grid>
    </Fragment>
  );
};

const mapStateToProps = ({ system, objectBrowser }: AppState) => ({
  distributedSetup: get(system, "distributedSetup", false),
  searchVersions: objectBrowser.searchVersions,
});

const mapDispatchToProps = {
  setErrorSnackMessage,
  setSnackBarMessage,
  setNewObject,
  updateProgress,
  completeObject,
  setSelectedVersion,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(withStyles(styles)(VersionsNavigator));
