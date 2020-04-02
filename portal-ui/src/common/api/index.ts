// This file is part of MinIO Kubernetes Cloud
// Copyright (c) 2019 MinIO, Inc.
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

import storage from "local-storage-fallback";
import request from "superagent";

export class API {
  invoke(method: string, url: string, data?: object) {
    const token: string = storage.getItem("token")!;
    return request(method, url)
      .set("Authorization", `Bearer ${token}`)
      .send(data)
      .then(res => res.body)
      .catch(err => this.onError(err));
  }

  onError(err: any) {
    if (err.status) {
      const errMessage: string =
        (err.response.body && err.response.body.error) ||
        err.status.toString(10);
      return Promise.reject(errMessage);
    } else {
      return Promise.reject("Unknown error");
    }
  }
}
const api = new API();
export default api;
