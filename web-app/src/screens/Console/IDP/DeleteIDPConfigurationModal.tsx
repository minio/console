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

import React, { Fragment, useState } from "react";
import { ConfirmDeleteIcon } from "mds";
import {
  setErrorSnackMessage,
  setServerNeedsRestart,
} from "../../../systemSlice";
import { useAppDispatch } from "../../../store";
import ConfirmDialog from "../Common/ModalWrapper/ConfirmDialog";
import { api } from "api";
import { SetIDPResponse } from "../../../api/consoleApi";
import { errorToHandler } from "../../../api/errors";

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
  const onDelSuccess = (res: SetIDPResponse) => {
    closeDeleteModalAndRefresh(true);
    dispatch(setServerNeedsRestart(res.restart === true));
  };

  const onClose = () => closeDeleteModalAndRefresh(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  if (!idp) {
    return null;
  }

  const onConfirmDelete = () => {
    setDeleteLoading(true);
    api.idp
      .deleteConfiguration(idp, idpType)
      .then((res) => {
        onDelSuccess(res.data);
      })
      .catch((err) => dispatch(setErrorSnackMessage(errorToHandler(err.error))))
      .finally(() => setDeleteLoading(false));
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
        <Fragment>
          Are you sure you want to delete IDP <b>{displayName}</b>{" "}
          configuration? <br />
        </Fragment>
      }
    />
  );
};

export default DeleteIDPConfigurationModal;
