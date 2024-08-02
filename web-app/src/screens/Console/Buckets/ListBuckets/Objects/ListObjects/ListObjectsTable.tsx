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

import React, { useState } from "react";
import { listModeColumns, rewindModeColumns } from "./ListObjectsHelpers";
import { useSelector } from "react-redux";
import { AppState, useAppDispatch } from "../../../../../../store";
import { selFeatures } from "../../../../consoleSlice";
import {
  setLoadingVersions,
  setObjectDetailsView,
  setReloadObjectsList,
  setSelectedObjects,
  setSelectedObjectView,
} from "../../../../ObjectBrowser/objectBrowserSlice";
import { useNavigate, useParams } from "react-router-dom";
import get from "lodash/get";
import { sortListObjects } from "../utils";
import { BucketObjectItem } from "./types";
import {
  IAM_SCOPES,
  permissionTooltipHelper,
} from "../../../../../../common/SecureComponent/permissions";
import { hasPermission } from "../../../../../../common/SecureComponent";
import { downloadObject } from "../../../../ObjectBrowser/utils";
import { DataTable, ItemActions } from "mds";
import { BucketObject } from "api/consoleApi";

const ListObjectsTable = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const navigate = useNavigate();

  const [sortDirection, setSortDirection] = useState<
    "ASC" | "DESC" | undefined
  >("ASC");
  const [currentSortField, setCurrentSortField] = useState<string>("name");

  const bucketName = params.bucketName || "";

  const detailsOpen = useSelector(
    (state: AppState) => state.objectBrowser.objectDetailsOpen,
  );

  const requestInProgress = useSelector(
    (state: AppState) => state.objectBrowser.requestInProgress,
  );

  const features = useSelector(selFeatures);
  const obOnly = !!features?.includes("object-browser-only");

  const rewindEnabled = useSelector(
    (state: AppState) => state.objectBrowser.rewind.rewindEnabled,
  );
  const records = useSelector((state: AppState) => state.objectBrowser.records);
  const searchObjects = useSelector(
    (state: AppState) => state.objectBrowser.searchObjects,
  );
  const selectedObjects = useSelector(
    (state: AppState) => state.objectBrowser.selectedObjects,
  );
  const connectionError = useSelector(
    (state: AppState) => state.objectBrowser.connectionError,
  );
  const anonymousMode = useSelector(
    (state: AppState) => state.system.anonymousMode,
  );

  const displayListObjects = hasPermission(bucketName, [
    IAM_SCOPES.S3_LIST_BUCKET,
    IAM_SCOPES.S3_ALL_LIST_BUCKET,
  ]);

  const plSelect = records.filter((b: BucketObjectItem) => {
    if (searchObjects === "") {
      return true;
    } else {
      const objectName = b.name.toLowerCase();
      return objectName.indexOf(searchObjects.toLowerCase()) >= 0;
    }
  });
  const sortASC = plSelect.sort(sortListObjects(currentSortField));

  let payload: BucketObjectItem[] = [];

  if (sortDirection === "ASC") {
    payload = sortASC;
  } else {
    payload = sortASC.reverse();
  }

  const openPath = (object: BucketObject) => {
    const idElement = object.name || "";
    const newPath = `/browser/${encodeURIComponent(bucketName)}${
      idElement ? `/${encodeURIComponent(idElement)}` : ``
    }`;

    // for anonymous start download
    if (anonymousMode && !object.name?.endsWith("/")) {
      downloadObject(dispatch, bucketName, idElement, object);
      return;
    }
    dispatch(setSelectedObjects([]));

    navigate(newPath);

    if (!anonymousMode) {
      dispatch(setObjectDetailsView(true));
      dispatch(setLoadingVersions(true));
    }
    dispatch(setSelectedObjectView(idElement));
  };
  const tableActions: ItemActions[] = [
    {
      type: "view",
      tooltip: "View",
      onClick: openPath,
      sendOnlyId: false,
    },
  ];

  const sortChange = (sortData: any) => {
    const newSortDirection = get(sortData, "sortDirection", "DESC");
    setCurrentSortField(sortData.sortBy);
    setSortDirection(newSortDirection);
    dispatch(setReloadObjectsList(true));
  };

  const selectAllItems = () => {
    dispatch(setSelectedObjectView(null));

    if (selectedObjects.length === payload.length) {
      dispatch(setSelectedObjects([]));
      return;
    }

    const elements = payload.map((item) => item.name);
    dispatch(setSelectedObjects(elements));
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
    dispatch(setSelectedObjects(elements));
    dispatch(setSelectedObjectView(null));

    return elements;
  };

  let errorMessage =
    !displayListObjects && !anonymousMode
      ? permissionTooltipHelper(
          [IAM_SCOPES.S3_LIST_BUCKET, IAM_SCOPES.S3_ALL_LIST_BUCKET],
          "view Objects in this bucket",
        )
      : `This location is empty${
          !rewindEnabled ? ", please try uploading a new file" : ""
        }`;

  if (connectionError) {
    errorMessage =
      "Objects List unavailable. Please review your WebSockets configuration and try again";
  }

  let customPaperHeight = "calc(100vh - 290px)";

  if (obOnly) {
    customPaperHeight = "calc(100vh - 315px)";
  }

  return (
    <DataTable
      itemActions={tableActions}
      columns={rewindEnabled ? rewindModeColumns : listModeColumns}
      isLoading={requestInProgress}
      entityName="Objects"
      idField="name"
      records={payload}
      customPaperHeight={customPaperHeight}
      selectedItems={selectedObjects}
      onSelect={!anonymousMode ? selectListObjects : undefined}
      customEmptyMessage={errorMessage}
      sortEnabled={{
        currentSort: currentSortField,
        currentDirection: sortDirection,
        onSortClick: sortChange,
      }}
      onSelectAll={selectAllItems}
      rowStyle={({ index }) => {
        if (payload[index]?.delete_flag) {
          return "deleted";
        }

        return "";
      }}
      sx={{
        minHeight: detailsOpen ? "100%" : "initial",
      }}
      noBackground
    />
  );
};
export default ListObjectsTable;
