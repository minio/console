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

import React, { Fragment, useState } from "react";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import Grid from "@mui/material/Grid";

import { Tooltip } from "react-tooltip";

import {
  containerForHeader,
  formFieldStyles,
  modalStyleUtils,
  spacingUtils,
} from "../Console/Common/FormComponents/common/styleLibrary";
import { HelpBox, HelpIconFilled } from "mds";
import HelpItem from "./HelpItem";
import { DocItem } from "./HelpMenu.types";

const styles = (theme: Theme) =>
  createStyles({
    ...modalStyleUtils,
    ...formFieldStyles,
    ...spacingUtils,
    ...containerForHeader,
  });

interface IHelpTipProps {
  helpTipID?: string;
  position?: string;
}
type PlacesType = "top" | "right" | "bottom" | "left";

const HelpTip = ({ helpTipID, position }: IHelpTipProps) => {
  const helpTips = require("../Console/helpTags.json");
  const tipPlace = position ? (position as PlacesType) : "right";

  const [helpTipOpen, setHelpTipOpen] = useState<boolean>(false);
  const thisItem: DocItem =
    helpTipID && helpTipID?.length > 0 && helpTips[helpTipID]
      ? helpTips[helpTipID]["docs"]["links"][0]
      : helpTips["help"]["docs"]["links"][0];

  return (
    <Fragment>
      <Tooltip
        id={helpTipID}
        place={tipPlace}
        positionStrategy="fixed"
        afterHide={() => {
          setHelpTipOpen(false);
        }}
        style={{ backgroundColor: "transparent", color: "black", zIndex: 10 }}
        clickable
      >
        <Grid container zIndex={50} sx={{ fontSize: "500" }}>
          {!helpTipOpen && (
            <HelpIconFilled
              height={"18px"}
              width={"18px"}
              onClick={() => {
                setHelpTipOpen(true);
              }}
            />
          )}
          {helpTipOpen && (
            <Grid
              style={{
                backgroundColor: "#d3d6d9",
                opacity: "50",
              }}
              display={"flex"}
              justifyContent={"flex-end"}
              maxWidth={400}
            >
              <HelpBox
                title={thisItem.title}
                iconComponent={<HelpIconFilled />}
                help={
                  <HelpItem
                    item={thisItem}
                    displayImage={false}
                    displayTitle={false}
                  />
                }
              />
            </Grid>
          )}
        </Grid>
      </Tooltip>
    </Fragment>
  );
};

export default withStyles(styles)(HelpTip);
