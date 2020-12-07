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

import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
} from "@material-ui/core";
import api from "../../../../common/api";
import { BucketList } from "../types";
import Typography from "@material-ui/core/Typography";

const styles = (theme: Theme) =>
  createStyles({
    errorBlock: {
      color: "red",
    },
  });

interface IDeleteBucketProps {
  classes: any;
  closeDeleteModalAndRefresh: (refresh: boolean) => void;
  deleteOpen: boolean;
  selectedBucket: string;
}

interface IDeleteBucketState {
  deleteLoading: boolean;
  deleteError: string;
}

const DeleteBucket = ({
  classes,
  closeDeleteModalAndRefresh,
  deleteOpen,
  selectedBucket,
}: IDeleteBucketProps) => {
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string>("");

  const removeRecord = () => {
    if (deleteLoading) {
      return;
    }
    setDeleteLoading(true);

    api
      .invoke("DELETE", `/api/v1/buckets/${selectedBucket}`, {
        name: selectedBucket,
      })
      .then((res: BucketList) => {
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
      <DialogTitle id="alert-dialog-title">Delete Bucket</DialogTitle>
      <DialogContent>
        {deleteLoading && <LinearProgress />}
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete bucket <b>{selectedBucket}</b>? <br />
          A bucket can only be deleted if it's empty.
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

export default withStyles(styles)(DeleteBucket);
