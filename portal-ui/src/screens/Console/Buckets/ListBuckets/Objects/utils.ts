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

import { isNullOrUndefined } from "util";

export const download = (
  bucketName: string,
  objectPath: string,
  versionID: any,
  callBack?: (objIdentifier: string) => void,
  includeVersionInCallback?: boolean
) => {
  const anchor = document.createElement("a");
  document.body.appendChild(anchor);
  const encodedPath = encodeURIComponent(objectPath);
  let path = `/api/v1/buckets/${bucketName}/objects/download?prefix=${encodedPath}`;
  if (!isNullOrUndefined(versionID) && versionID !== "null") {
    path = path.concat(`&version_id=${versionID}`);
  }
  window.location.href = path;
};

// Review file extension by name & returns the type of preview browser that can be used
export const extensionPreview = (
  fileName: string
): "image" | "text" | "audio" | "video" | "none" => {
  const imageExtensions = ["jpg", "jpeg", "gif", "png"];
  const textExtensions = ["pdf", "txt"];
  const audioExtensions = ["wav", "mp3", "aac"];
  const videoExtensions = ["mp4", ".avi", ".mpg"];

  const fileExtension = fileName.split(".").pop();

  if (!fileExtension) {
    return "none";
  }

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
