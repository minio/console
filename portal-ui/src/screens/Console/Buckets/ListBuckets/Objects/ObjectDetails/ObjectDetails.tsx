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

import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import get from "lodash/get";
import * as reactMoment from "react-moment";
import clsx from "clsx";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import {
  CircularProgress,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ShareFile from "./ShareFile";
import {
  actionsTray,
  buttonsStyles,
  containerForHeader,
  hrClass,
  searchField,
} from "../../../../Common/FormComponents/common/styleLibrary";
import { FileInfoResponse, IFileInfo } from "./types";
import { download, extensionPreview } from "../utils";
import history from "../../../../../../history";
import api from "../../../../../../common/api";
import ShareIcon from "../../../../../../icons/ShareIcon";
import DownloadIcon from "../../../../../../icons/DownloadIcon";
import DeleteIcon from "../../../../../../icons/DeleteIcon";
import TableWrapper, {
  ItemActions,
} from "../../../../Common/TableWrapper/TableWrapper";
import { AppState } from "../../../../../../store";
import { ErrorResponseHandler } from "../../../../../../common/types";
import {
  setErrorSnackMessage,
  setSnackBarMessage,
} from "../../../../../../actions";
import { decodeFileName, encodeFileName } from "../../../../../../common/utils";
import { IAM_SCOPES } from "../../../../../../common/SecureComponent/permissions";
import SetRetention from "./SetRetention";
import BrowserBreadcrumbs from "../../../../ObjectBrowser/BrowserBreadcrumbs";
import DeleteObject from "../ListObjects/DeleteObject";
import AddTagModal from "./AddTagModal";
import DeleteTagModal from "./DeleteTagModal";
import SetLegalHoldModal from "./SetLegalHoldModal";
import ScreenTitle from "../../../../Common/ScreenTitle/ScreenTitle";
import EditIcon from "../../../../../../icons/EditIcon";
import SearchIcon from "../../../../../../icons/SearchIcon";
import ObjectBrowserIcon from "../../../../../../icons/ObjectBrowserIcon";
import PreviewFileContent from "../Preview/PreviewFileContent";
import RestoreFileVersion from "./RestoreFileVersion";
import PageLayout from "../../../../Common/Layout/PageLayout";
import VerticalTabs from "../../../../Common/VerticalTabs/VerticalTabs";
import BoxIconButton from "../../../../Common/BoxIconButton/BoxIconButton";
import { RecoverIcon } from "../../../../../../icons";
import SecureComponent from "../../../../../../common/SecureComponent/SecureComponent";

const styles = (theme: Theme) =>
  createStyles({
    currentItemContainer: {
      marginBottom: 8,
    },
    pageContainer: {
      border: "1px solid #EAEAEA",
      height: "100%",
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
    currentItem: {
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
      "& .min-icon": {
        height: 12,
      },
    },
    actionsIconContainer: {
      marginLeft: 12,
    },
    actionsIcon: {
      height: 16,
      width: 16,
      "& .min-icon": {
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
      "& .min-icon": {
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
    paperContainer: {
      padding: 15,
      paddingLeft: 50,
      display: "flex",
    },
    elementTitle: {
      fontWeight: 500,
      color: "#777777",
      fontSize: 14,
      marginTop: -9,
    },
    dualCardLeft: {
      paddingRight: "5px",
    },
    dualCardRight: {
      paddingLeft: "5px",
    },
    capitalizeFirst: {
      textTransform: "capitalize",
      "& .min-icon": {
        width: 16,
        height: 16,
      },
    },
    titleCol: {
      width: "25%",
    },
    titleItem: {
      width: "35%",
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
    ...hrClass,
    ...buttonsStyles,
    ...actionsTray,
    ...searchField,
    ...containerForHeader(theme.spacing(4)),
  });

interface IObjectDetailsProps {
  classes: any;
  downloadingFiles: string[];
  rewindEnabled: boolean;
  rewindDate: any;
  match: any;
  bucketToRewind: string;
  distributedSetup: boolean;
  setErrorSnackMessage: typeof setErrorSnackMessage;
  setSnackBarMessage: typeof setSnackBarMessage;
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
  downloadingFiles,
  rewindEnabled,
  rewindDate,
  distributedSetup,
  match,
  bucketToRewind,
  setErrorSnackMessage,
  setSnackBarMessage,
}: IObjectDetailsProps) => {
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
  const [filterVersion, setFilterVersion] = useState<string>("");
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [metadataLoad, setMetadataLoad] = useState<boolean>(true);
  const [metadata, setMetadata] = useState<any>({});
  const [restoreVersionOpen, setRestoreVersionOpen] = useState<boolean>(false);
  const [restoreVersion, setRestoreVersion] = useState<string>("");

  const internalPaths = get(match.params, "subpaths", "");
  const internalPathsDecoded = decodeFileName(internalPaths) || "";
  const bucketName = match.params["bucketName"];
  const allPathData = internalPathsDecoded.split("/");
  const currentItem = allPathData.pop() || "";

  // calculate object name to display
  let objectNameArray: string[] = [];
  if (actualInfo) {
    objectNameArray = actualInfo.name.split("/");
  }

  useEffect(() => {
    if (loadObjectData) {
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

  useEffect(() => {
    if (metadataLoad) {
      api
        .invoke(
          "GET",
          `/api/v1/buckets/${bucketName}/objects?prefix=${internalPaths}&with_metadata=true`
        )
        .then((res: FileInfoResponse) => {
          const fileData = res.objects[0];
          let metadata = get(fileData, "user_metadata", {});

          setMetadata(metadata);
          setMetadataLoad(false);
        })
        .catch((error: ErrorResponseHandler) => {
          setMetadataLoad(false);
        });
    }
  }, [bucketName, metadataLoad, internalPaths]);

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
    if (object.size && parseInt(object.size) > 104857600) {
      // If file is bigger than 100MB we show a notification
      setSnackBarMessage(
        "Download process started, it may take a few moments to complete"
      );
    }

    download(bucketName, internalPaths, object.version_id);
  };

  const tableActions: ItemActions[] = [
    {
      label: "Share",
      type: "share",
      onClick: (item: any) => {
        setObjectToShare(item);
        shareObject();
      },
      sendOnlyId: false,
      disableButtonFunction: (item: string) => {
        const element = versions.find((elm) => elm.version_id === item);
        if (element && element.is_delete_marker) {
          return true;
        }
        return false;
      },
    },
    {
      label: "Download",
      type: "download",
      onClick: (item: IFileInfo) => {
        downloadObject(item);
      },
      disableButtonFunction: (item: string) => {
        const element = versions.find((elm) => elm.version_id === item);
        if (element && element.is_delete_marker) {
          return true;
        }
        return false;
      },
    },
    {
      label: "Restore",
      type: <RecoverIcon />,
      onClick: (item: IFileInfo) => {
        setRestoreVersion(item.version_id || "");
        setRestoreVersionOpen(true);
      },
      disableButtonFunction: (item: string) => {
        const element = versions.find((elm) => elm.version_id === item);
        return (element && element.is_delete_marker) || false;
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
      setMetadataLoad(true);
    }
  };

  return (
    <React.Fragment>
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

      <PageLayout className={classes.pageContainer}>
        {!actualInfo && (
          <Grid item xs={12}>
            <LinearProgress />
          </Grid>
        )}

        {actualInfo && (
          <Fragment>
            <Grid item xs={12}>
              <ScreenTitle
                icon={
                  <Fragment>
                    <ObjectBrowserIcon width={40} />
                  </Fragment>
                }
                title={
                  objectNameArray.length > 0
                    ? objectNameArray[objectNameArray.length - 1]
                    : actualInfo.name
                }
                subTitle={
                  <Fragment>
                    <BrowserBreadcrumbs
                      bucketName={bucketName}
                      internalPaths={actualInfo.name}
                    />
                  </Fragment>
                }
                actions={
                  <Fragment>
                    <BoxIconButton
                      tooltip={"Share"}
                      color="primary"
                      aria-label="share"
                      onClick={() => {
                        shareObject();
                      }}
                      disabled={actualInfo.is_delete_marker}
                      size="large"
                    >
                      <ShareIcon />
                    </BoxIconButton>

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
                      <BoxIconButton
                        tooltip={"Download"}
                        color="primary"
                        aria-label="download"
                        onClick={() => {
                          downloadObject(actualInfo);
                        }}
                        disabled={actualInfo.is_delete_marker}
                        size="large"
                      >
                        <DownloadIcon />
                      </BoxIconButton>
                    )}
                    <SecureComponent
                      scopes={[IAM_SCOPES.S3_DELETE_OBJECT]}
                      resource={bucketName}
                      matchAll
                    >
                      <BoxIconButton
                        tooltip={"Delete Object"}
                        color="primary"
                        aria-label="delete"
                        onClick={() => {
                          setDeleteOpen(true);
                        }}
                        disabled={actualInfo.is_delete_marker}
                        size="large"
                      >
                        <DeleteIcon />
                      </BoxIconButton>
                    </SecureComponent>
                  </Fragment>
                }
              />
            </Grid>
            <VerticalTabs>
              {{
                tabConfig: {
                  label: "Details",
                },
                content: (
                  <React.Fragment>
                    <div className={classes.actionsTray}>
                      <h1 className={classes.sectionTitle}>Details</h1>
                    </div>
                    <br />
                    <Grid item xs={12}>
                      <table width={"100%"}>
                        <tbody>
                          <SecureComponent
                            scopes={[IAM_SCOPES.S3_GET_OBJECT_LEGAL_HOLD]}
                            resource={bucketName}
                          >
                            <tr>
                              <td className={classes.titleCol}>Legal Hold:</td>
                              <td className={classes.capitalizeFirst}>
                                {actualInfo.version_id &&
                                actualInfo.version_id !== "null" ? (
                                  <Fragment>
                                    {actualInfo.legal_hold_status
                                      ? actualInfo.legal_hold_status.toLowerCase()
                                      : "Off"}
                                    <SecureComponent
                                      scopes={[
                                        IAM_SCOPES.S3_PUT_OBJECT_LEGAL_HOLD,
                                      ]}
                                      resource={bucketName}
                                      matchAll
                                    >
                                      <IconButton
                                        color="primary"
                                        aria-label="legal-hold"
                                        size="small"
                                        className={classes.propertiesIcon}
                                        onClick={() => {
                                          setLegalholdOpen(true);
                                        }}
                                      >
                                        <EditIcon />
                                      </IconButton>
                                    </SecureComponent>
                                  </Fragment>
                                ) : (
                                  "Disabled"
                                )}
                              </td>
                            </tr>
                          </SecureComponent>
                          <SecureComponent
                            scopes={[IAM_SCOPES.S3_GET_OBJECT_RETENTION]}
                            resource={bucketName}
                          >
                            <tr>
                              <td className={classes.titleCol}>Retention:</td>
                              <td className={classes.capitalizeFirst}>
                                {actualInfo.retention_mode
                                  ? actualInfo.retention_mode.toLowerCase()
                                  : "None"}
                                <SecureComponent
                                  scopes={[IAM_SCOPES.S3_PUT_OBJECT_RETENTION]}
                                  resource={bucketName}
                                  matchAll
                                >
                                  <IconButton
                                    color="primary"
                                    aria-label="retention"
                                    size="small"
                                    className={classes.propertiesIcon}
                                    onClick={() => {
                                      openRetentionModal();
                                    }}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </SecureComponent>
                              </td>
                            </tr>
                          </SecureComponent>
                          <SecureComponent
                            scopes={[IAM_SCOPES.S3_GET_OBJECT_TAGGING]}
                            resource={bucketName}
                          >
                            <tr>
                              <td className={classes.titleCol}>Tags:</td>
                              <td>
                                {tagKeys &&
                                  tagKeys.map((tagKey, index) => {
                                    const tag = get(
                                      actualInfo,
                                      `tags.${tagKey}`,
                                      ""
                                    );
                                    if (tag !== "") {
                                      return (
                                        <SecureComponent
                                          scopes={[
                                            IAM_SCOPES.S3_DELETE_OBJECT_TAGGING,
                                          ]}
                                          resource={bucketName}
                                          matchAll
                                          errorProps={{
                                            deleteIcon: null,
                                            onDelete: null,
                                          }}
                                        >
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
                                        </SecureComponent>
                                      );
                                    }
                                    return null;
                                  })}
                                <SecureComponent
                                  scopes={[IAM_SCOPES.S3_PUT_OBJECT_TAGGING]}
                                  resource={bucketName}
                                  matchAll
                                >
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
                                </SecureComponent>
                              </td>
                            </tr>
                          </SecureComponent>
                        </tbody>
                      </table>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid item xs={12}>
                        <h2>Object Metadata</h2>
                        <hr className={classes.hr} />
                      </Grid>

                      <Grid item xs={12}>
                        <Table
                          className={classes.table}
                          aria-label="simple table"
                        >
                          <TableBody>
                            {Object.keys(metadata).map((element, index) => {
                              return (
                                <TableRow key={`tRow-${index.toString()}`}>
                                  <TableCell
                                    component="th"
                                    scope="row"
                                    className={classes.titleItem}
                                  >
                                    {element}
                                  </TableCell>
                                  <TableCell align="right">
                                    {metadata[element]}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </Grid>
                    </Grid>
                  </React.Fragment>
                ),
              }}
              {{
                tabConfig: {
                  label: "Versions",
                  disabled: !(
                    actualInfo.version_id && actualInfo.version_id !== "null"
                  ),
                },
                content: (
                  <Fragment>
                    <div className={classes.actionsTray}>
                      <h1 className={classes.sectionTitle}>Versions</h1>
                    </div>
                    <br />
                    <Grid item xs={12} className={classes.actionsTray}>
                      {actualInfo.version_id &&
                        actualInfo.version_id !== "null" && (
                          <TextField
                            placeholder={`Search ${currentItem}`}
                            className={clsx(
                              classes.search,
                              classes.searchField
                            )}
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
                            variant="standard"
                          />
                        )}
                    </Grid>
                    <Grid item xs={12}>
                      {actualInfo.version_id &&
                        actualInfo.version_id !== "null" && (
                          <TableWrapper
                            itemActions={tableActions}
                            columns={[
                              {
                                label: "",
                                width: 40,
                                renderFullObject: true,
                                renderFunction: (r) => {
                                  const versOrd =
                                    versions.length - versions.indexOf(r);
                                  return `v${versOrd}`;
                                },
                                elementKey: "version_id",
                              },
                              { label: "Version ID", elementKey: "version_id" },
                              {
                                label: "Last Modified",
                                elementKey: "last_modified",
                                renderFunction: displayParsedDate,
                              },
                              {
                                label: "Deleted",
                                width: 60,
                                contentTextAlign: "center",
                                renderFullObject: true,
                                elementKey: "is_delete_marker",
                                renderFunction: (r) => {
                                  const versOrd = r.is_delete_marker
                                    ? "Yes"
                                    : "No";
                                  return `${versOrd}`;
                                },
                              },
                            ]}
                            isLoading={false}
                            entityName="Versions"
                            idField="version_id"
                            records={filteredRecords}
                            textSelectable
                          />
                        )}
                    </Grid>
                  </Fragment>
                ),
              }}
              {{
                tabConfig: {
                  label: "Preview",
                  disabled: extensionPreview(currentItem) === "none",
                },
                content: (
                  <React.Fragment>
                    {actualInfo && (
                      <PreviewFileContent
                        bucketName={bucketName}
                        object={{
                          name: actualInfo.name,
                          version_id: actualInfo.version_id || "null",
                          size: parseInt(actualInfo.size || "0"),
                          content_type: "",
                          last_modified: new Date(actualInfo.last_modified),
                        }}
                        isFullscreen
                      />
                    )}
                  </React.Fragment>
                ),
              }}
            </VerticalTabs>
          </Fragment>
        )}
      </PageLayout>
    </React.Fragment>
  );
};

const mapStateToProps = ({ objectBrowser, system }: AppState) => ({
  downloadingFiles: get(objectBrowser, "downloadingFiles", []),
  rewindEnabled: get(objectBrowser, "rewind.rewindEnabled", false),
  rewindDate: get(objectBrowser, "rewind.dateToRewind", null),
  bucketToRewind: get(objectBrowser, "rewind.bucketToRewind", ""),
  distributedSetup: get(system, "distributedSetup", false),
});

const mapDispatchToProps = {
  setErrorSnackMessage,
  setSnackBarMessage,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default withRouter(connector(withStyles(styles)(ObjectDetails)));
