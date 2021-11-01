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


import api from "../../../common/api";

export type GroupInfo = {
  members?: string[]
  name?: string
  policy?: string
  status?: string
}

export const fetchGroupInfo = async (selectedGroup: string): Promise<GroupInfo> => {
  return await api
    .invoke("GET", `/api/v1/group?name=${encodeURI(selectedGroup)}`)
    .then((res: any) => {
      return res;
    });
};

export const formatPolicy = (policy: string = ""): string[] => {
  return policy.split(",");
};

export const getPoliciesAsString = (policies: string[]): string => {
  return policies.join(", ");
};
