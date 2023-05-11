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
import { encodeURLString } from "../../../../../common/utils";
import { removeTrace } from "../../../ObjectBrowser/transferManager";
import streamSaver from "streamsaver";
import store from "../../../../../store";

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
  toastCallback: () => void
) => {
  const anchor = document.createElement("a");
  document.body.appendChild(anchor);
  let basename = document.baseURI.replace(window.location.origin, "");
  const state = store.getState();
  const anonymousMode = state.system.anonymousMode;

  let path = `${
    window.location.origin
  }${basename}api/v1/buckets/${bucketName}/objects/download?prefix=${objectPath}${
    overrideFileName !== null && overrideFileName.trim() !== ""
      ? `&override_file_name=${encodeURLString(overrideFileName || "")}`
      : ""
  }`;
  if (versionID) {
    path = path.concat(`&version_id=${versionID}`);
  }
  return new DownloadHelper(
    path,
    id,
    anonymousMode,
    fileSize,
    progressCallback,
    completeCallback,
    errorCallback,
    abortCallback,
    toastCallback
  );
};

class DownloadHelper {
  aborter: AbortController;
  path: string;
  id: string;
  filename: string = "";
  anonymousMode: boolean;
  fileSize: number = 0;
  writer: any = null;
  progressCallback: (progress: number) => void;
  completeCallback: () => void;
  errorCallback: (msg: string) => void;
  abortCallback: () => void;
  toastCallback: () => void;

  constructor(
    path: string,
    id: string,
    anonymousMode: boolean,
    fileSize: number,
    progressCallback: (progress: number) => void,
    completeCallback: () => void,
    errorCallback: (msg: string) => void,
    abortCallback: () => void,
    toastCallback: () => void
  ) {
    this.aborter = new AbortController();
    this.path = path;
    this.id = id;
    this.anonymousMode = anonymousMode;
    this.fileSize = fileSize;
    this.progressCallback = progressCallback;
    this.completeCallback = completeCallback;
    this.errorCallback = errorCallback;
    this.abortCallback = abortCallback;
    this.toastCallback = toastCallback;
  }

  abort(): void {
    this.aborter.abort();
    this.abortCallback();
    if (this.writer) {
      this.writer.abort();
    }
  }

  send(): void {
    let isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
      this.toastCallback();
      this.downloadSafari();
    } else {
      this.download({
        url: this.path,
        chunkSize: 1024 * 1024 * 1024 * 1.5,
      });
    }
  }

  async getRangeContent(url: string, start: number, end: number) {
    const info = this.getRequestInfo(start, end);
    const response = await fetch(url, info);
    if (response.ok && response.body) {
      if (!this.filename) {
        this.filename = this.getFilename(response);
      }
      if (!this.writer) {
        this.writer = streamSaver.createWriteStream(this.filename).getWriter();
      }
      const reader = response.body.getReader();
      let done, value;
      while (!done) {
        ({ value, done } = await reader.read());
        if (done) {
          break;
        }
        await this.writer.write(value);
      }
    } else {
      throw new Error(`Unexpected response status code (${response.status}).`);
    }
  }

  getRequestInfo(start: number, end: number) {
    const info: RequestInit = {
      signal: this.aborter.signal,
      headers: { range: `bytes=${start}-${end}` },
    };
    if (this.anonymousMode) {
      info.headers = { ...info.headers, "X-Anonymous": "1" };
    }
    return info;
  }

  getFilename(response: Response) {
    const rspHeader = response.headers.get("Content-Disposition");
    if (rspHeader) {
      let rspHeaderDecoded = decodeURIComponent(rspHeader);
      return rspHeaderDecoded.split('"')[1];
    }
    return "download";
  }

  async download({ url, chunkSize }: any) {
    const numberOfChunks = Math.ceil(this.fileSize / chunkSize);
    this.progressCallback(0);
    try {
      for (let i = 0; i < numberOfChunks; i++) {
        let start = i * chunkSize;
        let end =
          i + 1 === numberOfChunks
            ? this.fileSize - 1
            : (i + 1) * chunkSize - 1;
        await this.getRangeContent(url, start, end);
        let percentComplete = Math.round(((i + 1) / numberOfChunks) * 100);
        this.progressCallback(percentComplete);
      }
      this.writer.close();
      this.completeCallback();
      removeTrace(this.id);
    } catch (e: any) {
      this.errorCallback(e.message);
    }
  }

  downloadSafari() {
    const link = document.createElement("a");
    link.href = this.path;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.completeCallback();
    removeTrace(this.id);
  }
}

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
  const textExtensions = ["pdf"];
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

  return returnElements;
};
