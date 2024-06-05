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
import { useSelector } from "react-redux";
import {
  breakPoints,
  Button,
  DeleteIcon,
  DeleteNonCurrentIcon,
  Grid,
  ProgressBar,
  ScreenTitle,
  Select,
  SelectMultipleIcon,
  VersionsIcon,
} from "mds";
import ShareFile from "./ShareFile";

import { niceBytesInt } from "../../../../../../common/utils";
import RestoreFileVersion from "./RestoreFileVersion";

import { AppState, useAppDispatch } from "../../../../../../store";
import FileVersionItem from "./FileVersionItem";
import PreviewFileModal from "../Preview/PreviewFileModal";
import DeleteNonCurrent from "../ListObjects/DeleteNonCurrent";
import BrowserBreadcrumbs from "../../../../ObjectBrowser/BrowserBreadcrumbs";
import DeleteSelectedVersions from "./DeleteSelectedVersions";
import {
  selDistSet,
  setErrorSnackMessage,
} from "../../../../../../systemSlice";
import {
  setLoadingObjectInfo,
  setLoadingVersions,
  setSelectedVersion,
} from "../../../../ObjectBrowser/objectBrowserSlice";
import { List, ListRowProps } from "react-virtualized";
import TooltipWrapper from "../../../../Common/TooltipWrapper/TooltipWrapper";
import { downloadObject } from "../../../../ObjectBrowser/utils";
import { BucketObject } from "api/consoleApi";
import { api } from "api";
import { errorToHandler } from "api/errors";

interface IVersionsNavigatorProps {
  internalPaths: string;
  bucketName: string;
}

const emptyFile: BucketObject = {
  is_latest: true,
  last_modified: "",
  legal_hold_status: "",
  name: "",
  retention_mode: "",
  retention_until_date: "",
  size: 0,
  tags: {},
  version_id: undefined,
};

const VersionsNavigator = ({
  internalPaths,
  bucketName,
}: IVersionsNavigatorProps) => {
  const dispatch = useAppDispatch();

  const searchVersions = useSelector(
    (state: AppState) => state.objectBrowser.searchVersions,
  );
  const loadingVersions = useSelector(
    (state: AppState) => state.objectBrowser.loadingVersions,
  );
  const selectedVersion = useSelector(
    (state: AppState) => state.objectBrowser.selectedVersion,
  );

  const distributedSetup = useSelector(selDistSet);
  const [shareFileModalOpen, setShareFileModalOpen] = useState<boolean>(false);
  const [actualInfo, setActualInfo] = useState<BucketObject | null>(null);
  const [objectToShare, setObjectToShare] = useState<BucketObject | null>(null);
  const [versions, setVersions] = useState<BucketObject[]>([]);
  const [restoreVersionOpen, setRestoreVersionOpen] = useState<boolean>(false);
  const [restoreVersion, setRestoreVersion] = useState<BucketObject | null>(
    null,
  );
  const [sortValue, setSortValue] = useState<string>("date");
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [deleteNonCurrentOpen, setDeleteNonCurrentOpen] =
    useState<boolean>(false);
  const [selectEnabled, setSelectEnabled] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [delSelectedVOpen, setDelSelectedVOpen] = useState<boolean>(false);

  // calculate object name to display
  let objectNameArray: string[] = [];
  if (actualInfo && actualInfo.name) {
    objectNameArray = actualInfo.name.split("/");
  }

  useEffect(() => {
    if (!loadingVersions && !actualInfo) {
      dispatch(setLoadingVersions(true));
    }
  }, [loadingVersions, actualInfo, dispatch]);

  useEffect(() => {
    if (loadingVersions && internalPaths !== "") {
      api.buckets
        .listObjects(bucketName, {
          prefix: internalPaths,
          with_versions: distributedSetup,
        })
        .then((res) => {
          const result = get(res.data, "objects", []);

          // Filter the results prefixes as API can return more files than expected.
          const filteredPrefixes = result.filter(
            (item: BucketObject) => item.name === internalPaths,
          );

          if (distributedSetup) {
            setActualInfo(
              filteredPrefixes.find((el: BucketObject) => el.is_latest) ||
                emptyFile,
            );
            setVersions(filteredPrefixes);
          } else {
            setActualInfo(filteredPrefixes[0]);
            setVersions([]);
          }

          dispatch(setLoadingVersions(false));
        })
        .catch((err) => {
          dispatch(setErrorSnackMessage(errorToHandler(err.error)));
          dispatch(setLoadingVersions(false));
        });
    }
  }, [loadingVersions, bucketName, internalPaths, dispatch, distributedSetup]);

  const shareObject = () => {
    setShareFileModalOpen(true);
  };

  const closeShareModal = () => {
    setObjectToShare(null);
    setShareFileModalOpen(false);
    setPreviewOpen(false);
  };

  const onShareItem = (item: BucketObject) => {
    setObjectToShare(item);
    shareObject();
  };

  const onPreviewItem = (item: BucketObject) => {
    setObjectToShare(item);
    setPreviewOpen(true);
  };

  const onRestoreItem = (item: BucketObject) => {
    setRestoreVersion(item);
    setRestoreVersionOpen(true);
  };

  const onDownloadItem = (item: BucketObject) => {
    downloadObject(dispatch, bucketName, internalPaths, item);
  };

  const onGlobalClick = (item: BucketObject) => {
    dispatch(setSelectedVersion(item.version_id || ""));
  };

  const filteredRecords = versions.filter((version) => {
    if (version.version_id) {
      return version.version_id.includes(searchVersions);
    }
    return false;
  });

  const closeRestoreModal = (reloadObjectData: boolean) => {
    setRestoreVersionOpen(false);
    setRestoreVersion(null);

    if (reloadObjectData) {
      dispatch(setLoadingVersions(true));
      dispatch(setLoadingObjectInfo(true));
    }
  };

  const closeDeleteNonCurrent = (reloadAfterDelete: boolean) => {
    setDeleteNonCurrentOpen(false);

    if (reloadAfterDelete) {
      dispatch(setLoadingVersions(true));
      dispatch(setSelectedVersion(""));
      dispatch(setLoadingObjectInfo(true));
    }
  };

  const closeSelectedVersions = (reloadOnComplete: boolean) => {
    setDelSelectedVOpen(false);

    if (reloadOnComplete) {
      dispatch(setLoadingVersions(true));
      dispatch(setSelectedVersion(""));
      dispatch(setLoadingObjectInfo(true));
      setSelectedItems([]);
    }
  };

  const totalSpace = versions.reduce((acc: number, currValue: BucketObject) => {
    if (currValue.size) {
      return acc + currValue.size;
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
        const dateA = new Date(a.last_modified || "").getTime();
        const dateB = new Date(b.last_modified || "").getTime();

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
        (element) => element !== selectedVersion,
      );

      setSelectedItems(filteredItems);

      return;
    }

    const cloneState = [...selectedItems];
    cloneState.push(selectedVersion);

    setSelectedItems(cloneState);
  };

  const rowRenderer = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }: ListRowProps) => {
    const versOrd = versions.length - index;
    return (
      <FileVersionItem
        style={style}
        key={key}
        fileName={actualInfo?.name || ""}
        versionInfo={filteredRecords[index]}
        index={versOrd}
        onDownload={onDownloadItem}
        onRestore={onRestoreItem}
        onShare={onShareItem}
        onPreview={onPreviewItem}
        globalClick={onGlobalClick}
        isSelected={selectedVersion === filteredRecords[index].version_id}
        checkable={selectEnabled}
        onCheck={onCheckVersion}
        isChecked={selectedItems.includes(
          filteredRecords[index].version_id || "",
        )}
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
      {restoreVersionOpen && actualInfo && restoreVersion && (
        <RestoreFileVersion
          restoreOpen={restoreVersionOpen}
          bucketName={bucketName}
          versionToRestore={restoreVersion}
          objectPath={actualInfo.name || ""}
          onCloseAndUpdate={closeRestoreModal}
        />
      )}
      {previewOpen && actualInfo && (
        <PreviewFileModal
          open={previewOpen}
          bucketName={bucketName}
          actualInfo={{
            name: actualInfo.name || "",
            version_id:
              objectToShare && objectToShare.version_id
                ? objectToShare.version_id
                : "null",
            size: objectToShare && objectToShare.size ? objectToShare.size : 0,
            content_type: "",
            last_modified: actualInfo.last_modified || "",
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
          selectedObject={internalPaths}
          deleteOpen={delSelectedVOpen}
          selectedVersions={selectedItems}
          closeDeleteModalAndRefresh={closeSelectedVersions}
        />
      )}
      <Grid
        container
        sx={{
          width: "100%",
          padding: 10,
          "@media (max-width: 799px)": {
            minHeight: 800,
          },
        }}
      >
        {!actualInfo && (
          <Grid item xs={12}>
            <ProgressBar />
          </Grid>
        )}

        {actualInfo && (
          <Fragment>
            <Grid item xs={12}>
              <BrowserBreadcrumbs
                bucketName={bucketName}
                internalPaths={internalPaths}
                hidePathButton={true}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                position: "relative",
                "& .detailsSpacer": {
                  marginRight: 18,
                  "@media (max-width: 600px)": {
                    marginRight: 0,
                  },
                },
                [`@media (max-width: ${breakPoints.md}px)`]: {
                  "&::before": {
                    display: "none",
                  },
                },
              }}
            >
              <ScreenTitle
                icon={
                  <span
                    style={{
                      display: "block",
                      marginTop: "-10px",
                    }}
                  >
                    <VersionsIcon style={{ width: 20, height: 20 }} />
                  </span>
                }
                title={`${
                  objectNameArray.length > 0
                    ? objectNameArray[objectNameArray.length - 1]
                    : actualInfo.name
                } Versions`}
                subTitle={
                  <Fragment>
                    <span className={"detailsSpacer"}>
                      <strong>
                        {versions.length} Version
                        {versions.length === 1 ? "" : "s"}&nbsp;&nbsp;&nbsp;
                      </strong>
                    </span>
                    <span className={"detailsSpacer"}>
                      <strong>{niceBytesInt(totalSpace)}</strong>
                    </span>
                  </Fragment>
                }
                actions={
                  <Fragment>
                    <TooltipWrapper tooltip={"Select Multiple Versions"}>
                      <Button
                        id={"select-multiple-versions"}
                        onClick={() => {
                          setSelectEnabled(!selectEnabled);
                        }}
                        icon={<SelectMultipleIcon />}
                        variant={selectEnabled ? "callAction" : "regular"}
                        style={{ marginRight: 8 }}
                      />
                    </TooltipWrapper>
                    {selectEnabled && (
                      <TooltipWrapper tooltip={"Delete Selected Versions"}>
                        <Button
                          id={"delete-multiple-versions"}
                          onClick={() => {
                            setDelSelectedVOpen(true);
                          }}
                          icon={<DeleteIcon />}
                          variant={"secondary"}
                          style={{ marginRight: 8 }}
                          disabled={selectedItems.length === 0}
                        />
                      </TooltipWrapper>
                    )}
                    <TooltipWrapper tooltip={"Delete Non Current Versions"}>
                      <Button
                        id={"delete-non-current"}
                        onClick={() => {
                          setDeleteNonCurrentOpen(true);
                        }}
                        icon={<DeleteNonCurrentIcon />}
                        variant={"secondary"}
                        style={{ marginRight: 15 }}
                        disabled={versions.length <= 1}
                      />
                    </TooltipWrapper>
                    <Select
                      id={"sort-by"}
                      options={[
                        { label: "Date", value: "date" },
                        {
                          label: "Size",
                          value: "size",
                        },
                      ]}
                      value={sortValue}
                      label={"Sort by"}
                      onChange={(newValue) => {
                        setSortValue(newValue);
                      }}
                      noLabelMinWidth
                    />
                  </Fragment>
                }
                bottomBorder={false}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                flexGrow: 1,
                height: "calc(100% - 120px)",
                overflow: "auto",
                [`@media (max-width: ${breakPoints.md}px)`]: {
                  height: 600,
                },
              }}
            >
              {actualInfo.version_id && actualInfo.version_id !== "null" && (
                // @ts-ignore
                <List
                  style={{
                    width: "100%",
                  }}
                  containerStyle={{
                    width: "100%",
                    maxWidth: "100%",
                  }}
                  width={1}
                  height={800}
                  rowCount={filteredRecords.length}
                  rowHeight={108}
                  rowRenderer={rowRenderer}
                />
              )}
            </Grid>
          </Fragment>
        )}
      </Grid>
    </Fragment>
  );
};

export default VersionsNavigator;
