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

import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    setSelectedGroups,
    setUserName,
    setSecretKey,
    setSelectedPolicies,
    setShowPassword,
    setAddLoading,
} from "../AddUsersSlice";
import {AppState} from "../../../../store";
import api from "../../../../common/api";
import {ErrorResponseHandler} from "../../../../common/types";
import {setErrorSnackMessage} from "../../../../systemSlice";
import history from "../../../../history";
import {IAM_PAGES} from "../../../../common/SecureComponent/permissions";

export const resetFormAsync = createAsyncThunk(
    "resetForm/resetFormAsync",
    async (_, { dispatch }) => {
        dispatch(setSelectedGroups([]));
        dispatch(setUserName(""));
        dispatch(setSecretKey(""));
        dispatch(setSelectedPolicies([]));
        dispatch(setShowPassword(false));
    }
);

export const createUserAsync = createAsyncThunk(
    "createTenant/createNamespaceAsync",
    async (_, { getState, rejectWithValue, dispatch }) => {
        const state = getState() as AppState;
        const accessKey = state.createUser.userName
        const secretKey = state.createUser.secretKey
        const selectedGroups = state.createUser.selectedGroups
        const selectedPolicies = state.createUser.selectedPolicies
        return api
            .invoke("POST", "/api/v1/users", {
                accessKey,
                secretKey,
                groups: selectedGroups,
                policies: selectedPolicies,
            })
            .then((res) => {
                dispatch(setAddLoading(false));
                history.push(`${IAM_PAGES.USERS}`);
            })
            .catch((err: ErrorResponseHandler) => {
                dispatch(setAddLoading(false));
                dispatch(setErrorSnackMessage(err));
            });
    }
);
