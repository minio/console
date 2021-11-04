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

export const planDetails = [
  {
    id: 0,
    title: "Community",
    price: "N/A",
    capacityMax: "Open Source",
  },
  {
    id: 1,
    title: "Standard",
    price: "$10 per TB",
    capacityMax: "(Minimum of 100TB)",
    capacityMin: "",
  },
  {
    id: 2,
    title: "Enterprise",
    price: "$20 per TB",
    capacityMax: "(Minimum of 100TB)",
    capacityMin: "",
  },
];

export const planItems = [
  {
    id: 0,
    field: "License",
    community: "GNU AGPL v3",
    communityLink: true,
    communityDetail: "",
    standard: "Commercial License",
    standardDetail: "",
    enterprise: "Commercial License",
    enterpriseDetail: "",
  },
  {
    id: 1,
    field: "Software Release",
    community: "Upstream",
    standard: "1 Year Long Term Support",
    enterprise: "5 Years Long Term Support",
  },
  {
    id: 2,
    field: "SLA",
    community: "No SLA",
    standard: "<48 Hours (Local Business Hours)",
    enterprise: "<1 hour",
  },
  {
    id: 3,
    field: "Support",
    community: "Community:",
    communityDetail: "Public Slack Channel + Github Issues",
    standard: "L4 Direct Engineering",
    standardDetail: " support via SUBNET",
    enterprise: "L4 Direct Engineering",
    enterpriseDetail: "support via SUBNET",
  },
  {
    id: 4,
    field: "Security Updates & Critical Bugs",
    community: "Self Update",
    standard: "Continuous Scan and Alert",
    enterprise: "Continuous Scan and Alert",
  },
  {
    id: 5,
    field: "Panic Button",
    community: "N/A",
    standard: "1 per year",
    enterprise: "Unlimited",
  },
  {
    id: 6,
    field: "Health Diagnostics",
    community: "N/A",
    standard: "24/7/365",
    enterprise: "24/7/365",
  },
  {
    id: 6,
    field: "Annual Architecture Review",
    community: "N/A",
    standard: "N/A",
    enterprise: "Yes",
  },
  {
    id: 7,
    field: "Annual Performance Review",
    community: "N/A",
    standard: "N/A",
    enterprise: "Yes",
  },
  {
    id: 8,
    field: "Indemnification",
    community: "N/A",
    standard: "N/A",
    enterprise: "Yes",
  },
  {
    id: 9,
    field: "Security + Policy Review",
    community: "N/A",
    standard: "N/A",
    enterprise: "Yes",
  },
];

export const planButtons = [
  {
    id: 0,
    text: "Join Slack",
    text2: "",
    link: "https://slack.min.io",
    plan: "community",
  },
  {
    id: 1,
    text: "Subscribe",
    text2: "Upgrade",
    link: "https://subnet.min.io/subscription",
    plan: "standard",
  },
  {
    id: 2,
    text: "Subscribe",
    text2: "Upgrade",
    link: "https://subnet.min.io/subscription",
    plan: "enterprise",
  },
];
