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

import React from "react";
import { ApplicationLogo } from "mds";

interface LicensePlanOption {
  planId: string;
  planName: string;
  planType: "commercial" | "open-source";
  planIcon: React.ReactNode;
  planDescription: React.ReactNode;
}

interface FeatureElementObject {
  [name: string]: FeatureItem;
}

export interface FeatureItem {
  content: React.ReactNode;
  isCheck?: boolean;
}

interface PlansFeatures {
  featureLabel: string;
  featurePlans: FeatureElementObject;
}

export const FEATURE_ITEMS: PlansFeatures[] = [
  {
    featureLabel: "License",
    featurePlans: {
      openSource: {
        content: "Requires AGPLv3 License Compliance",
      },
      eosLite: {
        content: "Commercial License",
      },
      eosPlus: {
        content: "Commercial License",
      },
    },
  },
  {
    featureLabel: "Release",
    featurePlans: {
      openSource: {
        content: "Upstream Community Release",
      },
      eosLite: {
        content: "Enterprise Stable Release",
      },
      eosPlus: {
        content: "Enterprise Stable Release",
      },
    },
  },
  {
    featureLabel: "Additional Features",
    featurePlans: {
      openSource: {
        content: "None",
      },
      eosLite: {
        content:
          "Global Console, Observability, Cache, Data Firewall, Key Management Server Catalog",
      },
      eosPlus: {
        content:
          "Global Console, Observability, Cache, Data Firewall, Key Management Server Catalog",
      },
    },
  },
  {
    featureLabel: "Long Term Release Support",
    featurePlans: {
      openSource: {
        content: "None",
      },
      eosLite: {
        content: "1 year LTS",
      },
      eosPlus: {
        content: "5 years LTS",
      },
    },
  },
  {
    featureLabel: "Support SLA",
    featurePlans: {
      openSource: {
        content: "No SLA",
      },
      eosLite: {
        content: "Next Business Day SLA",
      },
      eosPlus: {
        content: "Less than 4 Hour SLA",
      },
    },
  },
  {
    featureLabel: "Panic button",
    featurePlans: {
      openSource: {
        content: "None",
      },
      eosLite: {
        content: "1 Panic Button Per Year",
      },
      eosPlus: {
        content: "Unlimited Panic Buttons Per Year",
      },
    },
  },
  {
    featureLabel:
      "Call Home Diagnostics, Health Check, Performance Benchmark, Security and Critical Vulnerabilities Notifications",
    featurePlans: {
      openSource: {
        content: "",
      },
      eosLite: {
        content: "",
        isCheck: true,
      },
      eosPlus: {
        content: "",
        isCheck: true,
      },
    },
  },
  {
    featureLabel: "Indemnification",
    featurePlans: {
      openSource: {
        content: "",
      },
      eosLite: {
        content: "",
      },
      eosPlus: {
        content: "",
        isCheck: true,
      },
    },
  },
  {
    featureLabel: "Annual Review of Architecture, Performance and Security",
    featurePlans: {
      openSource: {
        content: "",
      },
      eosLite: {
        content: "",
      },
      eosPlus: {
        content: "",
        isCheck: true,
      },
    },
  },
];

export const LICENSE_PLANS_INFORMATION: LicensePlanOption[] = [
  {
    planId: "openSource",
    planName: "Open Source",
    planType: "open-source",
    planIcon: (
      <ApplicationLogo applicationName={"console"} subVariant={"AGPL"} />
    ),
    planDescription: (
      <span>
        Designed for developers who are building open source applications in
        compliance with the GNU AGPL v3 license which requires developers to
        distribute their code under the same AGPL v3 license when they
        distribute, host or modify MinIO.
      </span>
    ),
  },
  {
    planId: "eosLite",
    planName: "Enterprise Lite",
    planType: "commercial",
    planIcon: (
      <ApplicationLogo applicationName={"minio"} subVariant={"enterpriseos"} />
    ),
    planDescription: (
      <span>
        Designed for customers who require a commercial license and can mostly
        self-support but want the peace of mind that comes with an
        engineer-backend SLA, additional features and operational capabilities.
      </span>
    ),
  },
  {
    planId: "eosPlus",
    planName: "Enterprise Plus",
    planType: "commercial",
    planIcon: (
      <ApplicationLogo applicationName={"minio"} subVariant={"enterpriseos"} />
    ),
    planDescription: (
      <span>
        Designed for customers where a commercial license and the
        strictest,engineer-backed SLA are required. The Plus tiers offers
        additional features and operational capabilities, more interaction
        options and more enterprise deliverables.
      </span>
    ),
  },
];

const LICENSE_CONSENT_STORE_KEY = "agpl_minio_license_consent";
export const setLicenseConsent = () => {
  localStorage.setItem(LICENSE_CONSENT_STORE_KEY, "true");
};

export const getLicenseConsent = () => {
  return localStorage.getItem(LICENSE_CONSENT_STORE_KEY) === "true";
};
