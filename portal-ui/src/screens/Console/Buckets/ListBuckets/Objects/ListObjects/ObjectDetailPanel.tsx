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
import { connect } from "react-redux";
import { Box, LinearProgress } from "@mui/material";
import { withStyles } from "@mui/styles";
import createStyles from "@mui/styles/createStyles";
import get from "lodash/get";
import Grid from "@mui/material/Grid";
import {
  actionsTray,
  buttonsStyles,
  spacingUtils,
  textStyleUtils,
  detailsPanel,
} from "../../../../Common/FormComponents/common/styleLibrary";
import { IFileInfo } from "../ObjectDetails/types";
import { download } from "../utils";
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
import { IAM_SCOPES } from "../../../../../../common/SecureComponent/permissions";
import {
  completeObject,
  setNewObject,
  updateProgress,
} from "../../../../ObjectBrowser/actions";
import { AppState } from "../../../../../../store";
import {
  DisabledIcon,
  NextArrowIcon,
  PreviewIcon,
} from "../../../../../../icons";
import { ShareIcon, DownloadIcon, DeleteIcon } from "../../../../../../icons";
import history from "../../../../../../history";
import api from "../../../../../../common/api";
import ShareFile from "../ObjectDetails/ShareFile";
import SetRetention from "../ObjectDetails/SetRetention";
import DeleteObject from "../ListObjects/DeleteObject";
import AddTagModal from "../ObjectDetails/AddTagModal";
import DeleteTagModal from "../ObjectDetails/DeleteTagModal";
import SetLegalHoldModal from "../ObjectDetails/SetLegalHoldModal";
import RestoreFileVersion from "../ObjectDetails/RestoreFileVersion";
import { SecureComponent } from "../../../../../../common/SecureComponent";
import ObjectTags from "../ObjectDetails/ObjectTags";
import LabelWithIcon from "../../../BucketDetails/SummaryItems/LabelWithIcon";
import PreviewFileModal from "../Preview/PreviewFileModal";
import ObjectActionButton from "./ObjectActionButton";
import ObjectMetaData from "../ObjectDetails/ObjectMetaData";
import EditablePropertyItem from "../../../BucketDetails/SummaryItems/EditablePropertyItem";
import LabelValuePair from "../../../../Common/UsageBarWrapper/LabelValuePair";

const styles = () =>
  createStyles({
    tag: {
      marginRight: 6,
      fontSize: 10,
      fontWeight: 700,
      "&.MuiChip-sizeSmall": {
        height: 18,
      },
      "& .min-icon": {
        height: 10,
        width: 10,
      },
    },
    "@global": {
      ".progressDetails": {
        paddingTop: 3,
        display: "inline-block",
        position: "relative",
        width: 18,
        height: 18,
      },
      ".progressDetails > .MuiCircularProgress-root": {
        position: "absolute",
        left: 0,
        top: 3,
      },
    },
    ...buttonsStyles,
    ...actionsTray,
    ...spacingUtils,
    ...textStyleUtils,
    ...detailsPanel,
  });

interface IObjectDetailPanelProps {
  classes: any;
  internalPaths: string;
  bucketName: string;
  rewindEnabled: boolean;
  rewindDate: any;
  bucketToRewind: string;
  distributedSetup: boolean;
  setErrorSnackMessage: typeof setErrorSnackMessage;
  setSnackBarMessage: typeof setSnackBarMessage;
  setNewObject: typeof setNewObject;
  updateProgress: typeof updateProgress;
  completeObject: typeof completeObject;
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

const ObjectDetailPanel = ({
  classes,
  internalPaths,
  bucketName,
  distributedSetup,
  setErrorSnackMessage,
  setNewObject,
  updateProgress,
  completeObject,
}: IObjectDetailPanelProps) => {
  const [loadObjectData, setLoadObjectData] = useState<boolean>(true);
  const [shareFileModalOpen, setShareFileModalOpen] = useState<boolean>(false);
  const [retentionModalOpen, setRetentionModalOpen] = useState<boolean>(false);
  const [tagModalOpen, setTagModalOpen] = useState<boolean>(false);
  const [deleteTagModalOpen, setDeleteTagModalOpen] = useState<boolean>(false);
  const [selectedTag, setSelectedTag] = useState<string[]>(["", ""]);
  const [legalholdOpen, setLegalholdOpen] = useState<boolean>(false);
  const [actualInfo, setActualInfo] = useState<IFileInfo | null>(null);
  const [objectToShare, setObjectToShare] = useState<IFileInfo | null>(null);
  const [versions, setVersions] = useState<IFileInfo[]>([]);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [restoreVersionOpen, setRestoreVersionOpen] = useState<boolean>(false);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [restoreVersion, setRestoreVersion] = useState<string>("");
  const [totalVersionsSize, setTotalVersionsSize] = useState<number>(0);

  const internalPathsDecoded = decodeFileName(internalPaths) || "";
  const allPathData = internalPathsDecoded.split("/");
  const currentItem = allPathData.pop() || "";

  // calculate object name to display
  let objectNameArray: string[] = [];
  if (actualInfo) {
    objectNameArray = actualInfo.name.split("/");
  }

  useEffect(() => {
    if (bucketName !== "" && internalPaths) {
      setLoadObjectData(true);
    }
  }, [internalPaths, bucketName]);

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
            const tVersionSize = result.reduce(
              (acc: number, currValue: IFileInfo) => {
                if (currValue?.size) {
                  return acc + currValue.size;
                }
                return acc;
              },
              0
            );

            setTotalVersionsSize(tVersionSize);
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

  let tagKeys: string[] = [];

  if (actualInfo && actualInfo.tags) {
    tagKeys = Object.keys(actualInfo.tags);
  }

  const openRetentionModal = () => {
    setRetentionModalOpen(true);
  };

  const closeRetentionModal = (updateInfo: boolean) => {
    setRetentionModalOpen(false);
    if (updateInfo) {
      setLoadObjectData(true);
    }
  };

  const shareObject = () => {
    setShareFileModalOpen(true);
  };

  const closeShareModal = () => {
    setObjectToShare(null);
    setShareFileModalOpen(false);
  };

  const deleteTag = (tagKey: string, tagLabel: string) => {
    setSelectedTag([tagKey, tagLabel]);
    setDeleteTagModalOpen(true);
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

  const closeDeleteModal = (redirectBack: boolean) => {
    setDeleteOpen(false);

    if (redirectBack) {
      const newPath = allPathData.join("/");
      history.push(
        `/buckets/${bucketName}/browse${
          newPath === "" ? "" : `/${encodeFileName(newPath)}`
        }`
      );
    }
  };

  const closeAddTagModal = (reloadObjectData: boolean) => {
    setTagModalOpen(false);
    if (reloadObjectData) {
      setLoadObjectData(true);
    }
  };

  const closeLegalholdModal = (reload: boolean) => {
    setLegalholdOpen(false);
    if (reload) {
      setLoadObjectData(true);
    }
  };

  const closeDeleteTagModal = (reloadObjectData: boolean) => {
    setDeleteTagModalOpen(false);
    if (reloadObjectData) {
      setLoadObjectData(true);
    }
  };

  const closeRestoreModal = (reloadObjectData: boolean) => {
    setRestoreVersionOpen(false);
    setRestoreVersion("");

    if (reloadObjectData) {
      setLoadObjectData(true);
    }
  };

  const closePreviewWindow = () => {
    setPreviewOpen(false);
  };

  const openExtraInfo = () => {
    const newPath = `/buckets/${bucketName}/browse${
      internalPaths !== "" ? `/${internalPaths}` : ``
    }`;

    history.push(newPath);
  };

  if (!actualInfo) {
    return null;
  }

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
      {retentionModalOpen && actualInfo && (
        <SetRetention
          open={retentionModalOpen}
          closeModalAndRefresh={closeRetentionModal}
          objectName={currentItem}
          objectInfo={actualInfo}
          bucketName={bucketName}
        />
      )}
      {deleteOpen && (
        <DeleteObject
          deleteOpen={deleteOpen}
          selectedBucket={bucketName}
          selectedObject={internalPaths}
          closeDeleteModalAndRefresh={closeDeleteModal}
          versioning={distributedSetup}
        />
      )}
      {tagModalOpen && actualInfo && (
        <AddTagModal
          modalOpen={tagModalOpen}
          currentTags={actualInfo.tags}
          selectedObject={internalPaths}
          versionId={actualInfo.version_id}
          bucketName={bucketName}
          onCloseAndUpdate={closeAddTagModal}
        />
      )}
      {deleteTagModalOpen && actualInfo && (
        <DeleteTagModal
          deleteOpen={deleteTagModalOpen}
          currentTags={actualInfo.tags}
          selectedObject={actualInfo.name}
          versionId={actualInfo.version_id}
          bucketName={bucketName}
          onCloseAndUpdate={closeDeleteTagModal}
          selectedTag={selectedTag}
        />
      )}
      {legalholdOpen && actualInfo && (
        <SetLegalHoldModal
          open={legalholdOpen}
          closeModalAndRefresh={closeLegalholdModal}
          objectName={actualInfo.name}
          bucketName={bucketName}
          actualInfo={actualInfo}
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
            version_id: actualInfo.version_id || "null",
            size: parseInt(actualInfo.size || "0"),
            content_type: "",
            last_modified: new Date(actualInfo.last_modified),
          }}
          onClosePreview={closePreviewWindow}
        />
      )}

      {!actualInfo && (
        <Grid item xs={12}>
          <LinearProgress />
        </Grid>
      )}
      <div className={classes.titleLabel}>
        {objectNameArray.length > 0
          ? objectNameArray[objectNameArray.length - 1]
          : actualInfo.name}
      </div>

      <ul className={classes.objectActions}>
        <li>Actions:</li>
        <li>
          <ObjectActionButton
            label={"Download"}
            icon={<DownloadIcon />}
            onClick={() => {
              downloadObject(actualInfo);
            }}
            disabled={actualInfo.is_delete_marker}
          />
        </li>
        <li>
          <ObjectActionButton
            label={"Share"}
            icon={<ShareIcon />}
            onClick={() => {
              shareObject();
            }}
            disabled={actualInfo.is_delete_marker}
          />
        </li>
        <li>
          <ObjectActionButton
            label={"Preview"}
            icon={<PreviewIcon />}
            onClick={() => {
              setPreviewOpen(true);
            }}
            disabled={actualInfo.is_delete_marker}
          />
        </li>
        <SecureComponent
          scopes={[IAM_SCOPES.S3_DELETE_OBJECT]}
          resource={bucketName}
          matchAll
          errorProps={{ disabled: true }}
        >
          <li>
            <ObjectActionButton
              label={"Delete"}
              icon={<DeleteIcon />}
              onClick={() => {
                setDeleteOpen(true);
              }}
              disabled={actualInfo.is_delete_marker}
            />
          </li>
        </SecureComponent>
        <li>
          <ObjectActionButton
            label={"Expand Details"}
            icon={<NextArrowIcon />}
            onClick={() => {
              openExtraInfo();
            }}
          />
        </li>
      </ul>

      <div className={classes.actionsTray}>
        <h1 className={classes.sectionTitle}>Details</h1>
      </div>
      <Box className={classes.detailContainer}>
        <LabelValuePair
          label={"Tags:"}
          value={
            <ObjectTags
              objectInfo={actualInfo}
              tagKeys={tagKeys}
              bucketName={bucketName}
              onDeleteTag={deleteTag}
              onAddTagClick={() => {
                setTagModalOpen(true);
              }}
            />
          }
        />
      </Box>
      <Box className={classes.detailContainer}>
        <SecureComponent
          scopes={[IAM_SCOPES.S3_GET_OBJECT_LEGAL_HOLD]}
          resource={bucketName}
        >
          <LabelValuePair
            label={""}
            value={
              actualInfo.version_id && actualInfo.version_id !== "null" ? (
                <EditablePropertyItem
                  iamScopes={[IAM_SCOPES.S3_PUT_OBJECT_LEGAL_HOLD]}
                  secureCmpProps={{
                    matchAll: false,
                    errorProps: {
                      disabled: true,
                      onClick: null,
                    },
                  }}
                  resourceName={bucketName}
                  property={"Legal Hold:"}
                  value={
                    actualInfo.legal_hold_status
                      ? actualInfo.legal_hold_status.toLowerCase()
                      : "Off"
                  }
                  onEdit={() => {
                    setLegalholdOpen(true);
                  }}
                  isLoading={false}
                />
              ) : (
                <LabelValuePair
                  label={"Legal Hold:"}
                  value={
                    <LabelWithIcon
                      icon={<DisabledIcon />}
                      label={
                        <label className={classes.textMuted}>Disabled</label>
                      }
                    />
                  }
                />
              )
            }
          />
        </SecureComponent>

        <SecureComponent
          scopes={[IAM_SCOPES.S3_GET_OBJECT_RETENTION]}
          resource={bucketName}
        >
          <LabelValuePair
            label={""}
            value={
              actualInfo.version_id && actualInfo.version_id !== "null" ? (
                <EditablePropertyItem
                  iamScopes={[IAM_SCOPES.S3_PUT_OBJECT_RETENTION]}
                  secureCmpProps={{
                    matchAll: false,
                  }}
                  resourceName={bucketName}
                  property={"Retention:"}
                  value={
                    actualInfo.retention_mode
                      ? actualInfo.retention_mode.toLowerCase()
                      : "None"
                  }
                  onEdit={openRetentionModal}
                  isLoading={false}
                />
              ) : (
                <LabelValuePair
                  label={"Retention:"}
                  value={
                    <LabelWithIcon
                      icon={<DisabledIcon />}
                      label={
                        <label className={classes.textMuted}>Disabled</label>
                      }
                    />
                  }
                />
              )
            }
          />
        </SecureComponent>
      </Box>
      <hr className={classes.hrClass} />
      <div className={classes.actionsTray}>
        <h1 className={classes.sectionTitle}>Object Metadata</h1>
      </div>
      <Box className={classes.detailContainer}>
        {actualInfo ? (
          <ObjectMetaData
            bucketName={bucketName}
            internalPaths={internalPaths}
            actualInfo={actualInfo}
            linear
          />
        ) : null}
      </Box>
      <hr className={classes.hrClass} />

      {actualInfo.version_id && actualInfo.version_id !== "null" && (
        <Fragment>
          <div className={classes.actionsTray}>
            <h1 className={classes.sectionTitle}>Versions</h1>
          </div>
          <Box className={classes.detailContainer}>
            <Box className={classes.metadataLinear}>
              <strong>Total available versions</strong>
              <br />
              {versions.length}
            </Box>
            <Box className={classes.metadataLinear}>
              <strong>Versions Stored size:</strong>
              <br />
              {niceBytesInt(totalVersionsSize)}
            </Box>
          </Box>
        </Fragment>
      )}
    </Fragment>
  );
};

const mapStateToProps = ({ objectBrowser, system }: AppState) => ({
  rewindEnabled: get(objectBrowser, "rewind.rewindEnabled", false),
  rewindDate: get(objectBrowser, "rewind.dateToRewind", null),
  bucketToRewind: get(objectBrowser, "rewind.bucketToRewind", ""),
  distributedSetup: get(system, "distributedSetup", false),
});

const mapDispatchToProps = {
  setErrorSnackMessage,
  setSnackBarMessage,
  setNewObject,
  updateProgress,
  completeObject,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(withStyles(styles)(ObjectDetailPanel));
