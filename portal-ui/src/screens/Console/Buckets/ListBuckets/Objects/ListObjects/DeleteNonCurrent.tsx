// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { DialogContentText } from "@mui/material";
import Grid from "@mui/material/Grid";
import { setErrorSnackMessage } from "../../../../../../actions";
import { ErrorResponseHandler } from "../../../../../../common/types";
import { decodeURLString } from "../../../../../../common/utils";
import { ConfirmDeleteIcon } from "../../../../../../icons";
import ConfirmDialog from "../../../../Common/ModalWrapper/ConfirmDialog";
import api from "../../../../../../common/api";
import InputBoxWrapper from "../../../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";

interface IDeleteNonCurrentProps {
  closeDeleteModalAndRefresh: (refresh: boolean) => void;
  deleteOpen: boolean;
  selectedObject: string;
  selectedBucket: string;
  setErrorSnackMessage: typeof setErrorSnackMessage;
}

const DeleteNonCurrentVersions = ({
  closeDeleteModalAndRefresh,
  deleteOpen,
  selectedBucket,
  selectedObject,
  setErrorSnackMessage,
}: IDeleteNonCurrentProps) => {
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [typeConfirm, setTypeConfirm] = useState<string>("");

  useEffect(() => {
    if (deleteLoading) {
      api
        .invoke(
          "DELETE",
          `/api/v1/buckets/${selectedBucket}/objects?path=${selectedObject}&non_current_versions=true`
        )
        .then(() => {
          closeDeleteModalAndRefresh(true);
        })
        .catch((error: ErrorResponseHandler) => {
          setErrorSnackMessage(error);
          setDeleteLoading(false);
        });
    }
  }, [
    deleteLoading,
    closeDeleteModalAndRefresh,
    setErrorSnackMessage,
    selectedObject,
    selectedBucket,
  ]);

  if (!selectedObject) {
    return null;
  }
  const onConfirmDelete = () => {
    setDeleteLoading(true);
  };

  return (
    <ConfirmDialog
      title={`Delete Non-Current versions`}
      confirmText={"Delete"}
      isOpen={deleteOpen}
      titleIcon={<ConfirmDeleteIcon />}
      isLoading={deleteLoading}
      onConfirm={onConfirmDelete}
      onClose={() => closeDeleteModalAndRefresh(false)}
      confirmButtonProps={{
        disabled: typeConfirm !== "YES, PROCEED" || deleteLoading,
      }}
      confirmationContent={
        <DialogContentText>
          Are you sure you want to delete all the non-current versions for:{" "}
          <b>{decodeURLString(selectedObject)}</b>? <br />
          <br />
          To continue please type <b>YES, PROCEED</b> in the box.
          <Grid item xs={12}>
            <InputBoxWrapper
              id="type-confirm"
              name="retype-tenant"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setTypeConfirm(event.target.value);
              }}
              label=""
              value={typeConfirm}
            />
          </Grid>
        </DialogContentText>
      }
    />
  );
};

const mapDispatchToProps = {
  setErrorSnackMessage,
};

const connector = connect(null, mapDispatchToProps);

export default connector(DeleteNonCurrentVersions);
