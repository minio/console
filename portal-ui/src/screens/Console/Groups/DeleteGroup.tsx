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
} from "@material-ui/core";
import api from "../../../common/api";
import { setErrorSnackMessage } from "../../../actions";

interface IDeleteGroup {
  selectedGroup: string;
  deleteOpen: boolean;
  closeDeleteModalAndRefresh: any;
  setErrorSnackMessage: typeof setErrorSnackMessage;
}

const DeleteGroup = ({
  selectedGroup,
  deleteOpen,
  closeDeleteModalAndRefresh,
  setErrorSnackMessage,
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
          .catch((err) => {
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
    <React.Fragment>
      <Dialog
        open={deleteOpen}
        onClose={closeNoAction}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete User</DialogTitle>
        <DialogContent>
          {isDeleting && <LinearProgress />}
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete group <b>{selectedGroup}</b>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeNoAction} color="primary" disabled={isDeleting}>
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
    </React.Fragment>
  );
};

const mapDispatchToProps = {
  setErrorSnackMessage,
};

const connector = connect(null, mapDispatchToProps);

export default connector(DeleteGroup);
