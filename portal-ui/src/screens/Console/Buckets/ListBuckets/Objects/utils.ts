// This file is part of MinIO Console Server
// Copyright (c) 2020 MinIO, Inc.
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

import storage from "local-storage-fallback";

export const download = (bucketName: string, objectName: string) => {
  const anchor = document.createElement("a");
  document.body.appendChild(anchor);
  const token: string = storage.getItem("token")!;
  const xhr = new XMLHttpRequest();

  xhr.open(
    "GET",
    `/api/v1/buckets/${bucketName}/objects/download?prefix=${objectName}`,
    true
  );
  xhr.responseType = "blob";

  xhr.onload = function (e) {
    if (this.status === 200) {
      const blob = new Blob([this.response], {
        type: "octet/stream",
      });
      const blobUrl = window.URL.createObjectURL(blob);

      anchor.href = blobUrl;
      anchor.download = objectName;

      anchor.click();
      window.URL.revokeObjectURL(blobUrl);
      anchor.remove();
    }
  };
  xhr.send();
};
