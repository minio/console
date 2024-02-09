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
import { setErrorSnackMessage } from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";
import { api } from "api";
import { ApiError, HttpResponse, PrefixWrapper } from "api/consoleApi";
import { errorToHandler } from "api/errors";
import ConfirmDialog from "../../Common/ModalWrapper/ConfirmDialog";

interface IDeleteAccessRule {
  modalOpen: boolean;
  onClose: () => any;
  bucket: string;
  toDelete: string;
}

const DeleteAccessRule = ({
  onClose,
  modalOpen,
  bucket,
  toDelete,
}: IDeleteAccessRule) => {
  const dispatch = useAppDispatch();

  const [loadingDeleteAccessRule, setLoadingDeleteAccessRule] =
    useState<boolean>(false);

  const onConfirmDelete = () => {
    setLoadingDeleteAccessRule(true);
    let wrapper: PrefixWrapper = { prefix: toDelete };
    api.bucket
      .deleteAccessRuleWithBucket(bucket, wrapper)
      .then(() => {
        onClose();
      })
      .catch((res: HttpResponse<boolean, ApiError>) => {
        dispatch(setErrorSnackMessage(errorToHandler(res.error)));
        onClose();
      })
      .finally(() => setLoadingDeleteAccessRule(false));
  };

  return (
    <ConfirmDialog
      title={`Delete Anonymous Access Rule`}
      confirmText={"Delete"}
      isOpen={modalOpen}
      isLoading={loadingDeleteAccessRule}
      onConfirm={onConfirmDelete}
      titleIcon={<ConfirmDeleteIcon />}
      onClose={onClose}
      confirmationContent={
        <Fragment>Are you sure you want to delete this access rule?</Fragment>
      }
    />
  );
};

export default DeleteAccessRule;
