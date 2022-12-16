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
import { DialogContentText } from "@mui/material";

import { ErrorResponseHandler } from "../../../../../../common/types";
import { decodeURLString } from "../../../../../../common/utils";
import ConfirmDialog from "../../../../Common/ModalWrapper/ConfirmDialog";
import useApi from "../../../../Common/Hooks/useApi";
import { ConfirmDeleteIcon } from "../../../../../../icons";
import FormSwitchWrapper from "../../../../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";

import { setErrorSnackMessage } from "../../../../../../systemSlice";
import { useAppDispatch } from "../../../../../../store";

interface IDeleteObjectProps {
  closeDeleteModalAndRefresh: (refresh: boolean) => void;
  deleteOpen: boolean;
  selectedObject: string;
  selectedBucket: string;

  versioning: boolean;
  selectedVersion?: string;
}

const DeleteObject = ({
  closeDeleteModalAndRefresh,
  deleteOpen,
  selectedBucket,
  selectedObject,

  versioning,
  selectedVersion = "",
}: IDeleteObjectProps) => {
  const dispatch = useAppDispatch();
  const onDelSuccess = () => closeDeleteModalAndRefresh(true);
  const onDelError = (err: ErrorResponseHandler) =>
    dispatch(setErrorSnackMessage(err));
  const onClose = () => closeDeleteModalAndRefresh(false);

  const [deleteLoading, invokeDeleteApi] = useApi(onDelSuccess, onDelError);
  const [deleteVersions, setDeleteVersions] = useState<boolean>(false);

  if (!selectedObject) {
    return null;
  }
  const onConfirmDelete = () => {
    const decodedSelectedObject = decodeURLString(selectedObject);
    const recursive = decodedSelectedObject.endsWith("/");
    invokeDeleteApi(
      "DELETE",
      `/api/v1/buckets/${selectedBucket}/objects?path=${selectedObject}${
        selectedVersion !== ""
          ? `&version_id=${selectedVersion}`
          : `&recursive=${recursive}&all_versions=${deleteVersions}`
      }`
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
        <DialogContentText
          sx={{
            width: "430px",
          }}
        >
          Are you sure you want to delete: <br />
          <b>{decodeURLString(selectedObject)}</b>{" "}
          {selectedVersion !== "" ? (
            <Fragment>
              <br />
              <br />
              Version ID:
              <br />
              <strong>{selectedVersion}</strong>
            </Fragment>
          ) : (
            ""
          )}
          ? <br />
          <br />
          {versioning && selectedVersion === "" && (
            <Fragment>
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
              {deleteVersions && (
                <Fragment>
                  <div
                    style={{
                      marginTop: 10,
                      border: "#c83b51 1px solid",
                      borderRadius: 3,
                      padding: 5,
                      backgroundColor: "#c83b5120",
                      color: "#c83b51",
                    }}
                  >
                    This will remove the object as well as all of its versions,{" "}
                    <br />
                    This action is irreversible.
                  </div>
                  <br />
                  Are you sure you want to continue?
                </Fragment>
              )}
            </Fragment>
          )}
        </DialogContentText>
      }
    />
  );
};

export default DeleteObject;
