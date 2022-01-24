// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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

import * as constants from "./constants";
import { Selector } from "testcafe";

//----------------------------------------------------
// General sidebar element
//----------------------------------------------------
export const sidebarItem = Selector(".MuiPaper-root").find("ul").child("a");
export const logoutItem = Selector(".MuiPaper-root").find("ul").child("div");

//----------------------------------------------------
// Specific sidebar elements
//----------------------------------------------------
export const monitoringElement = Selector(".MuiPaper-root")
  .find("ul")
  .child("#tools");
export const monitoringChildren = Selector("#tools-children");
export const dashboardElement = monitoringChildren
  .find("a")
  .withAttribute("href", "/tools/dashboard");
export const logsElement = monitoringChildren
  .find("a")
  .withAttribute("href", "/tools/logs");
export const traceElement = monitoringChildren
  .find("a")
  .withAttribute("href", "/tools/trace");
export const drivesElement = monitoringChildren
  .find("a")
  .withAttribute("href", "/tools/heal");
export const watchElement = monitoringChildren
  .find("a")
  .withAttribute("href", "/tools/watch");

export const bucketsElement = sidebarItem.withAttribute("href", "/buckets");

export const identityElement = Selector(".MuiPaper-root")
  .find("ul")
  .child("#identity");
export const identityChildren = Selector("#identity-children");

export const usersElement = identityChildren
  .find("a")
  .withAttribute("href", "/identity/users");
export const groupsElement = identityChildren
  .find("a")
  .withAttribute("href", "/identity/groups");
export const serviceAcctsElement = identityChildren
  .find("a")
  .withAttribute("href", "/identity/account");

export const iamPoliciesElement = sidebarItem.withAttribute(
  "href",
  "/access/policies"
);

export const settingsElement = Selector(".MuiPaper-root")
  .find("ul")
  .child("#settings");
export const settingsChildren = Selector("#settings-children");

export const configurationsElement = settingsChildren
  .find("a")
  .withAttribute("href", "/settings/configurations");
export const notificationEndpointsElement = settingsChildren
  .find("a")
  .withAttribute("href", "/settings/notification-endpoints");
export const tiersElement = settingsChildren
  .find("a")
  .withAttribute("href", "/settings/tiers");

export const supportElement = Selector(".MuiPaper-root")
  .find("ul")
  .child("#support");
export const supportChildren = Selector("#support-children");

export const registerElement = supportChildren
  .find("a")
  .withAttribute("href", "/support/register");
export const diagnosticsElement = supportChildren
  .find("a")
  .withAttribute("href", "/support/diagnostics");
export const performanceElement = supportChildren
  .find("a")
  .withAttribute("href", "/support/speedtest");
export const callHomeElement = supportChildren
  .find("a")
  .withAttribute("href", "/support/call-home");
export const profileElement = supportChildren
  .find("a")
  .withAttribute("href", "/support/profile");

export const licenseElement = sidebarItem.withAttribute("href", "/license");
