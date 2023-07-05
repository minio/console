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
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { modalBasic } from "../../../../Common/FormComponents/common/styleLibrary";
import { encodeURLString } from "../../../../../../common/utils";
import ConfirmDialog from "../../../../Common/ModalWrapper/ConfirmDialog";
import { Box, RecoverIcon } from "mds";
import { setErrorSnackMessage } from "../../../../../../systemSlice";
import { useAppDispatch } from "../../../../../../store";
import { restoreLocalObjectList } from "../../../../ObjectBrowser/objectBrowserSlice";
import { BucketObject } from "api/consoleApi";
import { api } from "api";
import { errorToHandler } from "api/errors";

interface IRestoreFileVersion {
  classes: any;
  restoreOpen: boolean;
  bucketName: string;
  versionToRestore: BucketObject;
  objectPath: string;
  onCloseAndUpdate: (refresh: boolean) => void;
}

const styles = (theme: Theme) =>
  createStyles({
    ...modalBasic,
  });

const RestoreFileVersion = ({
  classes,
  versionToRestore,
  bucketName,
  objectPath,
  restoreOpen,
  onCloseAndUpdate,
}: IRestoreFileVersion) => {
  const dispatch = useAppDispatch();
  const [restoreLoading, setRestoreLoading] = useState<boolean>(false);

  const restoreVersion = () => {
    setRestoreLoading(true);

    api.buckets
      .putObjectRestore(bucketName, {
        prefix: encodeURLString(objectPath),
        version_id: versionToRestore.version_id || "",
      })
      .then(() => {
        setRestoreLoading(false);
        onCloseAndUpdate(true);
        dispatch(
          restoreLocalObjectList({
            prefix: objectPath,
            objectInfo: versionToRestore,
          })
        );
      })
      .catch((err) => {
        dispatch(setErrorSnackMessage(errorToHandler(err.error)));
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
        <Box id="alert-dialog-description">
          Are you sure you want to restore <br />
          <b>{objectPath}</b> <br /> with Version ID:
          <br />
          <b className={classes.wrapText}>{versionToRestore.version_id}</b>?
        </Box>
      }
    />
  );
};

export default withStyles(styles)(RestoreFileVersion);
