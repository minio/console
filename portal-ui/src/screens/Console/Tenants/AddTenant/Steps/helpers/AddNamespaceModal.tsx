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
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { modalBasic } from "../../../../Common/FormComponents/common/styleLibrary";
import { setErrorSnackMessage } from "../../../../../../actions";
import { ErrorResponseHandler } from "../../../../../../common/types";
import api from "../../../../../../common/api";

const styles = (theme: Theme) =>
  createStyles({
    wrapText: {
      maxWidth: "200px",
      whiteSpace: "normal",
      wordWrap: "break-word",
    },
    ...modalBasic,
  });

interface IAddNamespace {
  classes: any;
  namespace: string;
  addNamespaceOpen: boolean;
  closeAddNamespaceModalAndRefresh: (reloadNamespaceData: boolean) => void;
  setErrorSnackMessage: typeof setErrorSnackMessage;
}

const AddNamespaceModal = ({
  classes,
  namespace,
  addNamespaceOpen,
  closeAddNamespaceModalAndRefresh,
  setErrorSnackMessage,
}: IAddNamespace) => {
  const [addNamespaceLoading, setAddNamespaceLoading] =
    useState<boolean>(false);

  useEffect(() => {
    if (addNamespaceLoading) {
      api
        .invoke("POST", "/api/v1/namespace", {
          name: namespace,
        })
        .then((res) => {
          setAddNamespaceLoading(false);
          closeAddNamespaceModalAndRefresh(true);
        })
        .catch((err: ErrorResponseHandler) => {
          setAddNamespaceLoading(false);
          setErrorSnackMessage(err);
        });
    }
  }, [
    addNamespaceLoading,
    closeAddNamespaceModalAndRefresh,
    namespace,
    setErrorSnackMessage,
  ]);

  const addNamespace = () => {
    setAddNamespaceLoading(true);
  };

  return (
    <Dialog
      open={addNamespaceOpen}
      onClose={() => {
        closeAddNamespaceModalAndRefresh(false);
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Create new namespace</DialogTitle>
      <DialogContent>
        {addNamespaceLoading && <LinearProgress />}
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to add a namespace called{" "}
          <b className={classes.wrapText}>{namespace}</b>?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            closeAddNamespaceModalAndRefresh(false);
          }}
          color="primary"
          disabled={addNamespaceLoading}
          type="button"
          className={classes.clearButton}
        >
          Cancel
        </Button>
        <Button
          onClick={addNamespace}
          variant="contained"
          color="primary"
          autoFocus
          disabled={addNamespaceLoading}
        >
          Create Namespace
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const mapDispatchToProps = {
  setErrorSnackMessage,
};

const connector = connect(null, mapDispatchToProps);

export default withStyles(styles)(connector(AddNamespaceModal));
