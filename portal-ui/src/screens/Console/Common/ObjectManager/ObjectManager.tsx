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

import React, { Fragment } from "react";
import { Theme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { IconButton, Tooltip } from "@mui/material";
import { AppState, useAppDispatch } from "../../../../store";
import { RemoveAllIcon } from "mds";
import ObjectHandled from "./ObjectHandled";
import {
  cleanList,
  deleteFromList,
} from "../../ObjectBrowser/objectBrowserSlice";
import clsx from "clsx";

const styles = (theme: Theme) =>
  createStyles({
    downloadContainer: {
      border: "#EAEDEE 1px solid",
      boxShadow: "rgba(0, 0, 0, 0.08) 0 2px 10px",
      backgroundColor: "#fff",
      position: "absolute",
      right: 20,
      top: 62,
      width: 400,
      overflowY: "hidden",
      overflowX: "hidden",
      borderRadius: 3,
      zIndex: 1000,
      padding: 0,
      height: 0,
      transitionDuration: "0.3s",
      visibility: "hidden",
      "&.open": {
        visibility: "visible",
        minHeight: 400,
      },
    },
    downloadContainerAnonymous: {
      top: 70,
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "left",
      paddingBottom: 20,
      borderBottom: "#E2E2E2 1px solid",
      margin: "25px 30px 5px 30px",
      color: "#000",
    },
    actionsContainer: {
      overflowY: "auto",
      overflowX: "hidden",
      minHeight: 250,
      maxHeight: 335,
      width: "100%",
      display: "flex",
      flexDirection: "column",
    },
    cleanIcon: {
      position: "absolute",
      right: 28,
      top: 25,
    },
    cleanButton: {
      "& svg": {
        width: 25,
      },
    },
  });

interface IObjectManager {
  classes: any;
}

const ObjectManager = ({ classes }: IObjectManager) => {
  const dispatch = useAppDispatch();

  const objects = useSelector(
    (state: AppState) => state.objectBrowser.objectManager.objectsToManage
  );
  const managerOpen = useSelector(
    (state: AppState) => state.objectBrowser.objectManager.managerOpen
  );
  const anonymousMode = useSelector(
    (state: AppState) => state.system.anonymousMode
  );
  return (
    <Fragment>
      {managerOpen && (
        <div
          className={clsx(classes.downloadContainer, {
            [classes.downloadContainerAnonymous]: anonymousMode,
            open: managerOpen,
          })}
        >
          <div className={classes.cleanIcon}>
            <Tooltip title={"Clean Completed Objects"} placement="bottom-start">
              <IconButton
                aria-label={"Clear Completed List"}
                size={"small"}
                onClick={() => dispatch(cleanList())}
                className={classes.cleanButton}
              >
                <RemoveAllIcon />
              </IconButton>
            </Tooltip>
          </div>
          <div className={classes.title}>Downloads / Uploads</div>
          <div className={classes.actionsContainer}>
            {objects.map((object, key) => (
              <ObjectHandled
                objectToDisplay={object}
                key={`object-handled-${object.instanceID}`}
                deleteFromList={(instanceID) =>
                  dispatch(deleteFromList(instanceID))
                }
              />
            ))}
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default withStyles(styles)(ObjectManager);
