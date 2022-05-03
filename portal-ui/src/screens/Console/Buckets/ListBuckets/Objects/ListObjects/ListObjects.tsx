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
import { connect } from "react-redux";
import { useDropzone } from "react-dropzone";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { withRouter } from "react-router-dom";
import Grid from "@mui/material/Grid";
import get from "lodash/get";
import { BucketObjectItem, BucketObjectItemsList } from "./types";
import api from "../../../../../../common/api";
import TableWrapper, {
  ItemActions,
} from "../../../../Common/TableWrapper/TableWrapper";
import {
  decodeFileName,
  encodeFileName,
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
import { Badge, Typography } from "@mui/material";
import BrowserBreadcrumbs from "../../../../ObjectBrowser/BrowserBreadcrumbs";
import {
  cancelObjectInList,
  completeObject,
  failObject,
  openList,
  resetRewind,
  setLoadingObjectInfo,
  setLoadingObjectsList,
  setLoadingVersions,
  setNewObject,
  setObjectDetailsView,
  setSearchObjects,
  setSelectedObjectView,
  setShowDeletedObjects,
  setVersionsModeEnabled,
  updateProgress,
} from "../../../../ObjectBrowser/actions";
import { Route } from "../../../../ObjectBrowser/types";

import { download, extensionPreview, sortListObjects } from "../utils";
import {
  setErrorSnackMessage,
  setSnackBarMessage,
} from "../../../../../../actions";
import {
  BucketInfo,
  BucketObjectLocking,
  BucketQuota,
  BucketVersioning,
} from "../../../types";
import { ErrorResponseHandler } from "../../../../../../common/types";

import ScreenTitle from "../../../../Common/ScreenTitle/ScreenTitle";

import { setBucketDetailsLoad, setBucketInfo } from "../../../actions";
import { AppState } from "../../../../../../store";
import PageLayout from "../../../../Common/Layout/PageLayout";

import { IAM_SCOPES } from "../../../../../../common/SecureComponent/permissions";
import {
  SecureComponent,
  hasPermission,
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
import RBIconButton from "../../../BucketDetails/SummaryItems/RBIconButton";
import ActionsListSection from "./ActionsListSection";
import { listModeColumns, rewindModeColumns } from "./ListObjectsHelpers";
import VersionsNavigator from "../ObjectDetails/VersionsNavigator";
import CheckboxWrapper from "../../../../Common/FormComponents/CheckboxWrapper/CheckboxWrapper";

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

const styles = (theme: Theme) =>
  createStyles({
    browsePaper: {
      border: 0,
      height: "calc(100vh - 210px)",
      "&.actionsPanelOpen": {
        minHeight: "100%",
      },
    },
    "@global": {
      ".rowLine:hover  .iconFileElm": {
        backgroundImage: "url(/images/ob_file_filled.svg)",
      },
      ".rowLine:hover  .iconFolderElm": {
        backgroundImage: "url(/images/ob_folder_filled.svg)",
      },
    },

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
    ...objectBrowserExtras,
    ...objectBrowserCommon,
    ...containerForHeader(theme.spacing(4)),
  });

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

interface IListObjectsProps {
  classes: any;
  match: any;
  history: any;
  routesList: Route[];
  downloadingFiles: string[];
  rewindEnabled: boolean;
  rewindDate: any;
  bucketToRewind: string;
  searchObjects: string;
  showDeleted: boolean;
  loading: boolean;
  setSnackBarMessage: typeof setSnackBarMessage;
  setErrorSnackMessage: typeof setErrorSnackMessage;
  resetRewind: typeof resetRewind;
  loadingBucket: boolean;
  setBucketInfo: typeof setBucketInfo;
  bucketInfo: BucketInfo | null;
  versionsMode: boolean;
  detailsOpen: boolean;
  setBucketDetailsLoad: typeof setBucketDetailsLoad;
  setNewObject: typeof setNewObject;
  updateProgress: typeof updateProgress;
  completeObject: typeof completeObject;
  openList: typeof openList;
  setSearchObjects: typeof setSearchObjects;
  selectedInternalPaths: string | null;
  setVersionsModeEnabled: typeof setVersionsModeEnabled;
  setShowDeletedObjects: typeof setShowDeletedObjects;
  setLoadingVersions: typeof setLoadingVersions;
  setObjectDetailsView: typeof setObjectDetailsView;
  setSelectedObjectView: typeof setSelectedObjectView;
  setLoadingObjectInfo: typeof setLoadingObjectInfo;
  setLoadingObjectsList: typeof setLoadingObjectsList;
  failObject: typeof failObject;
  cancelObjectInList: typeof cancelObjectInList;
}

function useInterval(callback: any, delay: number) {
  const savedCallback = useRef<Function | null>(null);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (savedCallback !== undefined && savedCallback.current) {
        savedCallback.current();
      }
    }

    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const defLoading = <Typography component="h3">Loading...</Typography>;

const ListObjects = ({
  classes,
  match,
  history,
  rewindEnabled,
  rewindDate,
  loading,
  bucketToRewind,
  setSnackBarMessage,
  setErrorSnackMessage,
  resetRewind,
  setBucketDetailsLoad,
  loadingBucket,
  setBucketInfo,
  bucketInfo,
  setNewObject,
  updateProgress,
  completeObject,
  setSearchObjects,
  searchObjects,
  versionsMode,
  openList,
  setVersionsModeEnabled,
  showDeleted,
  detailsOpen,
  setShowDeletedObjects,
  setLoadingVersions,
  setObjectDetailsView,
  selectedInternalPaths,
  setSelectedObjectView,
  setLoadingObjectInfo,
  setLoadingObjectsList,
  failObject,
  cancelObjectInList,
}: IListObjectsProps) => {
  const [records, setRecords] = useState<BucketObjectItem[]>([]);
  const [deleteMultipleOpen, setDeleteMultipleOpen] = useState<boolean>(false);
  const [loadingStartTime, setLoadingStartTime] = useState<number>(0);
  const [loadingMessage, setLoadingMessage] =
    useState<React.ReactNode>(defLoading);
  const [loadingVersioning, setLoadingVersioning] = useState<boolean>(true);
  const [isVersioned, setIsVersioned] = useState<boolean>(false);
  const [loadingLocking, setLoadingLocking] = useState<boolean>(true);
  const [lockingEnabled, setLockingEnabled] = useState<boolean>(false);
  const [rewindSelect, setRewindSelect] = useState<boolean>(false);
  const [selectedObjects, setSelectedObjects] = useState<string[]>([]);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [selectedPreview, setSelectedPreview] =
    useState<BucketObjectItem | null>(null);
  const [shareFileModalOpen, setShareFileModalOpen] = useState<boolean>(false);
  const [sortDirection, setSortDirection] = useState<
    "ASC" | "DESC" | undefined
  >("ASC");
  const [currentSortField, setCurrentSortField] = useState<string>("name");
  const [iniLoad, setIniLoad] = useState<boolean>(false);
  const [canShareFile, setCanShareFile] = useState<boolean>(false);
  const [canPreviewFile, setCanPreviewFile] = useState<boolean>(false);
  const [quota, setQuota] = useState<BucketQuota | null>(null);

  const internalPaths = get(match.params, "subpaths", "");
  const bucketName = match.params["bucketName"];

  const fileUpload = useRef<HTMLInputElement>(null);
  const folderUpload = useRef<HTMLInputElement>(null);

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
        .catch(() => {
          setQuota(null);
        });
    }
  }, [quota, bucketName]);

  useEffect(() => {
    if (selectedObjects.length > 0) {
      setObjectDetailsView(true);
      return;
    }

    if (selectedObjects.length === 0 && selectedInternalPaths === null) {
      setObjectDetailsView(false);
    }
  }, [selectedObjects, selectedInternalPaths, setObjectDetailsView]);

  const displayDeleteObject = hasPermission(bucketName, [
    IAM_SCOPES.S3_DELETE_OBJECT,
  ]);

  const displayListObjects = hasPermission(bucketName, [
    IAM_SCOPES.S3_LIST_BUCKET,
  ]);

  const updateMessage = () => {
    let timeDelta = Date.now() - loadingStartTime;

    if (timeDelta / 1000 >= 6) {
      setLoadingMessage(
        <Fragment>
          <Typography component="h3">
            This operation is taking longer than expected... (
            {Math.ceil(timeDelta / 1000)}s)
          </Typography>
        </Fragment>
      );
    } else if (timeDelta / 1000 >= 3) {
      setLoadingMessage(
        <Typography component="h3">
          This operation is taking longer than expected...
        </Typography>
      );
    }
  };

  useEffect(() => {
    if (!iniLoad) {
      setBucketDetailsLoad(true);
      setIniLoad(true);
    }
  }, [iniLoad, setBucketDetailsLoad, setIniLoad]);

  useInterval(() => {
    // Your custom logic here
    if (loading) {
      updateMessage();
    }
  }, 1000);

  useEffect(() => {
    if (loadingVersioning) {
      if (displayListObjects) {
        api
          .invoke("GET", `/api/v1/buckets/${bucketName}/versioning`)
          .then((res: BucketVersioning) => {
            setIsVersioned(res.is_versioned);
            setLoadingVersioning(false);
          })
          .catch((err: ErrorResponseHandler) => {
            setErrorSnackMessage(err);
            setLoadingVersioning(false);
          });
      } else {
        setLoadingVersioning(false);
        setRecords([]);
      }
    }
  }, [bucketName, loadingVersioning, setErrorSnackMessage, displayListObjects]);

  useEffect(() => {
    if (loadingLocking) {
      if (displayListObjects) {
        api
          .invoke("GET", `/api/v1/buckets/${bucketName}/object-locking`)
          .then((res: BucketObjectLocking) => {
            setLockingEnabled(res.object_locking_enabled);
            setLoadingLocking(false);
          })
          .catch((err: ErrorResponseHandler) => {
            setErrorSnackMessage(err);
            setLoadingLocking(false);
          });
      } else {
        setRecords([]);
        setLoadingLocking(false);
      }
    }
  }, [bucketName, loadingLocking, setErrorSnackMessage, displayListObjects]);

  useEffect(() => {
    const decodedIPaths = decodeFileName(internalPaths);

    if (decodedIPaths.endsWith("/") || decodedIPaths === "") {
      setLoadingObjectsList(true);
      setObjectDetailsView(false);
      setSearchObjects("");
    } else {
      setLoadingObjectInfo(true);
      setObjectDetailsView(true);
      setLoadingVersions(true);
      setSelectedObjectView(
        `${decodedIPaths ? `${encodeFileName(decodedIPaths)}` : ``}`
      );
    }
  }, [
    internalPaths,
    setSearchObjects,
    rewindDate,
    rewindEnabled,
    setLoadingObjectInfo,
    setLoadingVersions,
    setObjectDetailsView,
    setSelectedObjectView,
    setLoadingObjectsList,
  ]);

  useEffect(() => {
    if (loading) {
      if (displayListObjects) {
        let pathPrefix = "";
        if (internalPaths) {
          const decodedPath = decodeFileName(internalPaths);
          pathPrefix = decodedPath.endsWith("/")
            ? decodedPath
            : decodedPath + "/";
        }

        let currentTimestamp = Date.now();
        setLoadingStartTime(currentTimestamp);
        setLoadingMessage(defLoading);

        // We get URL to look into
        let urlTake = `/api/v1/buckets/${bucketName}/objects`;

        // Is rewind enabled?, we use Rewind API
        if (rewindEnabled) {
          if (bucketToRewind !== bucketName) {
            resetRewind();
            return;
          }

          if (rewindDate) {
            const rewindParsed = rewindDate.toISOString();

            urlTake = `/api/v1/buckets/${bucketName}/rewind/${rewindParsed}`;
          }
        } else if (showDeleted) {
          // Do we want to display deleted items too?, we use rewind to current time to show everything
          const currDate = new Date();
          const currDateISO = currDate.toISOString();

          urlTake = `/api/v1/buckets/${bucketName}/rewind/${currDateISO}`;
        }

        api
          .invoke(
            "GET",
            `${urlTake}${
              pathPrefix ? `?prefix=${encodeFileName(pathPrefix)}` : ``
            }`
          )
          .then((res: BucketObjectItemsList) => {
            const records: BucketObjectItem[] = res.objects || [];
            const folders: BucketObjectItem[] = [];
            const files: BucketObjectItem[] = [];

            // We separate items between folders or files to display folders at the beginning always.
            records.forEach((record) => {
              // We omit files from the same path
              if (record.name !== decodeFileName(internalPaths)) {
                // this is a folder
                if (record.name.endsWith("/")) {
                  folders.push(record);
                } else {
                  // this is a file
                  files.push(record);
                }
              }
            });

            const recordsInElement = [...folders, ...files];

            if (recordsInElement.length === 0 && pathPrefix !== "") {
              let pathTest = `/api/v1/buckets/${bucketName}/objects${
                internalPaths ? `?prefix=${internalPaths}` : ""
              }`;

              if (rewindEnabled) {
                const rewindParsed = rewindDate.toISOString();

                let pathPrefix = "";
                if (internalPaths) {
                  const decodedPath = decodeFileName(internalPaths);
                  pathPrefix = decodedPath.endsWith("/")
                    ? decodedPath
                    : decodedPath + "/";
                }

                pathTest = `/api/v1/buckets/${bucketName}/rewind/${rewindParsed}${
                  pathPrefix ? `?prefix=${encodeFileName(pathPrefix)}` : ``
                }`;
              }

              api
                .invoke("GET", pathTest)
                .then((res: BucketObjectItemsList) => {
                  //It is a file since it has elements in the object, setting file flag and waiting for component mount
                  if (!res.objects) {
                    // It is a folder, we remove loader & set original results list
                    setLoadingObjectsList(false);
                    setRecords(recordsInElement);
                  } else {
                    // This code prevents the program from opening a file when a substring of that file is entered as a new folder.
                    // Previously, if there was a file test1.txt and the folder test was created with the same prefix, the program
                    // would open test1.txt instead
                    let found = false;
                    let pathPrefixChopped = pathPrefix.slice(
                      0,
                      pathPrefix.length - 1
                    );
                    for (let i = 0; i < res.objects.length; i++) {
                      if (res.objects[i].name === pathPrefixChopped) {
                        found = true;
                      }
                    }
                    if (
                      (res.objects.length === 1 &&
                        res.objects[0].name.endsWith("/")) ||
                      !found
                    ) {
                      // This is a folder, we set the original results list
                      setRecords(recordsInElement);
                    } else {
                      // This is a file. We change URL & Open file details view.
                      setObjectDetailsView(true);
                      setSelectedObjectView(internalPaths);

                      // We split the selected object URL & remove the last item to fetch the files list for the parent folder
                      const parentPath = `${decodeFileName(internalPaths)
                        .split("/")
                        .slice(0, -1)
                        .join("/")}/`;

                      api
                        .invoke(
                          "GET",
                          `${urlTake}${
                            pathPrefix
                              ? `?prefix=${encodeFileName(parentPath)}`
                              : ``
                          }`
                        )
                        .then((res: BucketObjectItemsList) => {
                          const records: BucketObjectItem[] = res.objects || [];

                          setRecords(records);
                        })
                        .catch(() => {});
                    }

                    setLoadingObjectsList(false);
                  }
                })
                .catch((err: ErrorResponseHandler) => {
                  setLoadingObjectsList(false);
                  setErrorSnackMessage(err);
                });
            } else {
              setRecords(recordsInElement);
              setLoadingObjectsList(false);
            }
          })
          .catch((err: ErrorResponseHandler) => {
            setLoadingObjectsList(false);
            setErrorSnackMessage(err);
          });
      } else {
        setLoadingObjectsList(false);
      }
    }
  }, [
    loading,
    match,
    setErrorSnackMessage,
    bucketName,
    rewindEnabled,
    rewindDate,
    internalPaths,
    bucketInfo,
    showDeleted,
    displayListObjects,
    bucketToRewind,
    resetRewind,
    setObjectDetailsView,
    setSelectedObjectView,
    setLoadingObjectsList,
  ]);

  // bucket info
  useEffect(() => {
    if (loadingBucket) {
      api
        .invoke("GET", `/api/v1/buckets/${bucketName}`)
        .then((res: BucketInfo) => {
          setBucketDetailsLoad(false);
          setBucketInfo(res);
        })
        .catch((err: ErrorResponseHandler) => {
          setBucketDetailsLoad(false);
          setErrorSnackMessage(err);
        });
    }
  }, [
    bucketName,
    loadingBucket,
    setBucketDetailsLoad,
    setBucketInfo,
    setErrorSnackMessage,
  ]);

  const closeDeleteMultipleModalAndRefresh = (refresh: boolean) => {
    setDeleteMultipleOpen(false);

    if (refresh) {
      setSnackBarMessage(`Objects deleted successfully.`);
      setSelectedObjects([]);
      setLoadingObjectsList(true);
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

  const downloadObject = (object: BucketObjectItem) => {
    const identityDownload = encodeFileName(
      `${bucketName}-${object.name}-${new Date().getTime()}-${Math.random()}`
    );

    const downloadCall = download(
      bucketName,
      encodeFileName(object.name),
      object.version_id,
      object.size,
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

  const openPath = (idElement: string) => {
    setSelectedObjects([]);

    const newPath = `/buckets/${bucketName}/browse${
      idElement ? `/${encodeFileName(idElement)}` : ``
    }`;
    history.push(newPath);

    setObjectDetailsView(true);
    setLoadingVersions(true);
    setSelectedObjectView(`${idElement ? `${encodeFileName(idElement)}` : ``}`);
  };

  const uploadObject = useCallback(
    (files: File[], folderPath: string): void => {
      let pathPrefix = "";
      if (internalPaths) {
        const decodedPath = decodeFileName(internalPaths);
        pathPrefix = decodedPath.endsWith("/")
          ? decodedPath
          : decodedPath + "/";
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
            const relativeFolderPath =
              get(file, "webkitRelativePath", "") !== ""
                ? get(file, "webkitRelativePath", "")
                : folderPath;

            if (path !== "" || relativeFolderPath !== "") {
              const finalFolderPath = relativeFolderPath
                .split("/")
                .slice(0, -1)
                .join("/");

              encodedPath = encodeFileName(
                `${path}${finalFolderPath}${
                  !finalFolderPath.endsWith("/") ? "/" : ""
                }`
              );
            }

            if (encodedPath !== "") {
              uploadUrl = `${uploadUrl}?prefix=${encodedPath}`;
            }

            const identity = encodeFileName(
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
                completeObject(identity);
                resolve({ status: xhr.status });
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
                failObject(identity);
                reject({ status: xhr.status, message: errorMessage });
              }
            };

            xhr.upload.addEventListener("error", (event) => {
              reject(errorMessage);
              failObject(identity);
              return;
            });

            xhr.upload.addEventListener("progress", (event) => {
              const progress = Math.floor((event.loaded * 100) / event.total);

              updateProgress(identity, progress);
            });

            xhr.onerror = () => {
              reject(errorMessage);
              failObject(identity);
              return;
            };
            xhr.onloadend = () => {
              if (files.length === 0) {
                setLoadingObjectsList(true);
              }
            };
            xhr.onabort = () => {
              cancelObjectInList(identity);
            };

            const formData = new FormData();
            if (file.size !== undefined) {
              formData.append(file.size.toString(), blobFile, fileName);

              setNewObject({
                bucketName,
                done: false,
                instanceID: identity,
                percentage: 0,
                prefix: `${decodeFileName(encodedPath)}${fileName}`,
                type: "upload",
                waitingForFile: false,
                failed: false,
                cancelled: false,
                call: xhr,
              });

              xhr.send(formData);
            }
          });
        };

        const uploadFilePromises: any = [];
        // open object manager
        openList();
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
            setErrorSnackMessage(err);
          }
          // We force objects list reload after all promises were handled
          setLoadingObjectsList(true);
        });
      };

      upload(files, bucketName, pathPrefix, folderPath);
    },
    [
      bucketName,
      completeObject,
      internalPaths,
      openList,
      setNewObject,
      setErrorSnackMessage,
      updateProgress,
      setLoadingObjectsList,
      cancelObjectInList,
      failObject,
    ]
  );

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        let newFolderPath: string = acceptedFiles[0].path;
        uploadObject(acceptedFiles, newFolderPath);
      }
    },
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

  const openPreview = () => {
    if (selectedObjects.length === 1) {
      let fileObject: BucketObjectItem | undefined;

      const findFunction = (currValue: BucketObjectItem) =>
        selectedObjects.includes(currValue.name);

      fileObject = filteredRecords.find(findFunction);

      if (fileObject) {
        setSelectedPreview(fileObject);
        setPreviewOpen(true);
      }
    }
  };

  const openShare = () => {
    if (selectedObjects.length === 1) {
      let fileObject: BucketObjectItem | undefined;

      const findFunction = (currValue: BucketObjectItem) =>
        selectedObjects.includes(currValue.name);

      fileObject = filteredRecords.find(findFunction);

      if (fileObject) {
        setSelectedPreview(fileObject);
        setShareFileModalOpen(true);
      }
    }
  };

  const closeShareModal = () => {
    setShareFileModalOpen(false);
    setSelectedPreview(null);
  };

  const filteredRecords = records.filter((b: BucketObjectItem) => {
    if (searchObjects === "") {
      return true;
    } else {
      const objectName = b.name.toLowerCase();
      if (objectName.indexOf(searchObjects.toLowerCase()) >= 0) {
        return true;
      } else {
        return false;
      }
    }
  });

  const rewindCloseModal = () => {
    setRewindSelect(false);
  };

  const closePreviewWindow = () => {
    setPreviewOpen(false);
    setSelectedPreview(null);
  };

  const selectListObjects = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetD = e.target;
    const value = targetD.value;
    const checked = targetD.checked;

    let elements: string[] = [...selectedObjects]; // We clone the selectedBuckets array

    if (checked) {
      // If the user has checked this field we need to push this to selectedBucketsList
      elements.push(value);
    } else {
      // User has unchecked this field, we need to remove it from the list
      elements = elements.filter((element) => element !== value);
    }
    setSelectedObjects(elements);
    setSelectedObjectView(null);

    return elements;
  };

  const sortChange = (sortData: any) => {
    const newSortDirection = get(sortData, "sortDirection", "DESC");
    setCurrentSortField(sortData.sortBy);
    setSortDirection(newSortDirection);
    setLoadingObjectsList(true);
  };

  const pageTitle = decodeFileName(internalPaths);
  const currentPath = pageTitle.split("/").filter((i: string) => i !== "");

  const plSelect = filteredRecords;
  const sortASC = plSelect.sort(sortListObjects(currentSortField));

  let payload: BucketObjectItem[] = [];

  if (sortDirection === "ASC") {
    payload = sortASC;
  } else {
    payload = sortASC.reverse();
  }

  const selectAllItems = () => {
    setSelectedObjectView(null);

    if (selectedObjects.length === payload.length) {
      setSelectedObjects([]);
      return;
    }

    const elements = payload.map((item) => item.name);
    setSelectedObjects(elements);
  };

  const downloadSelected = () => {
    if (selectedObjects.length !== 0) {
      let itemsToDownload: BucketObjectItem[] = [];

      const filterFunction = (currValue: BucketObjectItem) =>
        selectedObjects.includes(currValue.name);

      itemsToDownload = filteredRecords.filter(filterFunction);

      itemsToDownload.forEach((filteredItem) => {
        downloadObject(filteredItem);
      });
    }
  };
  let uploadPath = [bucketName];
  if (currentPath.length > 0) {
    uploadPath = uploadPath.concat(currentPath);
  }

  const onClosePanel = (forceRefresh: boolean) => {
    setSelectedObjectView(null);
    setVersionsModeEnabled(false);
    if (detailsOpen && selectedInternalPaths !== null) {
      setSelectedObjectView(null);
      setVersionsModeEnabled(false);
      // We change URL to be the contained folder

      const decodedPath = decodeFileName(internalPaths);
      const splitURLS = decodedPath.split("/");

      // We remove the last section of the URL as it should be a file
      splitURLS.pop();

      let URLItem = "";

      if (splitURLS && splitURLS.length > 0) {
        URLItem = `${splitURLS.join("/")}/`;
      }

      history.push(`/buckets/${bucketName}/browse/${encodeFileName(URLItem)}`);
    }

    setObjectDetailsView(false);
    setSelectedObjects([]);

    if (forceRefresh) {
      setLoadingObjectsList(true);
    }
  };

  const setDeletedAction = () => {
    setShowDeletedObjects(!showDeleted);
    onClosePanel(true);
  };

  const tableActions: ItemActions[] = [
    {
      type: "view",
      label: "View",
      onClick: openPath,
      sendOnlyId: true,
    },
  ];

  const multiActionButtons = [
    {
      action: downloadSelected,
      label: "Download",
      disabled: selectedObjects.length === 0,
      icon: <DownloadIcon />,
      tooltip: "Download Selected",
    },
    {
      action: openShare,
      label: "Share",
      disabled: selectedObjects.length !== 1 || !canShareFile,
      icon: <ShareIcon />,
      tooltip: "Share Selected File",
    },
    {
      action: openPreview,
      label: "Preview",
      disabled: selectedObjects.length !== 1 || !canPreviewFile,
      icon: <PreviewIcon />,
      tooltip: "Preview Selected File",
    },
    {
      action: () => {
        setDeleteMultipleOpen(true);
      },
      label: "Delete",
      icon: <DeleteIcon />,
      disabled:
        !hasPermission(bucketName, [IAM_SCOPES.S3_DELETE_OBJECT]) ||
        selectedObjects.length === 0 ||
        !displayDeleteObject,
      tooltip: "Delete Selected Files",
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
                    <strong>{bucketInfo?.creation_date || ""}</strong>
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
                <RBIconButton
                  id={"rewind-objects-list"}
                  tooltip={"Rewind Bucket"}
                  text={"Rewind"}
                  icon={
                    <Badge
                      badgeContent=" "
                      color="secondary"
                      variant="dot"
                      invisible={!rewindEnabled}
                      className={classes.badgeOverlap}
                      sx={{ height: 12 }}
                    >
                      <HistoryIcon />
                    </Badge>
                  }
                  color="primary"
                  variant={"outlined"}
                  onClick={() => {
                    setRewindSelect(true);
                  }}
                  disabled={
                    !isVersioned ||
                    !hasPermission(bucketName, [IAM_SCOPES.S3_PUT_OBJECT])
                  }
                />
                <RBIconButton
                  id={"refresh-objects-list"}
                  tooltip={"Reload List"}
                  text={"Refresh"}
                  icon={<RefreshIcon />}
                  color="primary"
                  variant={"outlined"}
                  onClick={() => {
                    if (versionsMode) {
                      setLoadingVersions(true);
                    } else {
                      setLoadingObjectsList(true);
                    }
                  }}
                  disabled={
                    !hasPermission(bucketName, [IAM_SCOPES.S3_LIST_BUCKET]) ||
                    rewindEnabled
                  }
                />
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
                <Grid item xs={12}>
                  <Grid item xs={12} className={classes.breadcrumbsContainer}>
                    <BrowserBreadcrumbs
                      bucketName={bucketName}
                      internalPaths={pageTitle}
                      existingFiles={records || []}
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
                              noTopMargin
                            />
                          </div>
                        )
                      }
                      hidePathButton={false}
                    />
                  </Grid>
                  <TableWrapper
                    itemActions={tableActions}
                    columns={
                      rewindEnabled ? rewindModeColumns : listModeColumns
                    }
                    isLoading={loading}
                    loadingMessage={loadingMessage}
                    entityName="Objects"
                    idField="name"
                    records={payload}
                    customPaperHeight={`${classes.browsePaper} ${
                      detailsOpen ? "actionsPanelOpen" : ""
                    }`}
                    selectedItems={selectedObjects}
                    onSelect={selectListObjects}
                    customEmptyMessage={`This location is empty${
                      !rewindEnabled ? ", please try uploading a new file" : ""
                    }`}
                    sortConfig={{
                      currentSort: currentSortField,
                      currentDirection: sortDirection,
                      triggerSort: sortChange,
                    }}
                    onSelectAll={selectAllItems}
                    rowStyle={({ index }) => {
                      if (payload[index]?.delete_flag) {
                        return "deleted";
                      }

                      return "";
                    }}
                  />
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

const mapStateToProps = ({ objectBrowser, buckets }: AppState) => ({
  routesList: get(objectBrowser, "routesList", []),
  downloadingFiles: get(objectBrowser, "downloadingFiles", []),
  rewindEnabled: get(objectBrowser, "rewind.rewindEnabled", false),
  rewindDate: get(objectBrowser, "rewind.dateToRewind", null),
  bucketToRewind: get(objectBrowser, "rewind.bucketToRewind", ""),
  versionsMode: get(objectBrowser, "versionsMode", false),
  loadingBucket: buckets.bucketDetails.loadingBucket,
  bucketInfo: buckets.bucketDetails.bucketInfo,
  searchObjects: objectBrowser.searchObjects,
  showDeleted: objectBrowser.showDeleted,
  detailsOpen: objectBrowser.objectDetailsOpen,
  selectedInternalPaths: objectBrowser.selectedInternalPaths,
  loading: objectBrowser.loadingObjects,
});

const mapDispatchToProps = {
  setSnackBarMessage,
  setErrorSnackMessage,
  resetRewind,
  setBucketDetailsLoad,
  setBucketInfo,
  setNewObject,
  updateProgress,
  completeObject,
  openList,
  failObject,
  setSearchObjects,
  setVersionsModeEnabled,
  setShowDeletedObjects,
  setLoadingVersions,
  setObjectDetailsView,
  setSelectedObjectView,
  setLoadingObjectInfo,
  setLoadingObjectsList,
  cancelObjectInList,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default withRouter(connector(withStyles(styles)(ListObjects)));
