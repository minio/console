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
import theme from "./theme/main";
import "react-virtualized/styles.css";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import { generateOverrideTheme } from "./utils/stylesUtils";
import "./index.css";
import { useSelector } from "react-redux";
import { AppState } from "./store";
import { GlobalStyles, ThemeHandler } from "mds";

declare module "@mui/styles/defaultTheme" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

interface IStyleHandler {
  children: React.ReactNode;
}

const StyleHandler = ({ children }: IStyleHandler) => {
  const colorVariants = useSelector(
    (state: AppState) => state.system.overrideStyles,
  );

  let thm = undefined;

  if (colorVariants) {
    thm = generateOverrideTheme(colorVariants);
  }

  // ThemeHandler is needed for MDS components theming. Eventually we will remove Theme Provider & use only mds themes.
  return (
    <Fragment>
      <GlobalStyles />
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <ThemeHandler customTheme={thm}>{children}</ThemeHandler>
        </ThemeProvider>
      </StyledEngineProvider>
    </Fragment>
  );
};

export default StyleHandler;
