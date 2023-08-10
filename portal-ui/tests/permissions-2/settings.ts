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

import * as roles from "../utils/roles";
import * as elements from "../utils/elements";
import { configurationsElement } from "../utils/elements-menu";

fixture("For user with Settings permissions")
  .page("http://localhost:9090")
  .beforeEach(async (t) => {
    await t.useRole(roles.settings);
  });

test("Settings sidebar item exists", async (t) => {
  await t.expect(configurationsElement.exists).ok();
});

test("Settings window exists in Settings page", async (t) => {
  const settingsWindowExists = elements.settingsWindow.exists;
  await t
    .navigateTo("http://localhost:9090/settings/configurations")
    .expect(settingsWindowExists)
    .ok();
});

test("All vertical tab items exist", async (t) => {
  const settingsRegionTabExists = elements.settingsRegionTab.exists;
  const settingsCompressionTabExists = elements.settingsCompressionTab.exists;
  const settingsApiTabExists = elements.settingsApiTab.exists;
  const settingsHealTabExists = elements.settingsHealTab.exists;
  const settingsScannerTabExists = elements.settingsScannerTab.exists;
  const settingsEtcdTabExists = elements.settingsEtcdTab.exists;
  const settingsLoggerWebhookTabExists =
    elements.settingsLoggerWebhookTab.exists;
  const settingsAuditWebhookTabExists = elements.settingsAuditWebhookTab.exists;
  const settingsAuditKafkaTabExists = elements.settingsAuditKafkaTab.exists;
  await t
    .navigateTo("http://localhost:9090/settings/configurations")
    .expect(settingsRegionTabExists)
    .ok()
    .expect(settingsCompressionTabExists)
    .ok()
    .expect(settingsApiTabExists)
    .ok()
    .expect(settingsHealTabExists)
    .ok()
    .expect(settingsScannerTabExists)
    .ok()
    .expect(settingsEtcdTabExists)
    .ok()
    .expect(settingsLoggerWebhookTabExists)
    .ok()
    .expect(settingsAuditWebhookTabExists)
    .ok()
    .expect(settingsAuditKafkaTabExists)
    .ok();
});
