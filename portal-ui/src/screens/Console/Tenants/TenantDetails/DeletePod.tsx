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
import { IPodListElement } from "../ListTenants/types";
import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import Grid from "@mui/material/Grid";
import { connect } from "react-redux";
import { setErrorSnackMessage } from "../../../../actions";
import { ErrorResponseHandler } from "../../../../common/types";

interface IDeletePod {
  deleteOpen: boolean;
  selectedPod: IPodListElement;
  closeDeleteModalAndRefresh: (refreshList: boolean) => any;
  setErrorSnackMessage: typeof setErrorSnackMessage;
}

const DeletePod = ({
  deleteOpen,
  selectedPod,
  closeDeleteModalAndRefresh,
  setErrorSnackMessage,
}: IDeletePod) => {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [retypePod, setRetypePod] = useState("");

  useEffect(() => {
    if (deleteLoading) {
      api
        .invoke(
          "DELETE",
          `/api/v1/namespaces/${selectedPod.namespace}/tenants/${selectedPod.tenant}/pods/${selectedPod.name}`
        )
        .then(() => {
          setDeleteLoading(false);
          closeDeleteModalAndRefresh(true);
        })
        .catch((err: ErrorResponseHandler) => {
          setDeleteLoading(false);
          setErrorSnackMessage(err);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteLoading]);

  const removeRecord = () => {
    if (retypePod !== selectedPod.name) {
      setErrorSnackMessage({
        errorMessage: "Tenant name is incorrect",
        detailedError: "",
      });
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
      <DialogTitle id="alert-dialog-title">Delete Pod</DialogTitle>
      <DialogContent>
        {deleteLoading && <LinearProgress />}
        <DialogContentText id="alert-dialog-description">
          To continue please type <b>{selectedPod.name}</b> in the box.
          <Grid item xs={12}>
            <InputBoxWrapper
              id="retype-pod"
              name="retype-pod"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setRetypePod(event.target.value);
              }}
              label=""
              value={retypePod}
            />
          </Grid>
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
          disabled={retypePod !== selectedPod.name}
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

export default connector(DeletePod);
