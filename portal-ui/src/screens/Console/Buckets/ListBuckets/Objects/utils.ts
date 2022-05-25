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
import { IAllowResources } from "../../../types";

export const download = (
  bucketName: string,
  objectPath: string,
  versionID: any,
  fileSize: number,
  progressCallback: (progress: number) => void,
  completeCallback: () => void,
  errorCallback: () => void,
  abortCallback: () => void
) => {
  const anchor = document.createElement("a");
  document.body.appendChild(anchor);
  let path = `/api/v1/buckets/${bucketName}/objects/download?prefix=${objectPath}`;
  if (versionID) {
    path = path.concat(`&version_id=${versionID}`);
  }

  var req = new XMLHttpRequest();
  req.open("GET", path, true);
  req.addEventListener(
    "progress",
    function (evt) {
      var percentComplete = Math.round((evt.loaded / fileSize) * 100);

      if (progressCallback) {
        progressCallback(percentComplete);
      }
    },
    false
  );

  req.responseType = "blob";
  req.onreadystatechange = () => {
    if (req.readyState === 4 && req.status === 200) {
      const rspHeader = req.getResponseHeader("Content-Disposition");

      let filename = "download";
      if (rspHeader) {
        let rspHeaderDecoded = decodeURIComponent(rspHeader);
        filename = rspHeaderDecoded.split('"')[1];
      }

      if (completeCallback) {
        completeCallback();
      }

      var link = document.createElement("a");
      link.href = window.URL.createObjectURL(req.response);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  req.onerror = () => {
    if (errorCallback) {
      errorCallback();
    }
  };
  req.onabort = () => {
    if (abortCallback) {
      abortCallback();
    }
  };
  //req.send();

  return req;
};

// Review file extension by name & returns the type of preview browser that can be used
export const extensionPreview = (
  fileName: string
): "image" | "text" | "audio" | "video" | "none" => {
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
  const textExtensions = ["pdf", "txt", "json"];
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

  if (textExtensions.includes(fileExtension)) {
    return "text";
  }

  if (audioExtensions.includes(fileExtension)) {
    return "audio";
  }

  if (videoExtensions.includes(fileExtension)) {
    return "video";
  }

  return "none";
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
  permissionsArray: IAllowResources[]
): BucketObjectItem[] | null => {
  if (permissionsArray.length === 0) {
    return null;
  }

  // We get permissions applied to the current bucket
  const filteredPermissionsForBucket = permissionsArray.filter(
    (permissionItem) =>
      permissionItem.resource.endsWith(`:${bucketName}`) ||
      permissionItem.resource.includes(`:${bucketName}/`)
  );

  // No permissions for this bucket. we can throw the error message at this point
  if (filteredPermissionsForBucket.length === 0) {
    return null;
  }

  const returnElements: BucketObjectItem[] = [];

  // We split current path
  const splitCurrentPath = currentPath.split("/");

  filteredPermissionsForBucket.forEach((permissionElement) => {
    // We review paths in resource address

    // We split ARN & get the last item to check the URL
    const splitARN = permissionElement.resource.split(":");
    const urlARN = splitARN.pop() || "";

    // We split the paths of the URL & compare against current location to see if there are more items to include. In case current level is a wildcard or is the last one, we omit this validation

    const splitURLARN = urlARN.split("/");

    // splitURL has more items than bucket name, we can continue validating
    if (splitURLARN.length > 1) {
      splitURLARN.every((currentElementInPath, index) => {
        // It is a wildcard element. We can stor the verification as value should be included (?)
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
            last_modified: new Date(),
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
      permissionElement.prefixes.forEach((prefixItem) => {
        // Prefix Item is not empty?
        if (prefixItem !== "") {
          const splitItems = prefixItem.split("/");

          let pathToRouteElements: string[] = [];

          splitItems.every((splitElement, index) => {
            if (!splitElement.includes("*") && splitElement !== "") {
              if (splitElement !== splitCurrentPath[index]) {
                returnElements.push({
                  name: `${pathToRouteElements.join("/")}${
                    pathToRouteElements.length > 0 ? "/" : ""
                  }${splitElement}/`,
                  size: 0,
                  last_modified: new Date(),
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

  return returnElements;
};
