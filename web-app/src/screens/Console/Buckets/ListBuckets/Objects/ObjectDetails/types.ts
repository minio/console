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

export interface IFileInfo {
  is_latest?: boolean;
  last_modified: string;
  legal_hold_status?: string;
  name: string;
  retention_mode?: string;
  retention_until_date?: string;
  size?: string;
  tags?: object;
  etag?: string;
  version_id: string | null;
  is_delete_marker?: boolean;
  user_metadata?: object;
}
