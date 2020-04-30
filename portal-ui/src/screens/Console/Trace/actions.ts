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

import { TraceMessage } from "./types";

export const TRACE_MESSAGE_RECEIVED = "TRACE_MESSAGE_RECEIVED";
export const TRACE_RESET_MESSAGES = "TRACE_RESET_MESSAGES";

interface TraceMessageReceivedAction {
  type: typeof TRACE_MESSAGE_RECEIVED;
  message: TraceMessage;
}

interface TraceResetMessagesAction {
  type: typeof TRACE_RESET_MESSAGES;
}

export type TraceActionTypes =
  | TraceMessageReceivedAction
  | TraceResetMessagesAction;

export function traceMessageReceived(message: TraceMessage) {
  return {
    type: TRACE_MESSAGE_RECEIVED,
    message: message
  };
}

export function traceResetMessages() {
  return {
    type: TRACE_RESET_MESSAGES
  };
}
