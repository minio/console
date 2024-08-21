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
import { createUserAsync, resetFormAsync } from "./thunk/AddUsersThunk";

interface ICreateUser {
  userName: string;
  secretKey: string;
  selectedGroups: string[];
  selectedPolicies: string[];
  sendEnabled: boolean;
  addLoading: boolean;
  apinoerror: boolean;
  secretKeylength: number;
}

const initialState: ICreateUser = {
  addLoading: false,
  sendEnabled: false,
  apinoerror: false,
  userName: "",
  secretKey: "",
  selectedGroups: [],
  selectedPolicies: [],
  secretKeylength: 0,
};

const createUserSlice = createSlice({
  name: "createUser",
  initialState,
  reducers: {
    setAddLoading: (state, action: PayloadAction<boolean>) => {
      state.addLoading = action.payload;
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
    },
    setSelectedGroups: (state, action: PayloadAction<string[]>) => {
      state.selectedGroups = action.payload;
    },
    setSecretKey: (state, action: PayloadAction<string>) => {
      state.secretKey = action.payload;
      state.secretKeylength = state.secretKey.length;
    },
    setSelectedPolicies: (state, action: PayloadAction<string[]>) => {
      state.selectedPolicies = action.payload;
    },
    setSendEnabled: (state) => {
      state.sendEnabled = state.userName.trim() !== "";
    },
    setApinoerror: (state, action: PayloadAction<boolean>) => {
      state.apinoerror = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(resetFormAsync.fulfilled, (state, action) => {
        state.userName = "";
        state.selectedGroups = [];
        state.secretKey = "";
        state.selectedPolicies = [];
      })
      .addCase(createUserAsync.pending, (state, action) => {
        state.addLoading = true;
      })
      .addCase(createUserAsync.rejected, (state, action) => {
        state.addLoading = false;
      })
      .addCase(createUserAsync.fulfilled, (state, action) => {
        state.apinoerror = true;
      });
  },
});

export const {
  setUserName,
  setSelectedGroups,
  setSecretKey,
  setSelectedPolicies,
  setAddLoading,
  setSendEnabled,
} = createUserSlice.actions;

export default createUserSlice.reducer;
