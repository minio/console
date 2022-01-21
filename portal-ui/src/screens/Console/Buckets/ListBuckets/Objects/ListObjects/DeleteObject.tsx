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
import { connect } from "react-redux";
import { DialogContentText } from "@mui/material";
import { setErrorSnackMessage } from "../../../../../../actions";
import { ErrorResponseHandler } from "../../../../../../common/types";
import { decodeFileName } from "../../../../../../common/utils";
import ConfirmDialog from "../../../../Common/ModalWrapper/ConfirmDialog";
import useApi from "../../../../Common/Hooks/useApi";
import { ConfirmDeleteIcon } from "../../../../../../icons";
import FormSwitchWrapper from "../../../../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";

interface IDeleteObjectProps {
  closeDeleteModalAndRefresh: (refresh: boolean) => void;
  deleteOpen: boolean;
  selectedObject: string;
  selectedBucket: string;
  setErrorSnackMessage: typeof setErrorSnackMessage;
  versioning: boolean;
}

const DeleteObject = ({
  closeDeleteModalAndRefresh,
  deleteOpen,
  selectedBucket,
  selectedObject,
  setErrorSnackMessage,
  versioning,
}: IDeleteObjectProps) => {
  const onDelSuccess = () => closeDeleteModalAndRefresh(true);
  const onDelError = (err: ErrorResponseHandler) => setErrorSnackMessage(err);
  const onClose = () => closeDeleteModalAndRefresh(false);

  const [deleteLoading, invokeDeleteApi] = useApi(onDelSuccess, onDelError);
  const [deleteVersions, setDeleteVersions] = useState<boolean>(false);

  if (!selectedObject) {
    return null;
  }
  const onConfirmDelete = () => {
    const decodedSelectedObject = decodeFileName(selectedObject);
    const recursive = decodedSelectedObject.endsWith("/");
    invokeDeleteApi(
      "DELETE",
      `/api/v1/buckets/${selectedBucket}/objects?path=${selectedObject}&recursive=${recursive}&all_versions=${deleteVersions}`
    );
  };

  return (
    <ConfirmDialog
      title={`Delete Object`}
      confirmText={"Delete"}
      isOpen={deleteOpen}
      titleIcon={<ConfirmDeleteIcon />}
      isLoading={deleteLoading}
      onConfirm={onConfirmDelete}
      onClose={onClose}
      confirmationContent={
        <DialogContentText>
          Are you sure you want to delete:{" "}
          <b>{decodeFileName(selectedObject)}</b>? <br />
          {versioning && (
            <FormSwitchWrapper
              label={"Delete All Versions"}
              indicatorLabels={["Yes", "No"]}
              checked={deleteVersions}
              value={"delete_versions"}
              id="delete-versions"
              name="delete-versions"
              onChange={(e) => {
                setDeleteVersions(!deleteVersions);
              }}
              description=""
            />
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

export default connector(DeleteObject);
