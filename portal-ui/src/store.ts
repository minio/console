// This file is part of MinIO Console Server
// Copyright (c) 2020 MinIO, Inc.
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

import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk";
import { systemReducer } from "./reducer";
import { traceReducer } from "./screens/Console/Trace/reducers";
import { logReducer } from "./screens/Console/Logs/reducers";
import { watchReducer } from "./screens/Console/Watch/reducers";
import { consoleReducer } from "./screens/Console/reducer";
import { bucketsReducer } from "./screens/Console/Buckets/reducers";
import { objectBrowserReducer } from "./screens/Console/ObjectBrowser/reducers";

const globalReducer = combineReducers({
  system: systemReducer,
  trace: traceReducer,
  logs: logReducer,
  watch: watchReducer,
  console: consoleReducer,
  buckets: bucketsReducer,
  objectBrowser: objectBrowserReducer,
});

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export type AppState = ReturnType<typeof globalReducer>;

export default function configureStore() {
  return createStore(globalReducer, composeEnhancers(applyMiddleware(thunk)));
}
