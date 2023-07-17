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
import { StatsResponseType } from "../SiteReplicationStatus";
import LookupStatusTable from "./LookupStatusTable";
import { EntityNotFound, isEntityNotFound, syncStatus } from "./Utils";

type BucketEntityStatusProps = Partial<StatsResponseType> & {
  lookupValue?: string;
};
const BucketEntityStatus = ({
  bucketStats = {},
  sites = {},
  lookupValue = "",
}: BucketEntityStatusProps) => {
  const rowsForStatus = [
    "Tags",
    "Policy",
    "Quota",
    "Retention",
    "Encryption",
    "Replication",
  ];

  const bucketSites: Record<string, any> = bucketStats[lookupValue] || {};

  if (!lookupValue) return null;

  const siteKeys = Object.keys(sites);

  const notFound = isEntityNotFound(sites, bucketSites, "HasBucket");
  const resultMatrix: any = [];
  if (notFound) {
    return <EntityNotFound entityType={"Bucket"} entityValue={lookupValue} />;
  } else {
    const row = [];
    for (let sCol = 0; sCol < siteKeys.length; sCol++) {
      if (sCol === 0) {
        row.push("");
      }
      /**
       * ----------------------------------
       * | <blank cell>  | sit-0 | site-1 |
       * -----------------------------------
       */
      row.push(sites[siteKeys[sCol]].name);
    }
    resultMatrix.push(row);
    for (let fi = 0; fi < rowsForStatus.length; fi++) {
      /**
       * -------------------------------------------------
       * | Feature Name  | site-0-status | site-1-status |
       * --------------------------------------------------
       */
      const sfRow = [];
      const feature = rowsForStatus[fi];
      let sbStatus: string | boolean = "";

      for (let si = 0; si < siteKeys.length; si++) {
        const bucketSiteDeploymentId = sites[siteKeys[si]].deploymentID;

        const rSite = bucketSites[bucketSiteDeploymentId];

        if (si === 0) {
          sfRow.push(feature);
        }

        switch (fi) {
          case 0:
            sbStatus = syncStatus(rSite.TagMismatch, rSite.HasTagsSet);
            sfRow.push(sbStatus);
            break;
          case 1:
            sbStatus = syncStatus(rSite.PolicyMismatch, rSite.HasPolicySet);
            sfRow.push(sbStatus);
            break;
          case 2:
            sbStatus = syncStatus(rSite.QuotaCfgMismatch, rSite.HasQuotaCfgSet);
            sfRow.push(sbStatus);
            break;
          case 3:
            sbStatus = syncStatus(
              rSite.OLockConfigMismatch,
              rSite.HasOLockConfigSet,
            );
            sfRow.push(sbStatus);
            break;
          case 4:
            sbStatus = syncStatus(rSite.SSEConfigMismatch, rSite.HasSSECfgSet);
            sfRow.push(sbStatus);
            break;
          case 5:
            sbStatus = syncStatus(
              rSite.ReplicationCfgMismatch,
              rSite.HasReplicationCfg,
            );
            sfRow.push(sbStatus);
            break;
        }
      }

      resultMatrix.push(sfRow);
    }
  }

  return (
    <LookupStatusTable
      matrixData={resultMatrix}
      entityName={lookupValue}
      entityType={"Bucket"}
    />
  );
};

export default BucketEntityStatus;
