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
import { useDispatch } from "react-redux";
import { DialogContentText } from "@mui/material";
import useApi from "../Common/Hooks/useApi";
import ConfirmDialog from "../Common/ModalWrapper/ConfirmDialog";
import { ErrorResponseHandler } from "../../../common/types";
import { ConfirmDeleteIcon } from "../../../icons";
import { encodeURLString } from "../../../common/utils";
import { setErrorSnackMessage } from "../../../systemSlice";

interface IDeleteUserProps {
  closeDeleteModalAndRefresh: (refresh: boolean) => void;
  deleteOpen: boolean;
  selectedUsers: string[] | null;
}

const DeleteUser = ({
  closeDeleteModalAndRefresh,
  deleteOpen,
  selectedUsers,
}: IDeleteUserProps) => {
  const dispatch = useDispatch();
  const onDelSuccess = () => closeDeleteModalAndRefresh(true);
  const onDelError = (err: ErrorResponseHandler) =>
    dispatch(setErrorSnackMessage(err));
  const onClose = () => closeDeleteModalAndRefresh(false);

  const [deleteLoading, invokeDeleteApi] = useApi(onDelSuccess, onDelError);

  const userLoggedIn = localStorage.getItem("userLoggedIn") || "";

  if (!selectedUsers) {
    return null;
  }
  const renderUsers = selectedUsers.map((user) => (
    <div key={user}>
      <b>{user}</b>
    </div>
  ));

  const onConfirmDelete = () => {
    for (let user of selectedUsers) {
      if (user === userLoggedIn) {
        setErrorSnackMessage({
          errorMessage: "Cannot delete currently logged in user",
          detailedError: `Cannot delete currently logged in user ${userLoggedIn}`,
        });
        closeDeleteModalAndRefresh(true);
      } else {
        invokeDeleteApi("DELETE", `/api/v1/user/${encodeURLString(user)}`);
      }
    }
  };

  return (
    <ConfirmDialog
      title={`Delete User${selectedUsers.length > 1 ? "s" : ""}`}
      confirmText={"Delete"}
      isOpen={deleteOpen}
      titleIcon={<ConfirmDeleteIcon />}
      isLoading={deleteLoading}
      onConfirm={onConfirmDelete}
      onClose={onClose}
      confirmationContent={
        <DialogContentText>
          Are you sure you want to delete the following {selectedUsers.length}{" "}
          user{selectedUsers.length > 1 ? "s?" : "?"}
          <b>{renderUsers}</b>
        </DialogContentText>
      }
    />
  );
};

export default DeleteUser;
