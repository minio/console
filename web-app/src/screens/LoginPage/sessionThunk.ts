// This file is part of MinIO Console Server
// Copyright (c) 2023 MinIO, Inc.
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
import { setErrorSnackMessage } from "../../systemSlice";
import { api } from "api";
import { errorToHandler } from "api/errors";
import {
  saveSessionResponse,
  setSessionLoadingState,
} from "../Console/consoleSlice";
import { SessionCallStates } from "../Console/consoleSlice.types";

import {
  globalSetDistributedSetup,
  setAnonymousMode,
  setOverrideStyles,
  userLogged,
} from "../../../src/systemSlice";
import { getOverrideColorVariants } from "../../utils/stylesUtils";
import { AppState } from "../../store";

export const fetchSession = createAsyncThunk(
  "session/fetchSession",
  async (_, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as AppState;
    const pathnameParts = state.system.locationPath.split("/");
    const screen = pathnameParts.length > 2 ? pathnameParts[1] : "";

    return api.session
      .sessionCheck()
      .then((res) => {
        dispatch(userLogged(true));
        dispatch(saveSessionResponse(res.data));
        dispatch(globalSetDistributedSetup(res.data.distributedMode || false));

        if (res.data.customStyles && res.data.customStyles !== "") {
          const overrideColorVariants = getOverrideColorVariants(
            res.data.customStyles,
          );

          if (overrideColorVariants !== false) {
            dispatch(setOverrideStyles(overrideColorVariants));
          }
        }
      })
      .catch(async (res) => {
        if (screen === "browser") {
          const bucket = pathnameParts.length >= 3 ? pathnameParts[2] : "";
          // no bucket, no business
          if (bucket === "") {
            return;
          }
          // before marking the session as done, let's check if the bucket is publicly accessible (anonymous)
          api.buckets
            .listObjects(
              bucket,
              { limit: 1 },
              { headers: { "X-Anonymous": "1" } },
            )
            .then(() => {
              dispatch(setAnonymousMode());
            })
            .catch((res) => {
              dispatch(setErrorSnackMessage(errorToHandler(res.error)));
            })
            .finally(() => {
              // TODO: we probably need a thunk for this api since setting the state here is hacky,
              // we can use a state to let the ProtectedRoutes know when to render the elements
              dispatch(setSessionLoadingState(SessionCallStates.Done));
            });
        } else {
          dispatch(setSessionLoadingState(SessionCallStates.Done));
          dispatch(setErrorSnackMessage(errorToHandler(res.error)));
        }
        return rejectWithValue(res.error);
      });
  },
);
