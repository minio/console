// This file is part of MinIO Console Server
// Copyright (c) 2020 MinIO, Inc.
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
import HelpIcon from "@material-ui/icons/Help";
import Grid from "@material-ui/core/Grid";
import { Controlled as CodeMirror } from "react-codemirror2";
import { InputLabel, Tooltip } from "@material-ui/core";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { fieldBasic } from "../common/styleLibrary";
import "./ConsoleCodeMirror.css";

require("codemirror/mode/javascript/javascript");

interface ICodeWrapper {
  value: string;
  label?: string;
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
              <HelpIcon className={classes.tooltip} />
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
            mode: "javascript",
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
