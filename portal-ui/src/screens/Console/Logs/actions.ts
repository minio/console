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

import { LogMessage } from "./types";

export const LOG_MESSAGE_RECEIVED = "LOG_MESSAGE_RECEIVED";
export const LOG_RESET_MESSAGES = "LOG_RESET_MESSAGES";

interface LogMessageReceivedAction {
  type: typeof LOG_MESSAGE_RECEIVED;
  message: LogMessage;
}

interface LogResetMessagesAction {
  type: typeof LOG_RESET_MESSAGES;
}

export type LogActionTypes = LogMessageReceivedAction | LogResetMessagesAction;

export function logMessageReceived(message: LogMessage) {
  return {
    type: LOG_MESSAGE_RECEIVED,
    message: message,
  };
}

export function logResetMessages() {
  return {
    type: LOG_RESET_MESSAGES,
  };
}
