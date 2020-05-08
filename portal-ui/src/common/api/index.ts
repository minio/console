// This file is part of MinIO Console Server
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
import get from "lodash/get";

export class API {
  invoke(method: string, url: string, data?: object) {
    const token: string = storage.getItem("token")!;
    return request(method, url)
      .set("Authorization", `Bearer ${token}`)
      .send(data)
      .then(res => res.body)
      .catch(err => {
        // if we get unauthorized, kick out the user
        if (err.status === 401) {
          storage.removeItem("token");
          window.location.href = "/";
        }
        return this.onError(err);
      });
  }

  onError(err: any) {
    if (err.status) {
      const errMessage = get(
        err.response,
        "body.message",
        err.status.toString()
      );

      const throwMessage =
        errMessage.charAt(0).toUpperCase() + errMessage.slice(1);

      return Promise.reject(throwMessage);
    } else {
      return Promise.reject("Unknown error");
    }
  }
}

const api = new API();
export default api;
