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

export interface IEditPrometheusSecurityContext {
    securityContextEnabled: boolean;
    runAsUser: string;
    runAsGroup: string;
    fsGroup: string;
    runAsNonRoot: boolean;
}

const initialState: IEditPrometheusSecurityContext = {
    securityContextEnabled: false,    
        runAsUser: "1000",
        runAsGroup: "1000",
        fsGroup: "1000",
        runAsNonRoot: true,
};

export const editPrometheusSecurityContextSlice = createSlice({
    name: "editPrometheusSecurityContext",
    initialState,
    reducers: {
        setSecurityContextEnabled: (state, action: PayloadAction<boolean>) => {
            state.securityContextEnabled = action.payload;
        },
        setRunAsUser: (state, action: PayloadAction<string>) => {
            state.runAsUser = action.payload;
        },
        setRunAsGroup:(state, action: PayloadAction<string>) => {
            state.runAsGroup = action.payload;
        },
        setFSGroup: (state, action: PayloadAction<string>) => {
            state.fsGroup = action.payload;
        },
        setRunAsNonRoot: (state, action: PayloadAction<boolean>) => {
            state.runAsNonRoot = action.payload;
        },
    },
});

export const {
    setSecurityContextEnabled,
    setRunAsUser, 
    setRunAsGroup,
    setFSGroup,
    setRunAsNonRoot,
} = editPrometheusSecurityContextSlice.actions;

export default editPrometheusSecurityContextSlice.reducer;