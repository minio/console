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
import { useSelector } from "react-redux";
import { AppState, useAppDispatch } from "../../../../store";
import { Box, RemoveAllIcon, IconButton, Tooltip } from "mds";
import ObjectHandled from "./ObjectHandled";
import {
  cleanList,
  deleteFromList,
} from "../../ObjectBrowser/objectBrowserSlice";
import VirtualizedList from "../VirtualizedList/VirtualizedList";

const ObjectManager = () => {
  const dispatch = useAppDispatch();

  const objects = useSelector(
    (state: AppState) => state.objectBrowser.objectManager.objectsToManage,
  );
  const managerOpen = useSelector(
    (state: AppState) => state.objectBrowser.objectManager.managerOpen,
  );
  const anonymousMode = useSelector(
    (state: AppState) => state.system.anonymousMode,
  );

  function renderObject(index: number) {
    return (
      <ObjectHandled
        objectToDisplay={objects[index]}
        deleteFromList={(instanceID) => dispatch(deleteFromList(instanceID))}
      />
    );
  }

  return (
    <Fragment>
      {managerOpen && (
        <Box
          sx={{
            boxShadow: "rgba(0, 0, 0, 0.08) 0 2px 10px",
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
            "&.downloadContainerAnonymous": {
              top: 70,
            },
          }}
          className={`${anonymousMode ? "downloadContainerAnonymous" : ""} ${
            managerOpen ? "open" : ""
          }`}
          useBackground
          withBorders
        >
          <Box
            sx={{
              position: "absolute",
              right: 28,
              top: 25,
            }}
          >
            <Tooltip tooltip={"Clean Completed Objects"} placement="bottom">
              <IconButton
                aria-label={"Clear Completed List"}
                onClick={() => dispatch(cleanList())}
              >
                <RemoveAllIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Box
            sx={{
              fontSize: 16,
              fontWeight: "bold",
              textAlign: "left",
              paddingBottom: 20,
              borderBottom: "#E2E2E2 1px solid",
              margin: "25px 30px 5px 30px",
            }}
          >
            Downloads / Uploads
          </Box>
          <Box
            sx={{
              overflowY: "auto",
              overflowX: "hidden",
              minHeight: 250,
              maxHeight: 335,
              height: "100%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <VirtualizedList
              rowRenderFunction={renderObject}
              totalItems={objects.length}
              defaultHeight={110}
            />
          </Box>
        </Box>
      )}
    </Fragment>
  );
};

export default ObjectManager;
