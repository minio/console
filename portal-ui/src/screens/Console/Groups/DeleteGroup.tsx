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

import React from "react";

import { DialogContentText } from "@mui/material";

import { ErrorResponseHandler } from "../../../common/types";
import ConfirmDialog from "../Common/ModalWrapper/ConfirmDialog";
import useApi from "../Common/Hooks/useApi";
import { ConfirmDeleteIcon } from "mds";
import { encodeURLString } from "../../../common/utils";
import { setErrorSnackMessage } from "../../../systemSlice";
import { useAppDispatch } from "../../../store";

interface IDeleteGroup {
  selectedGroups: string[];
  deleteOpen: boolean;
  closeDeleteModalAndRefresh: any;
}

const DeleteGroup = ({
  selectedGroups,
  deleteOpen,
  closeDeleteModalAndRefresh,
}: IDeleteGroup) => {
  const dispatch = useAppDispatch();
  const onDelSuccess = () => closeDeleteModalAndRefresh(true);
  const onDelError = (err: ErrorResponseHandler) => {
    dispatch(setErrorSnackMessage(err));
    closeDeleteModalAndRefresh(false);
  };
  const onClose = () => closeDeleteModalAndRefresh(false);

  const [deleteLoading, invokeDeleteApi] = useApi(onDelSuccess, onDelError);

  if (!selectedGroups) {
    return null;
  }
  const onDeleteGroups = () => {
    for (let group of selectedGroups) {
      invokeDeleteApi("DELETE", `/api/v1/group/${encodeURLString(group)}`);
    }
  };

  const renderGroups = selectedGroups.map((group) => (
    <div key={group}>
      <b>{group}</b>
    </div>
  ));

  return (
    <ConfirmDialog
      title={`Delete Group${selectedGroups.length > 1 ? "s" : ""}`}
      confirmText={"Delete"}
      isOpen={deleteOpen}
      titleIcon={<ConfirmDeleteIcon />}
      isLoading={deleteLoading}
      onConfirm={onDeleteGroups}
      onClose={onClose}
      confirmationContent={
        <DialogContentText>
          Are you sure you want to delete the following {selectedGroups.length}{" "}
          group{selectedGroups.length > 1 ? "s?" : "?"}
          {renderGroups}
        </DialogContentText>
      }
    />
  );
};

export default DeleteGroup;
