// This file is part of MinIO Console Server
// Copyright (c) 2020 MinIO, Inc.
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
import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";

interface IModalProps {
  classes: any;
  onClose: () => void;
  modalOpen: boolean;
  title: string;
  children: any;
  wideLimit?: boolean;
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
      width: 45,
      height: 45,
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
      },
      "&::after": {
        ...baseCloseLine,
        transform: "rotate(-45deg)",
      },
      "&:hover::before, &:hover::after": {
        borderColor: "#9C9C9C",
      },
      width: 24,
      height: 24,
      display: "block",
      position: "relative",
    },
    titleClass: {
      padding: "0px 50px 12px",
      "& h2": {
        fontWeight: 600,
        color: "#000",
        fontSize: 22,
      },
    },
    modalContent: {
      padding: "0 50px",
    },
    customDialogSize: {
      width: "100%",
      maxWidth: 765,
    },
  });

const ModalWrapper = ({
  onClose,
  modalOpen,
  title,
  children,
  classes,
  wideLimit = true,
}: IModalProps) => {
  const customSize = wideLimit
    ? {
        classes: {
          paper: classes.customDialogSize,
        },
      }
    : { maxWidth: "md" as const, fullWidth: true };
  return (
    <Dialog
      open={modalOpen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      {...customSize}
    >
      <div className={classes.dialogContainer}>
        <div className={classes.closeContainer}>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
            disableRipple
          >
            <span className={classes.closeIcon} />
          </IconButton>
        </div>
        <DialogTitle id="alert-dialog-title" className={classes.titleClass}>
          {title}
        </DialogTitle>
        <DialogContent className={classes.modalContent}>
          {children}
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default withStyles(styles)(ModalWrapper);
