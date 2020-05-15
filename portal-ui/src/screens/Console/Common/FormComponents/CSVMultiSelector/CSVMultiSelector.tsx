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
import InputBoxWrapper from "../InputBoxWrapper/InputBoxWrapper";
import { InputLabel, Tooltip } from "@material-ui/core";
import { fieldBasic, tooltipHelper } from "../common/styleLibrary";
import HelpIcon from "@material-ui/icons/Help";

interface ICSVMultiSelector {
  elements: string;
  name: string;
  label: string;
  tooltip?: string;
  classes: any;
  onChange: (elements: string) => void;
}

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
  });

const CSVMultiSelector = ({
  elements,
  name,
  label,
  tooltip = "",
  onChange,
  classes,
}: ICSVMultiSelector) => {
  const [currentElements, setCurrentElements] = useState<string[]>([""]);
  const bottomList = createRef<HTMLDivElement>();

  // Use effect to get the initial values from props
  useEffect(() => {
    if (
      currentElements.length === 1 &&
      currentElements[0] === "" &&
      elements &&
      elements !== ""
    ) {
      const elementsSplit = elements.split(",");
      elementsSplit.push("");

      setCurrentElements(elementsSplit);
    }
  }, [elements, currentElements]);

  // Use effect to send new values to onChange
  useEffect(() => {
    const elementsString = currentElements
      .filter((element) => element.trim() !== "")
      .join(",");
    onChange(elementsString);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentElements]);

  // If the last input is not empty, we add a new one
  const addEmptyLine = (elementsUp: string[]) => {
    if (elementsUp[elementsUp.length - 1].trim() !== "") {
      elementsUp.push("");
      const refScroll = bottomList.current;

      if (refScroll) {
        refScroll.scrollIntoView(false);
      }
    }

    return elementsUp;
  };

  // Onchange function for input box, we get the dataset-index & only update that value in the array
  const onChangeElement = (e: ChangeEvent<HTMLInputElement>) => {
    e.persist();

    let updatedElement = [...currentElements];
    const index = get(e.target, "dataset.index", 0);
    updatedElement[index] = e.target.value;

    updatedElement = addEmptyLine(updatedElement);
    setCurrentElements(updatedElement);
  };

  const inputs = currentElements.map((element, index) => {
    return (
      <InputBoxWrapper
        id={`${name}-${index.toString()}`}
        label={""}
        name={`${name}-${index.toString()}`}
        value={currentElements[index]}
        onChange={onChangeElement}
        index={index}
        key={`csv-${name}-${index.toString()}`}
      />
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
        <Grid item xs={12} className={classes.inputContainer}>
          {inputs}
          <div ref={bottomList} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default withStyles(styles)(CSVMultiSelector);
