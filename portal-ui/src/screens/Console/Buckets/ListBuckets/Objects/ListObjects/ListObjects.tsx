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
import { BucketObjectItem } from "./types";
import api from "../../../../../../common/api";
import TableWrapper, {
  ItemActions,
} from "../../../../Common/TableWrapper/TableWrapper";
import {
  decodeURLString,
  encodeURLString,
  getClientOS,
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
  download,
  extensionPreview,
  permissionItems,
  sortListObjects,
} from "../utils";
import {
  BucketInfo,
  BucketObjectLocking,
  BucketQuota,
  BucketVersioning,
} from "../../../types";
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
import { listModeColumns, rewindModeColumns } from "./ListObjectsHelpers";
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
  resetRewind,
  setLoadingObjectInfo,
  setLoadingObjectsList,
  setLoadingVersions,
  setNewObject,
  setObjectDetailsView,
  setSearchObjects,
  setSelectedObjectView,
  setShowDeletedObjects,
  setSimplePathHandler,
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
import { selFeatures } from "../../../../consoleSlice";
import TooltipWrapper from "../../../../Common/TooltipWrapper/TooltipWrapper";
import { wsProtocol } from "../../../../../../utils/wsUtils";
import { IMessageEvent, w3cwebsocket as W3CWebSocket } from "websocket";

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
    browsePaper: {
      border: 0,
      height: "calc(100vh - 210px)",
      "&.isEmbedded": {
        height: "calc(100vh - 315px)",
      },
      "&.actionsPanelOpen": {
        minHeight: "100%",
      },
      "@media (max-width: 800px)": {
        width: 800,
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
    parentWrapper: {
      "@media (max-width: 800px)": {
        overflowX: "auto",
      },
    },
    fullContainer: {
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

const defLoading = <Typography component="h3">Loading...</Typography>;

const url = new URL(window.location.toString());
const isDev = process.env.NODE_ENV === "development";
const port = isDev ? "9090" : url.port;

// check if we are using base path, if not this always is `/`
const baseLocation = new URL(document.baseURI);
const baseUrl = baseLocation.pathname;

const wsProt = wsProtocol(url.protocol);

let objectsWS = new W3CWebSocket(`${wsProt}://${url.hostname}:${port}${baseUrl}ws/objectManager`);

const ListObjects = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const rewindEnabled = useSelector(
    (state: AppState) => state.objectBrowser.rewind.rewindEnabled
  );
  const rewindDate = useSelector(
    (state: AppState) => state.objectBrowser.rewind.dateToRewind
  );
  const bucketToRewind = useSelector(
    (state: AppState) => state.objectBrowser.rewind.bucketToRewind
  );
  const versionsMode = useSelector(
    (state: AppState) => state.objectBrowser.versionsMode
  );

  const searchObjects = useSelector(
    (state: AppState) => state.objectBrowser.searchObjects
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

  const loadingBucket = useSelector(selBucketDetailsLoading);
  const bucketInfo = useSelector(selBucketDetailsInfo);
  const allowResources = useSelector(
    (state: AppState) => state.console.session.allowResources
  );

  const features = useSelector(selFeatures);
  const obOnly = !!features?.includes("object-browser-only");

  const [records, setRecords] = useState<BucketObjectItem[]>([]);
  const [deleteMultipleOpen, setDeleteMultipleOpen] = useState<boolean>(false);
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
  const [downloadRenameModal, setDownloadRenameModal] =
    useState<BucketObjectItem | null>(null);

  const pathSegment = location.pathname.split("/browse/");

  const internalPaths = pathSegment.length === 2 ? pathSegment[1] : "";
  const bucketName = params.bucketName || "";

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

    if (selectedObjects.length === 0 && selectedInternalPaths === null) {
      dispatch(setObjectDetailsView(false));
    }
  }, [selectedObjects, selectedInternalPaths, dispatch]);

  const displayDeleteObject = hasPermission(bucketName, [
    IAM_SCOPES.S3_DELETE_OBJECT,
  ]);

  const displayListObjects = hasPermission(bucketName, [
    IAM_SCOPES.S3_LIST_BUCKET,
  ]);

  useEffect(() => {
    if (!iniLoad) {
      dispatch(setBucketDetailsLoad(true));
      setIniLoad(true);
    }
  }, [iniLoad, dispatch, setIniLoad]);

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
            console.error(
              "Error Getting Object Versioning Status: ",
              err.detailedError
            );
            setLoadingVersioning(false);
          });
      } else {
        setLoadingVersioning(false);
        setRecords([]);
      }
    }
  }, [bucketName, loadingVersioning, dispatch, displayListObjects]);

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
            console.error(
              "Error Getting Object Locking Status: ",
              err.detailedError
            );
            setLoadingLocking(false);
          });
      } else {
        setRecords([]);
        setLoadingLocking(false);
      }
    }
  }, [bucketName, loadingLocking, dispatch, displayListObjects]);

  useEffect(() => {
    const decodedIPaths = decodeURLString(internalPaths);

    if (decodedIPaths.endsWith("/") || decodedIPaths === "") {
      dispatch(setObjectDetailsView(false));
      dispatch(setSelectedObjectView(null));
      dispatch(
        setSimplePathHandler(decodedIPaths === "" ? "/" : decodedIPaths)
      );
    } else {
      dispatch(setLoadingObjectInfo(true));
      dispatch(setObjectDetailsView(true));
      dispatch(setLoadingVersions(true));
      dispatch(
        setSelectedObjectView(
          `${decodedIPaths ? `${encodeURLString(decodedIPaths)}` : ``}`
        )
      );
      dispatch(
        setSimplePathHandler(
          `${decodedIPaths.split("/").slice(0, -1).join("/")}/`
        )
      );
    }
  }, [internalPaths, rewindDate, rewindEnabled, dispatch]);

  useEffect(() => {
    dispatch(setSearchObjects(""));
    dispatch(setLoadingObjectsList(true));
    setSelectedObjects([]);
  }, [simplePath, dispatch, setSelectedObjects]);

  // Direct file access effect / prefix
  useEffect(() => {
    if (!loadingObjects && records.length === 0) {
      const url = new URL(window.location.toString());
      const isDev = process.env.NODE_ENV === "development";
      const port = isDev ? "9090" : url.port;

      // check if we are using base path, if not this always is `/`
      const baseLocation = new URL(document.baseURI);
      const baseUrl = baseLocation.pathname;

      const wsProt = wsProtocol(url.protocol);

      const parentPath = `${decodeURLString(internalPaths)
        .split("/")
        .slice(0, -1)
        .join("/")}/`;

      setLoadingMessage(defLoading);

      // We get URL to look into
      let urlTake = `objects?bucketName=${bucketName}&prefix=${encodeURLString(
        parentPath
      )}`;

      // Is rewind enabled?, we use Rewind API
      if (rewindEnabled) {
        if (bucketToRewind !== bucketName) {
          dispatch(resetRewind());
          return;
        }

        if (rewindDate) {
          const rewindParsed = rewindDate.toISOString();

          urlTake = `rewind?bucketName=${bucketName}&prefix=${encodeURLString(
            parentPath
          )}&date=${rewindParsed}`;
        }
      }

      const c = new W3CWebSocket(
        `${wsProt}://${url.hostname}:${port}${baseUrl}ws/${urlTake}`
      );

      if (c !== null) {
        c.onopen = () => {
          c.send("ok");
        };
        c.onmessage = (message: IMessageEvent) => {
          const data: any = JSON.parse(message.data.toString());
          setRecords((prevStatus) => {
            let prSt: any[] = [];
            if (prevStatus) {
              prSt = [...prevStatus];
            }

            const insertData = [data];
            return [...prSt, ...insertData];
          });
        };
        c.onclose = () => {
          // reset start status
          dispatch(setLoadingObjectsList(false));
        };
        c.onerror = (err) => {
          console.error("Error", err);
        };
      }
    }
  }, [
    loadingObjects,
    records,
    bucketName,
    bucketToRewind,
    dispatch,
    internalPaths,
    rewindDate,
    rewindEnabled,
  ]);

  // Common objects list
  useEffect(() => {
    // begin watch if bucketName in bucketList and start pressed
    if (loadingObjects && displayListObjects) {
      const url = new URL(window.location.toString());
      const isDev = process.env.NODE_ENV === "development";
      const port = isDev ? "9090" : url.port;

      // check if we are using base path, if not this always is `/`
      const baseLocation = new URL(document.baseURI);
      const baseUrl = baseLocation.pathname;

      const wsProt = wsProtocol(url.protocol);

      let pathPrefix = "";
      if (internalPaths) {
        const decodedPath = decodeURLString(internalPaths);
        pathPrefix = decodedPath.endsWith("/")
          ? decodedPath
          : decodedPath + "/";
      }

      setLoadingMessage(defLoading);

      // We get URL to look into
      let urlTake = `objects?bucketName=${bucketName}&prefix=${encodeURLString(
        pathPrefix
      )}`;

      // Is rewind enabled?, we use Rewind API
      if (rewindEnabled) {
        if (bucketToRewind !== bucketName) {
          dispatch(resetRewind());
          return;
        }

        if (rewindDate) {
          const rewindParsed = rewindDate.toISOString();

          urlTake = `rewind?bucketName=${bucketName}&prefix=${encodeURLString(
            pathPrefix
          )}&date=${rewindParsed}`;
        }
      } else if (showDeleted) {
        // Do we want to display deleted items too?, we use rewind to current time to show everything
        const currDate = new Date();
        const currDateISO = currDate.toISOString();

        urlTake = `rewind?bucketName=${bucketName}&prefix=${encodeURLString(
          pathPrefix
        )}&date=${currDateISO}`;
      }

      const c = new W3CWebSocket(
        `${wsProt}://${url.hostname}:${port}${baseUrl}ws/${urlTake}`
      );

      if (c !== null) {
        c.onopen = () => {
          setRecords([]);
          c.send("ok");
        };
        c.onmessage = (message: IMessageEvent) => {
          const data: any = JSON.parse(message.data.toString());

          // We omit files from the same path
          if (data.name !== decodeURLString(internalPaths)) {
            setRecords((prevStatus) => {
              let prSt: any[] = [];

              if (prevStatus) {
                prSt = [...prevStatus];
              }

              const duplicate = prevStatus.findIndex(
                (dup) => dup.name === data.name
              );

              // Element is duplicated, we verify if deleted flag is present
              if (duplicate >= 0) {
                if (data.is_latest) {
                  prSt[duplicate].delete_flag = data.delete_flag || false;
                  prSt[duplicate].version_id = data.version_id;
                  prSt[duplicate].is_latest = data.is_latest;
                }
                return [...prSt];
              }

              return [...prSt, ...[data]];
            });
          }
        };
        c.onclose = (err) => {
          if (err.reason === "Access Denied.") {
            const permitItems = permissionItems(
              bucketName,
              pathPrefix,
              allowResources || []
            );

            if (!permitItems || permitItems.length === 0) {
              dispatch(
                setErrorSnackMessage({
                  errorMessage: err.reason,
                  detailedError: err.reason,
                })
              );
            } else {
              setRecords(permitItems);
            }
          }
          // reset start status
          dispatch(setLoadingObjectsList(false));
        };
        c.onerror = (err) => {
          console.error("Error", err);
        };
        return () => {
          // close websocket on useEffect cleanup
          c.close(1000);
        };
      }
    } else {
      dispatch(setLoadingObjectsList(false));
    }
  }, [
    loadingObjects,
    bucketName,
    internalPaths,
    displayListObjects,
    bucketToRewind,
    dispatch,
    rewindDate,
    rewindEnabled,
    showDeleted,
    allowResources,
  ]);

  useEffect(() => {
    objectsWS.onopen = () => {
      console.log("object handler connected");
    };

    objectsWS.onmessage = (evt) => {
      console.log(evt.data);
    };

    objectsWS.onclose = () => {
      console.log("disconnected")
    }

    }, [objectsWS]);

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
      setSelectedObjects([]);
      dispatch(setLoadingObjectsList(true));
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
    const identityDownload = encodeURLString(
      `${bucketName}-${object.name}-${new Date().getTime()}-${Math.random()}`
    );

    const ID = makeid(8);

    const downloadCall = download(
      bucketName,
      encodeURLString(object.name),
      object.version_id,
      object.size,
      null,
      ID,
      (progress) => {
        dispatch(
          updateProgress({
            instanceID: identityDownload,
            progress: progress,
          })
        );
      },
      () => {
        dispatch(completeObject(identityDownload));
      },
      (msg: string) => {
        dispatch(failObject({ instanceID: identityDownload, msg }));
      },
      () => {
        dispatch(cancelObjectInList(identityDownload));
      }
    );
    storeCallForObjectWithID(ID, downloadCall);
    dispatch(
      setNewObject({
        ID,
        bucketName,
        done: false,
        instanceID: identityDownload,
        percentage: 0,
        prefix: object.name,
        type: "download",
        waitingForFile: true,
        failed: false,
        cancelled: false,
        errorMessage: "",
      })
    );
  };

  const openPath = (idElement: string) => {
    setSelectedObjects([]);

    const newPath = `/buckets/${bucketName}/browse${
      idElement ? `/${encodeURLString(idElement)}` : ``
    }`;
    navigate(newPath);

    dispatch(setObjectDetailsView(true));
    dispatch(setLoadingVersions(true));
    dispatch(
      setSelectedObjectView(
        `${idElement ? `${encodeURLString(idElement)}` : ``}`
      )
    );
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
                dispatch(setLoadingObjectsList(true));
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
          dispatch(setLoadingObjectsList(true));
          setSelectedObjects([]);
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
    dispatch(setSelectedObjectView(null));

    return elements;
  };

  const sortChange = (sortData: any) => {
    const newSortDirection = get(sortData, "sortDirection", "DESC");
    setCurrentSortField(sortData.sortBy);
    setSortDirection(newSortDirection);
    dispatch(setLoadingObjectsList(true));
  };

  const pageTitle = decodeURLString(internalPaths);
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
    dispatch(setSelectedObjectView(null));

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

      // I case just one element is selected, then we trigger download modal validation.
      // We are going to enforce zip download when multiple files are selected
      if (itemsToDownload.length === 1) {
        if (
          itemsToDownload[0].name.length > 200 &&
          getClientOS().toLowerCase().includes("win")
        ) {
          setDownloadRenameModal(itemsToDownload[0]);
          return;
        }
      }

      itemsToDownload.forEach((filteredItem) => {
        downloadObject(filteredItem);
      });
    }
  };
  let uploadPath = [bucketName];
  if (currentPath.length > 0) {
    uploadPath = uploadPath.concat(currentPath);
  }

  const canDownload = hasPermission(bucketName, [IAM_SCOPES.S3_GET_OBJECT]);
  const canDelete = hasPermission(bucketName, [IAM_SCOPES.S3_DELETE_OBJECT]);
  const canUpload = hasPermission(uploadPath, [IAM_SCOPES.S3_PUT_OBJECT]);

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

      navigate(`/buckets/${bucketName}/browse/${encodeURLString(URLItem)}`);
    }

    dispatch(setObjectDetailsView(false));
    setSelectedObjects([]);

    if (forceRefresh) {
      dispatch(setLoadingObjectsList(true));
    }
  };

  const setDeletedAction = () => {
    dispatch(setShowDeletedObjects(!showDeleted));
    onClosePanel(true);
  };

  const closeRenameModal = () => {
    setDownloadRenameModal(null);
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
      disabled: !canDownload || selectedObjects.length === 0,
      icon: <DownloadIcon />,
      tooltip: canDownload
        ? "Download Selected"
        : permissionTooltipHelper(
            [IAM_SCOPES.S3_GET_OBJECT],
            "download objects from this bucket"
          ),
    },
    {
      action: openShare,
      label: "Share",
      disabled: selectedObjects.length !== 1 || !canShareFile,
      icon: <ShareIcon />,
      tooltip: canShareFile ? "Share Selected File" : "Sharing unavailable",
    },
    {
      action: openPreview,
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
                          dispatch(setLoadingObjectsList(true));
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
                  <Button
                    id={"test-ws-message"}
                    label={"Test WS"}
                    icon={<RefreshIcon />}
                    variant={"secondary"}
                    onClick={() => {
                      objectsWS.send("random string")
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
                              className={classes.overrideShowDeleted}
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
                    isLoading={false}
                    loadingMessage={loadingMessage}
                    entityName="Objects"
                    idField="name"
                    records={payload}
                    customPaperHeight={`${classes.browsePaper} ${
                      obOnly ? "isEmbedded" : ""
                    } ${detailsOpen ? "actionsPanelOpen" : ""}`}
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
                    parentClassName={classes.parentWrapper}
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
