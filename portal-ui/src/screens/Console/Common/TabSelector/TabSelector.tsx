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
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import makeStyles from "@mui/styles/makeStyles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { ITabOption } from "./types";

interface ITabSelector {
  selectedTab: number;
  onChange: (newValue: number) => void;
  tabOptions: ITabOption[];
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    cardsContainer: {
      maxHeight: 440,
      overflowY: "auto",
      overflowX: "hidden",
    },
    generalStatusCards: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
    },
    generalStatusTitle: {
      color: "#767676",
      fontSize: 16,
      fontWeight: "bold",
      margin: "15px 10px 0 10px",
    },
  });

const tabSubStyles = makeStyles({
  root: {
    backgroundColor: "transparent",
    paddingTop: 0,
    paddingBottom: 0,
    fontSize: 22,
    textTransform: "uppercase",
    color: "#D0D0D0",
  },
  selected: { "& .MuiTab-wrapper": { color: "#07193E", fontWeight: "bold" } },
  indicator: {
    background:
      "transparent linear-gradient(90deg, #072B4E 0%, #081C42 100%) 0% 0% no-repeat padding-box;",
    height: 4,
  },
  scroller: {
    maxWidth: 1185,
    position: "relative",
    "&::after": {
      content: '" "',
      backgroundColor: "#EEF1F4",
      height: 4,
      width: "100%",
      display: "block",
    },
  },
});

const TabSelector = ({
  selectedTab,
  onChange,
  tabOptions,
  classes,
}: ITabSelector) => {
  const subStyles = tabSubStyles();

  return (
    <Fragment>
      <Tabs
        indicatorColor="primary"
        textColor="primary"
        aria-label="cluster-tabs"
        variant="scrollable"
        scrollButtons="auto"
        value={selectedTab}
        onChange={(e: React.ChangeEvent<{}>, newValue: number) => {
          onChange(newValue);
        }}
        classes={{
          indicator: subStyles.indicator,
          scroller: subStyles.scroller,
        }}
      >
        {tabOptions.map((option, index) => {
          let tabOptions: ITabOption = {
            label: option.label,
          };

          if (option.value) {
            tabOptions = { ...tabOptions, value: option.value };
          }

          if (option.disabled) {
            tabOptions = { ...tabOptions, disabled: option.disabled };
          }

          return (
            <Tab
              {...tabOptions}
              classes={{
                root: subStyles.root,
                selected: subStyles.selected,
              }}
              id={`simple-tab-${index}`}
              aria-controls={`simple-tabpanel-${index}`}
              key={`tab-${index}-${option.label}`}
            />
          );
        })}
      </Tabs>
    </Fragment>
  );
};

export default withStyles(styles)(TabSelector);
