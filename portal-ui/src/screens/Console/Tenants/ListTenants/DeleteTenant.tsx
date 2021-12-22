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
import { DialogContentText } from "@mui/material";
import { ITenant } from "./types";
import { connect } from "react-redux";
import { setErrorSnackMessage } from "../../../../actions";
import { ErrorResponseHandler } from "../../../../common/types";
import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import Grid from "@mui/material/Grid";
import useApi from "../../Common/Hooks/useApi";
import ConfirmDialog from "../../Common/ModalWrapper/ConfirmDialog";
import { ConfirmDeleteIcon } from "../../../../icons";

interface IDeleteTenant {
  deleteOpen: boolean;
  selectedTenant: ITenant;
  closeDeleteModalAndRefresh: (refreshList: boolean) => any;
  setErrorSnackMessage: typeof setErrorSnackMessage;
}

const DeleteTenant = ({
  deleteOpen,
  selectedTenant,
  closeDeleteModalAndRefresh,
  setErrorSnackMessage,
}: IDeleteTenant) => {
  const [retypeTenant, setRetypeTenant] = useState("");

  const onDelSuccess = () => closeDeleteModalAndRefresh(true);
  const onDelError = (err: ErrorResponseHandler) => setErrorSnackMessage(err);
  const onClose = () => closeDeleteModalAndRefresh(false);

  const [deleteLoading, invokeDeleteApi] = useApi(onDelSuccess, onDelError);

  const onConfirmDelete = () => {
    if (retypeTenant !== selectedTenant.name) {
      setErrorSnackMessage({
        errorMessage: "Tenant name is incorrect",
        detailedError: "",
      });
      return;
    }
    invokeDeleteApi(
      "DELETE",
      `/api/v1/namespaces/${selectedTenant.namespace}/tenants/${selectedTenant.name}`
    );
  };

  return (
    <ConfirmDialog
      title={`Delete Tenant`}
      confirmText={"Delete"}
      isOpen={deleteOpen}
      titleIcon={<ConfirmDeleteIcon />}
      isLoading={deleteLoading}
      onConfirm={onConfirmDelete}
      onClose={onClose}
      confirmButtonProps={{
        disabled: retypeTenant !== selectedTenant.name || deleteLoading,
      }}
      confirmationContent={
        <DialogContentText>
          To continue please type <b>{selectedTenant.name}</b> in the box.
          <Grid item xs={12}>
            <InputBoxWrapper
              id="retype-tenant"
              name="retype-tenant"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setRetypeTenant(event.target.value);
              }}
              label=""
              value={retypeTenant}
            />
          </Grid>
        </DialogContentText>
      }
    />
  );
};

const connector = connect(null, {
  setErrorSnackMessage,
});

export default connector(DeleteTenant);
