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

import React, { Fragment, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { AppState, useAppDispatch } from "../../../../store";
import { containerForHeader } from "../../Common/FormComponents/common/styleLibrary";

import ListObjects from "../ListBuckets/Objects/ListObjects/ListObjects";
import { IAM_SCOPES } from "../../../../common/SecureComponent/permissions";
import {
  errorInConnection,
  newMessage,
  resetMessages,
  setIsOpeningOD,
  setIsVersioned,
  setLoadingLocking,
  setLoadingObjectInfo,
  setLoadingObjects,
  setLoadingRecords,
  setLoadingVersioning,
  setLoadingVersions,
  setLockingEnabled,
  setObjectDetailsView,
  setRecords,
  setSelectedObjectView,
  setSimplePathHandler,
  setVersionsModeEnabled,
} from "../../ObjectBrowser/objectBrowserSlice";
import hasPermission from "../../../../common/SecureComponent/accessControl";
import { IMessageEvent } from "websocket";
import { wsProtocol } from "../../../../utils/wsUtils";
import {
  WebsocketRequest,
  WebsocketResponse,
} from "../ListBuckets/Objects/ListObjects/types";
import { decodeURLString, encodeURLString } from "../../../../common/utils";
import { permissionItems } from "../ListBuckets/Objects/utils";
import { setErrorSnackMessage } from "../../../../systemSlice";
import api from "../../../../common/api";
import { BucketObjectLocking, BucketVersioningInfo } from "../types";
import { ErrorResponseHandler } from "../../../../common/types";
import OBHeader from "../../ObjectBrowser/OBHeader";

const styles = (theme: Theme) =>
  createStyles({
    ...containerForHeader,
  });

let objectsWS: WebSocket;
let currentRequestID: number = 0;
let errorCounter: number = 0;
let wsInFlight: boolean = false;

const initWSConnection = (
  openCallback?: () => void,
  onMessageCallback?: (message: IMessageEvent) => void,
  connErrorCallback?: (message: string) => void
) => {
  if (wsInFlight) {
    return;
  }
  wsInFlight = true;
  const url = new URL(window.location.toString());
  const isDev = process.env.NODE_ENV === "development";
  const port = isDev ? "9090" : url.port;

  // check if we are using base path, if not this always is `/`
  const baseLocation = new URL(document.baseURI);
  const baseUrl = baseLocation.pathname;

  const wsProt = wsProtocol(url.protocol);

  objectsWS = new WebSocket(
    `${wsProt}://${url.hostname}:${port}${baseUrl}ws/objectManager`
  );

  objectsWS.onopen = () => {
    wsInFlight = false;
    if (openCallback) {
      openCallback();
    }
    errorCounter = 0;
  };

  if (onMessageCallback) {
    objectsWS.onmessage = onMessageCallback;
  }

  const reconnectFn = () => {
    if (errorCounter <= 5) {
      initWSConnection(() => {}, onMessageCallback, connErrorCallback);
      errorCounter += 1;
    } else {
      console.error(
        "Websocket not available. Please review that your environment settings are enabled to allow websocket connections and that requests are made from the same origin."
      );
      if (connErrorCallback) {
        connErrorCallback(
          "Couldn't establish WebSocket connection. Please review your configuration and try again."
        );
      }
    }
  };

  objectsWS.onclose = () => {
    wsInFlight = false;
    console.warn("Websocket Disconnected. Attempting Reconnection...");

    // We reconnect after 3 seconds
    setTimeout(reconnectFn, 3000);
  };

  objectsWS.onerror = () => {
    wsInFlight = false;
    console.error("Error in websocket connection. Attempting reconnection...");
    // Onclose will be triggered by specification, reconnect function will be executed there to avoid duplicated requests
  };
};

const BrowserHandler = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const location = useLocation();

  const loadingVersioning = useSelector(
    (state: AppState) => state.objectBrowser.loadingVersioning
  );

  const rewindEnabled = useSelector(
    (state: AppState) => state.objectBrowser.rewind.rewindEnabled
  );
  const rewindDate = useSelector(
    (state: AppState) => state.objectBrowser.rewind.dateToRewind
  );
  const showDeleted = useSelector(
    (state: AppState) => state.objectBrowser.showDeleted
  );
  const allowResources = useSelector(
    (state: AppState) => state.console.session.allowResources
  );
  const loadingObjects = useSelector(
    (state: AppState) => state.objectBrowser.loadingObjects
  );
  const loadingLocking = useSelector(
    (state: AppState) => state.objectBrowser.loadingLocking
  );
  const loadRecords = useSelector(
    (state: AppState) => state.objectBrowser.loadRecords
  );
  const selectedInternalPaths = useSelector(
    (state: AppState) => state.objectBrowser.selectedInternalPaths
  );
  const simplePath = useSelector(
    (state: AppState) => state.objectBrowser.simplePath
  );
  const isOpeningOD = useSelector(
    (state: AppState) => state.objectBrowser.isOpeningObjectDetail
  );
  const anonymousMode = useSelector(
    (state: AppState) => state.system.anonymousMode
  );

  const bucketName = params.bucketName || "";
  const pathSegment = location.pathname.split(`/browser/${bucketName}/`);
  const internalPaths = pathSegment.length === 2 ? pathSegment[1] : "";

  /*WS Request Handlers*/
  const onMessageCallBack = useCallback(
    (message: IMessageEvent) => {
      // reset start status
      dispatch(setLoadingObjects(false));

      const response: WebsocketResponse = JSON.parse(message.data.toString());
      if (currentRequestID === response.request_id) {
        // If response is not from current request, we can omit
        if (response.request_id !== currentRequestID) {
          return;
        }

        if (
          response.error ===
          "The Access Key Id you provided does not exist in our records."
        ) {
          // Session expired.
          window.location.reload();
        } else if (response.error === "Access Denied.") {
          const internalPathsPrefix = response.prefix;
          let pathPrefix = "";

          if (internalPathsPrefix) {
            const decodedPath = decodeURLString(internalPathsPrefix);

            pathPrefix = decodedPath.endsWith("/")
              ? decodedPath
              : decodedPath + "/";
          }

          const permitItems = permissionItems(
            bucketName,
            pathPrefix,
            allowResources || []
          );

          if (!permitItems || permitItems.length === 0) {
            dispatch(
              setErrorSnackMessage({
                errorMessage: response.error,
                detailedError: response.error,
              })
            );
          } else {
            dispatch(setRecords(permitItems));
          }

          return;
        }

        // This indicates final messages is received.
        if (response.request_end) {
          dispatch(setLoadingObjects(false));
          dispatch(setLoadingRecords(false));
          return;
        }

        if (response.data) {
          dispatch(newMessage(response.data));
        }
      }
    },
    [dispatch, allowResources, bucketName]
  );

  const initWSRequest = useCallback(
    (path: string, date: Date) => {
      if (objectsWS && objectsWS.readyState === 1) {
        try {
          const newRequestID = currentRequestID + 1;
          dispatch(resetMessages());
          dispatch(errorInConnection(false));

          const request: WebsocketRequest = {
            bucket_name: bucketName,
            prefix: encodeURLString(path),
            mode: rewindEnabled || showDeleted ? "rewind" : "objects",
            date: date.toISOString(),
            request_id: newRequestID,
          };

          objectsWS.send(JSON.stringify(request));

          // We store the new ID for the requestID
          currentRequestID = newRequestID;
        } catch (e) {
          console.error(e);
        }
      } else {
        // Socket is disconnected, we request reconnection but will need to recreate call
        const dupRequest = () => {
          initWSRequest(path, date);
        };

        const fatalWSError = (message: string) => {
          dispatch(
            setErrorSnackMessage({
              errorMessage: message,
              detailedError: message,
            })
          );
          dispatch(errorInConnection(true));
        };

        initWSConnection(dupRequest, onMessageCallBack, fatalWSError);
      }
    },
    [bucketName, rewindEnabled, showDeleted, dispatch, onMessageCallBack]
  );

  useEffect(() => {
    return () => {
      const request: WebsocketRequest = {
        mode: "cancel",
        request_id: currentRequestID,
      };

      if (objectsWS && objectsWS.readyState === 1) {
        objectsWS.send(JSON.stringify(request));
      }
    };
  }, []);

  useEffect(() => {
    const decodedIPaths = decodeURLString(internalPaths);

    dispatch(setLoadingVersioning(true));

    if (decodedIPaths.endsWith("/") || decodedIPaths === "") {
      dispatch(setObjectDetailsView(false));
      dispatch(setSelectedObjectView(null));
      dispatch(
        setSimplePathHandler(decodedIPaths === "" ? "/" : decodedIPaths)
      );
      dispatch(setLoadingLocking(true));
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

  // Direct file access effect / prefix
  useEffect(() => {
    if (!loadingObjects && !loadRecords && !rewindEnabled && !isOpeningOD) {
      // No requests are in progress, We review current path, if it doesn't end in '/' and current list is empty then we trigger a new request.
      const decodedInternalPaths = decodeURLString(internalPaths);

      if (
        !decodedInternalPaths.endsWith("/") &&
        simplePath !== decodedInternalPaths &&
        decodedInternalPaths !== ""
      ) {
        setLoadingRecords(true);
        const parentPath = `${decodedInternalPaths
          .split("/")
          .slice(0, -1)
          .join("/")}/`;

        initWSRequest(parentPath, new Date());
      }
    }
    dispatch(setIsOpeningOD(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    loadingObjects,
    loadRecords,
    dispatch,
    internalPaths,
    initWSRequest,
    rewindEnabled,
    simplePath,
  ]);

  const displayListObjects =
    hasPermission(bucketName, [
      IAM_SCOPES.S3_LIST_BUCKET,
      IAM_SCOPES.S3_ALL_LIST_BUCKET,
    ]) || anonymousMode;

  // Common objects list
  useEffect(() => {
    // begin watch if bucketName in bucketList and start pressed
    if (loadingObjects && displayListObjects) {
      let pathPrefix = "";
      if (internalPaths) {
        const decodedPath = decodeURLString(internalPaths);

        // internalPaths are selected (file details), we split and get parent folder
        if (selectedInternalPaths === internalPaths) {
          pathPrefix = `${decodeURLString(internalPaths)
            .split("/")
            .slice(0, -1)
            .join("/")}/`;
        } else {
          pathPrefix = decodedPath.endsWith("/")
            ? decodedPath
            : decodedPath + "/";
        }
      }

      let requestDate = new Date();

      if (rewindEnabled && rewindDate) {
        requestDate = new Date(rewindDate);
      }
      initWSRequest(pathPrefix, requestDate);
    } else {
      dispatch(setLoadingObjects(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    loadingObjects,
    internalPaths,
    dispatch,
    rewindDate,
    rewindEnabled,
    displayListObjects,
    initWSRequest,
  ]);

  useEffect(() => {
    dispatch(setVersionsModeEnabled({ status: false }));
  }, [internalPaths, dispatch]);

  useEffect(() => {
    if (loadingVersioning && !anonymousMode) {
      if (displayListObjects) {
        api
          .invoke("GET", `/api/v1/buckets/${bucketName}/versioning`)
          .then((res: BucketVersioningInfo) => {
            dispatch(setIsVersioned(res));
            dispatch(setLoadingVersioning(false));
          })
          .catch((err: ErrorResponseHandler) => {
            console.error(
              "Error Getting Object Versioning Status: ",
              err.detailedError
            );
            dispatch(setLoadingVersioning(false));
          });
      } else {
        dispatch(setLoadingVersioning(false));
        dispatch(resetMessages());
      }
    }
  }, [
    bucketName,
    loadingVersioning,
    dispatch,
    displayListObjects,
    anonymousMode,
  ]);

  useEffect(() => {
    if (loadingLocking) {
      if (displayListObjects) {
        api
          .invoke("GET", `/api/v1/buckets/${bucketName}/object-locking`)
          .then((res: BucketObjectLocking) => {
            dispatch(setLockingEnabled(res.object_locking_enabled));
            dispatch(setLoadingLocking(false));
          })
          .catch((err: ErrorResponseHandler) => {
            console.error(
              "Error Getting Object Locking Status: ",
              err.detailedError
            );
            dispatch(setLoadingLocking(false));
          });
      } else {
        dispatch(resetMessages());
        dispatch(setLoadingLocking(false));
      }
    }
  }, [bucketName, loadingLocking, dispatch, displayListObjects]);

  useEffect(() => {
    if (loadingLocking) {
      if (displayListObjects) {
        api
          .invoke("GET", `/api/v1/buckets/${bucketName}/object-locking`)
          .then((res: BucketObjectLocking) => {
            dispatch(setLockingEnabled(res.object_locking_enabled));
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
        dispatch(resetMessages());
        setLoadingLocking(false);
      }
    }
  }, [bucketName, loadingLocking, dispatch, displayListObjects]);

  return (
    <Fragment>
      {!anonymousMode && <OBHeader bucketName={bucketName} />}
      <ListObjects />
    </Fragment>
  );
};

export default withStyles(styles)(BrowserHandler);
