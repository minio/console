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
import { connect } from "react-redux";
import { DialogContentText } from "@mui/material";
import { setErrorSnackMessage } from "../../../actions";
import { ErrorResponseHandler } from "../../../common/types";
import ConfirmDialog from "../Common/ModalWrapper/ConfirmDialog";
import useApi from "../Common/Hooks/useApi";
import { ConfirmDeleteIcon } from "../../../icons";

interface IDeleteGroup {
  selectedGroup: string;
  deleteOpen: boolean;
  closeDeleteModalAndRefresh: any;
  setErrorSnackMessage: typeof setErrorSnackMessage;
}

const DeleteGroup = ({
  selectedGroup,
  deleteOpen,
  closeDeleteModalAndRefresh,
  setErrorSnackMessage,
}: IDeleteGroup) => {
  const onDelSuccess = () => closeDeleteModalAndRefresh(true);
  const onDelError = (err: ErrorResponseHandler) => setErrorSnackMessage(err);
  const onClose = () => closeDeleteModalAndRefresh(false);

  const [deleteLoading, invokeDeleteApi] = useApi(onDelSuccess, onDelError);

  if (!selectedGroup) {
    return null;
  }
  const onDeleteGroup = () => {
    invokeDeleteApi("DELETE", `/api/v1/group?name=${encodeURI(selectedGroup)}`);
  };

  return (
    <ConfirmDialog
      title={`Delete Group`}
      confirmText={"Delete"}
      isOpen={deleteOpen}
      titleIcon={<ConfirmDeleteIcon />}
      isLoading={deleteLoading}
      onConfirm={onDeleteGroup}
      onClose={onClose}
      confirmationContent={
        <DialogContentText>
          Are you sure you want to delete group
          <br />
          <b>{selectedGroup}</b>?
        </DialogContentText>
      }
    />
  );
};

const mapDispatchToProps = {
  setErrorSnackMessage,
};

const connector = connect(null, mapDispatchToProps);

export default connector(DeleteGroup);
