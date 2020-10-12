// This file is part of MinIO Console Server
// Copyright (c) 2020 MinIO, Inc.
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
    title: "Community",
    price: "Free",
    capacityMin: "(No minimum)",
  },
  {
    title: "Standard",
    price: "$10/TB/month",
    capacityMax: "Up to 10PB. No additional charges for capacity over 10PB",
    capacityMin: "(25TB minimum)",
  },
  {
    title: "Enterprise",
    price: "$20/TB/month",
    capacityMax: "Up to 5PB. No additional charges for capacity over 5PB",
    capacityMin: "(100TB minimum)",
  },
];

export const planItems = [
  {
    field: "License",
    community: "100% Open Source",
    communityDetail: "Apache License v2, GNU AGPL v3",
    standard: "Dual License",
    standardDetail: "Commercial + Open Source",
    enterprise: "Dual License",
    enterpriseDetail: "Commercial + Open Source",
  },
  {
    field: "Software Release",
    community: "Update to latest",
    standard: "1 Year Long Term Support",
    enterprise: "5 Years Long Term Support",
  },
  {
    field: "SLA",
    community: "No SLA",
    standard: "<24 hours",
    enterprise: "<1 hour",
  },
  {
    field: "Support",
    community: "Community:",
    communityDetail: "Public Slack Channel + Github Issues",
    standard: "24x7 L4 direct engineering",
    standardDetail: "Support via SUBNET",
    enterprise: "24x7 L4 direct engineering",
    enterpriseDetail: "Support via SUBNET",
  },
  {
    field: "Security Updates & Critical Bugs",
    community: "Self Update",
    standard: "Guided Update",
    enterprise: "Guided Update",
  },
  {
    field: "Panic Button",
    community: "N/A",
    standard: "1 per year",
    enterprise: "Unlimited",
  },
  {
    field: "Annual Architecture Review",
    community: "N/A",
    standard: "Yes",
    enterprise: "Yes",
  },
  {
    field: "Annual Performance Review",
    community: "N/A",
    standard: "Yes",
    enterprise: "Yes",
  },
  {
    field: "Indemnification",
    community: "N/A",
    standard: "N/A",
    enterprise: "Yes",
  },
  {
    field: "Security + Policy Review",
    community: "N/A",
    standard: "N/A",
    enterprise: "Yes",
  },
];

export const planButtons = [
  {
    text: "Slack Community",
    link: "https://slack.min.io",
  },
  {
    text: "Subscribe",
    link: "https://min.io/pricing",
  },
  {
    text: "Subscribe",
    link: "https://min.io/pricing",
  },
];
