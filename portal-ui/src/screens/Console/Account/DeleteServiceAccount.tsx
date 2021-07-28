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

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
} from "@material-ui/core";
import { setErrorSnackMessage } from "../../../actions";
import { ErrorResponseHandler } from "../../../common/types";
import api from "../../../common/api";

const styles = (theme: Theme) =>
  createStyles({
    wrapText: {
      maxWidth: "200px",
      whiteSpace: "normal",
      wordWrap: "break-word",
    },
  });

interface IDeleteServiceAccountProps {
  classes: any;
  closeDeleteModalAndRefresh: (refresh: boolean) => void;
  deleteOpen: boolean;
  selectedServiceAccount: string | null;
  setErrorSnackMessage: typeof setErrorSnackMessage;
}

const DeleteServiceAccount = ({
  classes,
  closeDeleteModalAndRefresh,
  deleteOpen,
  selectedServiceAccount,
  setErrorSnackMessage,
}: IDeleteServiceAccountProps) => {
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (deleteLoading) {
      api
        .invoke("DELETE", `/api/v1/service-accounts/${selectedServiceAccount}`)
        .then(() => {
          setDeleteLoading(false);
          closeDeleteModalAndRefresh(true);
        })
        .catch((err: ErrorResponseHandler) => {
          setDeleteLoading(false);
          setErrorSnackMessage(err);
        });
    }
  }, [
    deleteLoading,
    closeDeleteModalAndRefresh,
    selectedServiceAccount,
    setErrorSnackMessage,
  ]);

  const removeRecord = () => {
    if (selectedServiceAccount == null) {
      return;
    }

    setDeleteLoading(true);
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
      <DialogTitle id="alert-dialog-title">Delete ServiceAccount</DialogTitle>
      <DialogContent>
        {deleteLoading && <LinearProgress />}
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete service account{" "}
          <b className={classes.wrapText}>{selectedServiceAccount}</b>?
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
          onClick={removeRecord}
          color="secondary"
          autoFocus
          disabled={deleteLoading}
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

export default withStyles(styles)(connector(DeleteServiceAccount));
