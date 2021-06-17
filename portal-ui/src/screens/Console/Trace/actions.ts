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

import { TraceMessage } from "./types";

export const TRACE_MESSAGE_RECEIVED = "TRACE/MESSAGE_RECEIVED";
export const TRACE_RESET_MESSAGES = "TRACE/RESET_MESSAGES";
export const TRACE_SET_STARTED = "TRACE/SET_STARTED";

interface TraceMessageReceivedAction {
  type: typeof TRACE_MESSAGE_RECEIVED;
  message: TraceMessage;
}

interface TraceResetMessagesAction {
  type: typeof TRACE_RESET_MESSAGES;
}

interface TraceSetStarted {
  type: typeof TRACE_SET_STARTED;
  status: boolean;
}

export type TraceActionTypes =
  | TraceMessageReceivedAction
  | TraceResetMessagesAction
  | TraceSetStarted;

export function traceMessageReceived(message: TraceMessage) {
  return {
    type: TRACE_MESSAGE_RECEIVED,
    message: message,
  };
}

export function traceResetMessages() {
  return {
    type: TRACE_RESET_MESSAGES,
  };
}

export function setTraceStarted(status: boolean) {
  return {
    type: TRACE_SET_STARTED,
    status,
  };
}
