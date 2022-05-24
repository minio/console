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

import systemReducer from "./systemSlice";
import traceReducer from "./screens/Console/Trace/traceSlice";
import logReducer from "./screens/Console/Logs/logsSlice";
import healthInfoReducer from "./screens/Console/HealthInfo/healthInfoSlice";
import watchReducer from "./screens/Console/Watch/watchSlice";
import consoleReducer from "./screens/Console/consoleSlice";
import bucketsReducer from "./screens/Console/Buckets/bucketsSlice";
import bucketDetailsReducer from "./screens/Console/Buckets/BucketDetails/bucketDetailsSlice";
import objectBrowserReducer from "./screens/Console/ObjectBrowser/objectBrowserSlice";
import tenantsReducer from "./screens/Console/Tenants/tenantsSlice";
import dashboardReducer from "./screens/Console/Dashboard/dashboardSlice";
import { configureStore } from "@reduxjs/toolkit";
import createTenantReducer from "./screens/Console/Tenants/AddTenant/createTenantSlice";

export const store = configureStore({
  reducer: {
    system: systemReducer,
    trace: traceReducer,
    logs: logReducer,
    watch: watchReducer,
    console: consoleReducer,
    buckets: bucketsReducer,
    bucketDetails: bucketDetailsReducer,
    objectBrowser: objectBrowserReducer,
    healthInfo: healthInfoReducer,
    dashboard: dashboardReducer,
    // Operator Reducers
    tenants: tenantsReducer,
    createTenant: createTenantReducer,
  },
});

export type AppState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
