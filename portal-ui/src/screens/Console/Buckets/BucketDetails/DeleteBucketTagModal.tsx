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
} from "@mui/material";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { modalBasic } from "../../Common/FormComponents/common/styleLibrary";
import { setErrorSnackMessage } from "../../../../actions";
import { AppState } from "../../../../store";
import { ErrorResponseHandler } from "../../../../common/types";
import api from "../../../../common/api";

interface IDeleteBucketTagModal {
  deleteOpen: boolean;
  currentTags: any;
  bucketName: string;
  selectedTag: string[];
  onCloseAndUpdate: (refresh: boolean) => void;
  setErrorSnackMessage: typeof setErrorSnackMessage;
  classes: any;
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

const DeleteBucketTagModal = ({
  deleteOpen,
  currentTags,
  selectedTag,
  onCloseAndUpdate,
  bucketName,
  setErrorSnackMessage,
  classes,
}: IDeleteBucketTagModal) => {
  const [deleteLoading, setDeleteSending] = useState<boolean>(false);
  const [tagKey, tagLabel] = selectedTag;

  const removeTagProcess = () => {
    setDeleteSending(true);
    const cleanObject = { ...currentTags };
    delete cleanObject[tagKey];

    api
      .invoke("PUT", `/api/v1/buckets/${bucketName}/tags`, {
        tags: cleanObject,
      })
      .then((res: any) => {
        setDeleteSending(false);
        onCloseAndUpdate(true);
      })
      .catch((error: ErrorResponseHandler) => {
        setErrorSnackMessage(error);
        setDeleteSending(false);
      });
  };

  return (
    <Dialog
      open={deleteOpen}
      onClose={() => {
        onCloseAndUpdate(false);
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Delete Tag</DialogTitle>
      <DialogContent>
        {deleteLoading && <LinearProgress />}
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete the tag{" "}
          <b className={classes.wrapText}>
            {tagKey} : {tagLabel}
          </b>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onCloseAndUpdate(false);
          }}
          color="primary"
          disabled={deleteLoading}
        >
          Cancel
        </Button>
        <Button onClick={removeTagProcess} color="secondary" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const mapStateToProps = ({ system }: AppState) => ({
  distributedSetup: get(system, "distributedSetup", false),
});

const mapDispatchToProps = {
  setErrorSnackMessage,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default withStyles(styles)(connector(DeleteBucketTagModal));
