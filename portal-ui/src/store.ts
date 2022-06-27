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
import { useDispatch } from "react-redux";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

import systemReducer from "./systemSlice";
import traceReducer from "./screens/Console/Trace/traceSlice";
import logReducer from "./screens/Console/Logs/logsSlice";
import healthInfoReducer from "./screens/Console/HealthInfo/healthInfoSlice";
import watchReducer from "./screens/Console/Watch/watchSlice";
import consoleReducer from "./screens/Console/consoleSlice";
import bucketsReducer from "./screens/Console/Buckets/ListBuckets/AddBucket/addBucketsSlice";
import bucketDetailsReducer from "./screens/Console/Buckets/BucketDetails/bucketDetailsSlice";
import objectBrowserReducer from "./screens/Console/ObjectBrowser/objectBrowserSlice";
import tenantsReducer from "./screens/Console/Tenants/tenantsSlice";
import dashboardReducer from "./screens/Console/Dashboard/dashboardSlice";
import createTenantReducer from "./screens/Console/Tenants/AddTenant/createTenantSlice";
import createUserReducer from "./screens/Console/Users/AddUsersSlice";
import addPoolReducer from "./screens/Console/Tenants/TenantDetails/Pools/AddPool/addPoolSlice";
import editPoolReducer from "./screens/Console/Tenants/TenantDetails/Pools/EditPool/editPoolSlice";
import editTenantMonitoringReducer from "./screens/Console/Tenants/TenantDetails/tenantMonitoringSlice";
import editTenantAuditLoggingReducer from "./screens/Console/Tenants/TenantDetails/tenantAuditLogSlice";


const rootReducer = combineReducers({
  system: systemReducer,
  trace: traceReducer,
  logs: logReducer,
  watch: watchReducer,
  console: consoleReducer,
  addBucket: bucketsReducer,
  bucketDetails: bucketDetailsReducer,
  objectBrowser: objectBrowserReducer,
  healthInfo: healthInfoReducer,
  dashboard: dashboardReducer,
  // Operator Reducers
  tenants: tenantsReducer,
  createTenant: createTenantReducer,
  createUser: createUserReducer,
  addPool: addPoolReducer,
  editPool: editPoolReducer,
  editTenantMonitoring: editTenantMonitoringReducer,
  editTenantLogging: editTenantAuditLoggingReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

if (process.env.NODE_ENV !== "production" && module.hot) {
  module.hot.accept(() => {
    store.replaceReducer(rootReducer);
  });
}

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
