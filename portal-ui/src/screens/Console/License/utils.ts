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

export const LICENSE_PLANS = {
  COMMUNITY: "community",
  STANDARD: "standard",
  ENTERPRISE: "enterprise",
};

export const FEATURE_ITEMS = [
  {
    label: "Unit Price", //spacer
    isHeader: true,
  },
  {
    desc: "Features",
    featureTitleRow: true,
  },
  {
    desc: "License",
  },
  {
    desc: "Software Release",
  },
  {
    desc: "SLA",
  },
  {
    desc: "Support",
  },
  {
    desc: "Critical Security and Bug Detection",
  },
  {
    desc: "Panic Button",
  },
  {
    desc: "Health Diagnostics",
  },
  {
    desc: "Annual Architecture Review",
  },
  {
    desc: "Annual Performance Review",
  },
  {
    desc: "Indemnification",
  },
  {
    desc: "Security and Policy Review",
  },
];

export const COMMUNITY_PLAN_FEATURES = [
  {
    label: "Community",
    isHeader: true,
  },
  {
    id: "com_feat_title",
    featureTitleRow: true,
  },
  {
    id: "com_license",
    label: "GNU AGPL v3",
    isOssLicenseLink: true,
  },
  {
    id: "com_release",
    label: "Upstream",
  },
  {
    id: "com_sla",
    label: "No SLA",
  },
  {
    id: "com_support",
    label: "Community:",
    detail: "Public Slack Channel + Github Issues",
  },
  {
    id: "com_security",
    label: "Self",
  },
  {
    id: "com_panic",
    xsLabel: "N/A",
  },
  {
    id: "com_diag",
    xsLabel: "N/A",
  },
  {
    id: "com_arch",
    xsLabel: "N/A",
  },
  {
    id: "com_perf",
    xsLabel: "N/A",
  },
  {
    id: "com_indemnity",
    xsLabel: "N/A",
  },
  {
    id: "com_sec_policy",
    xsLabel: "N/A",
  },
];

export const STANDARD_PLAN_FEATURES = [
  {
    label: "Standard",
    isHeader: true,
  },
  {
    id: "std_feat_title",
    featureTitleRow: true,
  },
  {
    id: "std_license",
    label: "Commercial",
  },
  {
    id: "std_release",
    label: "1 Year Long Term Support",
  },
  {
    id: "std_sla",
    label: "<48 Hours",
    detail: "(Local Business Hours)",
  },
  {
    id: "std_support",
    label: "L4 Direct Engineering",
    detail: "support via SUBNET",
  },
  {
    id: "std_security",
    label: "Continuous Scan and Alert",
  },
  {
    id: "std_panic",
    label: "1 Per year",
  },
  {
    id: "std_diag",
    label: "24/7/365",
  },
  {
    id: "std_arch",
    xsLabel: "N/A",
  },
  {
    id: "std_perf",
    xsLabel: "N/A",
  },
  {
    id: "std_indemnity",
    xsLabel: "N/A",
  },
  {
    id: "std_sec_policy",
    xsLabel: "N/A",
  },
];

export const ENTERPRISE_PLAN_FEATURES = [
  {
    label: "Enterprise",
    isHeader: true,
  },
  {
    id: "end_feat_title",
    featureTitleRow: true,
  },
  {
    id: "ent_license",
    label: "Commercial",
  },
  {
    id: "ent_release",
    label: "5 Years Long Term Support",
  },
  {
    id: "ent_sla",
    label: "<1 hour",
  },
  {
    id: "ent_support",
    label: "L4 Direct Engineering support via",
    detail: "SUBNET, Phone, Web Conference",
  },
  {
    id: "ent_security",
    label: "Continuous Scan and Alert",
  },
  {
    id: "ent_panic",
    label: "Unlimited",
  },
  {
    id: "ent_diag",
    label: "24/7/365",
  },
  {
    id: "ent_arch",
    yesIcon: true,
  },
  {
    id: "ent_perf",
    yesIcon: true,
  },
  {
    id: "ent_indemnity",
    yesIcon: true,
  },
  {
    id: "ent_sec_policy",
    yesIcon: true,
  },
];

export const PAID_PLANS = [LICENSE_PLANS.STANDARD, LICENSE_PLANS.ENTERPRISE];
