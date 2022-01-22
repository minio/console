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

import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import "codemirror/theme/dracula.css";
/** Code mirror */
import CodeMirror, { Extension } from "@uiw/react-codemirror";
import { StreamLanguage } from "@codemirror/stream-parser";
import { json } from "@codemirror/lang-json";
import { yaml } from "@codemirror/legacy-modes/mode/yaml";

/** Code mirror */
import { Box, InputLabel, Tooltip } from "@mui/material";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import HelpIcon from "../../../../../icons/HelpIcon";
import { fieldBasic } from "../common/styleLibrary";
import { CopyIcon, EditorThemeSwitchIcon } from "../../../../../icons";
import RBIconButton from "../../../Buckets/BucketDetails/SummaryItems/RBIconButton";
import CopyToClipboard from "react-copy-to-clipboard";
import { EditorView } from "@codemirror/view";

interface ICodeWrapper {
  value: string;
  label?: string;
  mode?: string;
  tooltip?: string;
  classes: any;
  onChange?: (editor: any, data: any, value: string) => any;
  onBeforeChange: (editor: any, data: any, value: string) => any;
  readOnly?: boolean;
  editorHeight?: string;
}

const styles = (theme: Theme) =>
  createStyles({
    ...fieldBasic,
    inputLabel: {
      ...fieldBasic.inputLabel,
      fontWeight: "normal",
    },
  });

const langHighlight: Record<string, any> = {
  json,
  yaml: () => StreamLanguage.define(yaml),
};

const lightTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: "#FBFAFA",
    },
    ".cm-content": {
      caretColor: "#05122B",
    },
    "&.cm-focused .cm-cursor": {
      borderLeftColor: "#05122B",
    },
    ".cm-gutters": {
      backgroundColor: "#FBFAFA",
      color: "#000000",
      border: "none",
    },
    ".cm-gutter.cm-foldGutter": {
      borderRight: "1px solid #eaeaea",
    },
    ".cm-gutterElement": {
      fontSize: "13px",
    },
    ".cm-line": {
      fontSize: "13px",
      color: "#2781B0",
      "& .ͼc": {
        color: "#C83B51",
      },
    },
    "& .ͼb": {
      color: "#2781B0",
    },
    ".cm-activeLine": {
      backgroundColor: "#dde1f1",
    },
    ".cm-matchingBracket": {
      backgroundColor: "#05122B",
      color: "#ffffff",
    },
    ".cm-selectionMatch": {
      backgroundColor: "#ebe7f1",
    },
    ".cm-selectionLayer": {
      fontWeight: 500,
    },
    " .cm-selectionBackground": {
      backgroundColor: "#a180c7",
      color: "#ffffff",
    },
  },
  {
    dark: false,
  }
);

const darkTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: "#282a36",
      color: "#ffb86c",
    },

    ".cm-gutter.cm-foldGutter": {
      borderRight: "1px solid #eaeaea",
    },
    ".cm-gutterElement": {
      fontSize: "13px",
    },
    ".cm-line": {
      fontSize: "13px",
      "& .ͼd, & .ͼc": {
        color: "#8e6cef",
      },
    },
    "& .ͼb": {
      color: "#2781B0",
    },
    ".cm-activeLine": {
      backgroundColor: "#44475a",
    },
    ".cm-matchingBracket": {
      backgroundColor: "#842de5",
      color: "#ff79c6",
    },
    ".cm-selectionLayer .cm-selectionBackground": {
      backgroundColor: "green",
    },
  },
  {
    dark: true,
  }
);

const CodeMirrorWrapper = ({
  value,
  label = "",
  tooltip = "",
  mode = "json",
  classes,
  onBeforeChange,
  readOnly = false,
  editorHeight = "250px",
}: ICodeWrapper) => {
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);

  //based on the language mode pick . default to json
  let extensionList: Extension[] = [];
  if (langHighlight[mode]) {
    extensionList = [...extensionList, langHighlight[mode]()];
  }

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

      <Grid
        item
        xs={12}
        sx={{
          border: "1px solid #eaeaea",
        }}
      >
        <Grid item xs={12}>
          <CodeMirror
            value={value}
            theme={isDarkTheme ? darkTheme : lightTheme}
            extensions={extensionList}
            editable={!readOnly}
            basicSetup={true}
            height={editorHeight}
            onChange={(v: string, vu: any) => {
              onBeforeChange(null, null, v);
            }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            borderTop: "1px solid #eaeaea",
            background: isDarkTheme ? "#282c34" : "#f7f7f7",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "2px",
              paddingRight: "5px",
              justifyContent: "flex-end",
              "& button": {
                height: "26px",
                width: "26px",
                padding: "2px",
                " .min-icon": {
                  marginLeft: "0",
                },
              },
            }}
          >
            <RBIconButton
              tooltip={"Change theme"}
              onClick={() => {
                setIsDarkTheme(!isDarkTheme);
              }}
              text={""}
              icon={<EditorThemeSwitchIcon />}
              color={"primary"}
              variant={"outlined"}
            />
            <CopyToClipboard text={value}>
              <RBIconButton
                tooltip={"Copy to Clipboard"}
                onClick={() => {}}
                text={""}
                icon={<CopyIcon />}
                color={"primary"}
                variant={"outlined"}
              />
            </CopyToClipboard>
          </Box>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default withStyles(styles)(CodeMirrorWrapper);
