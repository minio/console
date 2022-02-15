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

export interface IPlanDetails {
  id: number;
  title: string;
  price: string;
  capacityMax: string;
  capacityMin?: string;
}

export const planDetails: IPlanDetails[] = [
  {
    id: 0,
    title: "Community",
    price: "Open Source",
    capacityMax: "",
  },
  {
    id: 1,
    title: "Standard",
    price: "$10 per TiB per Month",
    capacityMax: "(Minimum of 100TB)",
    capacityMin: "",
  },
  {
    id: 2,
    title: "Enterprise",
    price: "$20 per TiB per Month",
    capacityMax: "(Minimum of 100TB)",
    capacityMin: "",
  },
];

export interface IPlanItemValue {
  label: string;
  detail?: string;
  link?: boolean;
}

export interface IPlanItemValues {
  [index: string]: IPlanItemValue;
}
export interface IPlanItem {
  id: number;
  field: string;
  plans: IPlanItemValues;
  className?:string
}

export const planItems: IPlanItem[] = [
  {
    id: 0,
    field: "Unit Price",
    className:"unit-price",
    plans: {
      Community: {
        label: "",
        detail: "",
      },
      Standard: {
        label: "$10 per TiB per Month",
        detail: "(Minimum of 100TB)",
      },
      Enterprise: {
        label: "$20 per TiB per Month",
        detail: "(Minimum of 100TB)",
      },
    },
  },
  {
    id: 1,
    field: "License",
    className:"license-col",
    plans: {
      Community: {
        label: "GNU AGPL v3",
        detail: "Open source",
        link: true,
      },
      Standard: {
        label: "Commercial",
      },
      Enterprise: {
        label: "Commercial",
      },
    },
  },
  {
    id: 2,
    field: "Software Release",
    plans: {
      Community: {
        label: "Upstream",
      },
      Standard: {
        label: "1 Year Long Term Support",
      },
      Enterprise: {
        label: "5 Years Long Term Support",
      },
    },
  },
  {
    id: 3,
    field: "SLA",
    plans: {
      Community: {
        label: "No SLA",
      },
      Standard: {
        label: "<48 Hours",
        detail: "(Local Business Hours)"
      },
      Enterprise: {
        label: "<1 hour",
      },
    },
  },
  {
    id: 4,
    field: "Support",
    plans: {
      Community: {
        label: "Community:",
        detail: "Public Slack Channel + Github Issues",
      },
      Standard: {
        label: "L4 Direct Engineering",
        detail: " support via SUBNET",
      },
      Enterprise: {
        label: "L4 Direct Engineering",
        detail: "support via SUBNET",
      },
    },
  },
  {
    id: 5,
    field: "Critical Security and Bug Detection",
    plans: {
      Community: {
        label: "Self",
      },
      Standard: {
        label: "Continuous Scan and Alert",
      },
      Enterprise: {
        label: "Continuous Scan and Alert",
      },
    },
  },
  {
    id: 6,
    field: "Panic Button",
    plans: {
      Community: {
        label: "N/A",
      },
      Standard: {
        label: "1 per year",
      },
      Enterprise: {
        label: "Unlimited",
      },
    },
  },
  {
    id:7,
    field: "Health Diagnostics",
    plans: {
      Community: {
        label: "N/A",
      },
      Standard: {
        label: "24/7/365",
      },
      Enterprise: {
        label: "24/7/365",
      },
    },
  },
  {
    id: 8,
    field: "Annual Architecture Review",
    plans: {
      Community: {
        label: "N/A",
      },
      Standard: {
        label: "N/A",
      },
      Enterprise: {
        label: "Yes",
      },
    },
  },
  {
    id: 9,
    field: "Annual Performance Review",
    plans: {
      Community: {
        label: "N/A",
      },
      Standard: {
        label: "N/A",
      },
      Enterprise: {
        label: "Yes",
      },
    },
  },
  {
    id: 10,
    field: "Indemnification",
    plans: {
      Community: {
        label: "N/A",
      },
      Standard: {
        label: "N/A",
      },
      Enterprise: {
        label: "Yes",
      },
    },
  },
  {
    id: 11,
    field: "Security and Policy Review",
    plans: {
      Community: {
        label: "N/A",
      },
      Standard: {
        label: "N/A",
      },
      Enterprise: {
        label: "Yes",
      },
    },
  },
];

export interface IPlanButton {
  id: number;
  text: string;
  text2: string;
  link: string;
  plan: string;
}
export const planButtons: IPlanButton[] = [
  {
    id: 0,
    text: "Join Slack",
    text2: "",
    link: "https://slack.min.io",
    plan: "Community",
  },
  {
    id: 1,
    text: "Subscribe",
    text2: "Sign up",
    link: "https://min.io/signup",
    plan: "Standard",
  },
  {
    id: 2,
    text: "Subscribe",
    text2: "Sign up",
    link: "https://min.io/signup",
    plan: "Enterprise",
  },
];
