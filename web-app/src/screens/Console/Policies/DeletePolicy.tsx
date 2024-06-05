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

import React, { Fragment, useState } from "react";
import ConfirmDialog from "../Common/ModalWrapper/ConfirmDialog";
import { ConfirmDeleteIcon } from "mds";
import { setErrorSnackMessage } from "../../../systemSlice";
import { useAppDispatch } from "../../../store";
import { api } from "api";
import { ApiError, HttpResponse } from "api/consoleApi";
import { errorToHandler } from "api/errors";

interface IDeletePolicyProps {
  closeDeleteModalAndRefresh: (refresh: boolean) => void;
  deleteOpen: boolean;
  selectedPolicy: string;
}

const DeletePolicy = ({
  closeDeleteModalAndRefresh,
  deleteOpen,
  selectedPolicy,
}: IDeletePolicyProps) => {
  const dispatch = useAppDispatch();
  const onClose = () => closeDeleteModalAndRefresh(false);

  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

  if (!selectedPolicy) {
    return null;
  }

  const onConfirmDelete = () => {
    setLoadingDelete(true);
    api.policy
      .removePolicy(selectedPolicy)
      .then((_) => {
        closeDeleteModalAndRefresh(true);
      })
      .catch(async (res: HttpResponse<void, ApiError>) => {
        const err = (await res.json()) as ApiError;
        dispatch(setErrorSnackMessage(errorToHandler(err)));
        closeDeleteModalAndRefresh(false);
      })
      .finally(() => setLoadingDelete(false));
  };

  return (
    <ConfirmDialog
      title={`Delete Policy`}
      confirmText={"Delete"}
      isOpen={deleteOpen}
      titleIcon={<ConfirmDeleteIcon />}
      isLoading={loadingDelete}
      onConfirm={onConfirmDelete}
      onClose={onClose}
      confirmationContent={
        <Fragment>
          Are you sure you want to delete policy <br />
          <b>{selectedPolicy}</b>?
        </Fragment>
      }
    />
  );
};

export default DeletePolicy;
