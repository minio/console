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

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

import systemReducer from "./systemSlice";
import loginReducer from "./screens/LoginPage/loginSlice";
import traceReducer from "./screens/Console/Trace/traceSlice";
import logReducer from "./screens/Console/Logs/logsSlice";
import healthInfoReducer from "./screens/Console/HealthInfo/healthInfoSlice";
import watchReducer from "./screens/Console/Watch/watchSlice";
import consoleReducer from "./screens/Console/consoleSlice";
import addBucketsReducer from "./screens/Console/Buckets/ListBuckets/AddBucket/addBucketsSlice";
import bucketDetailsReducer from "./screens/Console/Buckets/BucketDetails/bucketDetailsSlice";
import objectBrowserReducer from "./screens/Console/ObjectBrowser/objectBrowserSlice";
import dashboardReducer from "./screens/Console/Dashboard/dashboardSlice";
import createUserReducer from "./screens/Console/Users/AddUsersSlice";
import licenseReducer from "./screens/Console/License/licenseSlice";
import registerReducer from "./screens/Console/Support/registerSlice";
import destinationSlice from "./screens/Console/EventDestinations/destinationsSlice";
import { objectBrowserWSMiddleware } from "./websockets/objectBrowserWSMiddleware";

let objectsWS: WebSocket;

const rootReducer = combineReducers({
  system: systemReducer,
  login: loginReducer,
  trace: traceReducer,
  logs: logReducer,
  watch: watchReducer,
  console: consoleReducer,
  addBucket: addBucketsReducer,
  bucketDetails: bucketDetailsReducer,
  objectBrowser: objectBrowserReducer,
  healthInfo: healthInfoReducer,
  dashboard: dashboardReducer,
  register: registerReducer,
  createUser: createUserReducer,
  license: licenseReducer,
  destination: destinationSlice,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(objectBrowserWSMiddleware(objectsWS)),
});

if (process.env.NODE_ENV !== "production" && module.hot) {
  module.hot.accept(() => {
    store.replaceReducer(rootReducer);
  });
}

export type AppState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;
type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
