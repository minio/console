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

import React, { Fragment, useEffect } from "react";
import { AppState, useAppDispatch } from "../../../../store";
import { useSelector } from "react-redux";
import {
  callForObjectID,
  formDataFromID,
} from "../../ObjectBrowser/transferManager";
import {
  newDownloadInit,
  newUploadInit,
} from "../../ObjectBrowser/objectBrowserSlice";

const TrafficMonitor = () => {
  const dispatch = useAppDispatch();

  const objects = useSelector(
    (state: AppState) => state.objectBrowser.objectManager.objectsToManage,
  );

  const limitVars = useSelector((state: AppState) =>
    state.console.session ? state.console.session.envConstants : null,
  );

  const currentDIP = useSelector(
    (state: AppState) => state.objectBrowser.objectManager.currentDownloads,
  );

  const currentUIP = useSelector(
    (state: AppState) => state.objectBrowser.objectManager.currentUploads,
  );

  const limitUploads = limitVars?.maxConcurrentUploads || 10;
  const limitDownloads = limitVars?.maxConcurrentDownloads || 20;

  useEffect(() => {
    if (objects.length > 0) {
      const filterDownloads = objects.filter(
        (object) =>
          object.type === "download" &&
          !object.done &&
          !currentDIP.includes(object.ID),
      );
      const filterUploads = objects.filter(
        (object) =>
          object.type === "upload" &&
          !object.done &&
          !currentUIP.includes(object.ID),
      );

      const remainingDownloadSlots = limitDownloads - currentDIP.length;

      if (
        filterDownloads.length > 0 &&
        (remainingDownloadSlots > 0 || limitDownloads === 0)
      ) {
        const itemsToDownload = filterDownloads.slice(
          0,
          remainingDownloadSlots,
        );

        itemsToDownload.forEach((item) => {
          const objectRequest = callForObjectID(item.ID);

          if (objectRequest) {
            objectRequest.send();
          }

          dispatch(newDownloadInit(item.ID));
        });
      }

      const remainingUploadSlots = limitUploads - currentUIP.length;

      if (
        filterUploads.length > 0 &&
        (remainingUploadSlots > 0 || limitUploads === 0)
      ) {
        const itemsToUpload = filterUploads.slice(0, remainingUploadSlots);

        itemsToUpload.forEach((item) => {
          const uploadRequest = callForObjectID(item.ID);
          const formDataID = formDataFromID(item.ID);

          if (uploadRequest && formDataID) {
            uploadRequest.send(formDataID);
          }
          dispatch(newUploadInit(item.ID));
        });
      }
    }
  }, [objects, limitUploads, limitDownloads, currentDIP, currentUIP, dispatch]);

  return <Fragment />;
};

export default TrafficMonitor;
