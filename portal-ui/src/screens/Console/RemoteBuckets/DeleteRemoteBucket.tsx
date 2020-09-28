// This file is part of MinIO Console Server
// Copyright (c) 2020 MinIO, Inc.
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

import React, { useState, useEffect } from "react";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import get from "lodash/get";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
} from "@material-ui/core";
import api from "../../../common/api";
import Typography from "@material-ui/core/Typography";

const styles = (theme: Theme) =>
  createStyles({
    errorBlock: {
      color: "red",
    },
  });

interface IDeleteEventProps {
  classes: any;
  closeDeleteModalAndRefresh: (refresh: boolean) => void;
  deleteOpen: boolean;
  bucketName: any;
  sourceBucket: string;
}

interface IDeleteEventState {
  deleteLoading: boolean;
  deleteError: string;
}

const DeleteRemoteBucket = ({
  deleteOpen,
  closeDeleteModalAndRefresh,
  classes,
  bucketName,
  sourceBucket,
}: IDeleteEventProps) => {
  const [deleteError, setDeleteError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (deleteLoading) {
      removeRecord();
    }
  }, [deleteLoading]);

  const removeRecord = () => {
    api
      .invoke("DELETE", `/api/v1/remote-buckets/${sourceBucket}/${bucketName}`)
      .then(() => {
        setDeleteLoading(false);
        setDeleteError("");
        closeDeleteModalAndRefresh(true);
      })
      .catch((err) => {
        setDeleteLoading(false);
        setDeleteError(err);
      });
  };

  return (
    <Dialog
      open={deleteOpen}
      onClose={() => {
        setDeleteError("");
        closeDeleteModalAndRefresh(false);
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Delete Remote Bucket</DialogTitle>
      <DialogContent>
        {deleteLoading && <LinearProgress />}
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete <strong>'{bucketName}'</strong> Remote
          Bucket?
          {deleteError !== "" && (
            <React.Fragment>
              <br />
              <Typography
                component="p"
                variant="body1"
                className={classes.errorBlock}
              >
                {deleteError}
              </Typography>
            </React.Fragment>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setDeleteError("");
            closeDeleteModalAndRefresh(false);
          }}
          color="primary"
          disabled={deleteLoading}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            setDeleteLoading(true);
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

export default withStyles(styles)(DeleteRemoteBucket);
