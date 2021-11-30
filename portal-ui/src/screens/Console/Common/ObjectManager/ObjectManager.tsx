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
import { connect } from "react-redux";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Tooltip, IconButton } from "@mui/material";
import { AppState } from "../../../../store";
import { IFileItem } from "../../ObjectBrowser/reducers";
import { deleteFromList, cleanList } from "../../ObjectBrowser/actions";
import { TrashIcon } from "../../../../icons";
import ObjectHandled from "./ObjectHandled";

interface IObjectManager {
  objects: IFileItem[];
  classes: any;
  managerOpen: boolean;
  deleteFromList: typeof deleteFromList;
  cleanList: typeof cleanList;
}

const styles = (theme: Theme) =>
  createStyles({
    downloadContainer: {
      border: "#EAEDEE 1px solid",
      boxShadow: "rgba(0, 0, 0, 0.08) 0 3px 10px",
      backgroundColor: "#fff",
      position: "absolute",
      right: 0,
      top: 80,
      width: 300,
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
    title: {
      fontSize: 14,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 5,
      paddingBottom: 12,
      borderBottom: "#E2E2E2 1px solid",
      margin: "15px 15px 5px 15px",
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
      right: 14,
      top: 12,
    },
    cleanButton: {
      "& svg": {
        width: 20,
      },
    },
  });

const ObjectManager = ({
  objects,
  classes,
  managerOpen,
  deleteFromList,
  cleanList,
}: IObjectManager) => {
  return (
    <Fragment>
      <div
        className={`${classes.downloadContainer} ${managerOpen ? "open" : ""}`}
      >
        <div className={classes.cleanIcon}>
          <Tooltip title={"Clean Completed Objects"} placement="bottom-start">
            <IconButton
              aria-label={"Clear Completed List"}
              size={"small"}
              onClick={cleanList}
              className={classes.cleanButton}
            >
              <TrashIcon />
            </IconButton>
          </Tooltip>
        </div>
        <div className={classes.title}>Object Manager</div>
        <div className={classes.actionsContainer}>
          {objects.map((object, key) => (
            <ObjectHandled
              objectToDisplay={object}
              key={`object-handled-${object.instanceID}`}
              deleteFromList={deleteFromList}
            />
          ))}
        </div>
      </div>
    </Fragment>
  );
};

const mapState = (state: AppState) => ({
  objects: state.objectBrowser.objectManager.objectsToManage,
  managerOpen: state.objectBrowser.objectManager.managerOpen,
});

const connector = connect(mapState, { deleteFromList, cleanList });

export default withStyles(styles)(connector(ObjectManager));
