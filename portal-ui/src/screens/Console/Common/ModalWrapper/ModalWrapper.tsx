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
  closeModalAndRefresh: () => void;
  modalOpen: boolean;
  title: string;
  children: any;
}

const baseCloseLine = {
  content: '" "',
  borderLeft: "2px solid #707070",
  height: 33,
  width: 1,
  position: "absolute"
};

const styles = (theme: Theme) =>
  createStyles({
    dialogContainer: {
      padding: "12px 26px 22px"
    },
    closeContainer: {
      textAlign: "right"
    },
    closeButton: {
      width: 45,
      height: 45,
      padding: 0,
      backgroundColor: "initial",
      "&:hover": {
        backgroundColor: "initial"
      },
      "&:active": {
        backgroundColor: "initial"
      }
    },
    modalCloseIcon: {
      fontSize: 35,
      color: "#707070",
      fontWeight: 300,
      "&:hover": {
        color: "#000"
      }
    },
    closeIcon: {
      "&::before": {
        ...baseCloseLine,
        transform: "rotate(45deg)"
      },
      "&::after": {
        ...baseCloseLine,
        transform: "rotate(-45deg)"
      },
      "&:hover::before, &:hover::after": {
        borderColor: "#000"
      },
      width: 24,
      height: 24,
      display: "block",
      position: "relative"
    },
    titleClass: {
      padding: "0px 24px 12px"
    }
  });

const ModalWrapper = ({
  closeModalAndRefresh,
  modalOpen,
  title,
  children,
  classes
}: IModalProps) => {
  return (
    <Dialog
      open={modalOpen}
      onClose={closeModalAndRefresh}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth={"md"}
      fullWidth
    >
      <div className={classes.dialogContainer}>
        <div className={classes.closeContainer}>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={closeModalAndRefresh}
            disableRipple
          >
            <span className={classes.closeIcon} />
          </IconButton>
        </div>
        <DialogTitle id="alert-dialog-title" className={classes.titleClass}>
          {title}
        </DialogTitle>
        <DialogContent>{children}</DialogContent>
      </div>
    </Dialog>
  );
};

export default withStyles(styles)(ModalWrapper);
