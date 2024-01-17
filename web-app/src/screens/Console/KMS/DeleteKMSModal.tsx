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
import { ConfirmDeleteIcon, Grid, InformativeMessage, InputBox } from "mds";
import { setErrorSnackMessage } from "../../../systemSlice";
import { useAppDispatch } from "../../../store";
import ConfirmDialog from "../Common/ModalWrapper/ConfirmDialog";
import { api } from "api";
import { errorToHandler } from "api/errors";
import { ApiError, HttpResponse } from "api/consoleApi";

interface IDeleteKMSModalProps {
  closeDeleteModalAndRefresh: (refresh: boolean) => void;
  deleteOpen: boolean;
  selectedItem: string;
}

const DeleteKMSModal = ({
  closeDeleteModalAndRefresh,
  deleteOpen,
  selectedItem,
}: IDeleteKMSModalProps) => {
  const dispatch = useAppDispatch();
  const onClose = () => closeDeleteModalAndRefresh(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const [retypeKey, setRetypeKey] = useState("");

  if (!selectedItem) {
    return null;
  }

  const onConfirmDelete = () => {
    setLoadingDelete(true);
    api.kms
      .kmsDeleteKey(selectedItem)
      .then((_) => {
        closeDeleteModalAndRefresh(true);
      })
      .catch(async (res: HttpResponse<void, ApiError>) => {
        const err = (await res.json()) as ApiError;
        dispatch(setErrorSnackMessage(errorToHandler(err)));
        closeDeleteModalAndRefresh(false);
      })
      .finally(() => setLoadingDelete(false));
  };

  return (
    <ConfirmDialog
      title={`Delete Key`}
      confirmText={"Delete"}
      isOpen={deleteOpen}
      titleIcon={<ConfirmDeleteIcon />}
      isLoading={loadingDelete}
      onConfirm={onConfirmDelete}
      onClose={onClose}
      confirmButtonProps={{
        disabled: retypeKey !== selectedItem || loadingDelete,
      }}
      confirmationContent={
        <Fragment>
          <Grid item xs={12}>
            <InformativeMessage
              variant={"error"}
              title={"WARNING"}
              message={
                "Please note that this is a dangerous operation. Once a key has been deleted all data that has been encrypted with it cannot be decrypted anymore, and therefore, is lost."
              }
              sx={{ margin: "15px 0" }}
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
