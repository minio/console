// This file is part of MinIO Console Server
// Copyright (c) 2023 MinIO, Inc.
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

import * as elements from "../utils/elements";

// Using subpath defined in `MINIO_BROWSER_REDIRECT_URL`
const appBaseUrl = "http://localhost:8000/console/subpath";
let rootUrl = `${appBaseUrl}/`;

fixture("Tests using subpath").page(appBaseUrl);

test("RootUrl redirects to Login Page", async (t) => {
  const loginButtonExists = elements.loginButton.exists;
  await t.navigateTo(rootUrl).expect(loginButtonExists).ok().wait(2000);
});
