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
import Grid from "@mui/material/Grid";
import { Controlled as CodeMirror } from "react-codemirror2";
import { InputLabel, Tooltip } from "@mui/material";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import HelpIcon from "../../../../../icons/HelpIcon";
import { fieldBasic } from "../common/styleLibrary";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";

require("codemirror/mode/yaml/yaml");

interface ICodeWrapper {
  value: string;
  label?: string;
  mode?: string;
  tooltip?: string;
  classes: any;
  onChange?: (editor: any, data: any, value: string) => any;
  onBeforeChange: (editor: any, data: any, value: string) => any;
  readOnly?: boolean;
}

const styles = (theme: Theme) =>
  createStyles({
    ...fieldBasic,
  });

const CodeMirrorWrapper = ({
  value,
  label = "",
  tooltip = "",
  mode = "yaml",
  classes,
  onChange = () => {},
  onBeforeChange,
  readOnly = false,
}: ICodeWrapper) => {
  return (
    <React.Fragment>
      <InputLabel className={classes.inputLabel}>
        <span>{label}</span>
        {tooltip !== "" && (
          <div className={classes.tooltipContainer}>
            <Tooltip title={tooltip} placement="top-start">
              <div className={classes.tooltip}>
                <HelpIcon />
              </div>
            </Tooltip>
          </div>
        )}
      </InputLabel>
      <Grid item xs={12}>
        <br />
      </Grid>
      <Grid item xs={12}>
        <CodeMirror
          value={value}
          options={{
            mode: mode,
            lineNumbers: true,
            readOnly,
          }}
          onBeforeChange={onBeforeChange}
          onChange={onChange}
        />
      </Grid>
    </React.Fragment>
  );
};

export default withStyles(styles)(CodeMirrorWrapper);
