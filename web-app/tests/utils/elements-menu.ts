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

import { Selector } from "testcafe";

//----------------------------------------------------
// Functions to get elements
//----------------------------------------------------

export const getMenuElement = (item) => {
  return Selector("div.menuItems").find("button").withAttribute("id", item);
};

export const getSubmenuBlock = (item) => {
  return getMenuElement(item).sibling("div.subItemsBox");
};

//----------------------------------------------------
// General sidebar element
//----------------------------------------------------
export const logoutItem = getMenuElement("sign-out");

//----------------------------------------------------
// Specific sidebar elements
//----------------------------------------------------
export const monitoringElement = getMenuElement("tools");
export const monitoringChildren = getSubmenuBlock("tools");

export const dashboardElement = monitoringChildren
  .find("button")
  .withAttribute("id", "monitorMetrics");
export const logsElement = monitoringChildren
  .find("button")
  .withAttribute("id", "monitorLogs");
export const traceElement = monitoringChildren
  .find("button")
  .withAttribute("id", "monitorTrace");
export const drivesElement = monitoringChildren
  .find("button")
  .withAttribute("id", "monitorDrives");
export const watchElement = monitoringChildren
  .find("button")
  .withAttribute("id", "monitorWatch");

export const bucketsElement = getMenuElement("buckets");

export const serviceAcctsElement = getMenuElement("nav-accesskeys");

export const identityElement = getMenuElement("identity");
export const identityChildren = getSubmenuBlock("identity");

export const usersElement = identityChildren
  .find("button")
  .withAttribute("id", "users");
export const groupsElement = identityChildren
  .find("button")
  .withAttribute("id", "groups");

export const iamPoliciesElement = getMenuElement("policies");

export const configurationsElement = getMenuElement("configurations");

export const notificationEndpointsElement = getMenuElement("lambda");

export const inspectElement = getMenuElement("inspectObjects");

export const licenseElement = getMenuElement("license");
