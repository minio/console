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

type PolicyEntityStatusProps = Partial<StatsResponseType> & {
  lookupValue?: string;
};
const PolicyEntityStatus = ({
  policyStats = {},
  sites = {},
  lookupValue = "",
}: PolicyEntityStatusProps) => {
  const rowsForStatus = ["Policy"];

  const policySites: Record<string, any> = policyStats[lookupValue] || {};

  if (!lookupValue) return null;

  const siteKeys = Object.keys(sites);
  const notFound = isEntityNotFound(sites, policySites, "HasPolicy");
  const resultMatrix: any = [];
  if (notFound) {
    return <EntityNotFound entityType={"Policy"} entityValue={lookupValue} />;
  } else {
    const row = [];
    for (let sCol = 0; sCol < siteKeys.length; sCol++) {
      if (sCol === 0) {
        row.push("");
      }
      row.push(sites[siteKeys[sCol]].name);
    }
    resultMatrix.push(row);
    for (let fi = 0; fi < rowsForStatus.length; fi++) {
      const sfRow = [];
      const feature = rowsForStatus[fi];
      let sbStatus: string | boolean = "";

      for (let si = 0; si < siteKeys.length; si++) {
        const bucketSiteDeploymentId = sites[siteKeys[si]].deploymentID;

        const rSite = policySites[bucketSiteDeploymentId];

        if (si === 0) {
          sfRow.push(feature);
        }

        switch (fi) {
          case 0:
            sbStatus = syncStatus(rSite.PolicyMismatch, rSite.HasPolicy);
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
      entityType={"Policy"}
    />
  );
};

export default PolicyEntityStatus;
