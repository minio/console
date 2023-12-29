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

import React, { Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { tierTypes } from "./utils";
import { IAM_PAGES } from "../../../../common/SecureComponent/permissions";
import TierTypeCard from "./TierTypeCard";
import {
  BackLink,
  Box,
  breakPoints,
  FormLayout,
  HelpBox,
  PageLayout,
  TiersIcon,
} from "mds";
import PageHeaderWrapper from "../../Common/PageHeaderWrapper/PageHeaderWrapper";
import HelpMenu from "../../HelpMenu";
import { setHelpName } from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";

const TierTypeSelector = () => {
  const navigate = useNavigate();

  const typeSelect = (selectName: string) => {
    navigate(`${IAM_PAGES.TIERS_ADD}/${selectName}`);
  };
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setHelpName("tier-type-selector"));
  }, [dispatch]);

  return (
    <Fragment>
      <PageHeaderWrapper
        label={
          <Fragment>
            <BackLink
              label="Tier Types"
              onClick={() => navigate(IAM_PAGES.TIERS)}
            />
          </Fragment>
        }
        actions={<HelpMenu />}
      />

      <PageLayout>
        <FormLayout
          title={"Select Tier Type"}
          icon={<TiersIcon />}
          helpBox={
            <HelpBox
              iconComponent={<TiersIcon />}
              title={"Tier Types"}
              help={
                <Fragment>
                  MinIO supports creating object transition lifecycle management
                  rules, where MinIO can automatically move an object to a
                  remote storage “tier”.
                  <br />
                  <br />
                  MinIO supports the following Tier types:
                  <br />
                  <ul>
                    <li>
                      <a
                        href="https://min.io/docs/minio/kubernetes/upstream/administration/object-management/transition-objects-to-s3.html#minio-lifecycle-management-transition-to-s3?ref=con"
                        target="_blank"
                        rel="noopener"
                      >
                        MinIO or other S3-compatible storage
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://min.io/docs/minio/kubernetes/upstream/administration/object-management/transition-objects-to-s3.html#minio-lifecycle-management-transition-to-s3?ref=con"
                        target="_blank"
                        rel="noopener"
                      >
                        Amazon S3
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://min.io/docs/minio/kubernetes/upstream/administration/object-management/transition-objects-to-gcs.html#minio-lifecycle-management-transition-to-gcs?ref=con"
                        target="_blank"
                        rel="noopener"
                      >
                        Google Cloud Storage
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://min.io/docs/minio/kubernetes/upstream/administration/object-management/transition-objects-to-azure.html#minio-lifecycle-management-transition-to-azure?ref=con"
                        target="_blank"
                        rel="noopener"
                      >
                        Microsoft Azure Blob Storage
                      </a>
                    </li>
                  </ul>
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
              gridTemplateColumns: "repeat(2, 1fr)",
              [`@media (max-width: ${breakPoints.md}px)`]: {
                gridTemplateColumns: "repeat(1, 1fr)",
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
