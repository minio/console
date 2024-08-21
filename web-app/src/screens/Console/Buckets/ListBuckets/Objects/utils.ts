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

import { BucketObjectItem } from "./ListObjects/types";
import { removeTrace } from "../../../ObjectBrowser/transferManager";
import { store } from "../../../../../store";
import { ContentType, PermissionResource } from "api/consoleApi";
import { api } from "../../../../../api";
import { setErrorSnackMessage } from "../../../../../systemSlice";
import { StatusCodes } from "http-status-codes";
const downloadWithLink = (href: string, downloadFileName: string) => {
  const link = document.createElement("a");
  link.href = href;
  link.download = downloadFileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadSelectedAsZip = async (
  bucketName: string,
  objectList: string[],
  resultFileName: string,
) => {
  const state = store.getState();
  const anonymousMode = state.system.anonymousMode;

  try {
    const resp = await api.buckets.downloadMultipleObjects(
      bucketName,
      objectList,
      {
        type: ContentType.Json,
        headers: anonymousMode
          ? {
              "X-Anonymous": "1",
            }
          : undefined,
      },
    );
    const blob = await resp.blob();
    const href = window.URL.createObjectURL(blob);
    downloadWithLink(href, resultFileName);
  } catch (err: any) {
    store.dispatch(
      setErrorSnackMessage({
        errorMessage: `Download of multiple files failed. ${err.statusText}`,
        detailedError: "",
      }),
    );
  }
};

const isFolder = (objectPath: string) => {
  return objectPath.endsWith("/");
};

export const download = (
  bucketName: string,
  objectPath: string,
  versionID: any,
  fileSize: number,
  overrideFileName: string | null = null,
  id: string,
  progressCallback: (progress: number) => void,
  completeCallback: () => void,
  errorCallback: (msg: string) => void,
  abortCallback: () => void,
  toastCallback: () => void,
) => {
  let basename = document.baseURI.replace(window.location.origin, "");
  const state = store.getState();
  const anonymousMode = state.system.anonymousMode;

  let path = `${
    window.location.origin
  }${basename}api/v1/buckets/${encodeURIComponent(bucketName)}/objects/download?prefix=${encodeURIComponent(objectPath)}${
    overrideFileName !== null && overrideFileName.trim() !== ""
      ? `&override_file_name=${encodeURIComponent(overrideFileName || "")}`
      : ""
  }`;
  if (versionID) {
    path = path.concat(`&version_id=${versionID}`);
  }

  // If file is greater than 50GiB then we force browser download, if not then we use HTTP Request for Object Manager
  if (fileSize > 53687091200) {
    return new BrowserDownload(path, id, completeCallback, toastCallback);
  }

  let req = new XMLHttpRequest();
  req.open("GET", path, true);
  if (anonymousMode) {
    req.setRequestHeader("X-Anonymous", "1");
  }
  req.addEventListener(
    "progress",
    function (evt) {
      let percentComplete = Math.round((evt.loaded / fileSize) * 100);
      if (progressCallback) {
        progressCallback(percentComplete);
      }
    },
    false,
  );

  req.responseType = "blob";
  req.onreadystatechange = () => {
    if (req.readyState === XMLHttpRequest.DONE) {
      // Ensure object was downloaded fully, if it's a folder we don't get the fileSize
      let completeDownload =
        isFolder(objectPath) || req.response.size === fileSize;

      if (req.status === StatusCodes.OK && completeDownload) {
        const rspHeader = req.getResponseHeader("Content-Disposition");

        let filename = "download";
        if (rspHeader) {
          let rspHeaderDecoded = decodeURIComponent(rspHeader);
          filename = rspHeaderDecoded.split('"')[1];
        }

        if (completeCallback) {
          completeCallback();
        }

        removeTrace(id);

        downloadWithLink(window.URL.createObjectURL(req.response), filename);
      } else {
        if (req.getResponseHeader("Content-Type") === "application/json") {
          const rspBody: { detailedMessage?: string } = JSON.parse(
            req.response,
          );
          if (rspBody.detailedMessage) {
            errorCallback(rspBody.detailedMessage);
            return;
          }
        }
        errorCallback(`Unexpected response, download incomplete.`);
      }
    }
  };
  req.onerror = () => {
    if (errorCallback) {
      errorCallback("A network error occurred.");
    }
  };
  req.onabort = () => {
    if (abortCallback) {
      abortCallback();
    }
  };

  return req;
};

class BrowserDownload {
  path: string;
  id: string;
  completeCallback: () => void;
  toastCallback: () => void;

  constructor(
    path: string,
    id: string,
    completeCallback: () => void,
    toastCallback: () => void,
  ) {
    this.path = path;
    this.id = id;
    this.completeCallback = completeCallback;
    this.toastCallback = toastCallback;
  }

  send(): void {
    this.toastCallback();
    const link = document.createElement("a");
    link.href = this.path;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.completeCallback();
    removeTrace(this.id);
  }
}

export type AllowedPreviews = "image" | "pdf" | "audio" | "video" | "none";
const contentTypePreview = (contentType: string): AllowedPreviews => {
  if (contentType) {
    const mimeObjectType = (contentType || "").toLowerCase();

    if (mimeObjectType.includes("image")) {
      return "image";
    }
    if (mimeObjectType.includes("pdf")) {
      return "pdf";
    }
    if (mimeObjectType.includes("audio")) {
      return "audio";
    }
    if (mimeObjectType.includes("video")) {
      return "video";
    }
  }

  return "none";
};

// Review file extension by name & returns the type of preview browser that can be used
const extensionPreview = (fileName: string): AllowedPreviews => {
  const imageExtensions = [
    "jif",
    "jfif",
    "apng",
    "avif",
    "svg",
    "webp",
    "bmp",
    "ico",
    "jpg",
    "jpe",
    "jpeg",
    "gif",
    "png",
    "heic",
  ];
  const pdfExtensions = ["pdf"];
  const audioExtensions = ["wav", "mp3", "alac", "aiff", "dsd", "pcm"];
  const videoExtensions = [
    "mp4",
    "avi",
    "mpg",
    "webm",
    "mov",
    "flv",
    "mkv",
    "wmv",
    "avchd",
    "mpeg-4",
  ];

  let fileExtension = fileName.split(".").pop();

  if (!fileExtension) {
    return "none";
  }

  fileExtension = fileExtension.toLowerCase();

  if (imageExtensions.includes(fileExtension)) {
    return "image";
  }

  if (pdfExtensions.includes(fileExtension)) {
    return "pdf";
  }

  if (audioExtensions.includes(fileExtension)) {
    return "audio";
  }

  if (videoExtensions.includes(fileExtension)) {
    return "video";
  }

  return "none";
};

export const previewObjectType = (
  metaData: Record<any, any>,
  objectName: string,
) => {
  const metaContentType = (
    (metaData && metaData["Content-Type"]) ||
    ""
  ).toString();

  const extensionType = extensionPreview(objectName || "");
  const contentType = contentTypePreview(metaContentType);

  let objectType: AllowedPreviews = extensionType;

  if (extensionType === contentType) {
    objectType = extensionType;
  } else if (extensionType === "none" && contentType !== "none") {
    objectType = contentType;
  } else if (contentType === "none" && extensionType !== "none") {
    objectType = extensionType;
  }

  return objectType;
};
export const sortListObjects = (fieldSort: string) => {
  switch (fieldSort) {
    case "name":
      return (a: BucketObjectItem, b: BucketObjectItem) =>
        a.name.localeCompare(b.name);
    case "last_modified":
      return (a: BucketObjectItem, b: BucketObjectItem) =>
        new Date(a.last_modified).getTime() -
        new Date(b.last_modified).getTime();
    case "size":
      return (a: BucketObjectItem, b: BucketObjectItem) =>
        (a.size || -1) - (b.size || -1);
  }
};

export const permissionItems = (
  bucketName: string,
  currentPath: string,
  permissionsArray: PermissionResource[],
): BucketObjectItem[] | null => {
  if (permissionsArray.length === 0) {
    return null;
  }

  // We get permissions applied to the current bucket
  const filteredPermissionsForBucket = permissionsArray.filter(
    (permissionItem) =>
      permissionItem.resource?.endsWith(`:${bucketName}`) ||
      permissionItem.resource?.includes(`:${bucketName}/`),
  );

  // No permissions for this bucket. we can throw the error message at this point
  if (filteredPermissionsForBucket.length === 0) {
    return null;
  }

  let returnElements: BucketObjectItem[] = [];

  // We split current path
  const splitCurrentPath = currentPath.split("/");

  filteredPermissionsForBucket.forEach((permissionElement) => {
    // We review paths in resource address

    // We split ARN & get the last item to check the URL
    const splitARN = permissionElement.resource?.split(":");
    const urlARN = splitARN?.pop() || "";

    // We split the paths of the URL & compare against current location to see if there are more items to include. In case current level is a wildcard or is the last one, we omit this validation

    const splitURLARN = urlARN.split("/");

    // splitURL has more items than bucket name, we can continue validating
    if (splitURLARN.length > 1) {
      splitURLARN.every((currentElementInPath, index) => {
        // It is a wildcard element. We can store the verification as value should be included (?)
        if (currentElementInPath === "*") {
          return false;
        }

        // Element is not included in the path. The user is trying to browse something else.
        if (
          splitCurrentPath[index] &&
          splitCurrentPath[index] !== currentElementInPath
        ) {
          return false;
        }

        // This element is not included by index in the current paths list. We add it so user can browse into it
        if (!splitCurrentPath[index]) {
          returnElements.push({
            name: `${currentElementInPath}/`,
            size: 0,
            last_modified: "",
            version_id: "",
          });
        }

        return true;
      });
    }

    // We review prefixes in allow resources for StringEquals variant only.
    if (
      permissionElement.conditionOperator === "StringEquals" ||
      permissionElement.conditionOperator === "StringLike"
    ) {
      permissionElement.prefixes?.forEach((prefixItem) => {
        // Prefix Item is not empty?
        if (prefixItem !== "") {
          const splitItems = prefixItem.split("/");

          let pathToRouteElements: string[] = [];

          // We verify if currentPath is contained in the path begin, if is not contained the  user has no access to this subpath
          const cleanCurrPath = currentPath.replace(/\/$/, "");

          if (!prefixItem.startsWith(cleanCurrPath) && currentPath !== "") {
            return;
          }

          // For every split element we iterate and check if we can construct a URL
          splitItems.every((splitElement, index) => {
            if (!splitElement.includes("*") && splitElement !== "") {
              if (splitElement !== splitCurrentPath[index]) {
                returnElements.push({
                  name: `${pathToRouteElements.join("/")}${
                    pathToRouteElements.length > 0 ? "/" : ""
                  }${splitElement}/`,
                  size: 0,
                  last_modified: "",
                  version_id: "",
                });
                return false;
              }
              if (splitElement !== "") {
                pathToRouteElements.push(splitElement);
              }

              return true;
            }
            return false;
          });
        }
      });
    }
  });

  // We clean duplicated name entries
  if (returnElements.length > 0) {
    let clElements: BucketObjectItem[] = [];
    let keys: string[] = [];

    returnElements.forEach((itm) => {
      if (!keys.includes(itm.name)) {
        clElements.push(itm);
        keys.push(itm.name);
      }
    });

    returnElements = clElements;
  }

  return returnElements;
};
