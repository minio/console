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
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { tierTypes } from "./utils";
import { IAM_PAGES } from "../../../../common/SecureComponent/permissions";
import PageHeader from "../../Common/PageHeader/PageHeader";
import BackLink from "../../../../common/BackLink";
import PageLayout from "../../Common/Layout/PageLayout";
import TierTypeCard from "./TierTypeCard";
import HelpBox from "../../../../common/HelpBox";
import { TiersIcon } from "../../../../icons";
import FormLayout from "../../Common/FormLayout";

const TierTypeSelector = () => {
  const navigate = useNavigate();

  const typeSelect = (selectName: string) => {
    navigate(`${IAM_PAGES.TIERS_ADD}/${selectName}`);
  };

  return (
    <Fragment>
      <PageHeader
        label={
          <Fragment>
            <BackLink to={IAM_PAGES.TIERS} label="Tier Types" />
          </Fragment>
        }
        actions={<React.Fragment />}
      />

      <PageLayout>
        <FormLayout
          title={"Select Tier Type"}
          icon={<TiersIcon />}
          helpbox={
            <HelpBox
              iconComponent={<TiersIcon />}
              title={"Tier Types"}
              help={
                <Fragment>
                  MinIO supports creating object transition lifecycle management
                  rules, where MinIO can automatically move an object to a
                  remote storage “tier”.
                  <br />
                  MinIO object transition supports use cases like moving aged
                  data from MinIO clusters in private or public cloud
                  infrastructure to low-cost private or public cloud storage
                  solutions. MinIO manages retrieving tiered objects on-the-fly
                  without any additional application-side logic.
                </Fragment>
              }
            />
          }
        >
          <Box
            sx={{
              margin: "15px",
              display: "grid",
              gridGap: "20px",
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                sm: "repeat(1, 1fr)",
                md: "repeat(2, 1fr)",
                lg: "repeat(2, 1fr)",
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
        </FormLayout>
      </PageLayout>
    </Fragment>
  );
};

export default TierTypeSelector;
