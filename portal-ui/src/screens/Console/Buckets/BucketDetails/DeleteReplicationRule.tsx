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
import { ConfirmDeleteIcon, Grid, InputBox } from "mds";
import { ErrorResponseHandler } from "../../../../common/types";
import { setErrorSnackMessage } from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";
import useApi from "../../Common/Hooks/useApi";
import ConfirmDialog from "../../Common/ModalWrapper/ConfirmDialog";

interface IDeleteReplicationProps {
  closeDeleteModalAndRefresh: (refresh: boolean) => void;
  deleteOpen: boolean;
  selectedBucket: string;
  ruleToDelete?: string;
  rulesToDelete?: string[];
  remainingRules: number;
  allSelected: boolean;
  deleteSelectedRules?: boolean;
}

const DeleteReplicationRule = ({
  closeDeleteModalAndRefresh,
  deleteOpen,
  selectedBucket,
  ruleToDelete,
  rulesToDelete,
  remainingRules,
  allSelected,
  deleteSelectedRules = false,
}: IDeleteReplicationProps) => {
  const dispatch = useAppDispatch();
  const [confirmationText, setConfirmationText] = useState<string>("");

  const onDelSuccess = () => closeDeleteModalAndRefresh(true);
  const onDelError = (err: ErrorResponseHandler) =>
    dispatch(setErrorSnackMessage(err));
  const onClose = () => closeDeleteModalAndRefresh(false);

  const [deleteLoading, invokeDeleteApi] = useApi(onDelSuccess, onDelError);

  if (!selectedBucket) {
    return null;
  }

  const onConfirmDelete = () => {
    let url = `/api/v1/buckets/${selectedBucket}/replication/${ruleToDelete}`;

    if (deleteSelectedRules) {
      if (allSelected) {
        url = `/api/v1/buckets/${selectedBucket}/delete-all-replication-rules`;
      } else {
        url = `/api/v1/buckets/${selectedBucket}/delete-selected-replication-rules`;
        invokeDeleteApi("DELETE", url, { rules: rulesToDelete });
        return;
      }
    } else if (remainingRules === 1) {
      url = `/api/v1/buckets/${selectedBucket}/delete-all-replication-rules`;
    }

    invokeDeleteApi("DELETE", url);
  };

  return (
    <ConfirmDialog
      title={
        deleteSelectedRules
          ? "Delete Selected Replication Rules"
          : "Delete Replication Rule"
      }
      confirmText={"Delete"}
      isOpen={deleteOpen}
      titleIcon={<ConfirmDeleteIcon />}
      isLoading={deleteLoading}
      onConfirm={onConfirmDelete}
      onClose={onClose}
      confirmButtonProps={{
        disabled: deleteSelectedRules && confirmationText !== "Yes, I am sure",
      }}
      confirmationContent={
        <Fragment>
          {deleteSelectedRules ? (
            <Fragment>
              Are you sure you want to remove the selected replication rules for
              bucket <b>{selectedBucket}</b>?<br />
              <br />
              To continue please type <b>Yes, I am sure</b> in the box.
              <Grid item xs={12}>
                <InputBox
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
        </Fragment>
      }
    />
  );
};

export default DeleteReplicationRule;
