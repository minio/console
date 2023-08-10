// This file is part of MinIO Console Server
// Copyright (c) 2023 MinIO, Inc.
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

import React, { useEffect, useState, Fragment } from "react";
import { ConfirmDeleteIcon } from "mds";
import { api } from "api";
import { errorToHandler } from "api/errors";
import ConfirmDialog from "../../Common/ModalWrapper/ConfirmDialog";
import {
  configurationIsLoading,
  setErrorSnackMessage,
  setServerNeedsRestart,
} from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";

interface IDeleteWebhookEndpoint {
  modalOpen: boolean;
  onClose: () => void;
  selectedARN: string;
  type: string;
}

const DeleteWebhookEndpoint = ({
  modalOpen,
  onClose,
  selectedARN,
}: IDeleteWebhookEndpoint) => {
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (deleteLoading) {
      api.configs
        .resetConfig(selectedARN)
        .then(() => {
          setDeleteLoading(false);
          dispatch(setServerNeedsRestart(true));
          dispatch(configurationIsLoading(true));
          onClose();
        })
        .catch((err) => {
          setDeleteLoading(false);
          dispatch(setErrorSnackMessage(errorToHandler(err.error)));
        });
    }
  }, [deleteLoading, dispatch, onClose, selectedARN]);

  const onConfirmDelete = () => {
    setDeleteLoading(true);
  };

  const defaultWH = !selectedARN.includes(":");

  let message = "Are you sure you want to delete the Configured Endpoint";

  // Main webhook, we just reset
  if (defaultWH) {
    message = "Are you sure you want to reset the Default";
  }

  return (
    <ConfirmDialog
      title={defaultWH ? `Reset Default Webhook` : `Delete Webhook`}
      confirmText={defaultWH ? "Reset" : "Delete"}
      isOpen={modalOpen}
      isLoading={deleteLoading}
      onConfirm={onConfirmDelete}
      titleIcon={<ConfirmDeleteIcon />}
      onClose={onClose}
      confirmationContent={
        <Fragment>
          {`${message} `}
          <strong>{selectedARN}</strong>?
        </Fragment>
      }
    />
  );
};

export default DeleteWebhookEndpoint;
