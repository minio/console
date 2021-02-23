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
    price: "Open Source",
    capacityMin: "",
  },
  {
    id: 1,
    title: "Standard",
    price: "$10/TB/month",
    capacityMax: "Up to 10PB. No additional charges for capacity over 10PB",
    capacityMin: "",
  },
  {
    id: 2,
    title: "Enterprise",
    price: "$20/TB/month",
    capacityMax: "Up to 5PB. No additional charges for capacity over 5PB",
    capacityMin: "",
  },
];

export const planItems = [
  {
    id: 0,
    field: "License",
    community: "GNU AGPL v3",
    communityDetail: "",
    standard: "Commercial License",
    standardDetail: "",
    enterprise: "Commercial License",
    enterpriseDetail: "",
  },
  {
    id: 1,
    field: "Software Release",
    community: "Update to latest",
    standard: "1 Year Long Term Support",
    enterprise: "5 Years Long Term Support",
  },
  {
    id: 2,
    field: "SLA",
    community: "No SLA",
    standard: "<24 hours",
    enterprise: "<1 hour",
  },
  {
    id: 3,
    field: "Support",
    community: "Community:",
    communityDetail: "Public Slack Channel + Github Issues",
    standard: "24x7 L4 direct engineering",
    standardDetail: "Support via SUBNET",
    enterprise: "24x7 L4 direct engineering",
    enterpriseDetail: "Support via SUBNET",
  },
  {
    id: 4,
    field: "Security Updates & Critical Bugs",
    community: "Self Update",
    standard: "Guided Update",
    enterprise: "Guided Update",
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
    field: "Annual Architecture Review",
    community: "N/A",
    standard: "Yes",
    enterprise: "Yes",
  },
  {
    id: 7,
    field: "Annual Performance Review",
    community: "N/A",
    standard: "Yes",
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
    link: "https://slack.min.io",
    plan: "community",
  },
  {
    id: 1,
    text: "Subscribe",
    link: "https://min.io/pricing",
    plan: "standard",
  },
  {
    id: 2,
    text: "Subscribe",
    link: "https://min.io/pricing",
    plan: "enterprise",
  },
];
