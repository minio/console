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

import React, { Fragment, useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import get from "lodash/get";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CloseIcon from "@mui/icons-material/Close";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { AppState } from "../../../../store";
import { setErrorSnackMessage } from "../../../../actions";
import { snackBarMessage } from "../../../../types";

interface IMainErrorProps {
  customStyle?: any;
  classes: any;
  snackBar: snackBarMessage;
  displayErrorMessage: typeof setErrorSnackMessage;
}

const styles = (theme: Theme) =>
  createStyles({
    mainErrorContainer: {
      position: "fixed",
      width: "100%",
      backgroundColor: "#fff",
      border: "#C72C48 1px solid",
      borderLeftWidth: 12,
      borderRadius: 3,
      zIndex: 1000,
      padding: "10px 15px",
      maxWidth: 600,
      left: "50%",
      transform: "translateX(-50%)",
      marginTop: 15,
      opacity: 0,
      transitionDuration: "0.2s",
    },
    mainErrorShow: {
      opacity: 1,
    },
    closeButton: {
      position: "absolute",
      right: 5,
      fontSize: "small",
      border: 0,
      backgroundColor: "#fff",
      cursor: "pointer",
    },
    errorTitle: {
      display: "flex",
      alignItems: "center",
    },
    errorLabel: {
      color: "#000",
      fontSize: 18,
      fontWeight: 500,
      marginLeft: 5,
    },
    messageIcon: {
      color: "#C72C48",
      display: "flex",
      "& svg": {
        width: 32,
        height: 32,
      },
    },
    simpleError: {
      marginTop: 5,
      padding: "2px 5px",
      fontSize: 16,
      color: "#000",
    },
    detailsButton: {
      color: "#9C9C9C",
      display: "flex",
      alignItems: "center",
      border: 0,
      backgroundColor: "transparent",
      paddingLeft: 5,
      fontSize: 14,
      transformDuration: "0.3s",
      cursor: "pointer",
    },
    extraDetailsContainer: {
      fontStyle: "italic",
      color: "#9C9C9C",
      lineHeight: 0,
      padding: "0 10px",
      transition: "all .2s ease-in-out",
      overflow: "hidden",
    },
    extraDetailsOpen: {
      lineHeight: 1,
      padding: "3px 10px",
    },
    arrowElement: {
      marginLeft: -5,
    },
    arrowOpen: {
      transform: "rotateZ(90deg)",
      transformDuration: "0.3s",
    },
  });

var timerI: any;

const startHideTimer = (callbackFunction: () => void) => {
  timerI = setInterval(callbackFunction, 10000);
};

const stopHideTimer = () => {
  clearInterval(timerI);
};

const MainError = ({
  classes,
  snackBar,
  displayErrorMessage,
  customStyle,
}: IMainErrorProps) => {
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);
  const [displayErrorMsg, setDisplayErrorMsg] = useState<boolean>(false);

  const closeErrorMessage = useCallback(() => {
    setDisplayErrorMsg(false);
  }, []);

  useEffect(() => {
    if (!displayErrorMsg) {
      displayErrorMessage({ detailedError: "", errorMessage: "" });
      setDetailsOpen(false);
      clearInterval(timerI);
    }
  }, [displayErrorMessage, displayErrorMsg]);

  useEffect(() => {
    if (snackBar.message !== "" && snackBar.type === "error") {
      //Error message received, we trigger the animation
      setDisplayErrorMsg(true);
      startHideTimer(closeErrorMessage);
    }
  }, [closeErrorMessage, snackBar.message, snackBar.type]);

  const detailsToggle = () => {
    setDetailsOpen(!detailsOpen);
  };

  const message = get(snackBar, "message", "");
  const messageDetails = get(snackBar, "detailedErrorMsg", "");

  if (snackBar.type !== "error" || message === "") {
    return null;
  }

  return (
    <Fragment>
      <div
        className={`${classes.mainErrorContainer} ${
          displayErrorMsg ? classes.mainErrorShow : ""
        }`}
        style={customStyle}
        onMouseOver={stopHideTimer}
        onMouseLeave={() => startHideTimer(closeErrorMessage)}
      >
        <button className={classes.closeButton} onClick={closeErrorMessage}>
          <CloseIcon />
        </button>
        <div className={classes.errorTitle}>
          <span className={classes.messageIcon}>
            <ErrorOutlineIcon />
          </span>
          <span className={classes.errorLabel}>Error</span>
        </div>
        <div className={classes.simpleError}>{message}</div>
        {messageDetails !== "" && (
          <Fragment>
            <div className={classes.detailsContainerLink}>
              <button className={classes.detailsButton} onClick={detailsToggle}>
                Details
                <ArrowRightIcon
                  className={`${classes.arrowElement} ${
                    detailsOpen ? classes.arrowOpen : ""
                  }`}
                />
              </button>
            </div>
            <div
              className={`${classes.extraDetailsContainer} ${
                detailsOpen ? classes.extraDetailsOpen : ""
              }`}
            >
              {messageDetails}
            </div>
          </Fragment>
        )}
      </div>
    </Fragment>
  );
};

const mapState = (state: AppState) => ({
  snackBar: state.system.snackBar,
});

const mapDispatchToProps = {
  displayErrorMessage: setErrorSnackMessage,
};

const connector = connect(mapState, mapDispatchToProps);

export default connector(withStyles(styles)(MainError));
