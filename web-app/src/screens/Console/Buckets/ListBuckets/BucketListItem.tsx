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
import React, { Fragment, useState } from "react";
import get from "lodash/get";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  breakPoints,
  BucketsIcon,
  Checkbox,
  Grid,
  HelpTip,
  ReportedUsageIcon,
  TotalObjectsIcon,
} from "mds";
import {
  calculateBytes,
  niceBytes,
  prettyNumber,
} from "../../../../common/utils";
import {
  IAM_PERMISSIONS,
  IAM_ROLES,
} from "../../../../common/SecureComponent/permissions";
import { hasPermission } from "../../../../common/SecureComponent";
import { Bucket } from "../../../../api/consoleApi";
import { usageClarifyingContent } from "screens/Console/Dashboard/BasicDashboard/ReportedUsage";

const BucketItemMain = styled.div(({ theme }) => ({
  border: `${get(theme, "borderColor", "#eaeaea")} 1px solid`,
  borderRadius: 3,
  padding: 15,
  cursor: "pointer",
  "&.disabled": {
    backgroundColor: get(theme, "signalColors.danger", "red"),
  },
  "&:hover": {
    backgroundColor: get(theme, "boxBackground", "#FBFAFA"),
  },
  "& .bucketTitle": {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
    "& h1": {
      padding: 0,
      margin: 0,
      marginBottom: 5,
      fontSize: 22,
      color: get(theme, "screenTitle.iconColor", "#07193E"),
      [`@media (max-width: ${breakPoints.md}px)`]: {
        marginBottom: 0,
      },
    },
  },
  "& .bucketDetails": {
    display: "flex",
    gap: 40,
    "& span": {
      fontSize: 14,
    },
    [`@media (max-width: ${breakPoints.md}px)`]: {
      flexFlow: "column-reverse",
      gap: 5,
    },
  },
  "& .bucketMetrics": {
    display: "flex",
    alignItems: "center",
    marginTop: 20,
    gap: 25,
    borderTop: `${get(theme, "borderColor", "#E2E2E2")} 1px solid`,
    paddingTop: 20,
    "& svg.bucketIcon": {
      color: get(theme, "screenTitle.iconColor", "#07193E"),
      fill: get(theme, "screenTitle.iconColor", "#07193E"),
    },
    "& .metric": {
      "& .min-icon": {
        color: get(theme, "fontColor", "#000"),
        width: 13,
        marginRight: 5,
      },
    },
    "& .metricLabel": {
      fontSize: 14,
      fontWeight: "bold",
      color: get(theme, "fontColor", "#000"),
    },
    "& .metricText": {
      fontSize: 24,
      fontWeight: "bold",
    },
    "& .unit": {
      fontSize: 12,
      fontWeight: "normal",
    },
    [`@media (max-width: ${breakPoints.md}px)`]: {
      marginTop: 8,
      paddingTop: 8,
    },
  },
}));

interface IBucketListItem {
  bucket: Bucket;
  onSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selected: boolean;
  bulkSelect: boolean;
}

const BucketListItem = ({
  bucket,
  onSelect,
  selected,
  bulkSelect,
}: IBucketListItem) => {
  const navigate = useNavigate();

  const [clickOverride, setClickOverride] = useState<boolean>(false);

  const usage = niceBytes(`${bucket.size}` || "0");
  const usageScalar = usage.split(" ")[0];
  const usageUnit = usage.split(" ")[1];

  const quota = get(bucket, "details.quota.quota", "0");
  const quotaForString = calculateBytes(quota, true, false);

  const manageAllowed =
    hasPermission(bucket.name, IAM_PERMISSIONS[IAM_ROLES.BUCKET_ADMIN]) &&
    false;

  const accessToStr = (bucket: Bucket): string => {
    if (bucket.rw_access?.read && !bucket.rw_access?.write) {
      return "R";
    } else if (!bucket.rw_access?.read && bucket.rw_access?.write) {
      return "W";
    } else if (bucket.rw_access?.read && bucket.rw_access?.write) {
      return "R/W";
    }
    return "";
  };
  const onCheckboxClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelect(e);
  };

  return (
    <BucketItemMain
      onClick={() => {
        !clickOverride && navigate(`/buckets/${bucket.name}/admin`);
      }}
      id={`manageBucket-${bucket.name}`}
      className={`bucket-item ${manageAllowed ? "disabled" : ""}`}
    >
      <Box className={"bucketTitle"}>
        {bulkSelect && (
          <Box
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Checkbox
              checked={selected}
              id={`select-${bucket.name}`}
              label={""}
              name={`select-${bucket.name}`}
              onChange={onCheckboxClick}
              value={bucket.name}
            />
          </Box>
        )}
        <h1>
          {bucket.name} {manageAllowed}
        </h1>
      </Box>
      <Box className={"bucketDetails"}>
        <span id={`created-${bucket.name}`}>
          <strong>Created:</strong>{" "}
          {bucket.creation_date
            ? new Date(bucket.creation_date).toString()
            : "n/a"}
        </span>
        <span id={`access-${bucket.name}`}>
          <strong>Access:</strong> {accessToStr(bucket)}
        </span>
      </Box>
      <Box className={"bucketMetrics"}>
        <Link to={`/buckets/${bucket.name}/admin`}>
          <BucketsIcon
            className={"bucketIcon"}
            style={{
              height: 48,
              width: 48,
            }}
          />
        </Link>

        <Grid
          item
          className={"metric"}
          onMouseEnter={() =>
            bucket.details?.versioning && setClickOverride(true)
          }
          onMouseLeave={() =>
            bucket.details?.versioning && setClickOverride(false)
          }
        >
          {bucket.details?.versioning && (
            <HelpTip content={usageClarifyingContent} placement="top">
              <ReportedUsageIcon />{" "}
            </HelpTip>
          )}
          {!bucket.details?.versioning && <ReportedUsageIcon />}
          <span className={"metricLabel"}>Usage</span>
          <div className={"metricText"}>
            {usageScalar}
            <span className={"unit"}>{usageUnit}</span>
            {quota !== "0" && (
              <Fragment>
                {" "}
                / {quotaForString.total}
                <span className={"unit"}>{quotaForString.unit}</span>
              </Fragment>
            )}
          </div>
        </Grid>

        <Grid item className={"metric"}>
          <TotalObjectsIcon />
          <span className={"metricLabel"}>Objects</span>
          <div className={"metricText"}>
            {bucket.objects ? prettyNumber(bucket.objects) : 0}
          </div>
        </Grid>
      </Box>
    </BucketItemMain>
  );
};

export default BucketListItem;
