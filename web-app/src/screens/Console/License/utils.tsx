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
        content: "GNU AGPL v3 License",
      },
      eosPlus: {
        content: "Enterprise License",
      },
    },
  },
  {
    featureLabel: "Intended Use",
    featurePlans: {
      openSource: {
        content: <div>Test and Dev Use</div>,
      },
      eosPlus: {
        content: (
          <div>
            Production Use <br /> (Site-Replication, Enterprise Grade Security,
            Encryption and Key Management)
          </div>
        ),
      },
    },
  },
  {
    featureLabel: "Features",
    featurePlans: {
      openSource: {
        content: "Basic Features",
      },
      eosPlus: {
        content:
          "Basic Features, S3 Express, Non-Disruptive Upgrade, QoS, Catalog, Monitoring, Audit Logs, Health-Diagnostics, RDMA, GPU Direct, AI Features",
      },
    },
  },
  {
    featureLabel: "Support",
    featurePlans: {
      openSource: {
        content: "Community Support",
      },
      eosPlus: {
        content:
          "SLA backed - 24/7/365, <4 hr response time, Instant SLA for P0 issues ",
      },
    },
  },
  {
    featureLabel: "Regulatory Compliance",
    featurePlans: {
      openSource: {
        content: "N/A",
      },
      eosPlus: {
        content:
          "FIPS 140-a Compliant, Pentest\n" +
          "SOC2, ISO 27001, \n" +
          "SEC 17a-4(f), FINRA 4511(c) and CFTC 1.31(c)-(d)\n" +
          "\n",
      },
    },
  },
  {
    featureLabel: "Optimizations",
    featurePlans: {
      openSource: {
        content: "N/A",
      },
      eosPlus: {
        content:
          "Optimizations for Small Objects, Bulk Deletes, List Operations, Low TTFB, Distributed Cache",
      },
    },
  },
];

export const LICENSE_PLANS_INFORMATION: LicensePlanOption[] = [
  {
    planId: "openSource",
    planName: "Community",
    planType: "open-source",
    planIcon: (
      <ApplicationLogo applicationName={"console"} subVariant={"AGPL"} />
    ),
    planDescription: "",
  },
  {
    planId: "eosPlus",
    planName: "Enterprise",
    planType: "commercial",
    planIcon: (
      <ApplicationLogo applicationName={"aistor"} subVariant={"enterprise"} />
    ),
    planDescription: "",
  },
];

const LICENSE_CONSENT_STORE_KEY = "agpl_minio_license_consent";
export const setLicenseConsent = () => {
  localStorage.setItem(LICENSE_CONSENT_STORE_KEY, "true");
};

export const getLicenseConsent = () => {
  return localStorage.getItem(LICENSE_CONSENT_STORE_KEY) === "true";
};
