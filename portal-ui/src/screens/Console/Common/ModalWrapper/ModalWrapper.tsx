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
import { useSelector } from "react-redux";
import Snackbar from "@mui/material/Snackbar";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import {
  deleteDialogStyles,
  snackBarCommon,
} from "../FormComponents/common/styleLibrary";
import { AppState, useAppDispatch } from "../../../../store";
import MainError from "../MainError/MainError";
import { setModalSnackMessage } from "../../../../systemSlice";
import { ModalBox } from "mds";
import { CSSObject } from "styled-components";

interface IModalProps {
  classes: any;
  onClose: () => void;
  modalOpen: boolean;
  title: string | React.ReactNode;
  children: any;
  wideLimit?: boolean;
  titleIcon?: React.ReactNode;
  iconColor?: "default" | "delete" | "accept";
  sx?: CSSObject;
}

const styles = (theme: Theme) =>
  createStyles({
    ...deleteDialogStyles,
    ...snackBarCommon,
  });

const ModalWrapper = ({
  onClose,
  modalOpen,
  title,
  children,
  classes,
  wideLimit = true,
  titleIcon = null,
  iconColor = "default",
  sx,
}: IModalProps) => {
  const dispatch = useAppDispatch();
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  const modalSnackMessage = useSelector(
    (state: AppState) => state.system.modalSnackBar,
  );

  useEffect(() => {
    dispatch(setModalSnackMessage(""));
  }, [dispatch]);

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
    dispatch(setModalSnackMessage(""));
  };

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
    <ModalBox
      onClose={onClose}
      open={modalOpen}
      title={title}
      titleIcon={titleIcon}
      widthLimit={wideLimit}
      sx={sx}
      iconColor={iconColor}
    >
      <MainError isModal={true} />
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
          modalSnackMessage && modalSnackMessage.type === "error" ? 10000 : 5000
        }
      />
      {children}
    </ModalBox>
  );
};

export default withStyles(styles)(ModalWrapper);
