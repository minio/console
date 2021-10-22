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
import { setErrorSnackMessage } from "../../../../actions";
import { ErrorResponseHandler } from "../../../../common/types";
import api from "../../../../common/api";

interface IDeleteReplicationProps {
  closeDeleteModalAndRefresh: (refresh: boolean) => void;
  deleteOpen: boolean;
  selectedBucket: string;
  ruleToDelete: string;
  setErrorSnackMessage: typeof setErrorSnackMessage;
}

const DeleteReplicationRule = ({
  closeDeleteModalAndRefresh,
  deleteOpen,
  selectedBucket,
  ruleToDelete,
  setErrorSnackMessage,
}: IDeleteReplicationProps) => {
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const removeRecord = () => {
    if (!deleteLoading) {
      setDeleteLoading(true);

      api
        .invoke(
          "DELETE",
          `/api/v1/buckets/${selectedBucket}/replication/${ruleToDelete}`
        )
        .then(() => {
          setDeleteLoading(false);
          closeDeleteModalAndRefresh(true);
        })
        .catch((err: ErrorResponseHandler) => {
          setDeleteLoading(false);
          setErrorSnackMessage(err);
        });
    }
  };

  return (
    <Dialog
      open={deleteOpen}
      onClose={() => {
        closeDeleteModalAndRefresh(false);
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Delete Replication Rule</DialogTitle>
      <DialogContent>
        {deleteLoading && <LinearProgress />}
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete replication rule <b>{ruleToDelete}</b>
          ? <br />
          Remember, at lease one rule must be present once replication has been
          enabled
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

export default connector(DeleteReplicationRule);
