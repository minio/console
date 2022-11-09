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

import { DialogContentText, Grid } from "@mui/material";
import React, { useState } from "react";
import { ErrorResponseHandler } from "../../../../common/types";
import { useAppDispatch } from "../../../../store";
import { setErrorSnackMessage } from "../../../../systemSlice";
import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import useApi from "../../Common/Hooks/useApi";
import ConfirmDialog from "../../Common/ModalWrapper/ConfirmDialog";
import KMSHelpBox from "../../KMS/KMSHelpbox";

interface IAddKeyModalProps {
  closeAddModalAndRefresh: (refresh: boolean) => void;
  addOpen: boolean;
}

const AddKeyModal = ({
  closeAddModalAndRefresh,
  addOpen,
}: IAddKeyModalProps) => {
  const dispatch = useAppDispatch();
  const onAddSuccess = () => closeAddModalAndRefresh(true);
  const onAddError = (err: ErrorResponseHandler) => {
    closeAddModalAndRefresh(false);
    dispatch(setErrorSnackMessage(err));
  };
  const onClose = () => closeAddModalAndRefresh(false);

  const [addLoading, invokeAddApi] = useApi(onAddSuccess, onAddError);
  const [keyName, setKeyName] = useState<string>("");

  const onConfirmAdd = () => {
    invokeAddApi("POST", "/api/v1/kms/keys/", { key: keyName });
  };

  return (
    <ConfirmDialog
      title={""}
      confirmText={"Create"}
      isOpen={addOpen}
      isLoading={addLoading}
      onConfirm={onConfirmAdd}
      onClose={onClose}
      confirmButtonProps={{
        disabled: keyName.indexOf(" ") !== -1 || keyName === "" || addLoading,
        variant: "callAction",
      }}
      confirmationContent={
        <DialogContentText>
          <KMSHelpBox
            helpText={"Create Key"}
            contents={[
              "Create a new cryptographic key in the Key Management Service server connected to MINIO.",
            ]}
          />

          <Grid item xs={12} marginTop={3}>
            <InputBoxWrapper
              id="key-name"
              name="key-name"
              label="Key Name"
              autoFocus={true}
              value={keyName}
              error={
                keyName.indexOf(" ") !== -1
                  ? "Key name cannot contain spaces"
                  : ""
              }
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setKeyName(e.target.value);
              }}
            />
          </Grid>
        </DialogContentText>
      }
    />
  );
};

export default AddKeyModal;
