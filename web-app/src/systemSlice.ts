// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { snackBarMessage, SRInfoStateType } from "./types";
import { ErrorResponseHandler, IEmbeddedCustomStyles } from "./common/types";
import { AppState } from "./store";
import { SubnetInfo } from "./screens/Console/License/types";
import { isDarkModeOn } from "./utils/stylesUtils";

// determine whether we have the sidebar state stored on localstorage
const initSideBarOpen = localStorage.getItem("sidebarOpen")
  ? JSON.parse(localStorage.getItem("sidebarOpen")!)["open"]
  : true;

interface SystemState {
  value: number;
  loggedIn: boolean;
  showMarketplace: boolean;
  sidebarOpen: boolean;
  userName: string;
  serverNeedsRestart: boolean;
  serverIsLoading: boolean;
  loadingConfigurations: boolean;
  loadingProgress: number;
  snackBar: snackBarMessage;
  modalSnackBar: snackBarMessage;
  serverDiagnosticStatus: string;
  distributedSetup: boolean;
  siteReplicationInfo: SRInfoStateType;
  licenseInfo: null | SubnetInfo;
  overrideStyles: null | IEmbeddedCustomStyles;
  anonymousMode: boolean;
  helpName: string;
  helpTabName: string;
  locationPath: string;
  darkMode: boolean;
}

const initialState: SystemState = {
  value: 0,
  loggedIn: false,
  showMarketplace: false,
  userName: "",
  sidebarOpen: initSideBarOpen,
  siteReplicationInfo: { siteName: "", curSite: false, enabled: false },
  serverNeedsRestart: false,
  serverIsLoading: false,
  loadingConfigurations: true,
  loadingProgress: 100,
  snackBar: {
    message: "",
    detailedErrorMsg: "",
    type: "message",
  },
  modalSnackBar: {
    message: "",
    detailedErrorMsg: "",
    type: "message",
  },
  serverDiagnosticStatus: "",
  distributedSetup: false,
  licenseInfo: null,
  overrideStyles: null,
  anonymousMode: false,
  helpName: "help",
  helpTabName: "docs",
  locationPath: "",
  darkMode: isDarkModeOn(),
};

const systemSlice = createSlice({
  name: "system",
  initialState,
  reducers: {
    userLogged: (state, action: PayloadAction<boolean>) => {
      state.loggedIn = action.payload;
    },
    showMarketplace: (state, action: PayloadAction<boolean>) => {
      state.showMarketplace = action.payload;
    },
    menuOpen: (state, action: PayloadAction<boolean>) => {
      // persist preference to local storage
      localStorage.setItem(
        "sidebarOpen",
        JSON.stringify({ open: action.payload }),
      );
      state.sidebarOpen = action.payload;
    },
    setServerNeedsRestart: (state, action: PayloadAction<boolean>) => {
      state.serverNeedsRestart = action.payload;
    },
    serverIsLoading: (state, action: PayloadAction<boolean>) => {
      state.serverIsLoading = action.payload;
    },
    configurationIsLoading: (state, action: PayloadAction<boolean>) => {
      state.loadingConfigurations = action.payload;
    },
    setLoadingProgress: (state, action: PayloadAction<number>) => {
      state.loadingProgress = action.payload;
    },
    setSnackBarMessage: (state, action: PayloadAction<string>) => {
      state.snackBar = {
        message: action.payload,
        detailedErrorMsg: "",
        type: "message",
      };
    },
    setErrorSnackMessage: (
      state,
      action: PayloadAction<ErrorResponseHandler>,
    ) => {
      state.snackBar = {
        message: action.payload.errorMessage,
        detailedErrorMsg: action.payload.detailedError,
        type: "error",
      };
    },
    setModalSnackMessage: (state, action: PayloadAction<string>) => {
      state.modalSnackBar = {
        message: action.payload,
        detailedErrorMsg: "",
        type: "message",
      };
    },
    setModalErrorSnackMessage: (
      state,
      action: PayloadAction<{ errorMessage: string; detailedError: string }>,
    ) => {
      state.modalSnackBar = {
        message: action.payload.errorMessage,
        detailedErrorMsg: action.payload.detailedError,
        type: "error",
      };
    },
    setServerDiagStat: (state, action: PayloadAction<string>) => {
      state.serverDiagnosticStatus = action.payload;
    },
    globalSetDistributedSetup: (state, action: PayloadAction<boolean>) => {
      state.distributedSetup = action.payload;
    },
    setSiteReplicationInfo: (state, action: PayloadAction<SRInfoStateType>) => {
      state.siteReplicationInfo = action.payload;
    },
    setSystemLicenseInfo: (state, action: PayloadAction<SubnetInfo | null>) => {
      state.licenseInfo = action.payload;
    },
    setHelpName: (state, action: PayloadAction<string>) => {
      state.helpName = action.payload;
    },
    setHelpTabName: (state, action: PayloadAction<string>) => {
      state.helpTabName = action.payload;
    },

    setOverrideStyles: (
      state,
      action: PayloadAction<IEmbeddedCustomStyles>,
    ) => {
      state.overrideStyles = action.payload;
    },
    setAnonymousMode: (state) => {
      state.anonymousMode = true;
      state.loggedIn = true;
    },
    setLocationPath: (state, action: PayloadAction<string>) => {
      state.locationPath = action.payload;
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    },
    resetSystem: () => {
      return initialState;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  userLogged,
  menuOpen,
  setServerNeedsRestart,
  serverIsLoading,
  setSnackBarMessage,
  setErrorSnackMessage,
  setModalErrorSnackMessage,
  setModalSnackMessage,
  globalSetDistributedSetup,
  setSiteReplicationInfo,
  setOverrideStyles,
  setAnonymousMode,
  resetSystem,
  configurationIsLoading,
  setHelpName,
  setHelpTabName,
  setLocationPath,
  setDarkMode,
} = systemSlice.actions;

export const selDistSet = (state: AppState) => state.system.distributedSetup;
export const selSiteRep = (state: AppState) => state.system.siteReplicationInfo;

export default systemSlice.reducer;
