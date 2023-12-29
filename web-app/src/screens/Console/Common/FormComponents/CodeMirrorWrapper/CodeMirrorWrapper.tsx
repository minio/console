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
import { Button, CodeEditor, CopyIcon } from "mds";
import CopyToClipboard from "react-copy-to-clipboard";
import TooltipWrapper from "../../TooltipWrapper/TooltipWrapper";

interface ICodeWrapper {
  value: string;
  label?: string;
  mode?: string;
  tooltip?: string;
  onChange: (value: string) => any;
  editorHeight?: string | number;
  helptip?: any;
}

const CodeMirrorWrapper = ({
  value,
  label = "",
  tooltip = "",
  mode = "json",
  onChange,
  editorHeight = 250,
  helptip,
}: ICodeWrapper) => {
  return (
    <CodeEditor
      value={value}
      onChange={(value) => onChange(value)}
      mode={mode}
      tooltip={tooltip}
      editorHeight={editorHeight}
      label={label}
      helpTools={
        <Fragment>
          <TooltipWrapper tooltip={"Copy to Clipboard"}>
            <CopyToClipboard text={value}>
              <Button
                type={"button"}
                id={"copy-code-mirror"}
                icon={<CopyIcon />}
                color={"primary"}
                variant={"regular"}
              />
            </CopyToClipboard>
          </TooltipWrapper>
        </Fragment>
      }
      helpTip={helptip}
      helpTipPlacement="right"
    />
  );
};

export default CodeMirrorWrapper;
