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
import {
  BackLink,
  Box,
  breakPoints,
  BucketsIcon,
  Button,
  Grid,
  GroupsIcon,
  IAMPoliciesIcon,
  Loader,
  PageLayout,
  RefreshIcon,
  UsersIcon,
  SectionTitle,
} from "mds";
import { useNavigate } from "react-router-dom";
import { IAM_PAGES } from "../../../../common/SecureComponent/permissions";
import { useAppDispatch } from "../../../../store";
import { setErrorSnackMessage, setHelpName } from "../../../../systemSlice";
import StatusCountCard from "../../Dashboard/BasicDashboard/StatusCountCard";
import EntityReplicationLookup from "./EntityReplicationLookup";
import TooltipWrapper from "../../Common/TooltipWrapper/TooltipWrapper";
import PageHeaderWrapper from "../../Common/PageHeaderWrapper/PageHeaderWrapper";
import HelpMenu from "../../HelpMenu";
import { api } from "api";
import { errorToHandler } from "api/errors";
import {
  ApiError,
  HttpResponse,
  SiteReplicationStatusResponse,
} from "api/consoleApi";

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
      withBorders
      sx={{
        padding: "25px",
        [`@media (min-width: ${breakPoints.sm}px)`]: {
          maxWidth: "100%",
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
  const navigate = useNavigate();

  const [stats, setStats] = useState<StatsResponseType>({});
  const [loading, setLoading] = useState<boolean>(false);

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
    setLoading(true);
    api.admin
      .getSiteReplicationStatus({
        buckets: true,
        groups: true,
        policies: true,
        users: true,
      })
      .then((res: HttpResponse<SiteReplicationStatusResponse, ApiError>) => {
        setStats(res.data);
      })
      .catch((res: HttpResponse<SiteReplicationStatusResponse, ApiError>) => {
        setStats({});
        dispatch(setErrorSnackMessage(errorToHandler(res.error)));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setHelpName("replication_status"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <PageHeaderWrapper
        label={
          <BackLink
            label={"Site Replication"}
            onClick={() => navigate(IAM_PAGES.SITE_REPLICATION)}
          />
        }
        actions={<HelpMenu />}
      />

      <PageLayout>
        <SectionTitle
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
          separator
        >
          Replication status from all Sites
        </SectionTitle>

        {!loading ? (
          <Box
            sx={{
              display: "grid",
              marginTop: "25px",
              gridTemplateColumns: "1fr 1fr 1fr 1fr",
              [`@media (max-width: ${breakPoints.md}px)`]: {
                gridTemplateColumns: "1fr 1fr",
              },
              [`@media (max-width: ${breakPoints.sm}px)`]: {
                gridTemplateColumns: "1fr",
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
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 45,
            }}
          >
            <Loader style={{ width: 25, height: 25 }} />
          </Grid>
        )}

        <Box
          withBorders
          sx={{
            minHeight: 450,
            [`@media (max-width: ${breakPoints.sm}px)`]: {
              minHeight: 250,
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
