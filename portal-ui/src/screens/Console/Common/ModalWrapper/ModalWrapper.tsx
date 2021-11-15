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
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { snackBarCommon } from "../FormComponents/common/styleLibrary";
import { AppState } from "../../../../store";
import { snackBarMessage } from "../../../../types";
import { setModalSnackMessage } from "../../../../actions";
import ModalError from "../FormComponents/ModalError/ModalError";

interface IModalProps {
  classes: any;
  onClose: () => void;
  modalOpen: boolean;
  title: string | React.ReactNode;
  children: any;
  wideLimit?: boolean;
  modalSnackMessage?: snackBarMessage;
  noContentPadding?: boolean;
  setModalSnackMessage: typeof setModalSnackMessage;
}

const baseCloseLine = {
  content: '" "',
  borderLeft: "2px solid #9C9C9C",
  height: 33,
  width: 1,
  position: "absolute",
};

const styles = (theme: Theme) =>
  createStyles({
    dialogContainer: {
      padding: "8px 15px 22px",
    },
    closeContainer: {
      textAlign: "right",
    },
    closeButton: {
      height: 16,
      width: 16,
      padding: 0,
      backgroundColor: "initial",
      "&:hover": {
        backgroundColor: "initial",
      },
      "&:active": {
        backgroundColor: "initial",
      },
    },
    modalCloseIcon: {
      fontSize: 35,
      color: "#9C9C9C",
      fontWeight: 300,
      "&:hover": {
        color: "#9C9C9C",
      },
    },
    closeIcon: {
      "&::before": {
        ...baseCloseLine,
        transform: "rotate(45deg)",
        height: 12,
      },
      "&::after": {
        ...baseCloseLine,
        transform: "rotate(-45deg)",
        height: 12,
      },
      "&:hover::before, &:hover::after": {
        borderColor: "#9C9C9C",
      },
      display: "block",
      position: "relative",
      height: 12,
      width: 12,
    },
    titleClass: {
      padding: "0px 50px 12px",
      fontSize: "1.2rem",
      fontWeight: 600,
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    },
    modalContent: {
      padding: "0 50px",
    },
    customDialogSize: {
      width: "100%",
      maxWidth: 765,
    },
    ...snackBarCommon,
  });

const ModalWrapper = ({
  onClose,
  modalOpen,
  title,
  children,
  classes,
  wideLimit = true,
  modalSnackMessage,
  noContentPadding,
  setModalSnackMessage,
}: IModalProps) => {
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  useEffect(() => {
    setModalSnackMessage("");
  }, [setModalSnackMessage]);

  useEffect(() => {
    if (modalSnackMessage) {
      if (modalSnackMessage.message === "") {
        setOpenSnackbar(false);
        return;
      }
      // Open SnackBar
      if (modalSnackMessage.type !== "error") {
        setOpenSnackbar(true);
      }
    }
  }, [modalSnackMessage]);

  const closeSnackBar = () => {
    setOpenSnackbar(false);
    setModalSnackMessage("");
  };

  const customSize = wideLimit
    ? {
        classes: {
          paper: classes.customDialogSize,
        },
      }
    : { maxWidth: "lg" as const, fullWidth: true };

  let message = "";

  if (modalSnackMessage) {
    message = modalSnackMessage.detailedErrorMsg;
    if (
      modalSnackMessage.detailedErrorMsg === "" ||
      modalSnackMessage.detailedErrorMsg.length < 5
    ) {
      message = modalSnackMessage.message;
    }
  }

  return (
    <Dialog
      open={modalOpen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      {...customSize}
    >
      <div className={classes.dialogContainer}>
        <ModalError />
        <Snackbar
          open={openSnackbar}
          className={classes.snackBarModal}
          onClose={() => {
            closeSnackBar();
          }}
          message={message}
          ContentProps={{
            className: `${classes.snackBar} ${
              modalSnackMessage && modalSnackMessage.type === "error"
                ? classes.errorSnackBar
                : ""
            }`,
          }}
          autoHideDuration={
            modalSnackMessage && modalSnackMessage.type === "error"
              ? 10000
              : 5000
          }
        />
        <div className={classes.closeContainer}>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
            disableRipple
            size="large"
          >
            <span className={classes.closeIcon} />
          </IconButton>
        </div>
        <DialogTitle id="alert-dialog-title" className={classes.titleClass}>
          {title}
        </DialogTitle>
        <DialogContent className={noContentPadding ? "" : classes.modalContent}>
          {children}
        </DialogContent>
      </div>
    </Dialog>
  );
};

const mapState = (state: AppState) => ({
  modalSnackMessage: state.system.modalSnackBar,
});

const connector = connect(mapState, {
  setModalSnackMessage,
});

export default withStyles(styles)(connector(ModalWrapper));
