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
import {
  StyledEngineProvider,
  Theme,
  ThemeProvider,
} from "@mui/material/styles";
import withStyles from "@mui/styles/withStyles";
import theme from "./theme/main";
import "react-virtualized/styles.css";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import { generateOverrideTheme } from "./utils/stylesUtils";
import "./index.css";
import { useSelector } from "react-redux";
import { AppState } from "./store";
import { ThemeHandler } from "mds";

declare module "@mui/styles/defaultTheme" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

interface IStyleHandler {
  children: React.ReactNode;
}

const StyleHandler = ({ children }: IStyleHandler) => {
  const colorVariants = useSelector(
    (state: AppState) => state.system.overrideStyles
  );

  let thm = theme;
  let globalBody: any = {};
  let rowColor: any = { color: "#393939" };
  let detailsListPanel: any = { backgroundColor: "#fff" };

  if (colorVariants) {
    thm = generateOverrideTheme(colorVariants);

    globalBody = { backgroundColor: colorVariants.backgroundColor };
    rowColor = { color: colorVariants.fontColor };
    detailsListPanel = {
      backgroundColor: colorVariants.backgroundColor,
      color: colorVariants.fontColor,
    };
  }

  const GlobalCss = withStyles({
    // @global is handled by jss-plugin-global.
    "@global": {
      body: {
        height: "100vh",
        width: "100vw",
        fontFamily: "Lato, sans-serif",
        ...globalBody,
      },
      "#root": {
        height: "100%",
        width: "100%",
        display: "flex",
        flexFlow: "column",
        alignItems: "stretch",
      },
      ".min-icon": {
        width: 26,
      },
      ".MuiButton-endIcon": {
        "& .min-icon": {
          width: 16,
        },
      },
      ".MuiButton-contained": {
        fontSize: "14px",
        textTransform: "capitalize",
        padding: "15px 25px 15px 25px",
        borderRadius: 3,
      },
      ".MuiButton-sizeSmall": {
        padding: "4px 10px",
        fontSize: "0.8125rem",
      },
      ".MuiTableCell-head": {
        borderRadius: "3px 3px 0px 0px",
        fontSize: 13,
      },
      ".MuiPaper-root": {
        borderRadius: 3,
      },
      ".MuiDrawer-paperAnchorDockedLeft": {
        borderRight: 0,
      },
      ".MuiDrawer-root": {
        "& .MuiPaper-root": {
          borderRadius: 0,
        },
      },
      ".rowLine": {
        ...rowColor,
      },
      ".detailsListPanel": {
        ...detailsListPanel,
      },
      hr: {
        borderTop: 0,
        borderLeft: 0,
        borderRight: 0,
        borderColor: "#999999",
        backgroundColor: "transparent" as const,
      },
      ul: {
        paddingLeft: 20,
        listStyle: "none" /* Remove default bullets */,
        "& li::before:not(.Mui*)": {
          content: '"￭"',
          color: "#2781B0",
          fontSize: 20,
          display:
            "inline-block" /* Needed to add space between the bullet and the text */,
          width: "1em" /* Also needed for space (tweak if needed) */,
          marginLeft: "-1em" /* Also needed for space (tweak if needed) */,
        },
        "& ul": {
          listStyle: "none" /* Remove default bullets */,
          "& li::before:not(.Mui*)": {
            content: '"￮"',
            color: "#2781B0",
            fontSize: 20,
            display:
              "inline-block" /* Needed to add space between the bullet and the text */,
            width: "1em" /* Also needed for space (tweak if needed) */,
            marginLeft: "-1em" /* Also needed for space (tweak if needed) */,
          },
        },
      },
    },
  })(() => null);

  // ThemeHandler is needed for MDS components theming. Eventually we will remove Theme Provider & use only mds themes.
  return (
    <Fragment>
      <GlobalCss />
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={thm}>
          <ThemeHandler>{children}</ThemeHandler>
        </ThemeProvider>
      </StyledEngineProvider>
    </Fragment>
  );
};

export default StyleHandler;
