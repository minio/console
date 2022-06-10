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

import React, { useEffect, useState } from "react";

import { DialogContentText } from "@mui/material";

import { ErrorResponseHandler } from "../../../../../../common/types";
import ConfirmDialog from "../../../../Common/ModalWrapper/ConfirmDialog";
import { ConfirmDeleteIcon } from "../../../../../../icons";
import api from "../../../../../../common/api";
import { setErrorSnackMessage } from "../../../../../../systemSlice";
import { useAppDispatch } from "../../../../../../store";

interface IDeleteSelectedVersionsProps {
  closeDeleteModalAndRefresh: (refresh: boolean) => void;
  deleteOpen: boolean;
  selectedVersions: string[];
  selectedObject: string;
  selectedBucket: string;
}

const DeleteObject = ({
  closeDeleteModalAndRefresh,
  deleteOpen,
  selectedBucket,
  selectedVersions,
  selectedObject,
}: IDeleteSelectedVersionsProps) => {
  const dispatch = useAppDispatch();
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const onClose = () => closeDeleteModalAndRefresh(false);
  const onConfirmDelete = () => {
    setDeleteLoading(true);
  };

  useEffect(() => {
    if (deleteLoading) {
      const selectedObjectsRequest = selectedVersions.map((versionID) => {
        return {
          path: selectedObject,
          versionID: versionID,
          recursive: false,
        };
      });

      if (selectedObjectsRequest.length > 0) {
        api
          .invoke(
            "POST",
            `/api/v1/buckets/${selectedBucket}/delete-objects?all_versions=false`,
            selectedObjectsRequest
          )
          .then(() => {
            setDeleteLoading(false);
            closeDeleteModalAndRefresh(true);
          })
          .catch((error: ErrorResponseHandler) => {
            dispatch(setErrorSnackMessage(error));
            setDeleteLoading(false);
          });
      }
    }
  }, [
    deleteLoading,
    closeDeleteModalAndRefresh,
    selectedBucket,
    selectedObject,
    selectedVersions,
    dispatch,
  ]);

  if (!selectedVersions) {
    return null;
  }

  return (
    <ConfirmDialog
      title={`Delete Selected Versions`}
      confirmText={"Delete"}
      isOpen={deleteOpen}
      titleIcon={<ConfirmDeleteIcon />}
      isLoading={deleteLoading}
      onConfirm={onConfirmDelete}
      onClose={onClose}
      confirmationContent={
        <DialogContentText>
          Are you sure you want to delete the selected {selectedVersions.length}{" "}
          versions for <strong>{selectedObject}</strong>?
        </DialogContentText>
      }
    />
  );
};

export default DeleteObject;
