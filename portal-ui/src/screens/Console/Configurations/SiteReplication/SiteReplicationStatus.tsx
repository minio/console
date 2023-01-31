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

import React, { Fragment, useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import { Button, PageHeader } from "mds";
import PageLayout from "../../Common/Layout/PageLayout";
import useApi from "../../Common/Hooks/useApi";
import BackLink from "../../../../common/BackLink";
import { IAM_PAGES } from "../../../../common/SecureComponent/permissions";
import ScreenTitle from "../../Common/ScreenTitle/ScreenTitle";
import StatusCountCard from "../../Dashboard/BasicDashboard/StatusCountCard";
import {
  BucketsIcon,
  GroupsIcon,
  IAMPoliciesIcon,
  RefreshIcon,
  UsersIcon,
} from "mds";
import EntityReplicationLookup from "./EntityReplicationLookup";
import { Loader } from "mds";
import TooltipWrapper from "../../Common/TooltipWrapper/TooltipWrapper";

export type StatsResponseType = {
  maxBuckets?: number;
  bucketStats?: Record<string, any>;
  maxGroups?: number;
  groupStats?: Record<string, any>;
  maxUsers?: number;
  userStats?: Record<string, any>;
  maxPolicies?: number;
  policyStats?: Record<string, any>;
  sites?: Record<string, any>;
};

const SREntityStatus = ({
  maxValue = 0,
  entityStatObj = {},
  entityTextPlural = "",
  icon = null,
}: {
  maxValue: number;
  entityStatObj: Record<string, any>;
  entityTextPlural: string;
  icon?: React.ReactNode;
}) => {
  const statEntityLen = Object.keys(entityStatObj || {})?.length;
  return (
    <Box
      sx={{
        border: "1px solid #f1f1f1",
        padding: "25px",
        maxWidth: {
          sm: "100%",
        },
      }}
    >
      <StatusCountCard
        icon={icon}
        onlineCount={maxValue}
        offlineCount={statEntityLen}
        okStatusText={"Synced"}
        notOkStatusText={"Failed"}
        label={entityTextPlural}
      />
    </Box>
  );
};

const SiteReplicationStatus = () => {
  const [stats, setStats] = useState<StatsResponseType>({});

  const [isStatsLoading, invokeSiteStatsApi] = useApi(
    (res: any) => {
      setStats(res);
    },
    (err: any) => {
      setStats({});
    }
  );

  const {
    maxBuckets = 0,
    bucketStats = {},
    maxGroups = 0,
    groupStats = {},
    maxUsers = 0,
    userStats = {},
    maxPolicies = 0,
    policyStats = {},
  } = stats || {};

  const getStats = () => {
    let url = `api/v1/admin/site-replication/status?buckets=true&groups=true&policies=true&users=true`;
    invokeSiteStatsApi("GET", url);
  };

  useEffect(() => {
    getStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <PageHeader
        label={
          <BackLink
            to={IAM_PAGES.SITE_REPLICATION}
            label={"Site Replication"}
          />
        }
      />
      <PageLayout>
        <ScreenTitle
          title={"Replication status from all Sites"}
          actions={
            <Fragment>
              <TooltipWrapper tooltip={"Refresh"}>
                <Button
                  id={"refresh"}
                  onClick={() => {
                    getStats();
                  }}
                  label={"Refresh"}
                  icon={<RefreshIcon />}
                  variant={"regular"}
                  collapseOnSmall={false}
                />
              </TooltipWrapper>
            </Fragment>
          }
        />

        {!isStatsLoading ? (
          <Box
            sx={{
              display: "grid",
              marginTop: "25px",
              gridTemplateColumns: {
                md: "1fr 1fr 1fr 1fr",
                sm: "1fr 1fr",
                xs: "1fr",
              },
              gap: "30px",
            }}
          >
            <SREntityStatus
              entityStatObj={bucketStats}
              entityTextPlural={"Buckets"}
              maxValue={maxBuckets}
              icon={<BucketsIcon />}
            />
            <SREntityStatus
              entityStatObj={userStats}
              entityTextPlural={"Users"}
              maxValue={maxUsers}
              icon={<UsersIcon />}
            />
            <SREntityStatus
              entityStatObj={groupStats}
              entityTextPlural={"Groups"}
              maxValue={maxGroups}
              icon={<GroupsIcon />}
            />
            <SREntityStatus
              entityStatObj={policyStats}
              entityTextPlural={"Policies"}
              maxValue={maxPolicies}
              icon={<IAMPoliciesIcon />}
            />
          </Box>
        ) : (
          <Grid
            item
            xs={12}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            marginTop={"45px"}
          >
            <Loader style={{ width: 25, height: 25 }} />
          </Grid>
        )}

        <Box
          sx={{
            border: "1px solid #eaeaea",
            minHeight: {
              sm: "450px",
              xs: "250px",
            },
            marginTop: "25px",
            padding: "25px",
          }}
        >
          <EntityReplicationLookup />
        </Box>
      </PageLayout>
    </Fragment>
  );
};

export default SiteReplicationStatus;
