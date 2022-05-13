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
import {
  decodeFileName,
  encodeFileName,
  niceBytesInt,
} from "../../../../../../common/utils";
import ScreenTitle from "../../../../Common/ScreenTitle/ScreenTitle";
import RestoreFileVersion from "./RestoreFileVersion";
import {
  cancelObjectInList,
  completeObject,
  failObject,
  setLoadingObjectInfo,
  setLoadingVersions,
  setNewObject,
  setSelectedVersion,
  updateProgress,
} from "../../../../ObjectBrowser/actions";

import { AppState } from "../../../../../../store";
import {
  DeleteIcon,
  DeleteNonCurrentIcon,
  SelectMultipleIcon,
  VersionsIcon,
} from "../../../../../../icons";
import VirtualizedList from "../../../../Common/VirtualizedList/VirtualizedList";
import FileVersionItem from "./FileVersionItem";
import SelectWrapper from "../../../../Common/FormComponents/SelectWrapper/SelectWrapper";
import PreviewFileModal from "../Preview/PreviewFileModal";
import RBIconButton from "../../../BucketDetails/SummaryItems/RBIconButton";
import DeleteNonCurrent from "../ListObjects/DeleteNonCurrent";
import BrowserBreadcrumbs from "../../../../ObjectBrowser/BrowserBreadcrumbs";
import DeleteSelectedVersions from "./DeleteSelectedVersions";

const styles = (theme: Theme) =>
  createStyles({
    versionsContainer: {
      padding: 10,
      "@media (max-width: 799px)": {
        minHeight: 800,
      },
    },
    noBottomBorder: {
      borderBottom: 0,
    },
    versionsVirtualPanel: {
      flexGrow: 1,
      height: "calc(100% - 120px)",
      overflow: "auto",
      "@media (max-width: 799px)": {
        height: 600,
      },
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
        height: "40px",
        bottom: 0,
      },
      "@media (max-width: 799px)": {
        "&::before": {
          display: "none",
        },
      },
    },
    sortByLabel: {
      color: "#838383",
      fontWeight: "bold",
      whiteSpace: "nowrap",
      marginRight: 12,
      fontSize: 14,
      "@media (max-width: 600px)": {
        display: "none",
      },
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
  loadingVersions: boolean;
  selectedVersion: string;
  setErrorSnackMessage: typeof setErrorSnackMessage;
  setSnackBarMessage: typeof setSnackBarMessage;
  setNewObject: typeof setNewObject;
  updateProgress: typeof updateProgress;
  completeObject: typeof completeObject;
  setSelectedVersion: typeof setSelectedVersion;
  setLoadingVersions: typeof setLoadingVersions;
  setLoadingObjectInfo: typeof setLoadingObjectInfo;
  failObject: typeof failObject;
  cancelObjectInList: typeof cancelObjectInList;
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
  loadingVersions,
  selectedVersion,
  completeObject,
  internalPaths,
  bucketName,
  setSelectedVersion,
  setLoadingVersions,
  setLoadingObjectInfo,
  failObject,
  cancelObjectInList,
}: IVersionsNavigatorProps) => {
  const [shareFileModalOpen, setShareFileModalOpen] = useState<boolean>(false);
  const [actualInfo, setActualInfo] = useState<IFileInfo | null>(null);
  const [objectToShare, setObjectToShare] = useState<IFileInfo | null>(null);
  const [versions, setVersions] = useState<IFileInfo[]>([]);
  const [restoreVersionOpen, setRestoreVersionOpen] = useState<boolean>(false);
  const [restoreVersion, setRestoreVersion] = useState<string>("");
  const [sortValue, setSortValue] = useState<string>("date");
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [deleteNonCurrentOpen, setDeleteNonCurrentOpen] =
    useState<boolean>(false);
  const [selectEnabled, setSelectEnabled] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [delSelectedVOpen, setDelSelectedVOpen] = useState<boolean>(false);

  // calculate object name to display
  let objectNameArray: string[] = [];
  if (actualInfo) {
    objectNameArray = actualInfo.name.split("/");
  }

  useEffect(() => {
    if (!loadingVersions && !actualInfo) {
      setLoadingVersions(true);
    }
  }, [loadingVersions, actualInfo, setLoadingVersions]);

  useEffect(() => {
    if (loadingVersions && internalPaths !== "") {
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

          setLoadingVersions(false);
        })
        .catch((error: ErrorResponseHandler) => {
          setErrorSnackMessage(error);
          setLoadingVersions(false);
        });
    }
  }, [
    setLoadingVersions,
    loadingVersions,
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

    const downloadCall = download(
      bucketName,
      internalPaths,
      object.version_id,
      parseInt(object.size || "0"),
      (progress) => {
        updateProgress(identityDownload, progress);
      },
      () => {
        completeObject(identityDownload);
      },
      () => {
        failObject(identityDownload);
      },
      () => {
        cancelObjectInList(identityDownload);
      }
    );

    setNewObject({
      bucketName,
      done: false,
      instanceID: identityDownload,
      percentage: 0,
      prefix: object.name,
      type: "download",
      waitingForFile: true,
      failed: false,
      cancelled: false,
      call: downloadCall,
    });

    downloadCall.send();
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
      setLoadingVersions(true);
      setLoadingObjectInfo(true);
    }
  };

  const closeDeleteNonCurrent = (reloadAfterDelete: boolean) => {
    setDeleteNonCurrentOpen(false);

    if (reloadAfterDelete) {
      setLoadingVersions(true);
      setSelectedVersion("");
      setLoadingObjectInfo(true);
    }
  };

  const closeSelectedVersions = (reloadOnComplete: boolean) => {
    setDelSelectedVOpen(false);

    if (reloadOnComplete) {
      setLoadingVersions(true);
      setSelectedVersion("");
      setLoadingObjectInfo(true);
      setSelectedItems([]);
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
      case "size":
        if (a.size && b.size) {
          if (a.size < b.size) {
            return -1;
          }
          if (a.size > b.size) {
            return 1;
          }
          return 0;
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

  const onCheckVersion = (selectedVersion: string) => {
    if (selectedItems.includes(selectedVersion)) {
      const filteredItems = selectedItems.filter(
        (element) => element !== selectedVersion
      );

      setSelectedItems(filteredItems);

      return;
    }

    const cloneState = [...selectedItems];
    cloneState.push(selectedVersion);

    setSelectedItems(cloneState);
  };

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
        isSelected={selectedVersion === item.version_id}
        checkable={selectEnabled}
        onCheck={onCheckVersion}
        isChecked={selectedItems.includes(item.version_id || "")}
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
      {deleteNonCurrentOpen && (
        <DeleteNonCurrent
          deleteOpen={deleteNonCurrentOpen}
          closeDeleteModalAndRefresh={closeDeleteNonCurrent}
          selectedBucket={bucketName}
          selectedObject={internalPaths}
        />
      )}
      {delSelectedVOpen && (
        <DeleteSelectedVersions
          selectedBucket={bucketName}
          selectedObject={decodeFileName(internalPaths)}
          deleteOpen={delSelectedVOpen}
          selectedVersions={selectedItems}
          closeDeleteModalAndRefresh={closeSelectedVersions}
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
            <Grid item xs={12}>
              <BrowserBreadcrumbs
                bucketName={bucketName}
                internalPaths={decodeFileName(internalPaths)}
                existingFiles={[]}
                hidePathButton={true}
              />
            </Grid>
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
                    <RBIconButton
                      id={"select-multiple-versions"}
                      tooltip={"Select Multiple Versions"}
                      onClick={() => {
                        setSelectEnabled(!selectEnabled);
                      }}
                      text={""}
                      icon={<SelectMultipleIcon />}
                      color="primary"
                      variant={selectEnabled ? "contained" : "outlined"}
                      style={{ marginRight: 8 }}
                    />
                    {selectEnabled && (
                      <RBIconButton
                        id={"delete-multiple-versions"}
                        tooltip={"Delete Selected Versions"}
                        onClick={() => {
                          setDelSelectedVOpen(true);
                        }}
                        text={""}
                        icon={<DeleteIcon />}
                        color="secondary"
                        style={{ marginRight: 8 }}
                        disabled={selectedItems.length === 0}
                      />
                    )}
                    <RBIconButton
                      id={"delete-non-current"}
                      tooltip={"Delete Non Current Versions"}
                      onClick={() => {
                        setDeleteNonCurrentOpen(true);
                      }}
                      text={""}
                      icon={<DeleteNonCurrentIcon />}
                      color="secondary"
                      style={{ marginRight: 15 }}
                      disabled={versions.length <= 1}
                    />
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
                          label: "Size",
                          value: "size",
                        },
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
                  defaultHeight={108}
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
  loadingVersions: objectBrowser.loadingVersions,
  selectedVersion: objectBrowser.selectedVersion,
});

const mapDispatchToProps = {
  setErrorSnackMessage,
  setSnackBarMessage,
  setNewObject,
  updateProgress,
  completeObject,
  setSelectedVersion,
  setLoadingVersions,
  setLoadingObjectInfo,
  failObject,
  cancelObjectInList,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(withStyles(styles)(VersionsNavigator));
