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

import React, { Fragment } from "react";

import PageHeader from "../../Common/PageHeader/PageHeader";
import { tierTypes } from "./utils";
import BackLink from "../../../../common/BackLink";
import PageLayout from "../../Common/Layout/PageLayout";
import { Box } from "@mui/material";
import TierTypeCard from "./TierTypeCard";
import { IAM_PAGES } from "../../../../common/SecureComponent/permissions";

interface ITypeTiersConfig {
  history: any;
}

const TierTypeSelector = ({ history }: ITypeTiersConfig) => {
  const typeSelect = (selectName: string) => {
    history.push(`${IAM_PAGES.TIERS_ADD}/${selectName}`);
  };

  return (
    <Fragment>
      <PageHeader label="Tier Configuration" />
      <BackLink to={IAM_PAGES.TIERS} label="Return to Configured Tiers" />

      <PageLayout>
        <Box
          sx={{
            border: "1px solid #eaeaea",
            padding: "40px",
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 600, paddingBottom: 15 }}>
            Select Tier Type
          </div>
          <Box
            sx={{
              margin: "0 auto",
              display: "grid",
              gridGap: "47px",
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              },
            }}
          >
            {tierTypes.map((tierType, index) => (
              <TierTypeCard
                key={`tierOpt-${index.toString}-${tierType.targetTitle}`}
                name={tierType.targetTitle}
                onClick={() => {
                  typeSelect(tierType.serviceName);
                }}
                icon={tierType.logo}
              />
            ))}
          </Box>
        </Box>
      </PageLayout>
    </Fragment>
  );
};

export default TierTypeSelector;
