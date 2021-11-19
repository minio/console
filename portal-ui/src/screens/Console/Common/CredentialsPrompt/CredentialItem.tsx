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

import React from "react";
import { InputAdornment, OutlinedInput } from "@mui/material";
import BoxIconButton from "../BoxIconButton/BoxIconButton";
import withStyles from "@mui/styles/withStyles";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import CopyToClipboard from "react-copy-to-clipboard";
import { CopyIcon } from "../../../../icons";

const styles = (theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flexFlow: "column",
      padding: "20px 0 8px 0",
    },
    inputWithCopy: {
      "& .MuiInputBase-root ": {
        width: "100%",
        background: "#FBFAFA",
        "& .MuiInputBase-input": {
          height: ".8rem",
        },
        "& .MuiInputAdornment-positionEnd": {
          marginRight: ".5rem",
          "& .MuiButtonBase-root": {
            height: "2rem",
          },
        },
      },
      "& .MuiButtonBase-root .min-icon": {
        width: ".8rem",
        height: ".8rem",
      },
    },
    inputLabel: {
      fontSize: ".8rem",
      fontWeight: 600,
    },
  });

const CredentialItem = ({
  label = "",
  value = "",
  classes = {},
}: {
  label: string;
  value: string;
  classes: any;
}) => {
  return (
    <div className={classes.container}>
      <div className={classes.inputLabel}>{label}:</div>
      <div className={classes.inputWithCopy}>
        <OutlinedInput
          value={value}
          readOnly
          endAdornment={
            <InputAdornment position="end">
              <CopyToClipboard text={value}>
                <BoxIconButton
                  aria-label="copy"
                  tooltip={"Copy"}
                  onClick={() => {}}
                  onMouseDown={() => {}}
                  edge="end"
                >
                  <CopyIcon />
                </BoxIconButton>
              </CopyToClipboard>
            </InputAdornment>
          }
        />
      </div>
    </div>
  );
};

export default withStyles(styles)(CredentialItem);
