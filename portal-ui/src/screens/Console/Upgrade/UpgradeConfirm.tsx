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

import React, { useEffect, useState } from "react";
import { ConfirmModalIcon } from "mds";
import { DialogContentText, LinearProgress } from "@mui/material";
import ConfirmDialog from "../Common/ModalWrapper/ConfirmDialog";
import api from "../../../common/api";
import { ErrorResponseHandler } from "../../../common/types";
import {
  setModalErrorSnackMessage,
  setSnackBarMessage,
} from "../../../systemSlice";
import { useAppDispatch } from "../../../store";

interface IUpgradeConfirm {
  confirmOpen: boolean;
  onClose: (success: boolean) => void;
  upgradeVersion: string;
}

const UpgradeConfirm = ({
  confirmOpen,
  onClose,
  upgradeVersion,
}: IUpgradeConfirm) => {
  const dispatch = useAppDispatch();
  const [upgradeLoading, setUpgradeLoading] = useState<boolean>(false);

  useEffect(() => {
    if (upgradeLoading) {
      const request = {};

      api
        .invoke("PUT", "/api/v1/admin/upgrade", request)
        .then(() => {
          dispatch(
            setSnackBarMessage(
              "MinIO upgraded Successfully, Reloading this page."
            )
          );
          setUpgradeLoading(false);
          onClose(true);
        })
        .catch((err: ErrorResponseHandler) => {
          setUpgradeLoading(false);
          dispatch(setModalErrorSnackMessage(err));
        });
    }
  }, [upgradeLoading, dispatch, onClose]);

  const onConfirmUpgrade = () => {
    setUpgradeLoading(true);
  };

  const closeDisabled = () => {
    if (!upgradeLoading) {
      onClose(false);
    }
  };

  return (
    <ConfirmDialog
      title={`Upgrade MinIO instance`}
      confirmText={"Yes, Upgrade my Instance"}
      isOpen={confirmOpen}
      titleIcon={<ConfirmModalIcon />}
      isLoading={upgradeLoading}
      onConfirm={onConfirmUpgrade}
      onClose={closeDisabled}
      confirmButtonProps={{ variant: "callAction" }}
      confirmationContent={
        <DialogContentText>
          Are you sure you want to upgrade your MinIO instance <br />
          to <b>{upgradeVersion}</b>?{upgradeLoading && <LinearProgress />}
        </DialogContentText>
      }
    />
  );
};

export default UpgradeConfirm;
