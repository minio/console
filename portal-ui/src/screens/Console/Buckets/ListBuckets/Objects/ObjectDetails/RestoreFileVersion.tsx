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
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Theme } from "@mui/material/styles";
import { connect } from "react-redux";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { modalBasic } from "../../../../Common/FormComponents/common/styleLibrary";
import { setErrorSnackMessage } from "../../../../../../actions";
import { ErrorResponseHandler } from "../../../../../../common/types";
import { encodeFileName } from "../../../../../../common/utils";
import api from "../../../../../../common/api";

interface IRestoreFileVersion {
  classes: any;
  restoreOpen: boolean;
  bucketName: string;
  versionID: string;
  objectPath: string;
  onCloseAndUpdate: (refresh: boolean) => void;
  setErrorSnackMessage: typeof setErrorSnackMessage;
}

const styles = (theme: Theme) =>
  createStyles({
    buttonContainer: {
      textAlign: "right",
    },
    pathLabel: {
      marginTop: 0,
      marginBottom: 32,
    },
    ...modalBasic,
  });

const RestoreFileVersion = ({
  classes,
  versionID,
  bucketName,
  objectPath,
  restoreOpen,
  onCloseAndUpdate,
}: IRestoreFileVersion) => {
  const [restoreLoading, setRestoreLoading] = useState<boolean>(false);

  const restoreVersion = () => {
    setRestoreLoading(true);

    api
      .invoke(
        "PUT",
        `/api/v1/buckets/${bucketName}/objects/restore?prefix=${encodeFileName(
          objectPath
        )}&version_id=${versionID}`
      )
      .then((res: any) => {
        setRestoreLoading(false);
        onCloseAndUpdate(true);
      })
      .catch((error: ErrorResponseHandler) => {
        setErrorSnackMessage(error);
        setRestoreLoading(false);
      });
  };

  return (
    <Dialog
      open={restoreOpen}
      onClose={() => {
        onCloseAndUpdate(false);
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Restore File Version</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to restore <b>{objectPath}</b> <br /> with
          Version ID: <b className={classes.wrapText}>{versionID}</b>?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onCloseAndUpdate(false);
          }}
          color="primary"
          disabled={restoreLoading}
        >
          Cancel
        </Button>
        <Button
          onClick={restoreVersion}
          color="primary"
          autoFocus
          disabled={restoreLoading}
        >
          Restore
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const mapStateToProps = null;

const mapDispatchToProps = {
  setErrorSnackMessage,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default withStyles(styles)(connector(RestoreFileVersion));
