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

import React, { Fragment } from "react";
import { ErrorResponseHandler } from "../../../common/types";
import useApi from "../Common/Hooks/useApi";
import ConfirmDialog from "../Common/ModalWrapper/ConfirmDialog";
import { ConfirmDeleteIcon } from "mds";
import { encodeURLString } from "../../../common/utils";
import { setErrorSnackMessage } from "../../../systemSlice";
import { useAppDispatch } from "../../../store";

interface IDeleteServiceAccountProps {
  closeDeleteModalAndRefresh: (refresh: boolean) => void;
  deleteOpen: boolean;
  selectedServiceAccount: string | null;
}

const DeleteServiceAccount = ({
  closeDeleteModalAndRefresh,
  deleteOpen,
  selectedServiceAccount,
}: IDeleteServiceAccountProps) => {
  const dispatch = useAppDispatch();
  const onDelSuccess = () => closeDeleteModalAndRefresh(true);
  const onDelError = (err: ErrorResponseHandler) =>
    dispatch(setErrorSnackMessage(err));
  const onClose = () => closeDeleteModalAndRefresh(false);

  const [deleteLoading, invokeDeleteApi] = useApi(onDelSuccess, onDelError);

  if (!selectedServiceAccount) {
    return null;
  }

  const onConfirmDelete = () => {
    invokeDeleteApi(
      "DELETE",
      `/api/v1/service-accounts/${encodeURLString(selectedServiceAccount)}`
    );
  };

  return (
    <ConfirmDialog
      title={`Delete Access Key`}
      confirmText={"Delete"}
      isOpen={deleteOpen}
      titleIcon={<ConfirmDeleteIcon />}
      isLoading={deleteLoading}
      onConfirm={onConfirmDelete}
      onClose={onClose}
      confirmationContent={
        <Fragment>
          Are you sure you want to delete Access Key{" "}
          <b
            style={{
              maxWidth: "200px",
              whiteSpace: "normal",
              wordWrap: "break-word",
            }}
          >
            {selectedServiceAccount}
          </b>
          ?
        </Fragment>
      }
    />
  );
};

export default DeleteServiceAccount;
