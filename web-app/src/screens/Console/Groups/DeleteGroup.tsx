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
import { ConfirmDeleteIcon } from "mds";
import { setErrorSnackMessage } from "../../../systemSlice";
import { useAppDispatch } from "../../../store";
import ConfirmDialog from "../Common/ModalWrapper/ConfirmDialog";
import { api } from "api";
import { errorToHandler } from "api/errors";
import { ApiError, HttpResponse } from "api/consoleApi";

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
  const onClose = () => closeDeleteModalAndRefresh(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

  if (!selectedGroups) {
    return null;
  }
  const onDeleteGroups = () => {
    for (let group of selectedGroups) {
      setLoadingDelete(true);
      api.group
        .removeGroup(group)
        .then((_) => {
          closeDeleteModalAndRefresh(true);
        })
        .catch(async (res: HttpResponse<void, ApiError>) => {
          const err = (await res.json()) as ApiError;
          dispatch(setErrorSnackMessage(errorToHandler(err)));
          closeDeleteModalAndRefresh(false);
        })
        .finally(() => setLoadingDelete(false));
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
      isLoading={loadingDelete}
      onConfirm={onDeleteGroups}
      onClose={onClose}
      confirmationContent={
        <Fragment>
          Are you sure you want to delete the following{" "}
          {selectedGroups.length === 1 ? "" : selectedGroups.length} group
          {selectedGroups.length > 1 ? "s?" : "?"}
          {renderGroups}
        </Fragment>
      }
    />
  );
};

export default DeleteGroup;
