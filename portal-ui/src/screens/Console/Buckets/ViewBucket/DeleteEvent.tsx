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
import get from "lodash/get";
import { connect } from "react-redux";
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
import { BucketEvent, BucketList } from "../types";
import { setErrorSnackMessage } from "../../../../actions";

interface IDeleteEventProps {
  closeDeleteModalAndRefresh: (refresh: boolean) => void;
  deleteOpen: boolean;
  selectedBucket: string;
  bucketEvent: BucketEvent | null;
  setErrorSnackMessage: typeof setErrorSnackMessage;
}

const DeleteEvent = ({
  closeDeleteModalAndRefresh,
  deleteOpen,
  selectedBucket,
  bucketEvent,
  setErrorSnackMessage,
}: IDeleteEventProps) => {
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const removeRecord = () => {
    if (deleteLoading) {
      return;
    }
    if (bucketEvent == null) {
      return;
    }

    setDeleteLoading(true);

    const events = get(bucketEvent, "events", []);
    const prefix = get(bucketEvent, "prefix", "");
    const suffix = get(bucketEvent, "suffix", "");
    api
      .invoke(
        "DELETE",
        `/api/v1/buckets/${selectedBucket}/events/${bucketEvent.arn}`,
        {
          events,
          prefix,
          suffix,
        }
      )
      .then((res: BucketList) => {
        setDeleteLoading(false);
        closeDeleteModalAndRefresh(true);
      })
      .catch((err) => {
        setDeleteLoading(false);
        setErrorSnackMessage(err);
      });
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
      <DialogTitle id="alert-dialog-title">Delete Event</DialogTitle>
      <DialogContent>
        {deleteLoading && <LinearProgress />}
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete this event?
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

const connector = connect(null, {
  setErrorSnackMessage,
});

export default connector(DeleteEvent);
