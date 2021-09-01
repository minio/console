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

export const REWIND_SET_ENABLE = "REWIND/SET_ENABLE";
export const REWIND_RESET_REWIND = "REWIND/RESET_REWIND";

export const REWIND_FILE_MODE_ENABLED = "BUCKET_BROWSER/FILE_MODE_ENABLED";

interface RewindSetEnabled {
  type: typeof REWIND_SET_ENABLE;
  bucket: string;
  state: boolean;
  dateRewind: any;
}

interface RewindReset {
  type: typeof REWIND_RESET_REWIND;
}

interface FileModeEnabled {
  type: typeof REWIND_FILE_MODE_ENABLED;
  status: boolean;
}

export type ObjectBrowserActionTypes =
  | RewindSetEnabled
  | RewindReset
  | FileModeEnabled;

export const setRewindEnable = (
  state: boolean,
  bucket: string,
  dateRewind: any
) => {
  return {
    type: REWIND_SET_ENABLE,
    state,
    bucket,
    dateRewind,
  };
};

export const resetRewind = () => {
  return {
    type: REWIND_RESET_REWIND,
  };
};

export const setFileModeEnabled = (status: boolean) => {
  return {
    type: REWIND_FILE_MODE_ENABLED,
    status,
  };
};
