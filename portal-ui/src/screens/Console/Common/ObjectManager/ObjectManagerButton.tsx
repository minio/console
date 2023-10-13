// This file is part of MinIO Console Server
// Copyright (c) 2023 MinIO, Inc.
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

import React, { Fragment, useEffect, useState } from "react";
import styled from "styled-components";
import get from "lodash/get";
import { Button, CircleIcon, ObjectManagerIcon } from "mds";
import { useSelector } from "react-redux";
import { toggleList } from "../../ObjectBrowser/objectBrowserSlice";
import { AppState, useAppDispatch } from "../../../../store";

const IndicatorContainer = styled.div(({ theme }) => ({
  position: "absolute",
  display: "block",
  width: 15,
  height: 15,
  top: 0,
  right: 4,
  marginTop: 4,
  transitionDuration: "0.2s",
  color: get(theme, "signalColors.good", "#32C787"),
  "& svg": {
    width: 10,
    height: 10,
    top: "50%",
    left: "50%",
    transitionDuration: "0.2s",
  },
  "&.newItem": {
    color: get(theme, "signalColors.info", "#2781B0"),
    "& svg": {
      width: 15,
      height: 15,
    },
  },
}));

const ObjectManagerButton = () => {
  const dispatch = useAppDispatch();
  const managerObjects = useSelector(
    (state: AppState) => state.objectBrowser.objectManager.objectsToManage,
  );
  const newItems = useSelector(
    (state: AppState) => state.objectBrowser.objectManager.newItems,
  );
  const managerOpen = useSelector(
    (state: AppState) => state.objectBrowser.objectManager.managerOpen,
  );

  const [newObject, setNewObject] = useState<boolean>(false);

  useEffect(() => {
    if (managerObjects.length > 0 && !managerOpen) {
      setNewObject(true);
      setTimeout(() => {
        setNewObject(false);
      }, 300);
    }
  }, [managerObjects.length, managerOpen]);

  return (
    <Fragment>
      {managerObjects && managerObjects.length > 0 && (
        <Button
          aria-label="Refresh List"
          onClick={() => {
            dispatch(toggleList());
          }}
          icon={
            <Fragment>
              <IndicatorContainer
                className={newObject ? "newItem" : ""}
                style={{
                  opacity: managerObjects.length > 0 && newItems ? 1 : 0,
                }}
              >
                <CircleIcon />
              </IndicatorContainer>
              <ObjectManagerIcon
                style={{ width: 20, height: 20, marginTop: -2 }}
              />
            </Fragment>
          }
          id="object-manager-toggle"
          style={{ position: "relative", padding: "0 10px" }}
        />
      )}
    </Fragment>
  );
};

export default ObjectManagerButton;
