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

import React, { useState, Fragment } from "react";
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
import api from "../../../../common/api";
import { setErrorSnackMessage } from "../../../../actions";
import { ErrorResponseHandler } from "../../../../common/types";

interface IVersioningEventProps {
  closeVersioningModalAndRefresh: (refresh: boolean) => void;
  modalOpen: boolean;
  selectedBucket: string;
  versioningCurrentState: boolean;
  setErrorSnackMessage: typeof setErrorSnackMessage;
}

const EnableVersioningModal = ({
  closeVersioningModalAndRefresh,
  modalOpen,
  selectedBucket,
  versioningCurrentState,
  setErrorSnackMessage,
}: IVersioningEventProps) => {
  const [versioningLoading, setVersioningLoading] = useState<boolean>(false);

  const enableVersioning = () => {
    if (versioningLoading) {
      return;
    }
    setVersioningLoading(true);

    api
      .invoke("PUT", `/api/v1/buckets/${selectedBucket}/versioning`, {
        versioning: !versioningCurrentState,
      })
      .then(() => {
        setVersioningLoading(false);
        closeVersioningModalAndRefresh(true);
      })
      .catch((err: ErrorResponseHandler) => {
        setVersioningLoading(false);
        setErrorSnackMessage(err);
      });
  };

  return (
    <Dialog
      open={modalOpen}
      onClose={() => {
        closeVersioningModalAndRefresh(false);
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Edit Versioning</DialogTitle>
      <DialogContent>
        {versioningLoading && <LinearProgress />}
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to{" "}
          <strong>{versioningCurrentState ? "disable" : "enable"}</strong>{" "}
          versioning for this bucket?
          {versioningCurrentState && (
            <Fragment>
              <br />
              <br />
              <strong>File versions won't be automatically deleted</strong>
            </Fragment>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            closeVersioningModalAndRefresh(false);
          }}
          color="primary"
          disabled={versioningLoading}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            enableVersioning();
          }}
          color="secondary"
          autoFocus
        >
          {versioningCurrentState ? "Disable" : "Enable"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const connector = connect(null, {
  setErrorSnackMessage,
});

export default connector(EnableVersioningModal);
