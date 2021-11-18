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
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
} from "@mui/material";
import api from "../../../common/api";
import { setErrorSnackMessage } from "../../../actions";
import { ErrorResponseHandler } from "../../../common/types";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { deleteDialogStyles } from "../Common/FormComponents/common/styleLibrary";

const styles = (theme: Theme) =>
  createStyles({
    ...deleteDialogStyles,
  });

interface IDeleteGroup {
  selectedGroup: string;
  deleteOpen: boolean;
  closeDeleteModalAndRefresh: any;
  setErrorSnackMessage: typeof setErrorSnackMessage;
  classes: any;
}

const DeleteGroup = ({
  selectedGroup,
  deleteOpen,
  closeDeleteModalAndRefresh,
  setErrorSnackMessage,
  classes,
}: IDeleteGroup) => {
  const [isDeleting, setDeleteLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isDeleting) {
      const removeRecord = () => {
        if (!selectedGroup) {
          return;
        }

        api
          .invoke("DELETE", `/api/v1/group?name=${encodeURI(selectedGroup)}`)
          .then(() => {
            setDeleteLoading(false);
            closeDeleteModalAndRefresh(true);
          })
          .catch((err: ErrorResponseHandler) => {
            setDeleteLoading(false);
            setErrorSnackMessage(err);
          });
      };
      removeRecord();
    }
  }, [
    isDeleting,
    selectedGroup,
    closeDeleteModalAndRefresh,
    setErrorSnackMessage,
  ]);

  const closeNoAction = () => {
    closeDeleteModalAndRefresh(false);
  };

  return (
    <Dialog
      open={deleteOpen}
      onClose={closeNoAction}
      classes={classes}
      className={classes.root}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" className={classes.title}>
        <div className={classes.titleText}>Delete Group</div>
        <div className={classes.closeContainer}>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={closeNoAction}
            disableRipple
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent>
        {isDeleting && <LinearProgress />}
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete group <br />
          <b>{selectedGroup}</b>?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          type="button"
          variant="outlined"
          onClick={closeNoAction}
          color="primary"
          disabled={isDeleting}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="outlined"
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

const mapDispatchToProps = {
  setErrorSnackMessage,
};

const connector = connect(null, mapDispatchToProps);

export default withStyles(styles)(connector(DeleteGroup));
