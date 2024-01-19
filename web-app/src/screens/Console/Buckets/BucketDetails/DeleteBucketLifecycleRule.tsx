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

import React, { useEffect, useState, Fragment } from "react";
import { ConfirmDeleteIcon } from "mds";
import { api } from "api";
import { errorToHandler } from "api/errors";
import { setErrorSnackMessage } from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";
import ConfirmDialog from "../../Common/ModalWrapper/ConfirmDialog";

interface IDeleteLifecycleRule {
  deleteOpen: boolean;
  onCloseAndRefresh: (refresh: boolean) => any;
  bucket: string;
  id: string;
}

const DeleteBucketLifecycleRule = ({
  onCloseAndRefresh,
  deleteOpen,
  bucket,
  id,
}: IDeleteLifecycleRule) => {
  const dispatch = useAppDispatch();
  const [deletingRule, setDeletingRule] = useState<boolean>(false);

  useEffect(() => {
    if (deletingRule) {
      api.buckets
        .deleteBucketLifecycleRule(bucket, id)
        .then(() => {
          setDeletingRule(false);
          onCloseAndRefresh(true);
        })
        .catch((err) => {
          setDeletingRule(false);
          dispatch(setErrorSnackMessage(errorToHandler(err.error)));
        });
    }
  }, [deletingRule, bucket, id, onCloseAndRefresh, dispatch]);

  const onConfirmDelete = () => {
    setDeletingRule(true);
  };

  return (
    <ConfirmDialog
      title={`Delete Lifecycle Rule`}
      confirmText={"Delete"}
      isOpen={deleteOpen}
      isLoading={deletingRule}
      onConfirm={onConfirmDelete}
      titleIcon={<ConfirmDeleteIcon />}
      onClose={() => onCloseAndRefresh(false)}
      confirmationContent={
        <Fragment>
          Are you sure you want to delete the <strong>{id}</strong> rule?
        </Fragment>
      }
    />
  );
};

export default DeleteBucketLifecycleRule;
