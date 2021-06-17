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

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import get from "lodash/get";
import * as reactMoment from "react-moment";
import clsx from "clsx";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import ShareFile from "./ShareFile";
import {
  actionsTray,
  containerForHeader,
  searchField,
} from "../../../../Common/FormComponents/common/styleLibrary";
import { IFileInfo } from "./types";
import {
  removeRouteLevel,
  fileIsBeingPrepared,
  fileDownloadStarted,
} from "../../../../ObjectBrowser/actions";
import {
  ObjectBrowserReducer,
  Route,
} from "../../../../ObjectBrowser/reducers";
import { download } from "../utils";
import history from "../../../../../../history";
import api from "../../../../../../common/api";
import PageHeader from "../../../../Common/PageHeader/PageHeader";
import ShareIcon from "../../../../../../icons/ShareIcon";
import DownloadIcon from "../../../../../../icons/DownloadIcon";
import DeleteIcon from "../../../../../../icons/DeleteIcon";
import TableWrapper from "../../../../Common/TableWrapper/TableWrapper";
import PencilIcon from "../../../../Common/TableWrapper/TableActionIcons/PencilIcon";
import SetRetention from "./SetRetention";
import BrowserBreadcrumbs from "../../../../ObjectBrowser/BrowserBreadcrumbs";
import DeleteObject from "../ListObjects/DeleteObject";
import AddTagModal from "./AddTagModal";
import DeleteTagModal from "./DeleteTagModal";
import SetLegalHoldModal from "./SetLegalHoldModal";
import {
  setSnackBarMessage,
  setErrorSnackMessage,
} from "../../../../../../actions";
import { CircularProgress } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    objectNameContainer: {
      marginBottom: 8,
    },
    objectPathContainer: {
      marginBottom: 26,
      fontSize: 10,
    },
    objectPathLink: {
      "&:visited": {
        color: "#000",
      },
    },
    objectName: {
      fontSize: 24,
    },
    propertiesContainer: {
      display: "flex",
      flexDirection: "row",
      marginBottom: 15,
    },
    propertiesItem: {
      display: "flex",
      flexDirection: "row",
      marginRight: 21,
    },
    propertiesItemBold: {
      fontWeight: 700,
    },
    propertiesValue: {
      marginLeft: 8,
      textTransform: "capitalize",
    },
    propertiesIcon: {
      marginLeft: 5,
    },
    actionsIconContainer: {
      marginLeft: 12,
    },
    actionsIcon: {
      height: 16,
      width: 16,
      "& .MuiSvgIcon-root": {
        height: 16,
      },
    },
    tagsContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 15,
    },
    tagText: {
      marginRight: 13,
    },
    tag: {
      marginRight: 6,
      fontSize: 10,
      fontWeight: 700,
      "&.MuiChip-sizeSmall": {
        height: 18,
      },
      "& .MuiSvgIcon-root": {
        height: 10,
        width: 10,
      },
    },
    search: {
      marginBottom: 8,
      "&.MuiFormControl-root": {
        marginRight: 0,
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
    ...actionsTray,
    ...searchField,
    ...containerForHeader(theme.spacing(4)),
  });

interface IObjectDetailsProps {
  classes: any;
  routesList: Route[];
  downloadingFiles: string[];
  rewindEnabled: boolean;
  rewindDate: any;
  bucketToRewind: string;
  removeRouteLevel: (newRoute: string) => any;
  setErrorSnackMessage: typeof setErrorSnackMessage;
  setSnackBarMessage: typeof setSnackBarMessage;
  fileIsBeingPrepared: typeof fileIsBeingPrepared;
  fileDownloadStarted: typeof fileDownloadStarted;
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

const ObjectDetails = ({
  classes,
  routesList,
  downloadingFiles,
  rewindEnabled,
  rewindDate,
  bucketToRewind,
  removeRouteLevel,
  setErrorSnackMessage,
  setSnackBarMessage,
  fileIsBeingPrepared,
  fileDownloadStarted,
}: IObjectDetailsProps) => {
  const [loadObjectData, setLoadObjectData] = useState<boolean>(true);
  const [shareFileModalOpen, setShareFileModalOpen] = useState<boolean>(false);
  const [retentionModalOpen, setRetentionModalOpen] = useState<boolean>(false);
  const [tagModalOpen, setTagModalOpen] = useState<boolean>(false);
  const [deleteTagModalOpen, setDeleteTagModalOpen] = useState<boolean>(false);
  const [selectedTag, setSelectedTag] = useState<string[]>(["", ""]);
  const [legalholdOpen, setLegalholdOpen] = useState<boolean>(false);
  const [actualInfo, setActualInfo] = useState<IFileInfo>(emptyFile);
  const [versions, setVersions] = useState<IFileInfo[]>([]);
  const [filterVersion, setFilterVersion] = useState<string>("");
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);

  const currentItem = routesList[routesList.length - 1];
  const allPathData = currentItem.route.split("/");
  const objectName = allPathData[allPathData.length - 1];
  const bucketName = allPathData[2];
  const pathInBucket = allPathData.slice(3).join("/");

  useEffect(() => {
    if (loadObjectData) {
      api
        .invoke(
          "GET",
          `/api/v1/buckets/${bucketName}/objects?prefix=${pathInBucket}&with_versions=true`
        )
        .then((res: IFileInfo[]) => {
          const result = get(res, "objects", []);
          setActualInfo(
            result.find((el: IFileInfo) => el.is_latest) || emptyFile
          );
          setVersions(result.filter((el: IFileInfo) => !el.is_latest));
          setLoadObjectData(false);
        })
        .catch((error) => {
          setErrorSnackMessage(error);
          setLoadObjectData(false);
        });
    }
  }, [loadObjectData, bucketName, pathInBucket, setErrorSnackMessage]);

  let tagKeys: string[] = [];

  if (actualInfo.tags) {
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
    setShareFileModalOpen(false);
  };

  const deleteTag = (tagKey: string, tagLabel: string) => {
    setSelectedTag([tagKey, tagLabel]);
    setDeleteTagModalOpen(true);
  };

  const removeDownloadAnimation = (path: string) => {
    fileDownloadStarted(path);
  };

  const downloadObject = (object: IFileInfo, includeVersion?: boolean) => {
    fileIsBeingPrepared(
      `${bucketName}/${object.name}${
        includeVersion ? `-${object.version_id}` : ""
      }`
    );
    if (object.size && parseInt(object.size) > 104857600) {
      // If file is bigger than 100MB we show a notification
      setSnackBarMessage(
        "Download process started, it may take a few moments to complete"
      );
    }
    download(
      bucketName,
      pathInBucket,
      object.version_id,
      removeDownloadAnimation,
      includeVersion
    );
  };

  const tableActions = [
    { type: "share", onClick: shareObject, sendOnlyId: true },
    {
      type: "download",
      onClick: (item: IFileInfo) => {
        downloadObject(item, true);
      },
      showLoaderFunction: (version: string) => {
        return downloadingFiles.includes(
          `${bucketName}/${objectName}-${version}`
        );
      },
    },
  ];

  const filteredRecords = versions.filter((version) => {
    if (version.version_id) {
      return version.version_id.includes(filterVersion);
    }
    return false;
  });

  const displayParsedDate = (date: string) => {
    return <reactMoment.default>{date}</reactMoment.default>;
  };

  const closeDeleteModal = (redirectBack: boolean) => {
    setDeleteOpen(false);

    if (redirectBack) {
      const newPath = allPathData.slice(0, -1).join("/");

      removeRouteLevel(newPath);
      history.push(newPath);
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

  return (
    <React.Fragment>
      <PageHeader label={"Object Browser"} />
      {shareFileModalOpen && (
        <ShareFile
          open={shareFileModalOpen}
          closeModalAndRefresh={closeShareModal}
          bucketName={bucketName}
          dataObject={actualInfo}
        />
      )}
      {retentionModalOpen && (
        <SetRetention
          open={retentionModalOpen}
          closeModalAndRefresh={closeRetentionModal}
          objectName={objectName}
          objectInfo={actualInfo}
          bucketName={bucketName}
        />
      )}
      {deleteOpen && (
        <DeleteObject
          deleteOpen={deleteOpen}
          selectedBucket={bucketName}
          selectedObject={pathInBucket}
          closeDeleteModalAndRefresh={closeDeleteModal}
        />
      )}
      {tagModalOpen && (
        <AddTagModal
          modalOpen={tagModalOpen}
          currentTags={actualInfo.tags}
          selectedObject={pathInBucket}
          versionId={actualInfo.version_id}
          bucketName={bucketName}
          onCloseAndUpdate={closeAddTagModal}
        />
      )}
      {deleteTagModalOpen && (
        <DeleteTagModal
          deleteOpen={deleteTagModalOpen}
          currentTags={actualInfo.tags}
          selectedObject={pathInBucket}
          versionId={actualInfo.version_id}
          bucketName={bucketName}
          onCloseAndUpdate={closeDeleteTagModal}
          selectedTag={selectedTag}
        />
      )}
      {legalholdOpen && (
        <SetLegalHoldModal
          open={legalholdOpen}
          closeModalAndRefresh={closeLegalholdModal}
          objectName={pathInBucket}
          bucketName={bucketName}
          actualInfo={actualInfo}
        />
      )}
      <Grid container>
        <Grid item xs={12} className={classes.container}>
          <Grid item xs={12} className={classes.obTitleSection}>
            <div>
              <BrowserBreadcrumbs />
            </div>
          </Grid>
          <br />
          <Grid item xs={12} className={classes.propertiesContainer}>
            {actualInfo.version_id && actualInfo.version_id !== "null" && (
              <React.Fragment>
                <div className={classes.propertiesItem}>
                  <div>
                    <span className={classes.propertiesItemBold}>
                      Legal Hold:
                    </span>
                    <span className={classes.propertiesValue}>
                      {actualInfo.legal_hold_status
                        ? actualInfo.legal_hold_status.toLowerCase()
                        : "Off"}
                    </span>
                  </div>
                  <div>
                    <IconButton
                      color="primary"
                      aria-label="legal-hold"
                      size="small"
                      className={classes.propertiesIcon}
                      onClick={() => {
                        setLegalholdOpen(true);
                      }}
                    >
                      <PencilIcon active={true} />
                    </IconButton>
                  </div>
                </div>
                <div className={classes.propertiesItem}>
                  <div>
                    <span className={classes.propertiesItemBold}>
                      Retention:
                    </span>
                    <span className={classes.propertiesValue}>
                      {actualInfo.retention_mode
                        ? actualInfo.retention_mode.toLowerCase()
                        : "Undefined"}
                    </span>
                  </div>
                  <div>
                    <IconButton
                      color="primary"
                      aria-label="retention"
                      size="small"
                      className={classes.propertiesIcon}
                      onClick={() => {
                        openRetentionModal();
                      }}
                    >
                      <PencilIcon active={true} />
                    </IconButton>
                  </div>
                </div>
              </React.Fragment>
            )}
            <div className={classes.propertiesItem}>
              <div className={classes.propertiesItemBold}>File Actions:</div>
              <div className={classes.actionsIconContainer}>
                <IconButton
                  color="primary"
                  aria-label="share"
                  size="small"
                  className={classes.actionsIcon}
                  onClick={() => {
                    shareObject();
                  }}
                >
                  <ShareIcon />
                </IconButton>
              </div>
              <div className={classes.actionsIconContainer}>
                {downloadingFiles.includes(
                  `${bucketName}/${actualInfo.name}`
                ) ? (
                  <div className="progressDetails">
                    <CircularProgress
                      color="primary"
                      size={17}
                      variant="indeterminate"
                    />
                  </div>
                ) : (
                  <IconButton
                    color="primary"
                    aria-label="download"
                    size="small"
                    className={classes.actionsIcon}
                    onClick={() => {
                      downloadObject(actualInfo);
                    }}
                  >
                    <DownloadIcon />
                  </IconButton>
                )}
              </div>
              <div className={classes.actionsIconContainer}>
                <IconButton
                  color="primary"
                  aria-label="delete"
                  size="small"
                  className={classes.actionsIcon}
                  onClick={() => {
                    setDeleteOpen(true);
                  }}
                  disabled={rewindEnabled}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} className={classes.tagsContainer}>
            <div className={classes.tagText}>Tags:</div>
            {tagKeys &&
              tagKeys.map((tagKey, index) => {
                const tag = get(actualInfo, `tags.${tagKey}`, "");
                if (tag !== "") {
                  return (
                    <Chip
                      key={`chip-${index}`}
                      className={classes.tag}
                      size="small"
                      label={`${tagKey} : ${tag}`}
                      color="primary"
                      deleteIcon={<CloseIcon />}
                      onDelete={() => {
                        deleteTag(tagKey, tag);
                      }}
                    />
                  );
                }
                return null;
              })}
            <Chip
              className={classes.tag}
              icon={<AddIcon />}
              clickable
              size="small"
              label="Add tag"
              color="primary"
              variant="outlined"
              onClick={() => {
                setTagModalOpen(true);
              }}
            />
          </Grid>

          <Grid item xs={12} className={classes.actionsTray}>
            {actualInfo.version_id && actualInfo.version_id !== "null" && (
              <TextField
                placeholder={`Search ${objectName}`}
                className={clsx(classes.search, classes.searchField)}
                id="search-resource"
                label=""
                onChange={(val) => {
                  setFilterVersion(val.target.value);
                }}
                InputProps={{
                  disableUnderline: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          </Grid>
          <Grid item xs={12}>
            {actualInfo.version_id && actualInfo.version_id !== "null" && (
              <TableWrapper
                itemActions={tableActions}
                columns={[
                  { label: "Version ID", elementKey: "version_id" },
                  {
                    label: "Last Modified",
                    elementKey: "last_modified",
                    renderFunction: displayParsedDate,
                  },
                ]}
                isLoading={false}
                entityName="Versions"
                idField="version_id"
                records={filteredRecords}
              />
            )}
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const mapStateToProps = ({ objectBrowser }: ObjectBrowserReducer) => ({
  downloadingFiles: get(objectBrowser, "downloadingFiles", []),
  rewindEnabled: get(objectBrowser, "rewind.rewindEnabled", false),
  rewindDate: get(objectBrowser, "rewind.dateToRewind", null),
  bucketToRewind: get(objectBrowser, "rewind.bucketToRewind", ""),
});

const mapDispatchToProps = {
  removeRouteLevel,
  setErrorSnackMessage,
  fileIsBeingPrepared,
  fileDownloadStarted,
  setSnackBarMessage,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(withStyles(styles)(ObjectDetails));
