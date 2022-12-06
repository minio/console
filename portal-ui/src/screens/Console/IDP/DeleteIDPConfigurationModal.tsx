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

import React from "react";

import { DialogContentText } from "@mui/material";
import { ErrorResponseHandler } from "../../../common/types";
import useApi from "../Common/Hooks/useApi";
import ConfirmDialog from "../Common/ModalWrapper/ConfirmDialog";
import { ConfirmDeleteIcon } from "../../../icons";
import {
  setErrorSnackMessage,
  setServerNeedsRestart,
} from "../../../systemSlice";
import { useAppDispatch } from "../../../store";

interface IDeleteIDPConfigurationModalProps {
  closeDeleteModalAndRefresh: (refresh: boolean) => void;
  deleteOpen: boolean;
  idp: string;
  idpType: string;
}

const DeleteIDPConfigurationModal = ({
  closeDeleteModalAndRefresh,
  deleteOpen,
  idp,
  idpType,
}: IDeleteIDPConfigurationModalProps) => {
  const dispatch = useAppDispatch();
  const onDelSuccess = (res: any) => {
    closeDeleteModalAndRefresh(true);
    dispatch(setServerNeedsRestart(res.restart === true));
  };
  const onDelError = (err: ErrorResponseHandler) =>
    dispatch(setErrorSnackMessage(err));
  const onClose = () => closeDeleteModalAndRefresh(false);

  const [deleteLoading, invokeDeleteApi] = useApi(onDelSuccess, onDelError);

  if (!idp) {
    return null;
  }

  const onConfirmDelete = () => {
    invokeDeleteApi("DELETE", `/api/v1/idp/${idpType}/${idp}`);
  };

  const displayName = idp === "_" ? "Default" : idp;

  return (
    <ConfirmDialog
      title={`Delete ${displayName}`}
      confirmText={"Delete"}
      isOpen={deleteOpen}
      titleIcon={<ConfirmDeleteIcon />}
      isLoading={deleteLoading}
      onConfirm={onConfirmDelete}
      onClose={onClose}
      confirmButtonProps={{
        disabled: deleteLoading,
      }}
      confirmationContent={
        <DialogContentText>
          Are you sure you want to delete IDP <b>{displayName}</b>{" "}
          configuration? <br />
        </DialogContentText>
      }
    />
  );
};

export default DeleteIDPConfigurationModal;
