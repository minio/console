// This file is part of MinIO Console Server
// Copyright (c) 2023 MinIO, Inc.
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

import get from "lodash/get";
import { Middleware } from "@reduxjs/toolkit";
import { AppState } from "../store";
import { wsProtocol } from "../utils/wsUtils";
import {
  errorInConnection,
  newMessage,
  resetMessages,
  setRecords,
  setReloadObjectsList,
  setRequestInProgress,
  setSearchObjects,
  setSelectedBucket,
  setSelectedObjects,
  setSimplePathHandler,
} from "../screens/Console/ObjectBrowser/objectBrowserSlice";
import {
  WebsocketRequest,
  WebsocketResponse,
} from "../screens/Console/Buckets/ListBuckets/Objects/ListObjects/types";
import { permissionItems } from "../screens/Console/Buckets/ListBuckets/Objects/utils";
import { setErrorSnackMessage } from "../systemSlice";

let wsInFlight: boolean = false;
let currentRequestID: number = 0;

export const objectBrowserWSMiddleware = (
  objectsWS: WebSocket,
): Middleware<{}, AppState> => {
  return (storeApi) => (next) => (action) => {
    const dispatch = storeApi.dispatch;
    const storeState = storeApi.getState();

    const allowResources = get(
      storeState,
      "console.session.allowResources",
      null,
    );
    const bucketName = get(storeState, "objectBrowser.selectedBucket", "");

    const { type } = action;
    switch (type) {
      case "socket/OBConnect":
        const sessionInitialized = get(storeState, "system.loggedIn", false);

        if (wsInFlight || !sessionInitialized) {
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
          `${wsProt}://${url.hostname}:${port}${baseUrl}ws/objectManager`,
        );

        objectsWS.onopen = () => {
          wsInFlight = false;
        };

        objectsWS.onmessage = (message) => {
          const basicErrorMessage = {
            errorMessage: "An error occurred",
            detailedMessage:
              "An unknown error occurred. Please refer to Console logs to get more information.",
          };

          const response: WebsocketResponse = JSON.parse(
            message.data.toString(),
          );
          if (currentRequestID === response.request_id) {
            // If response is not from current request, we can omit
            if (response.request_id !== currentRequestID) {
              return;
            }

            if (response.error?.Code === 401) {
              // Session expired. We reload this page
              window.location.reload();
            } else if (response.error?.Code === 403) {
              const internalPathsPrefix = response.prefix;
              let pathPrefix = "";

              if (internalPathsPrefix) {
                pathPrefix = internalPathsPrefix.endsWith("/")
                  ? internalPathsPrefix
                  : internalPathsPrefix + "/";
              }

              const permitItems = permissionItems(
                response.bucketName || bucketName,
                pathPrefix,
                allowResources || [],
              );

              if (!permitItems || permitItems.length === 0) {
                const errorMsg = response.error.APIError;

                dispatch(
                  setErrorSnackMessage({
                    errorMessage:
                      errorMsg.message || basicErrorMessage.errorMessage,
                    detailedError:
                      errorMsg.detailedMessage ||
                      basicErrorMessage.detailedMessage,
                  }),
                );
              } else {
                dispatch(setRequestInProgress(false));
                dispatch(setRecords(permitItems));
              }

              return;
            } else if (response.error) {
              const errorMsg = response.error.APIError;

              dispatch(setRequestInProgress(false));
              dispatch(
                setErrorSnackMessage({
                  errorMessage:
                    errorMsg.message || basicErrorMessage.errorMessage,
                  detailedError:
                    errorMsg.detailedMessage ||
                    basicErrorMessage.detailedMessage,
                }),
              );
            }

            // This indicates final messages is received.
            if (response.request_end) {
              dispatch(setRequestInProgress(false));
              return;
            }

            if (response.data) {
              dispatch(setRequestInProgress(false));
              dispatch(newMessage(response.data));
            }
          }
        };

        objectsWS.onclose = () => {
          wsInFlight = false;
          console.warn("Websocket Disconnected. Attempting Reconnection...");

          // We reconnect after 3 seconds
          setTimeout(() => dispatch({ type: "socket/OBConnect" }), 3000);
        };

        objectsWS.onerror = () => {
          wsInFlight = false;
          console.error(
            "Error in websocket connection. Attempting reconnection...",
          );
          // Onclose will be triggered by specification, reconnect function will be executed there to avoid duplicated requests
        };

        break;

      case "socket/OBRequest":
        if (objectsWS && objectsWS.readyState === 1) {
          try {
            const newRequestID = currentRequestID + 1;
            const dataPayload = action.payload;

            dispatch(resetMessages());
            dispatch(errorInConnection(false));
            dispatch(setSimplePathHandler(dataPayload.path));
            dispatch(setSelectedBucket(dataPayload.bucketName));
            dispatch(setRequestInProgress(true));
            dispatch(setReloadObjectsList(false));
            dispatch(setSearchObjects(""));
            dispatch(setSelectedObjects([]));

            const request: WebsocketRequest = {
              bucket_name: dataPayload.bucketName,
              prefix: dataPayload.path,
              mode: dataPayload.rewindMode ? "rewind" : "objects",
              date: dataPayload.date,
              request_id: newRequestID,
            };

            objectsWS.send(JSON.stringify(request));

            // We store the new ID for the requestID
            currentRequestID = newRequestID;
          } catch (e) {
            console.error(e);
          }
        } else {
          dispatch(setReloadObjectsList(false));

          if (!wsInFlight) {
            dispatch({ type: "socket/OBConnect" });
          }
          // Retry request after 1 second
          setTimeout(
            () =>
              dispatch({ type: "socket/OBRequest", payload: action.payload }),
            1000,
          );
        }

        break;
      case "socket/OBCancelLast":
        const request: WebsocketRequest = {
          mode: "cancel",
          request_id: currentRequestID,
        };

        if (objectsWS && objectsWS.readyState === 1) {
          objectsWS.send(JSON.stringify(request));
        }
        break;
      case "socket/OBDisconnect":
        if (objectsWS) {
          objectsWS.close();
        }
        break;

      default:
        break;
    }
    return next(action);
  };
};
