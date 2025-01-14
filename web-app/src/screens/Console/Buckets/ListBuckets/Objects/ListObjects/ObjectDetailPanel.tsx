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
  ActionsList,
  Box,
  Button,
  DeleteIcon,
  DownloadIcon,
  Grid,
  Loader,
  MetadataIcon,
  ObjectInfoIcon,
  PreviewIcon,
  ShareIcon,
  SimpleHeader,
  TagsIcon,
  VersionsIcon,
} from "mds";
import { api } from "api";
import { downloadObject } from "../../../../ObjectBrowser/utils";
import { BucketObject, BucketVersioningResponse } from "api/consoleApi";
import { AllowedPreviews, previewObjectType } from "../utils";
import {
  niceBytes,
  niceBytesInt,
  niceDaysInt,
} from "../../../../../../common/utils";
import {
  IAM_SCOPES,
  permissionTooltipHelper,
} from "../../../../../../common/SecureComponent/permissions";
import { AppState, useAppDispatch } from "../../../../../../store";
import {
  hasPermission,
  SecureComponent,
} from "../../../../../../common/SecureComponent";
import { selDistSet } from "../../../../../../systemSlice";
import {
  setLoadingObjectInfo,
  setLoadingVersions,
  setSelectedVersion,
  setVersionsModeEnabled,
} from "../../../../ObjectBrowser/objectBrowserSlice";
import { displayFileIconName } from "./utils";
import PreviewFileModal from "../Preview/PreviewFileModal";
import ObjectMetaData from "../ObjectDetails/ObjectMetaData";
import ShareFile from "../ObjectDetails/ShareFile";
import DeleteObject from "../ListObjects/DeleteObject";
import TagsModal from "../ObjectDetails/TagsModal";
import RenameLongFileName from "../../../../ObjectBrowser/RenameLongFilename";
import TooltipWrapper from "../../../../Common/TooltipWrapper/TooltipWrapper";

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

interface IObjectDetailPanelProps {
  internalPaths: string;
  bucketName: string;
  versioningInfo: BucketVersioningResponse;
  onClosePanel: (hardRefresh: boolean) => void;
}

const ObjectDetailPanel = ({
  internalPaths,
  bucketName,
  versioningInfo,
  onClosePanel,
}: IObjectDetailPanelProps) => {
  const dispatch = useAppDispatch();

  const distributedSetup = useSelector(selDistSet);
  const versionsMode = useSelector(
    (state: AppState) => state.objectBrowser.versionsMode,
  );
  const selectedVersion = useSelector(
    (state: AppState) => state.objectBrowser.selectedVersion,
  );
  const loadingObjectInfo = useSelector(
    (state: AppState) => state.objectBrowser.loadingObjectInfo,
  );

  const [shareFileModalOpen, setShareFileModalOpen] = useState<boolean>(false);
  const [tagModalOpen, setTagModalOpen] = useState<boolean>(false);
  const [actualInfo, setActualInfo] = useState<BucketObject | null>(null);
  const [allInfoElements, setAllInfoElements] = useState<BucketObject[]>([]);
  const [objectToShare, setObjectToShare] = useState<BucketObject | null>(null);
  const [versions, setVersions] = useState<BucketObject[]>([]);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [totalVersionsSize, setTotalVersionsSize] = useState<number>(0);
  const [longFileOpen, setLongFileOpen] = useState<boolean>(false);
  const [metaData, setMetaData] = useState<any | null>(null);
  const [loadMetadata, setLoadingMetadata] = useState<boolean>(false);

  const internalPathsDecoded = internalPaths || "";
  const allPathData = internalPathsDecoded.split("/");
  const currentItem = allPathData.pop() || "";

  // calculate object name to display
  let objectNameArray: string[] = [];
  if (actualInfo && actualInfo.name) {
    objectNameArray = actualInfo.name.split("/");
  }

  useEffect(() => {
    if (distributedSetup && allInfoElements && allInfoElements.length >= 1) {
      let infoElement =
        allInfoElements.find((el: BucketObject) => el.is_latest) || emptyFile;

      if (selectedVersion !== "") {
        infoElement =
          allInfoElements.find(
            (el: BucketObject) => el.version_id === selectedVersion,
          ) || emptyFile;
      }

      if (!infoElement.is_delete_marker) {
        setLoadingMetadata(true);
      }

      setActualInfo(infoElement);
    }
  }, [selectedVersion, distributedSetup, allInfoElements]);

  useEffect(() => {
    if (loadingObjectInfo && internalPaths !== "") {
      api.buckets
        .listObjects(bucketName, {
          prefix: internalPaths,
          with_versions: distributedSetup,
        })
        .then((res) => {
          const result: BucketObject[] = res.data.objects || [];
          if (distributedSetup) {
            setAllInfoElements(result);
            setVersions(result);

            const tVersionSize = result.reduce(
              (acc: number, currValue: BucketObject): number => {
                if (currValue?.size) {
                  return acc + currValue.size;
                }
                return acc;
              },
              0,
            );

            setTotalVersionsSize(tVersionSize);
          } else {
            const resInfo = result[0];

            setActualInfo(resInfo);
            setVersions([]);

            if (!resInfo.is_delete_marker) {
              setLoadingMetadata(true);
            }
          }

          dispatch(setLoadingObjectInfo(false));
        })
        .catch((err) => {
          console.error("Error loading object details", err.error);
          dispatch(setLoadingObjectInfo(false));
        });
    }
  }, [
    loadingObjectInfo,
    bucketName,
    internalPaths,
    dispatch,
    distributedSetup,
    selectedVersion,
  ]);

  useEffect(() => {
    if (loadMetadata && internalPaths !== "") {
      api.buckets
        .getObjectMetadata(bucketName, {
          prefix: internalPaths,
          versionID: actualInfo?.version_id || "",
        })
        .then((res) => {
          let metadata = get(res.data, "objectMetadata", {});

          setMetaData(metadata);
          setLoadingMetadata(false);
        })
        .catch((err) => {
          console.error("Error Getting Metadata Status: ", err.detailedError);
          setLoadingMetadata(false);
        });
    }
  }, [bucketName, internalPaths, loadMetadata, actualInfo?.version_id]);

  let tagKeys: string[] = [];

  if (actualInfo && actualInfo.tags) {
    tagKeys = Object.keys(actualInfo.tags);
  }

  const shareObject = () => {
    setShareFileModalOpen(true);
  };

  const closeShareModal = () => {
    setObjectToShare(null);
    setShareFileModalOpen(false);
  };

  const closeFileOpen = () => {
    setLongFileOpen(false);
  };

  const closeDeleteModal = (closeAndReload: boolean) => {
    setDeleteOpen(false);

    if (closeAndReload && selectedVersion === "") {
      onClosePanel(true);
    } else {
      dispatch(setLoadingVersions(true));
      dispatch(setSelectedVersion(""));
      dispatch(setLoadingObjectInfo(true));
    }
  };

  const closeAddTagModal = (reloadObjectData: boolean) => {
    setTagModalOpen(false);
    if (reloadObjectData) {
      dispatch(setLoadingObjectInfo(true));
    }
  };

  const loaderForContainer = (
    <div style={{ textAlign: "center", marginTop: 35 }}>
      <Loader />
    </div>
  );

  if (!actualInfo) {
    if (loadingObjectInfo) {
      return loaderForContainer;
    }

    return null;
  }

  const objectName =
    objectNameArray.length > 0
      ? objectNameArray[objectNameArray.length - 1]
      : actualInfo.name;

  const objectResources = [
    bucketName,
    currentItem,
    [bucketName, actualInfo.name].join("/"),
  ];
  const canSetTags = hasPermission(objectResources, [
    IAM_SCOPES.S3_PUT_OBJECT_TAGGING,
    IAM_SCOPES.S3_PUT_ACTIONS,
  ]);
  const canChangeVersioning = hasPermission(objectResources, [
    IAM_SCOPES.S3_GET_BUCKET_VERSIONING,
    IAM_SCOPES.S3_PUT_BUCKET_VERSIONING,
    IAM_SCOPES.S3_GET_OBJECT_VERSION,
    IAM_SCOPES.S3_GET_ACTIONS,
    IAM_SCOPES.S3_PUT_ACTIONS,
  ]);
  const canGetObject = hasPermission(objectResources, [
    IAM_SCOPES.S3_GET_OBJECT,
    IAM_SCOPES.S3_GET_ACTIONS,
  ]);
  const canDelete = hasPermission(
    [bucketName, currentItem, [bucketName, actualInfo.name].join("/")],
    [IAM_SCOPES.S3_DELETE_OBJECT, IAM_SCOPES.S3_DELETE_ACTIONS],
  );

  let objectType: AllowedPreviews = previewObjectType(metaData, currentItem);

  const multiActionButtons = [
    {
      action: () => {
        downloadObject(dispatch, bucketName, internalPaths, actualInfo);
      },
      label: "Download",
      disabled: !!actualInfo.is_delete_marker || !canGetObject,
      icon: <DownloadIcon />,
      tooltip: canGetObject
        ? "Download this Object"
        : permissionTooltipHelper(
            [IAM_SCOPES.S3_GET_OBJECT, IAM_SCOPES.S3_GET_ACTIONS],
            "download this object",
          ),
    },
    {
      action: () => {
        shareObject();
      },
      label: "Share",
      disabled: !!actualInfo.is_delete_marker || !canGetObject,
      icon: <ShareIcon />,
      tooltip: canGetObject
        ? "Share this File"
        : permissionTooltipHelper(
            [IAM_SCOPES.S3_GET_OBJECT, IAM_SCOPES.S3_GET_ACTIONS],
            "share this object",
          ),
    },
    {
      action: () => {
        setPreviewOpen(true);
      },
      label: "Preview",
      disabled:
        !!actualInfo.is_delete_marker ||
        (objectType === "none" && !canGetObject),
      icon: <PreviewIcon />,
      tooltip: canGetObject
        ? "Preview this File"
        : permissionTooltipHelper(
            [IAM_SCOPES.S3_GET_OBJECT, IAM_SCOPES.S3_GET_ACTIONS],
            "preview this object",
          ),
    },
    {
      action: () => {
        setTagModalOpen(true);
      },
      label: "Tags",
      disabled:
        !!actualInfo.is_delete_marker || selectedVersion !== "" || !canSetTags,
      icon: <TagsIcon />,
      tooltip: canSetTags
        ? "Change Tags for this File"
        : permissionTooltipHelper(
            [
              IAM_SCOPES.S3_PUT_OBJECT_TAGGING,
              IAM_SCOPES.S3_GET_OBJECT_TAGGING,
              IAM_SCOPES.S3_GET_ACTIONS,
              IAM_SCOPES.S3_PUT_ACTIONS,
            ],
            "set Tags on this object",
          ),
    },
    {
      action: () => {
        dispatch(
          setVersionsModeEnabled({
            status: !versionsMode,
            objectName: objectName,
          }),
        );
      },
      label: versionsMode ? "Hide Object Versions" : "Display Object Versions",
      icon: <VersionsIcon />,
      disabled:
        !distributedSetup ||
        !(actualInfo.version_id && actualInfo.version_id !== "null") ||
        !canChangeVersioning,
      tooltip: canChangeVersioning
        ? actualInfo.version_id && actualInfo.version_id !== "null"
          ? "Display Versions for this file"
          : ""
        : permissionTooltipHelper(
            [
              IAM_SCOPES.S3_GET_BUCKET_VERSIONING,
              IAM_SCOPES.S3_PUT_BUCKET_VERSIONING,
              IAM_SCOPES.S3_GET_OBJECT_VERSION,
              IAM_SCOPES.S3_GET_ACTIONS,
              IAM_SCOPES.S3_PUT_ACTIONS,
            ],
            "display all versions of this object",
          ),
    },
  ];

  const calculateLastModifyTime = (lastModified: string) => {
    const currentTime = new Date();
    const modifiedTime = new Date(lastModified);

    const difTime = currentTime.getTime() - modifiedTime.getTime();

    const formatTime = niceDaysInt(difTime, "ms");

    return formatTime.trim() !== "" ? `${formatTime} ago` : "Just now";
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
      {deleteOpen && (
        <DeleteObject
          deleteOpen={deleteOpen}
          selectedBucket={bucketName}
          selectedObject={internalPaths}
          closeDeleteModalAndRefresh={closeDeleteModal}
          versioningInfo={distributedSetup ? versioningInfo : undefined}
          selectedVersion={selectedVersion}
        />
      )}
      {previewOpen && actualInfo && (
        <PreviewFileModal
          open={previewOpen}
          bucketName={bucketName}
          actualInfo={actualInfo}
          onClosePreview={() => {
            setPreviewOpen(false);
          }}
        />
      )}
      {tagModalOpen && actualInfo && (
        <TagsModal
          modalOpen={tagModalOpen}
          bucketName={bucketName}
          actualInfo={actualInfo}
          onCloseAndUpdate={closeAddTagModal}
        />
      )}
      {longFileOpen && actualInfo && (
        <RenameLongFileName
          open={longFileOpen}
          closeModal={closeFileOpen}
          currentItem={currentItem}
          bucketName={bucketName}
          internalPaths={internalPaths}
          actualInfo={actualInfo}
        />
      )}

      {loadingObjectInfo ? (
        <Fragment>{loaderForContainer}</Fragment>
      ) : (
        <Box
          sx={{
            "& .ObjectDetailsTitle": {
              display: "flex",
              alignItems: "center",
              "& .min-icon": {
                width: 26,
                height: 26,
                minWidth: 26,
                minHeight: 26,
              },
            },
            "& .objectNameContainer": {
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
              alignItems: "center",
              marginLeft: 10,
            },
            "& .capitalizeFirst": {
              textTransform: "capitalize",
            },
            "& .detailContainer": {
              padding: "0 22px",
              marginBottom: 10,
              fontSize: 14,
            },
          }}
        >
          <ActionsList
            title={
              <div className={"ObjectDetailsTitle"}>
                {displayFileIconName(objectName || "", true)}
                <span className={"objectNameContainer"}>{objectName}</span>
              </div>
            }
            items={multiActionButtons}
          />
          <TooltipWrapper
            tooltip={
              canDelete
                ? ""
                : permissionTooltipHelper(
                    [IAM_SCOPES.S3_DELETE_OBJECT, IAM_SCOPES.S3_DELETE_ACTIONS],
                    "delete this object",
                  )
            }
          >
            <Grid
              item
              xs={12}
              sx={{ justifyContent: "center", display: "flex" }}
            >
              <SecureComponent
                resource={[
                  bucketName,
                  currentItem,
                  [bucketName, actualInfo.name].join("/"),
                ]}
                scopes={[
                  IAM_SCOPES.S3_DELETE_OBJECT,
                  IAM_SCOPES.S3_DELETE_ACTIONS,
                ]}
                errorProps={{ disabled: true }}
              >
                <Button
                  id={"delete-element-click"}
                  icon={<DeleteIcon />}
                  iconLocation={"start"}
                  fullWidth
                  variant={"secondary"}
                  onClick={() => {
                    setDeleteOpen(true);
                  }}
                  disabled={
                    selectedVersion === "" && actualInfo.is_delete_marker
                  }
                  sx={{
                    width: "calc(100% - 44px)",
                    margin: "8px 0",
                  }}
                  label={`Delete${selectedVersion !== "" ? " version" : ""}`}
                />
              </SecureComponent>
            </Grid>
          </TooltipWrapper>
          <SimpleHeader icon={<ObjectInfoIcon />} label={"Object Info"} />
          <Box className={"detailContainer"}>
            <strong>Name:</strong>
            <br />
            <div style={{ overflowWrap: "break-word" }}>{objectName}</div>
          </Box>
          {selectedVersion !== "" && (
            <Box className={"detailContainer"}>
              <strong>Version ID:</strong>
              <br />
              {selectedVersion}
            </Box>
          )}
          <Box className={"detailContainer"}>
            <strong>Size:</strong>
            <br />
            {niceBytes(`${actualInfo.size || "0"}`)}
          </Box>
          {actualInfo.version_id &&
            actualInfo.version_id !== "null" &&
            selectedVersion === "" && (
              <Box className={"detailContainer"}>
                <strong>Versions:</strong>
                <br />
                {versions.length} version{versions.length !== 1 ? "s" : ""},{" "}
                {niceBytesInt(totalVersionsSize)}
              </Box>
            )}
          {selectedVersion === "" && (
            <Box className={"detailContainer"}>
              <strong>Last Modified:</strong>
              <br />
              {calculateLastModifyTime(actualInfo.last_modified || "")}
            </Box>
          )}
          <Box className={"detailContainer"}>
            <strong>ETAG:</strong>
            <br />
            {actualInfo.etag || "N/A"}
          </Box>
          <Box className={"detailContainer"}>
            <strong>Tags:</strong>
            <br />
            {tagKeys.length === 0
              ? "N/A"
              : tagKeys.map((tagKey, index) => {
                  return (
                    <span key={`key-vs-${index.toString()}`}>
                      {tagKey}:{get(actualInfo, `tags.${tagKey}`, "")}
                      {index < tagKeys.length - 1 ? ", " : ""}
                    </span>
                  );
                })}
          </Box>
          <Box className={"detailContainer"}>
            <SecureComponent
              scopes={[
                IAM_SCOPES.S3_GET_OBJECT_LEGAL_HOLD,
                IAM_SCOPES.S3_GET_ACTIONS,
              ]}
              resource={bucketName}
            >
              <Fragment>
                <strong>Legal Hold:</strong>
                <br />
                {actualInfo.legal_hold_status ? "On" : "Off"}
              </Fragment>
            </SecureComponent>
          </Box>
          <Box className={"detailContainer"}>
            <SecureComponent
              scopes={[
                IAM_SCOPES.S3_GET_OBJECT_RETENTION,
                IAM_SCOPES.S3_GET_ACTIONS,
              ]}
              resource={bucketName}
            >
              <Fragment>
                <strong>Retention Policy:</strong>
                <br />
                <span className={"capitalizeFirst"}>
                  {actualInfo.version_id && actualInfo.version_id !== "null" ? (
                    <Fragment>
                      {actualInfo.retention_mode
                        ? actualInfo.retention_mode.toLowerCase()
                        : "None"}
                    </Fragment>
                  ) : (
                    <Fragment>
                      {actualInfo.retention_mode
                        ? actualInfo.retention_mode.toLowerCase()
                        : "None"}
                    </Fragment>
                  )}
                </span>
              </Fragment>
            </SecureComponent>
          </Box>
          {!actualInfo.is_delete_marker && (
            <Fragment>
              <SimpleHeader label={"Metadata"} icon={<MetadataIcon />} />
              <Box className={"detailContainer"}>
                {actualInfo && metaData ? (
                  <ObjectMetaData metaData={metaData} />
                ) : null}
              </Box>
            </Fragment>
          )}
        </Box>
      )}
    </Fragment>
  );
};

export default ObjectDetailPanel;
