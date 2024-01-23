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

import React, { Fragment, useState } from "react";
import { Grid, InputBox } from "mds";
import { useAppDispatch } from "../../../../store";
import { setErrorSnackMessage } from "../../../../systemSlice";
import ConfirmDialog from "../../Common/ModalWrapper/ConfirmDialog";
import KMSHelpBox from "../../KMS/KMSHelpbox";
import { api } from "api";
import { ApiError, HttpResponse } from "api/consoleApi";
import { errorToHandler } from "api/errors";

interface IAddKeyModalProps {
  closeAddModalAndRefresh: (refresh: boolean) => void;
  addOpen: boolean;
}

const AddKeyModal = ({
  closeAddModalAndRefresh,
  addOpen,
}: IAddKeyModalProps) => {
  const dispatch = useAppDispatch();
  const onClose = () => closeAddModalAndRefresh(false);

  const [loadingAdd, setLoadingAdd] = useState<boolean>(false);
  const [keyName, setKeyName] = useState<string>("");

  const onConfirmAdd = () => {
    setLoadingAdd(true);
    api.kms
      .kmsCreateKey({ key: keyName })
      .then((_) => {
        closeAddModalAndRefresh(true);
      })
      .catch(async (res: HttpResponse<void, ApiError>) => {
        const err = (await res.json()) as ApiError;
        dispatch(setErrorSnackMessage(errorToHandler(err)));
        closeAddModalAndRefresh(false);
      })
      .finally(() => setLoadingAdd(false));
  };

  return (
    <ConfirmDialog
      title={""}
      confirmText={"Create"}
      isOpen={addOpen}
      isLoading={loadingAdd}
      onConfirm={onConfirmAdd}
      onClose={onClose}
      confirmButtonProps={{
        disabled: keyName.indexOf(" ") !== -1 || keyName === "" || loadingAdd,
        variant: "callAction",
      }}
      confirmationContent={
        <Fragment>
          <KMSHelpBox
            helpText={"Create Key"}
            contents={[
              "Create a new cryptographic key in the Key Management Service server connected to MINIO.",
            ]}
          />

          <Grid item xs={12} sx={{ marginTop: 15 }}>
            <InputBox
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
        </Fragment>
      }
    />
  );
};

export default AddKeyModal;
