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

import { HealthInfoMessage } from "./types";

export const HEALTH_INFO_MESSAGE_RECEIVED = "HEALTH_INFO_MESSAGE_RECEIVED";
export const HEALTH_INFO_RESET_MESSAGE = "HEALTH_INFO_RESET_MESSAGE";

interface HealthInfoMessageReceivedAction {
  type: typeof HEALTH_INFO_MESSAGE_RECEIVED;
  message: HealthInfoMessage;
}

interface HealthInfoResetMessagesAction {
  type: typeof HEALTH_INFO_RESET_MESSAGE;
}

export type HealthInfoActionTypes =
  | HealthInfoMessageReceivedAction
  | HealthInfoResetMessagesAction;

export function healthInfoMessageReceived(message: HealthInfoMessage) {
  return {
    type: HEALTH_INFO_MESSAGE_RECEIVED,
    message: message,
  };
}

export function healthInfoResetMessage() {
  return {
    type: HEALTH_INFO_RESET_MESSAGE,
  };
}
