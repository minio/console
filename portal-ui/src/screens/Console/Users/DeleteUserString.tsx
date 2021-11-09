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

import React, { useState } from "react";
import { connect } from "react-redux";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
} from "@mui/material";
import { setErrorSnackMessage } from "../../../actions";
import { UsersList } from "./types";
import { ErrorResponseHandler } from "../../../common/types";
import history from "../../../history";
import api from "../../../common/api";

interface IDeleteUserProps {
  closeDeleteModalAndRefresh: (refresh: boolean) => void;
  deleteOpen: boolean;
  userName: string;
  setErrorSnackMessage: typeof setErrorSnackMessage;
}

const DeleteUserString = ({
  closeDeleteModalAndRefresh,
  deleteOpen,
  userName,
  setErrorSnackMessage,
}: IDeleteUserProps) => {
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const removeRecord = () => {
    if (deleteLoading) {
      return;
    }
    if (userName === null) {
      return;
    }
    setDeleteLoading(true);
    api
      .invoke("DELETE", `/api/v1/user?name=${encodeURI(userName)}`, {
        id: userName,
      })
      .then((res: UsersList) => {
        setDeleteLoading(false);
        closeDeleteModalAndRefresh(true);
      })
      .catch((err: ErrorResponseHandler) => {
        setDeleteLoading(false);
        setErrorSnackMessage(err);
      });
  };

  if (userName === null) {
    return <div />;
  }

  return (
    <Dialog
      open={deleteOpen}
      onClose={() => {
        closeDeleteModalAndRefresh(false);
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Delete User</DialogTitle>
      <DialogContent>
        {deleteLoading && <LinearProgress />}
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete user <b>{userName}</b>?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            closeDeleteModalAndRefresh(false);
          }}
          color="primary"
          disabled={deleteLoading}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            removeRecord();
            closeDeleteModalAndRefresh(true);
            history.push(`/users/`);
          }}
          color="secondary"
          autoFocus
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const mapDispatchToProps = {
  setErrorSnackMessage,
};

const connector = connect(null, mapDispatchToProps);

export default connector(DeleteUserString);
