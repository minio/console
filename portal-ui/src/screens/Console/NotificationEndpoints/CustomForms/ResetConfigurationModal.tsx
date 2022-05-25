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

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { DialogContentText, LinearProgress } from "@mui/material";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { deleteDialogStyles } from "../../Common/FormComponents/common/styleLibrary";

import { ErrorResponseHandler } from "../../../../common/types";
import api from "../../../../common/api";
import ConfirmDialog from "../../Common/ModalWrapper/ConfirmDialog";
import { ConfirmDeleteIcon } from "../../../../icons";
import { setErrorSnackMessage } from "../../../../systemSlice";

const styles = (theme: Theme) =>
  createStyles({
    wrapText: {
      maxWidth: "200px",
      whiteSpace: "normal",
      wordWrap: "break-word",
    },
    ...deleteDialogStyles,
  });

interface IResetConfiguration {
  classes: any;
  configurationName: string;
  closeResetModalAndRefresh: (reloadConfiguration: boolean) => void;

  resetOpen: boolean;
}

const ResetConfigurationModal = ({
  classes,
  configurationName,
  closeResetModalAndRefresh,
  resetOpen,
}: IResetConfiguration) => {
  const dispatch = useDispatch();
  const [resetLoading, setResetLoading] = useState<boolean>(false);

  useEffect(() => {
    if (resetLoading) {
      api
        .invoke("POST", `/api/v1/configs/${configurationName}/reset`)
        .then((res) => {
          setResetLoading(false);
          closeResetModalAndRefresh(true);
        })
        .catch((err: ErrorResponseHandler) => {
          setResetLoading(false);
          dispatch(setErrorSnackMessage(err));
        });
    }
  }, [closeResetModalAndRefresh, configurationName, resetLoading, dispatch]);

  const resetConfiguration = () => {
    setResetLoading(true);
  };

  return (
    <ConfirmDialog
      title={`Restore Defaults`}
      confirmText={"Yes, Reset Configuration"}
      isOpen={resetOpen}
      titleIcon={<ConfirmDeleteIcon />}
      isLoading={resetLoading}
      onConfirm={resetConfiguration}
      onClose={() => {
        closeResetModalAndRefresh(false);
      }}
      confirmationContent={
        <React.Fragment>
          {resetLoading && <LinearProgress />}
          <DialogContentText>
            Are you sure you want to restore these configurations to default
            values?
            <br />
            <b className={classes.wrapText}>
              Please note that this may cause your system to not be accessible
            </b>
          </DialogContentText>
        </React.Fragment>
      }
    />
  );
};

export default withStyles(styles)(ResetConfigurationModal);
