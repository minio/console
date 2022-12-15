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

import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { Theme } from "@mui/material/styles";
import { Button } from "mds";
import createStyles from "@mui/styles/createStyles";
import Grid from "@mui/material/Grid";
import get from "lodash/get";
import api from "../../../../../../common/api";
import {
  decodeURLString,
  encodeURLString,
  niceBytesInt,
} from "../../../../../../common/utils";

import {
  actionsTray,
  containerForHeader,
  objectBrowserCommon,
  objectBrowserExtras,
  searchField,
  tableStyles,
} from "../../../../Common/FormComponents/common/styleLibrary";
import { Badge } from "@mui/material";
import BrowserBreadcrumbs from "../../../../ObjectBrowser/BrowserBreadcrumbs";
import { extensionPreview } from "../utils";
import { BucketInfo, BucketQuota } from "../../../types";
import { ErrorResponseHandler } from "../../../../../../common/types";

import ScreenTitle from "../../../../Common/ScreenTitle/ScreenTitle";

import { AppState, useAppDispatch } from "../../../../../../store";
import PageLayout from "../../../../Common/Layout/PageLayout";
import {
  IAM_SCOPES,
  permissionTooltipHelper,
} from "../../../../../../common/SecureComponent/permissions";
import {
  hasPermission,
  SecureComponent,
} from "../../../../../../common/SecureComponent";
import withSuspense from "../../../../Common/Components/withSuspense";
import {
  BucketsIcon,
  DownloadIcon,
  PreviewIcon,
  ShareIcon,
} from "../../../../../../icons";
import UploadFilesButton from "../../UploadFilesButton";
import DetailsListPanel from "./DetailsListPanel";
import ObjectDetailPanel from "./ObjectDetailPanel";
import ActionsListSection from "./ActionsListSection";
import VersionsNavigator from "../ObjectDetails/VersionsNavigator";
import CheckboxWrapper from "../../../../Common/FormComponents/CheckboxWrapper/CheckboxWrapper";

import {
  setErrorSnackMessage,
  setSnackBarMessage,
} from "../../../../../../systemSlice";

import {
  makeid,
  removeTrace,
  storeCallForObjectWithID,
  storeFormDataWithID,
} from "../../../../ObjectBrowser/transferManager";
import {
  cancelObjectInList,
  completeObject,
  failObject,
  openList,
  resetMessages,
  resetRewind,
  setDownloadRenameModal,
  setLoadingObjects,
  setLoadingRecords,
  setLoadingVersions,
  setNewObject,
  setObjectDetailsView,
  setPreviewOpen,
  setSearchObjects,
  setSelectedObjects,
  setSelectedObjectView,
  setSelectedPreview,
  setShareFileModalOpen,
  setShowDeletedObjects,
  setVersionsModeEnabled,
  updateProgress,
} from "../../../../ObjectBrowser/objectBrowserSlice";
import makeStyles from "@mui/styles/makeStyles";
import {
  selBucketDetailsInfo,
  selBucketDetailsLoading,
  setBucketDetailsLoad,
  setBucketInfo,
} from "../../../BucketDetails/bucketDetailsSlice";
import RenameLongFileName from "../../../../ObjectBrowser/RenameLongFilename";
import TooltipWrapper from "../../../../Common/TooltipWrapper/TooltipWrapper";
import ListObjectsTable from "./ListObjectsTable";
import {
  downloadSelected,
  openPreview,
  openShare,
} from "../../../../ObjectBrowser/objectBrowserThunks";

const HistoryIcon = React.lazy(
  () => import("../../../../../../icons/HistoryIcon")
);
const RefreshIcon = React.lazy(
  () => import("../../../../../../icons/RefreshIcon")
);

const DeleteIcon = React.lazy(
  () => import("../../../../../../icons/DeleteIcon")
);

const DeleteMultipleObjects = withSuspense(
  React.lazy(() => import("./DeleteMultipleObjects"))
);
const ShareFile = withSuspense(
  React.lazy(() => import("../ObjectDetails/ShareFile"))
);
const RewindEnable = withSuspense(React.lazy(() => import("./RewindEnable")));
const PreviewFileModal = withSuspense(
  React.lazy(() => import("../Preview/PreviewFileModal"))
);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    badgeOverlap: {
      "& .MuiBadge-badge": {
        top: 10,
        right: 1,
        width: 5,
        height: 5,
        minWidth: 5,
      },
    },
    screenTitle: {
      borderBottom: 0,
      paddingTop: 0,
      paddingLeft: 0,
      paddingRight: 0,
    },
    ...tableStyles,
    ...actionsTray,
    ...searchField,

    searchField: {
      ...searchField.searchField,
      maxWidth: 380,
    },
    screenTitleContainer: {
      border: "#EAEDEE 1px solid",
      padding: "0.8rem 15px 0",
    },
    labelStyle: {
      color: "#969FA8",
      fontSize: "12px",
    },
    breadcrumbsContainer: {
      padding: "12px 14px 5px",
    },
    fullContainer: {
      position: "relative",
      "@media (max-width: 799px)": {
        width: 0,
      },
    },
    hideListOnSmall: {
      "@media (max-width: 799px)": {
        display: "none",
      },
    },
    ...objectBrowserExtras,
    ...objectBrowserCommon,
    ...containerForHeader(theme.spacing(4)),
  })
);

const baseDnDStyle = {
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  outline: "none",
};

const activeDnDStyle = {
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  borderColor: "#2196f3",
};

const acceptDnDStyle = {
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  borderColor: "#00e676",
};

const ListObjects = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const rewindEnabled = useSelector(
    (state: AppState) => state.objectBrowser.rewind.rewindEnabled
  );
  const bucketToRewind = useSelector(
    (state: AppState) => state.objectBrowser.rewind.bucketToRewind
  );
  const versionsMode = useSelector(
    (state: AppState) => state.objectBrowser.versionsMode
  );

  const showDeleted = useSelector(
    (state: AppState) => state.objectBrowser.showDeleted
  );
  const detailsOpen = useSelector(
    (state: AppState) => state.objectBrowser.objectDetailsOpen
  );
  const selectedInternalPaths = useSelector(
    (state: AppState) => state.objectBrowser.selectedInternalPaths
  );
  const loadingObjects = useSelector(
    (state: AppState) => state.objectBrowser.loadingObjects
  );
  const simplePath = useSelector(
    (state: AppState) => state.objectBrowser.simplePath
  );

  const isVersioned = useSelector(
    (state: AppState) => state.objectBrowser.isVersioned
  );
  const lockingEnabled = useSelector(
    (state: AppState) => state.objectBrowser.lockingEnabled
  );
  const downloadRenameModal = useSelector(
    (state: AppState) => state.objectBrowser.downloadRenameModal
  );
  const selectedPreview = useSelector(
    (state: AppState) => state.objectBrowser.selectedPreview
  );
  const shareFileModalOpen = useSelector(
    (state: AppState) => state.objectBrowser.shareFileModalOpen
  );
  const previewOpen = useSelector(
    (state: AppState) => state.objectBrowser.previewOpen
  );

  const loadingBucket = useSelector(selBucketDetailsLoading);
  const bucketInfo = useSelector(selBucketDetailsInfo);

  const [deleteMultipleOpen, setDeleteMultipleOpen] = useState<boolean>(false);
  const [rewindSelect, setRewindSelect] = useState<boolean>(false);
  const [iniLoad, setIniLoad] = useState<boolean>(false);
  const [canShareFile, setCanShareFile] = useState<boolean>(false);
  const [canPreviewFile, setCanPreviewFile] = useState<boolean>(false);
  const [quota, setQuota] = useState<BucketQuota | null>(null);

  const bucketName = params.bucketName || "";

  const pathSegment = location.pathname.split(`/browser/${bucketName}/`);
  const internalPaths = pathSegment.length === 2 ? pathSegment[1] : "";

  const pageTitle = decodeURLString(internalPaths);
  const currentPath = pageTitle.split("/").filter((i: string) => i !== "");

  let uploadPath = [bucketName];
  if (currentPath.length > 0) {
    uploadPath = uploadPath.concat(currentPath);
  }

  const fileUpload = useRef<HTMLInputElement>(null);
  const folderUpload = useRef<HTMLInputElement>(null);

  const canDownload = hasPermission(bucketName, [IAM_SCOPES.S3_GET_OBJECT]);
  const canDelete = hasPermission(bucketName, [IAM_SCOPES.S3_DELETE_OBJECT]);
  const canUpload = hasPermission(
    uploadPath,
    [IAM_SCOPES.S3_PUT_OBJECT],
    true,
    true
  );

  const displayDeleteObject = hasPermission(bucketName, [
    IAM_SCOPES.S3_DELETE_OBJECT,
  ]);
  const selectedObjects = useSelector(
    (state: AppState) => state.objectBrowser.selectedObjects
  );

  useEffect(() => {
    dispatch(setSearchObjects(""));
    dispatch(setLoadingObjects(true));
    dispatch(setSelectedObjects([]));
  }, [simplePath, dispatch]);

  useEffect(() => {
    if (rewindEnabled) {
      if (bucketToRewind !== bucketName) {
        dispatch(resetRewind());
        return;
      }
    }
  }, [rewindEnabled, bucketToRewind, bucketName, dispatch]);

  // END OF WS HANDLERS

  useEffect(() => {
    if (folderUpload.current !== null) {
      folderUpload.current.setAttribute("directory", "");
      folderUpload.current.setAttribute("webkitdirectory", "");
    }
  }, [folderUpload]);

  useEffect(() => {
    if (selectedObjects.length === 1) {
      const objectName = selectedObjects[0];

      if (extensionPreview(objectName) !== "none") {
        setCanPreviewFile(true);
      } else {
        setCanPreviewFile(false);
      }

      if (objectName.endsWith("/")) {
        setCanShareFile(false);
      } else {
        setCanShareFile(true);
      }
    } else {
      setCanShareFile(false);
      setCanPreviewFile(false);
    }
  }, [selectedObjects]);

  useEffect(() => {
    if (!quota) {
      api
        .invoke("GET", `/api/v1/buckets/${bucketName}/quota`)
        .then((res: BucketQuota) => {
          let quotaVals = null;

          if (res.quota) {
            quotaVals = res;
          }

          setQuota(quotaVals);
        })
        .catch((err) => {
          console.error("Error Getting Quota Status: ", err.detailedError);
          setQuota(null);
        });
    }
  }, [quota, bucketName]);

  useEffect(() => {
    if (selectedObjects.length > 0) {
      dispatch(setObjectDetailsView(true));
      return;
    }

    if (
      selectedObjects.length === 0 &&
      selectedInternalPaths === null &&
      !loadingObjects
    ) {
      dispatch(setObjectDetailsView(false));
    }
  }, [selectedObjects, selectedInternalPaths, dispatch, loadingObjects]);

  useEffect(() => {
    if (!iniLoad) {
      dispatch(setBucketDetailsLoad(true));
      setIniLoad(true);
    }
  }, [iniLoad, dispatch, setIniLoad]);

  // bucket info
  useEffect(() => {
    if (loadingBucket) {
      api
        .invoke("GET", `/api/v1/buckets/${bucketName}`)
        .then((res: BucketInfo) => {
          dispatch(setBucketDetailsLoad(false));
          dispatch(setBucketInfo(res));
        })
        .catch((err: ErrorResponseHandler) => {
          dispatch(setBucketDetailsLoad(false));
          dispatch(setErrorSnackMessage(err));
        });
    }
  }, [bucketName, loadingBucket, dispatch]);

  const closeDeleteMultipleModalAndRefresh = (refresh: boolean) => {
    setDeleteMultipleOpen(false);

    if (refresh) {
      dispatch(setSnackBarMessage(`Objects deleted successfully.`));
      dispatch(setSelectedObjects([]));
      dispatch(setLoadingObjects(true));
    }
  };

  const handleUploadButton = (e: any) => {
    if (
      e === null ||
      e === undefined ||
      e.target.files === null ||
      e.target.files === undefined
    ) {
      return;
    }
    e.preventDefault();
    var newFiles: File[] = [];

    for (var i = 0; i < e.target.files.length; i++) {
      newFiles.push(e.target.files[i]);
    }
    uploadObject(newFiles, "");

    e.target.value = "";
  };

  const uploadObject = useCallback(
    (files: File[], folderPath: string): void => {
      let pathPrefix = "";
      if (simplePath) {
        pathPrefix = simplePath.endsWith("/") ? simplePath : simplePath + "/";
      }

      const upload = (
        files: File[],
        bucketName: string,
        path: string,
        folderPath: string
      ) => {
        let uploadPromise = (file: File) => {
          return new Promise((resolve, reject) => {
            let uploadUrl = `api/v1/buckets/${bucketName}/objects/upload`;
            const fileName = file.name;

            const blobFile = new Blob([file], { type: file.type });

            let encodedPath = "";

            const filePath = get(file, "path", "");
            const fileWebkitRelativePath = get(file, "webkitRelativePath", "");

            let relativeFolderPath = folderPath;
            const ID = makeid(8);

            // File was uploaded via drag & drop
            if (filePath !== "") {
              relativeFolderPath = filePath;
            } else if (fileWebkitRelativePath !== "") {
              // File was uploaded using upload button
              relativeFolderPath = fileWebkitRelativePath;
            }

            if (path !== "" || relativeFolderPath !== "") {
              const finalFolderPath = relativeFolderPath
                .split("/")
                .slice(0, -1)
                .join("/");

              const pathClean = path.endsWith("/") ? path.slice(0, -1) : path;

              encodedPath = encodeURLString(
                `${pathClean}${
                  !pathClean.endsWith("/") &&
                  finalFolderPath !== "" &&
                  !finalFolderPath.startsWith("/")
                    ? "/"
                    : ""
                }${finalFolderPath}${
                  !finalFolderPath.endsWith("/") ||
                  (finalFolderPath.trim() === "" && !path.endsWith("/"))
                    ? "/"
                    : ""
                }`
              );
            }

            if (encodedPath !== "") {
              uploadUrl = `${uploadUrl}?prefix=${encodedPath}`;
            }

            const identity = encodeURLString(
              `${bucketName}-${encodedPath}-${new Date().getTime()}-${Math.random()}`
            );

            let xhr = new XMLHttpRequest();
            xhr.open("POST", uploadUrl, true);

            const areMultipleFiles = files.length > 1;
            let errorMessage = `An error occurred while uploading the file${
              areMultipleFiles ? "s" : ""
            }.`;

            const errorMessages: any = {
              413: "Error - File size too large",
            };

            xhr.withCredentials = false;
            xhr.onload = function (event) {
              // resolve promise only when HTTP code is ok
              if (xhr.status >= 200 && xhr.status < 300) {
                dispatch(completeObject(identity));
                resolve({ status: xhr.status });

                removeTrace(ID);
              } else {
                // reject promise if there was a server error
                if (errorMessages[xhr.status]) {
                  errorMessage = errorMessages[xhr.status];
                } else if (xhr.response) {
                  try {
                    const err = JSON.parse(xhr.response);
                    errorMessage = err.detailedMessage;
                  } catch (e) {
                    errorMessage = "something went wrong";
                  }
                }

                dispatch(
                  failObject({
                    instanceID: identity,
                    msg: errorMessage,
                  })
                );
                reject({ status: xhr.status, message: errorMessage });

                removeTrace(ID);
              }
            };

            xhr.upload.addEventListener("error", (event) => {
              reject(errorMessage);
              dispatch(
                failObject({
                  instanceID: identity,
                  msg: "A network error occurred.",
                })
              );
              return;
            });

            xhr.upload.addEventListener("progress", (event) => {
              const progress = Math.floor((event.loaded * 100) / event.total);

              dispatch(
                updateProgress({
                  instanceID: identity,
                  progress: progress,
                })
              );
            });

            xhr.onerror = () => {
              reject(errorMessage);
              dispatch(
                failObject({
                  instanceID: identity,
                  msg: "A network error occurred.",
                })
              );
              return;
            };
            xhr.onloadend = () => {
              if (files.length === 0) {
                dispatch(setLoadingObjects(true));
              }
            };
            xhr.onabort = () => {
              dispatch(cancelObjectInList(identity));
            };

            const formData = new FormData();
            if (file.size !== undefined) {
              formData.append(file.size.toString(), blobFile, fileName);
              storeCallForObjectWithID(ID, xhr);
              dispatch(
                setNewObject({
                  ID,
                  bucketName,
                  done: false,
                  instanceID: identity,
                  percentage: 0,
                  prefix: `${decodeURLString(encodedPath)}${fileName}`,
                  type: "upload",
                  waitingForFile: false,
                  failed: false,
                  cancelled: false,
                  errorMessage: "",
                })
              );

              storeFormDataWithID(ID, formData);
              storeCallForObjectWithID(ID, xhr);
            }
          });
        };

        const uploadFilePromises: any = [];
        // open object manager
        dispatch(openList());
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          uploadFilePromises.push(uploadPromise(file));
        }
        Promise.allSettled(uploadFilePromises).then((results: Array<any>) => {
          const errors = results.filter(
            (result) => result.status === "rejected"
          );
          if (errors.length > 0) {
            const totalFiles = uploadFilePromises.length;
            const successUploadedFiles =
              uploadFilePromises.length - errors.length;
            const err: ErrorResponseHandler = {
              errorMessage: "There were some errors during file upload",
              detailedError: `Uploaded files ${successUploadedFiles}/${totalFiles}`,
            };
            dispatch(setErrorSnackMessage(err));
          }
          // We force objects list reload after all promises were handled
          dispatch(setLoadingObjects(true));
          dispatch(setSelectedObjects([]));
        });
      };

      upload(files, bucketName, pathPrefix, folderPath);
    },
    [bucketName, dispatch, simplePath]
  );

  const onDrop = useCallback(
    (acceptedFiles: any[]) => {
      if (acceptedFiles && acceptedFiles.length > 0 && canUpload) {
        let newFolderPath: string = acceptedFiles[0].path;
        uploadObject(acceptedFiles, newFolderPath);
      }
      if (!canUpload) {
        dispatch(
          setErrorSnackMessage({
            errorMessage: "Upload not allowed",
            detailedError: permissionTooltipHelper(
              [IAM_SCOPES.S3_PUT_OBJECT],
              "upload objects to this location"
            ),
          })
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [uploadObject]
  );

  const { getRootProps, getInputProps, isDragActive, isDragAccept } =
    useDropzone({
      noClick: true,
      onDrop,
    });

  const dndStyles = useMemo(
    () => ({
      ...baseDnDStyle,
      ...(isDragActive ? activeDnDStyle : {}),
      ...(isDragAccept ? acceptDnDStyle : {}),
    }),
    [isDragActive, isDragAccept]
  );

  const closeShareModal = () => {
    dispatch(setShareFileModalOpen(false));
    dispatch(setSelectedPreview(null));
  };

  const rewindCloseModal = () => {
    setRewindSelect(false);
  };

  const closePreviewWindow = () => {
    dispatch(setPreviewOpen(false));
    dispatch(setSelectedPreview(null));
  };

  const onClosePanel = (forceRefresh: boolean) => {
    dispatch(setSelectedObjectView(null));
    dispatch(setVersionsModeEnabled({ status: false }));
    if (detailsOpen && selectedInternalPaths !== null) {
      // We change URL to be the contained folder

      const decodedPath = decodeURLString(internalPaths);
      const splitURLS = decodedPath.split("/");

      // We remove the last section of the URL as it should be a file
      splitURLS.pop();

      let URLItem = "";

      if (splitURLS && splitURLS.length > 0) {
        URLItem = `${splitURLS.join("/")}/`;
      }

      navigate(`/browser/${bucketName}/${encodeURLString(URLItem)}`);
    }

    dispatch(setObjectDetailsView(false));
    dispatch(setSelectedObjects([]));

    if (forceRefresh) {
      dispatch(setLoadingObjects(true));
    }
  };

  const setDeletedAction = () => {
    dispatch(resetMessages());
    dispatch(setShowDeletedObjects(!showDeleted));
    onClosePanel(true);
  };

  const closeRenameModal = () => {
    dispatch(setDownloadRenameModal(null));
  };

  const multiActionButtons = [
    {
      action: () => {
        dispatch(downloadSelected(bucketName));
      },
      label: "Download",
      disabled: !canDownload || selectedObjects?.length === 0,
      icon: <DownloadIcon />,
      tooltip: canDownload
        ? "Download Selected"
        : permissionTooltipHelper(
            [IAM_SCOPES.S3_GET_OBJECT],
            "download objects from this bucket"
          ),
    },
    {
      action: () => {
        dispatch(openShare());
      },
      label: "Share",
      disabled: selectedObjects.length !== 1 || !canShareFile,
      icon: <ShareIcon />,
      tooltip: canShareFile ? "Share Selected File" : "Sharing unavailable",
    },
    {
      action: () => {
        dispatch(openPreview());
      },
      label: "Preview",
      disabled: selectedObjects.length !== 1 || !canPreviewFile,
      icon: <PreviewIcon />,
      tooltip: canPreviewFile ? "Preview Selected File" : "Preview unavailable",
    },
    {
      action: () => {
        setDeleteMultipleOpen(true);
      },
      label: "Delete",
      icon: <DeleteIcon />,
      disabled:
        !canDelete || selectedObjects.length === 0 || !displayDeleteObject,
      tooltip: canDelete
        ? "Delete Selected Files"
        : permissionTooltipHelper(
            [IAM_SCOPES.S3_DELETE_OBJECT],
            "delete objects in this bucket"
          ),
    },
  ];

  return (
    <Fragment>
      {shareFileModalOpen && selectedPreview && (
        <ShareFile
          open={shareFileModalOpen}
          closeModalAndRefresh={closeShareModal}
          bucketName={bucketName}
          dataObject={{
            name: selectedPreview.name,
            last_modified: "",
            version_id: selectedPreview.version_id,
          }}
        />
      )}
      {deleteMultipleOpen && (
        <DeleteMultipleObjects
          deleteOpen={deleteMultipleOpen}
          selectedBucket={bucketName}
          selectedObjects={selectedObjects}
          closeDeleteModalAndRefresh={closeDeleteMultipleModalAndRefresh}
          versioning={isVersioned}
        />
      )}
      {rewindSelect && (
        <RewindEnable
          open={rewindSelect}
          closeModalAndRefresh={rewindCloseModal}
          bucketName={bucketName}
        />
      )}
      {previewOpen && (
        <PreviewFileModal
          open={previewOpen}
          bucketName={bucketName}
          object={selectedPreview}
          onClosePreview={closePreviewWindow}
        />
      )}
      {!!downloadRenameModal && (
        <RenameLongFileName
          open={!!downloadRenameModal}
          closeModal={closeRenameModal}
          currentItem={downloadRenameModal.name.split("/")?.pop() || ""}
          bucketName={bucketName}
          internalPaths={internalPaths}
          actualInfo={{
            name: downloadRenameModal.name,
            last_modified: "",
            version_id: downloadRenameModal.version_id,
            size: downloadRenameModal.size.toString(),
          }}
        />
      )}
      <PageLayout variant={"full"}>
        <Grid item xs={12} className={classes.screenTitleContainer}>
          <ScreenTitle
            className={classes.screenTitle}
            icon={
              <span className={classes.listIcon}>
                <BucketsIcon />
              </span>
            }
            title={<span className={classes.titleSpacer}>{bucketName}</span>}
            subTitle={
              <Fragment>
                <Grid item xs={12} className={classes.bucketDetails}>
                  <span className={classes.detailsSpacer}>
                    Created:&nbsp;&nbsp;&nbsp;
                    <strong>
                      {new Date(bucketInfo?.creation_date || "").toString()}
                    </strong>
                  </span>
                  <span className={classes.detailsSpacer}>
                    Access:&nbsp;&nbsp;&nbsp;
                    <strong>{bucketInfo?.access || ""}</strong>
                  </span>
                  {bucketInfo && (
                    <Fragment>
                      <span className={classes.detailsSpacer}>
                        {bucketInfo.size && (
                          <Fragment>{niceBytesInt(bucketInfo.size)}</Fragment>
                        )}
                        {bucketInfo.size && quota && (
                          <Fragment> / {niceBytesInt(quota.quota)}</Fragment>
                        )}
                        {bucketInfo.size && bucketInfo.objects ? " - " : ""}
                        {bucketInfo.objects && (
                          <Fragment>
                            {bucketInfo.objects}&nbsp;Object
                            {bucketInfo.objects && bucketInfo.objects !== 1
                              ? "s"
                              : ""}
                          </Fragment>
                        )}
                      </span>
                    </Fragment>
                  )}
                </Grid>
              </Fragment>
            }
            actions={
              <Fragment>
                <div className={classes.actionsSection}>
                  <TooltipWrapper tooltip={"Rewind Bucket"}>
                    <Button
                      id={"rewind-objects-list"}
                      label={"Rewind"}
                      icon={
                        <Badge
                          badgeContent=" "
                          color="secondary"
                          variant="dot"
                          invisible={!rewindEnabled}
                          className={classes.badgeOverlap}
                          sx={{ height: 16 }}
                        >
                          <HistoryIcon
                            style={{
                              minWidth: 16,
                              minHeight: 16,
                              width: 16,
                              height: 16,
                              marginTop: -3,
                            }}
                          />
                        </Badge>
                      }
                      variant={"regular"}
                      onClick={() => {
                        setRewindSelect(true);
                      }}
                      disabled={
                        !isVersioned ||
                        !hasPermission(bucketName, [IAM_SCOPES.S3_GET_OBJECT])
                      }
                    />
                  </TooltipWrapper>
                  <TooltipWrapper tooltip={"Reload List"}>
                    <Button
                      id={"refresh-objects-list"}
                      label={"Refresh"}
                      icon={<RefreshIcon />}
                      variant={"regular"}
                      onClick={() => {
                        if (versionsMode) {
                          dispatch(setLoadingVersions(true));
                        } else {
                          dispatch(resetMessages());
                          dispatch(setLoadingRecords(true));
                          dispatch(setLoadingObjects(true));
                        }
                      }}
                      disabled={
                        !hasPermission(bucketName, [
                          IAM_SCOPES.S3_LIST_BUCKET,
                        ]) || rewindEnabled
                      }
                    />
                  </TooltipWrapper>
                  <input
                    type="file"
                    multiple
                    onChange={handleUploadButton}
                    style={{ display: "none" }}
                    ref={fileUpload}
                  />
                  <input
                    type="file"
                    multiple
                    onChange={handleUploadButton}
                    style={{ display: "none" }}
                    ref={folderUpload}
                  />
                  <UploadFilesButton
                    bucketName={bucketName}
                    uploadPath={uploadPath.join("/")}
                    uploadFileFunction={(closeMenu) => {
                      if (fileUpload && fileUpload.current) {
                        fileUpload.current.click();
                      }
                      closeMenu();
                    }}
                    uploadFolderFunction={(closeMenu) => {
                      if (folderUpload && folderUpload.current) {
                        folderUpload.current.click();
                      }
                      closeMenu();
                    }}
                  />
                </div>
              </Fragment>
            }
          />
        </Grid>
        <div
          id="object-list-wrapper"
          {...getRootProps({ style: { ...dndStyles } })}
        >
          <input {...getInputProps()} />
          <Grid
            item
            xs={12}
            className={classes.tableBlock}
            sx={{ border: "#EAEDEE 1px solid", borderTop: 0 }}
          >
            {versionsMode ? (
              <Fragment>
                {selectedInternalPaths !== null && (
                  <VersionsNavigator
                    internalPaths={selectedInternalPaths}
                    bucketName={bucketName}
                  />
                )}
              </Fragment>
            ) : (
              <SecureComponent
                scopes={[IAM_SCOPES.S3_LIST_BUCKET]}
                resource={bucketName}
                errorProps={{ disabled: true }}
              >
                <Grid item xs={12} className={classes.fullContainer}>
                  <Grid item xs={12} className={classes.breadcrumbsContainer}>
                    <BrowserBreadcrumbs
                      bucketName={bucketName}
                      internalPaths={pageTitle}
                      additionalOptions={
                        !isVersioned || rewindEnabled ? null : (
                          <div>
                            <CheckboxWrapper
                              name={"deleted_objects"}
                              id={"showDeletedObjects"}
                              value={"deleted_on"}
                              label={"Show deleted objects"}
                              onChange={setDeletedAction}
                              checked={showDeleted}
                              overrideLabelClasses={classes.labelStyle}
                              className={classes.overrideShowDeleted}
                              noTopMargin
                            />
                          </div>
                        )
                      }
                      hidePathButton={false}
                    />
                  </Grid>
                  <ListObjectsTable />
                </Grid>
              </SecureComponent>
            )}
            <SecureComponent
              scopes={[IAM_SCOPES.S3_LIST_BUCKET]}
              resource={bucketName}
              errorProps={{ disabled: true }}
            >
              <DetailsListPanel
                open={detailsOpen}
                closePanel={() => {
                  onClosePanel(false);
                }}
                className={`${versionsMode ? classes.hideListOnSmall : ""}`}
              >
                {selectedObjects.length > 0 && (
                  <ActionsListSection
                    items={multiActionButtons}
                    title={"Selected Objects:"}
                  />
                )}
                {selectedInternalPaths !== null && (
                  <ObjectDetailPanel
                    internalPaths={selectedInternalPaths}
                    bucketName={bucketName}
                    onClosePanel={onClosePanel}
                    versioning={isVersioned}
                    locking={lockingEnabled}
                  />
                )}
              </DetailsListPanel>
            </SecureComponent>
          </Grid>
        </div>
      </PageLayout>
    </Fragment>
  );
};

export default ListObjects;
