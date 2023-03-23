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
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { modalBasic } from "../../Common/FormComponents/common/styleLibrary";

import { ErrorResponseHandler } from "../../../../common/types";
import useApi from "../../Common/Hooks/useApi";
import ConfirmDialog from "../../Common/ModalWrapper/ConfirmDialog";
import { ConfirmDeleteIcon } from "mds";
import { setErrorSnackMessage } from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";

interface IDeleteAccessRule {
  modalOpen: boolean;
  onClose: () => any;
  bucket: string;
  toDelete: string;
}

const styles = (theme: Theme) =>
  createStyles({
    ...modalBasic,
  });

const DeleteAccessRule = ({
  onClose,
  modalOpen,
  bucket,
  toDelete,
}: IDeleteAccessRule) => {
  const dispatch = useAppDispatch();
  const onDelSuccess = () => onClose();
  const onDelError = (err: ErrorResponseHandler) =>
    dispatch(setErrorSnackMessage(err));

  const [deleteLoading, invokeDeleteApi] = useApi(onDelSuccess, onDelError);

  const onConfirmDelete = () => {
    invokeDeleteApi("DELETE", `/api/v1/bucket/${bucket}/access-rules`, {
      prefix: toDelete,
    });
  };

  return (
    <ConfirmDialog
      title={`Delete Anonymous Access Rule`}
      confirmText={"Delete"}
      isOpen={modalOpen}
      isLoading={deleteLoading}
      onConfirm={onConfirmDelete}
      titleIcon={<ConfirmDeleteIcon />}
      onClose={onClose}
      confirmationContent={
        <DialogContentText>
          Are you sure you want to delete this access rule?
        </DialogContentText>
      }
    />
  );
};

export default withStyles(styles)(DeleteAccessRule);
