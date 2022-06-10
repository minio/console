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
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { modalBasic } from "../../Common/FormComponents/common/styleLibrary";
import { ErrorResponseHandler } from "../../../../common/types";

import { ConfirmDeleteIcon } from "../../../../icons";
import ConfirmDialog from "../../Common/ModalWrapper/ConfirmDialog";
import api from "../../../../common/api";

import { setErrorSnackMessage } from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";

interface IDeleteLifecycleRule {
  deleteOpen: boolean;
  onCloseAndRefresh: (refresh: boolean) => any;
  bucket: string;
  id: string;
}

const styles = (theme: Theme) =>
  createStyles({
    ...modalBasic,
  });

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
      api
        .invoke("DELETE", `/api/v1/buckets/${bucket}/lifecycle/${id}`)
        .then((res) => {
          setDeletingRule(false);
          onCloseAndRefresh(true);
        })
        .catch((err: ErrorResponseHandler) => {
          setDeletingRule(false);
          dispatch(setErrorSnackMessage(err));
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
        <DialogContentText>
          Are you sure you want to delete the <strong>{id}</strong> rule?
        </DialogContentText>
      }
    />
  );
};

export default withStyles(styles)(DeleteBucketLifecycleRule);
