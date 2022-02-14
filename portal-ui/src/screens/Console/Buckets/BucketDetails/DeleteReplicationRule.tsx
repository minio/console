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

import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { DialogContentText } from "@mui/material";
import { setErrorSnackMessage } from "../../../../actions";
import { ErrorResponseHandler } from "../../../../common/types";
import useApi from "../../Common/Hooks/useApi";
import ConfirmDialog from "../../Common/ModalWrapper/ConfirmDialog";
import { ConfirmDeleteIcon } from "../../../../icons";
import Grid from "@mui/material/Grid";
import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";

interface IDeleteReplicationProps {
  closeDeleteModalAndRefresh: (refresh: boolean) => void;
  deleteOpen: boolean;
  selectedBucket: string;
  ruleToDelete?: string;
  remainingRules: number;
  deleteAllRules?: boolean;
  setErrorSnackMessage: typeof setErrorSnackMessage;
}

const DeleteReplicationRule = ({
  closeDeleteModalAndRefresh,
  deleteOpen,
  selectedBucket,
  ruleToDelete,
  remainingRules,
  setErrorSnackMessage,
  deleteAllRules = false,
}: IDeleteReplicationProps) => {
  const [confirmationText, setConfirmationText] = useState<string>("");

  const onDelSuccess = () => closeDeleteModalAndRefresh(true);
  const onDelError = (err: ErrorResponseHandler) => setErrorSnackMessage(err);
  const onClose = () => closeDeleteModalAndRefresh(false);

  const [deleteLoading, invokeDeleteApi] = useApi(onDelSuccess, onDelError);

  if (!selectedBucket) {
    return null;
  }

  const onConfirmDelete = () => {
    let url = `/api/v1/buckets/${selectedBucket}/replication/${ruleToDelete}`;

    if (deleteAllRules || remainingRules === 1) {
      url = `/api/v1/buckets/${selectedBucket}/delete-all-replication-rules`;
    }

    invokeDeleteApi("DELETE", url);
  };

  return (
    <ConfirmDialog
      title={
        deleteAllRules
          ? "Delete all Replication Rules"
          : "Delete Replication Rule"
      }
      confirmText={"Delete"}
      isOpen={deleteOpen}
      titleIcon={<ConfirmDeleteIcon />}
      isLoading={deleteLoading}
      onConfirm={onConfirmDelete}
      onClose={onClose}
      confirmButtonProps={{
        disabled: deleteAllRules && confirmationText !== "Yes, I am sure",
      }}
      confirmationContent={
        <DialogContentText>
          {deleteAllRules ? (
            <Fragment>
              Are you sure you want to remove all replication rules for bucket{" "}
              <b>{selectedBucket}</b>?<br />
              <br />
              To continue please type <b>Yes, I am sure</b> in the box.
              <Grid item xs={12}>
                <InputBoxWrapper
                  id="retype-tenant"
                  name="retype-tenant"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setConfirmationText(event.target.value);
                  }}
                  label=""
                  value={confirmationText}
                />
              </Grid>
            </Fragment>
          ) : (
            <Fragment>
              Are you sure you want to delete replication rule{" "}
              <b>{ruleToDelete}</b>?
            </Fragment>
          )}
        </DialogContentText>
      }
    />
  );
};

const mapDispatchToProps = {
  setErrorSnackMessage,
};

const connector = connect(null, mapDispatchToProps);

export default connector(DeleteReplicationRule);
