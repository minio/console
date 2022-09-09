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
import { Theme } from "@mui/material/styles";

import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { modalBasic } from "../../../../Common/FormComponents/common/styleLibrary";

import { ErrorResponseHandler } from "../../../../../../common/types";
import { encodeURLString } from "../../../../../../common/utils";
import api from "../../../../../../common/api";
import ConfirmDialog from "../../../../Common/ModalWrapper/ConfirmDialog";
import RecoverIcon from "../../../../../../icons/RecoverIcon";
import { setErrorSnackMessage } from "../../../../../../systemSlice";
import { useAppDispatch } from "../../../../../../store";

interface IRestoreFileVersion {
  classes: any;
  restoreOpen: boolean;
  bucketName: string;
  versionID: string;
  objectPath: string;
  onCloseAndUpdate: (refresh: boolean) => void;
}

const styles = (theme: Theme) =>
  createStyles({
    ...modalBasic,
  });

const RestoreFileVersion = ({
  classes,
  versionID,
  bucketName,
  objectPath,
  restoreOpen,
  onCloseAndUpdate,
}: IRestoreFileVersion) => {
  const dispatch = useAppDispatch();
  const [restoreLoading, setRestoreLoading] = useState<boolean>(false);

  const restoreVersion = () => {
    setRestoreLoading(true);

    api
      .invoke(
        "PUT",
        `/api/v1/buckets/${bucketName}/objects/restore?prefix=${encodeURLString(
          objectPath
        )}&version_id=${versionID}`
      )
      .then((res: any) => {
        setRestoreLoading(false);
        onCloseAndUpdate(true);
      })
      .catch((error: ErrorResponseHandler) => {
        dispatch(setErrorSnackMessage(error));
        setRestoreLoading(false);
      });
  };

  return (
    <ConfirmDialog
      title={`Restore File Version`}
      confirmText={"Restore"}
      isOpen={restoreOpen}
      isLoading={restoreLoading}
      titleIcon={<RecoverIcon />}
      onConfirm={restoreVersion}
      confirmButtonProps={{
        variant: "secondary",
        disabled: restoreLoading,
      }}
      onClose={() => {
        onCloseAndUpdate(false);
      }}
      confirmationContent={
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to restore <br />
          <b>{objectPath}</b> <br /> with Version ID:
          <br />
          <b className={classes.wrapText}>{versionID}</b>?
        </DialogContentText>
      }
    />
  );
};

export default withStyles(styles)(RestoreFileVersion);
