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
import React, { useState, useEffect, createRef, ChangeEvent } from "react";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import get from "lodash/get";
import { InputLabel, Tooltip } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import {
  fieldBasic,
  tooltipHelper,
} from "../../Common/FormComponents/common/styleLibrary";
import DeleteIcon from "../../../../icons/DeleteIcon";
import HelpIcon from "../../../../icons/HelpIcon";
import { IPool } from "./types";

interface IPoolsMultiSelector {
  elements: IPool[];
  name: string;
  label: string;
  tooltip?: string;
  classes: any;

  onChange: (elements: IPool[]) => void;
}

const gridBasic = {
  display: "grid",
  gridTemplateColumns: "calc(50% - 20px) calc(50% - 20px) 30px",
  gridGap: 8,
};

const styles = (theme: Theme) =>
  createStyles({
    ...fieldBasic,
    ...tooltipHelper,
    inputLabel: {
      ...fieldBasic.inputLabel,
      width: 116,
    },
    inputContainer: {
      height: 150,
      overflowY: "auto",
      padding: 15,
      position: "relative",
      border: "1px solid #c4c4c4",
    },
    labelContainer: {
      display: "flex",
    },
    inputGrid: {
      ...gridBasic,
    },
    inputTitles: {
      ...gridBasic,
      marginBottom: 5,
    },
    deleteIconContainer: {
      alignSelf: "center",
      "& button": {
        padding: 0,
        marginBottom: 10,
      },
    },
  });

const PoolsMultiSelector = ({
  elements,
  name,
  label,
  tooltip = "",
  onChange,
  classes,
}: IPoolsMultiSelector) => {
  const defaultPool: IPool = {
    name: "",
    servers: 0,
    capacity: "",
    volumes: 0,
    volumes_per_server: 0,
    volume_configuration: { size: 0, storage_class: "", labels: null },
  };

  const [currentElements, setCurrentElements] = useState<IPool[]>([]);
  const [internalCounter, setInternalCounter] = useState<number>(1);
  const bottomList = createRef<HTMLDivElement>();

  // Use effect to send new values to onChange
  useEffect(() => {
    onChange(currentElements);
  }, [currentElements]);

  // Use effect to set initial values
  useEffect(() => {
    if (currentElements.length === 0 && elements.length === 0) {
      // Initial Value
      setCurrentElements([{ ...defaultPool, name: "pool-1" }]);
    } else if (currentElements.length === 0 && elements.length > 0) {
      setCurrentElements(elements);
      setInternalCounter(elements.length);
    }
  }, [currentElements, elements]);

  // If the last input is not empty, we add a new one
  const addEmptyRow = (elementsUp: IPool[]) => {
    const lastElement = elementsUp[elementsUp.length - 1];
    const internalElement = internalCounter + 1;
    if (
      lastElement.servers !== 0 &&
      lastElement.name !== "" &&
      !isNaN(lastElement.servers)
    ) {
      elementsUp.push({
        ...defaultPool,
        name: `pool-${internalElement}`,
      });
      const refScroll = bottomList.current;

      setInternalCounter(internalElement);

      if (refScroll) {
        refScroll.scrollIntoView(false);
      }
    }

    return elementsUp;
  };

  // Onchange function for input box, we get the dataset-index & only update that value in the array
  const onChangeElement = (e: ChangeEvent<HTMLInputElement>, field: string) => {
    e.persist();

    let updatedElement = [...currentElements];
    const index = get(e.target, "dataset.index", 0);

    const rowPosition: IPool = updatedElement[index];

    rowPosition.servers =
      field === "servers" ? parseInt(e.target.value) : rowPosition.servers;
    rowPosition.name = field === "name" ? e.target.value : rowPosition.name;

    updatedElement[index] = rowPosition;

    updatedElement = addEmptyRow(updatedElement);
    setCurrentElements(updatedElement);
  };

  const deleteElement = (poolToRemove: number) => {
    const poolsClone = [...currentElements];

    const newArray = poolsClone
      .slice(0, poolToRemove)
      .concat(poolsClone.slice(poolToRemove + 1, poolsClone.length));

    setCurrentElements(newArray);
  };

  const inputs = currentElements.map((element, index) => {
    return (
      <React.Fragment key={`pool-${name}-${index.toString()}`}>
        <div>
          <InputBoxWrapper
            id={`${name}-${index.toString()}-name`}
            label={""}
            name={`${name}-${index.toString()}-name`}
            value={currentElements[index].name}
            onChange={(e) => onChangeElement(e, "name")}
            index={index}
            key={`Pools-${name}-${index.toString()}-name`}
          />
        </div>
        <div>
          <InputBoxWrapper
            type="number"
            min="0"
            id={`${name}-${index.toString()}-servers`}
            label={""}
            name={`${name}-${index.toString()}-servers`}
            value={currentElements[index].servers.toString(10)}
            onChange={(e) => onChangeElement(e, "servers")}
            index={index}
            key={`Pools-${name}-${index.toString()}-servers`}
          />
        </div>
        <div className={classes.deleteIconContainer}>
          <IconButton
            color="primary"
            onClick={() => {
              deleteElement(index);
            }}
            disabled={index === currentElements.length - 1}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      </React.Fragment>
    );
  });

  return (
    <React.Fragment>
      <Grid item xs={12} className={classes.fieldContainer}>
        <InputLabel className={classes.inputLabel}>
          <span>{label}</span>
          {tooltip !== "" && (
            <div className={classes.tooltipContainer}>
              <Tooltip title={tooltip} placement="top-start">
                <div>
                  <HelpIcon className={classes.tooltip} />
                </div>
              </Tooltip>
            </div>
          )}
        </InputLabel>
        <Grid item xs={12}>
          <div className={classes.inputTitles}>
            <div>Name</div>
            <div>Servers</div>
          </div>
          <div className={classes.inputContainer}>
            <div className={classes.inputGrid}>{inputs}</div>
          </div>
          <div ref={bottomList} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default withStyles(styles)(PoolsMultiSelector);
