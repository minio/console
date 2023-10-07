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

import React, { useState, Fragment } from "react";
import { ConfirmDeleteIcon, Grid, InputBox } from "mds";
import { ErrorResponseHandler } from "../../../common/types";
import { setErrorSnackMessage } from "../../../systemSlice";
import { useAppDispatch } from "../../../store";
import useApi from "../Common/Hooks/useApi";
import ConfirmDialog from "../Common/ModalWrapper/ConfirmDialog";
import WarningMessage from "../Common/WarningMessage/WarningMessage";

interface IDeleteKMSModalProps {
  closeDeleteModalAndRefresh: (refresh: boolean) => void;
  deleteOpen: boolean;
  selectedItem: string;
  endpoint: string;
  element: string;
}

const DeleteKMSModal = ({
  closeDeleteModalAndRefresh,
  deleteOpen,
  selectedItem,
  endpoint,
  element,
}: IDeleteKMSModalProps) => {
  const dispatch = useAppDispatch();
  const onDelSuccess = () => closeDeleteModalAndRefresh(true);
  const onDelError = (err: ErrorResponseHandler) =>
    dispatch(setErrorSnackMessage(err));
  const onClose = () => closeDeleteModalAndRefresh(false);

  const [deleteLoading, invokeDeleteApi] = useApi(onDelSuccess, onDelError);
  const [retypeKey, setRetypeKey] = useState("");

  if (!selectedItem) {
    return null;
  }

  const onConfirmDelete = () => {
    invokeDeleteApi("DELETE", `${endpoint}${selectedItem}`);
  };

  return (
    <ConfirmDialog
      title={`Delete ${element}`}
      confirmText={"Delete"}
      isOpen={deleteOpen}
      titleIcon={<ConfirmDeleteIcon />}
      isLoading={deleteLoading}
      onConfirm={onConfirmDelete}
      onClose={onClose}
      confirmButtonProps={{
        disabled: retypeKey !== selectedItem || deleteLoading,
      }}
      confirmationContent={
        <Fragment>
          <Grid item xs={12}>
            <WarningMessage
              title={"WARNING"}
              label={
                "Please note that this is a dangerous operation. Once a key has been deleted all data that has been encrypted with it cannot be decrypted anymore, and therefore, is lost."
              }
            />
          </Grid>
          To continue please type <b>{selectedItem}</b> in the box.
          <Grid item xs={12}>
            <InputBox
              id="retype-key"
              name="retype-key"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setRetypeKey(event.target.value);
              }}
              onPaste={(e) => e.preventDefault()}
              label=""
              value={retypeKey}
            />
          </Grid>
        </Fragment>
      }
    />
  );
};

export default DeleteKMSModal;
