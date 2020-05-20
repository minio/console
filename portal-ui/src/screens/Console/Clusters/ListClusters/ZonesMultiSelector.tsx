// This file is part of MinIO Console Server
// Copyright (c) 2019 MinIO, Inc.
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
import HelpIcon from "@material-ui/icons/Help";
import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import {
  fieldBasic,
  tooltipHelper,
} from "../../Common/FormComponents/common/styleLibrary";
import { IZone } from "./types";

interface IZonesMultiSelector {
  elements: IZone[];
  name: string;
  label: string;
  tooltip?: string;
  classes: any;
  onChange: (elements: IZone[]) => void;
}

const gridBasic = {
  display: "grid",
  gridTemplateColumns: "calc(50% - 4px) calc(50% - 4px)",
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
  });

const ZonesMultiSelector = ({
  elements,
  name,
  label,
  tooltip = "",
  onChange,
  classes,
}: IZonesMultiSelector) => {
  const defaultZone: IZone = { name: "", servers: 0 };

  const [currentElements, setCurrentElements] = useState<IZone[]>([
    { ...defaultZone },
  ]);
  const bottomList = createRef<HTMLDivElement>();

  // Use effect to send new values to onChange
  useEffect(() => {
    onChange(currentElements);
  }, [currentElements]);

  // If the last input is not empty, we add a new one
  const addEmptyRow = (elementsUp: IZone[]) => {
    const lastElement = elementsUp[elementsUp.length - 1];
    if (lastElement.servers !== 0 && lastElement.name !== "") {
      elementsUp.push({ ...defaultZone });
      const refScroll = bottomList.current;

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

    const rowPosition: IZone = updatedElement[index];

    rowPosition.servers =
      field === "servers" ? parseInt(e.target.value) : rowPosition.servers;
    rowPosition.name = field === "name" ? e.target.value : rowPosition.name;

    updatedElement[index] = rowPosition;

    updatedElement = addEmptyRow(updatedElement);
    setCurrentElements(updatedElement);
  };

  const inputs = currentElements.map((element, index) => {
    return (
      <React.Fragment key={`zone-${name}-${index.toString()}`}>
        <div>
          <InputBoxWrapper
            id={`${name}-${index.toString()}-name`}
            label={""}
            name={`${name}-${index.toString()}-name`}
            value={currentElements[index].name}
            onChange={(e) => onChangeElement(e, "name")}
            index={index}
            key={`Zones-${name}-${index.toString()}-name`}
          />
        </div>
        <div>
          <InputBoxWrapper
            type="number"
            id={`${name}-${index.toString()}-servers`}
            label={""}
            name={`${name}-${index.toString()}-servers`}
            value={currentElements[index].servers.toString(10)}
            onChange={(e) => onChangeElement(e, "servers")}
            index={index}
            key={`Zones-${name}-${index.toString()}-servers`}
          />
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
                <HelpIcon className={classes.tooltip} />
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

export default withStyles(styles)(ZonesMultiSelector);
