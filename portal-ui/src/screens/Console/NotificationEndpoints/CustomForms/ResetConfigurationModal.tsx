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
import { connect } from "react-redux";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
} from "@mui/material";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {
  deleteDialogStyles,
  modalBasic,
} from "../../Common/FormComponents/common/styleLibrary";
import { setErrorSnackMessage } from "../../../../actions";
import { ErrorResponseHandler } from "../../../../common/types";
import api from "../../../../common/api";

const styles = (theme: Theme) =>
  createStyles({
    wrapText: {
      maxWidth: "200px",
      whiteSpace: "normal",
      wordWrap: "break-word",
    },
    ...modalBasic,
    ...deleteDialogStyles,
  });

interface IResetConfiguration {
  classes: any;
  configurationName: string;
  closeResetModalAndRefresh: (reloadConfiguration: boolean) => void;
  setErrorSnackMessage: typeof setErrorSnackMessage;
  resetOpen: boolean;
}

const ResetConfigurationModal = ({
  classes,
  configurationName,
  closeResetModalAndRefresh,
  setErrorSnackMessage,
  resetOpen,
}: IResetConfiguration) => {
  const [resetLoading, setResetLoading] = useState<boolean>(false);

  useEffect(() => {
    if (resetLoading) {
      api
        .invoke("GET", `/api/v1/configs/${configurationName}/reset`)
        .then((res) => {
          setResetLoading(false);
          closeResetModalAndRefresh(true);
        })
        .catch((err: ErrorResponseHandler) => {
          setResetLoading(false);
          setErrorSnackMessage(err);
        });
    }
  }, [
    closeResetModalAndRefresh,
    configurationName,
    resetLoading,
    setErrorSnackMessage,
  ]);

  const resetConfiguration = () => {
    setResetLoading(true);
  };

  return (
    <Dialog
      open={resetOpen}
      onClose={() => {
        closeResetModalAndRefresh(false);
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{
        "& .MuiPaper-root": {
          padding: "1rem 2rem 2rem 1rem",
        },
      }}
    >
      <DialogTitle id="alert-dialog-title" className={classes.title}>
        <div className={classes.titleText}>Restore Defaults</div>
        <div className={classes.closeContainer}>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={() => {
              closeResetModalAndRefresh(false);
            }}
            disableRipple
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent>
        {resetLoading && <LinearProgress />}
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to restore these configurations to default
          values?
          <br />
          <b className={classes.wrapText}>
            Please note that this may cause your system to not be accessible
          </b>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          type="button"
          variant="outlined"
          onClick={() => {
            closeResetModalAndRefresh(false);
          }}
          color="primary"
          disabled={resetLoading}
        >
          Cancel
        </Button>
        <Button
          onClick={resetConfiguration}
          variant="contained"
          color="primary"
          autoFocus
          disabled={resetLoading}
        >
          Yes, Reset Configuration
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const mapDispatchToProps = {
  setErrorSnackMessage,
};

const connector = connect(null, mapDispatchToProps);

export default withStyles(styles)(connector(ResetConfigurationModal));
