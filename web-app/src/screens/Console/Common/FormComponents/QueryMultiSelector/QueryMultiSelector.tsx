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
import React, {
  ChangeEvent,
  createRef,
  Fragment,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import get from "lodash/get";
import debounce from "lodash/debounce";
import {
  AddIcon,
  Box,
  Grid,
  HelpIcon,
  InputBox,
  InputLabel,
  Tooltip,
} from "mds";

interface IQueryMultiSelector {
  elements: string;
  name: string;
  label: string;
  tooltip?: string;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  withBorder?: boolean;
  onChange: (elements: string) => void;
}

const QueryMultiSelector = ({
  elements,
  name,
  label,
  tooltip = "",
  keyPlaceholder = "",
  valuePlaceholder = "",
  onChange,
  withBorder = false,
}: IQueryMultiSelector) => {
  const [currentKeys, setCurrentKeys] = useState<string[]>([""]);
  const [currentValues, setCurrentValues] = useState<string[]>([""]);
  const bottomList = createRef<HTMLDivElement>();

  // Use effect to get the initial values from props
  useEffect(() => {
    if (
      currentKeys.length === 1 &&
      currentKeys[0] === "" &&
      currentValues.length === 1 &&
      currentValues[0] === "" &&
      elements &&
      elements !== ""
    ) {
      const elementsSplit = elements.split("&");
      let keys = [];
      let values = [];

      elementsSplit.forEach((element: string) => {
        const splittedVals = element.split("=");
        if (splittedVals.length === 2) {
          keys.push(splittedVals[0]);
          values.push(splittedVals[1]);
        }
      });

      keys.push("");
      values.push("");

      setCurrentKeys(keys);
      setCurrentValues(values);
    }
  }, [currentKeys, currentValues, elements]);

  // Use effect to send new values to onChange
  useEffect(() => {
    const refScroll = bottomList.current;
    if (refScroll && currentKeys.length > 1) {
      refScroll.scrollIntoView(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentKeys]);

  // We avoid multiple re-renders / hang issue typing too fast
  const firstUpdate = useRef(true);
  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    debouncedOnChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentKeys, currentValues]);

  // If the last input is not empty, we add a new one
  const addEmptyLine = () => {
    if (
      currentKeys[currentKeys.length - 1].trim() !== "" &&
      currentValues[currentValues.length - 1].trim() !== ""
    ) {
      const keysList = [...currentKeys];
      const valuesList = [...currentValues];

      keysList.push("");
      valuesList.push("");

      setCurrentKeys(keysList);
      setCurrentValues(valuesList);
    }
  };

  // Onchange function for input box, we get the dataset-index & only update that value in the array
  const onChangeKey = (e: ChangeEvent<HTMLInputElement>) => {
    e.persist();

    let updatedElement = [...currentKeys];
    const index = get(e.target, "dataset.index", "0");
    const indexNum = parseInt(index);
    updatedElement[indexNum] = e.target.value;

    setCurrentKeys(updatedElement);
  };

  const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    e.persist();

    let updatedElement = [...currentValues];
    const index = get(e.target, "dataset.index", "0");
    const indexNum = parseInt(index);
    updatedElement[indexNum] = e.target.value;

    setCurrentValues(updatedElement);
  };

  // Debounce for On Change
  const debouncedOnChange = debounce(() => {
    let queryString = "";

    currentKeys.forEach((keyVal, index) => {
      if (currentKeys[index] && currentValues[index]) {
        let insertString = `${keyVal}=${currentValues[index]}`;
        if (index !== 0) {
          insertString = `&${insertString}`;
        }
        queryString = `${queryString}${insertString}`;
      }
    });

    onChange(queryString);
  }, 500);

  const inputs = currentValues.map((element, index) => {
    return (
      <Grid
        item
        xs={12}
        className={"lineInputBoxes inputItem"}
        key={`query-pair-${name}-${index.toString()}`}
      >
        <InputBox
          id={`${name}-key-${index.toString()}`}
          label={""}
          name={`${name}-${index.toString()}`}
          value={currentKeys[index]}
          onChange={onChangeKey}
          index={index}
          placeholder={keyPlaceholder}
        />
        <span className={"queryDiv"}>:</span>
        <InputBox
          id={`${name}-value-${index.toString()}`}
          label={""}
          name={`${name}-${index.toString()}`}
          value={currentValues[index]}
          onChange={onChangeValue}
          index={index}
          placeholder={valuePlaceholder}
          overlayIcon={index === currentValues.length - 1 ? <AddIcon /> : null}
          overlayAction={() => {
            addEmptyLine();
          }}
        />
      </Grid>
    );
  });

  return (
    <Fragment>
      <Grid
        item
        xs={12}
        sx={{
          "& .lineInputBoxes": {
            display: "flex",
          },
          "& .queryDiv": {
            alignSelf: "center",
            margin: "-15px 4px 0",
            fontWeight: 600,
          },
        }}
        className={"inputItem"}
      >
        <InputLabel>
          {label}
          {tooltip !== "" && (
            <Box
              sx={{
                marginLeft: 5,
                display: "flex",
                alignItems: "center",
                "& .min-icon": {
                  width: 13,
                },
              }}
            >
              <Tooltip tooltip={tooltip} placement="top">
                <HelpIcon style={{ width: 13, height: 13 }} />
              </Tooltip>
            </Box>
          )}
        </InputLabel>
        <Box
          withBorders={withBorder}
          sx={{
            padding: 15,
            height: 150,
            overflowY: "auto",
            position: "relative",
            marginTop: 15,
          }}
        >
          {inputs}
          <div ref={bottomList} />
        </Box>
      </Grid>
    </Fragment>
  );
};
export default QueryMultiSelector;
