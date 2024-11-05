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

import React, { Fragment, useCallback, useEffect, useState } from "react";
import { PageLayout, ProgressBar, Grid } from "mds";
import { SubnetInfo } from "./types";
import api from "../../../common/api";
import LicensePlans from "./LicensePlans";
import withSuspense from "../Common/Components/withSuspense";
import { getLicenseConsent } from "./utils";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";
import { setHelpName } from "../../../systemSlice";
import { useAppDispatch } from "../../../store";

const LicenseConsentModal = withSuspense(
  React.lazy(() => import("./LicenseConsentModal")),
);

const License = () => {
  const [activateProductModal, setActivateProductModal] =
    useState<boolean>(false);

  const [licenseInfo, setLicenseInfo] = useState<SubnetInfo>();
  const [currentPlanID, setCurrentPlanID] = useState<number>(0);
  const [loadingLicenseInfo, setLoadingLicenseInfo] = useState<boolean>(false);
  const [initialLicenseLoading, setInitialLicenseLoading] =
    useState<boolean>(true);
  useState<boolean>(false);
  const [clusterRegistered, setClusterRegistered] = useState<boolean>(false);

  const [isLicenseConsentOpen, setIsLicenseConsentOpen] =
    useState<boolean>(false);

  const closeModalAndFetchLicenseInfo = () => {
    setActivateProductModal(false);
    fetchLicenseInfo();
  };

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setHelpName("license"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isRegistered = licenseInfo && clusterRegistered;

  const isAgplConsentDone = getLicenseConsent();

  useEffect(() => {
    const shouldConsent =
      !isRegistered && !isAgplConsentDone && !initialLicenseLoading;

    if (shouldConsent && !loadingLicenseInfo) {
      setIsLicenseConsentOpen(true);
    }
  }, [
    isRegistered,
    isAgplConsentDone,
    initialLicenseLoading,
    loadingLicenseInfo,
  ]);

  const fetchLicenseInfo = useCallback(() => {
    if (loadingLicenseInfo) {
      return;
    }
    setLoadingLicenseInfo(true);
    api
      .invoke("GET", `/api/v1/subnet/info`)
      .then((res: SubnetInfo) => {
        if (res) {
          if (res.plan === "STANDARD") {
            setCurrentPlanID(1);
          } else if (
            ["ENTERPRISE", "ENTERPRISE-LITE", "ENTERPRISE-PLUS"].includes(
              res.plan,
            )
          ) {
            setCurrentPlanID(2);
          } else {
            setCurrentPlanID(1);
          }
          setLicenseInfo(res);
        }
        setClusterRegistered(true);
        setLoadingLicenseInfo(false);
      })
      .catch(() => {
        setClusterRegistered(false);
        setLoadingLicenseInfo(false);
      });
  }, [loadingLicenseInfo]);

  useEffect(() => {
    if (initialLicenseLoading) {
      fetchLicenseInfo();
      setInitialLicenseLoading(false);
    }
  }, [fetchLicenseInfo, initialLicenseLoading, setInitialLicenseLoading]);

  if (loadingLicenseInfo) {
    return (
      <Grid item xs={12}>
        <ProgressBar />
      </Grid>
    );
  }

  return (
    <Fragment>
      <PageHeaderWrapper label="MinIO License and Support Plan" />

      <PageLayout>
        <LicensePlans
          activateProductModal={activateProductModal}
          closeModalAndFetchLicenseInfo={closeModalAndFetchLicenseInfo}
          licenseInfo={licenseInfo}
          currentPlanID={currentPlanID}
          setActivateProductModal={setActivateProductModal}
        />

        <LicenseConsentModal
          isOpen={isLicenseConsentOpen}
          onClose={() => {
            setIsLicenseConsentOpen(false);
          }}
        />
      </PageLayout>
    </Fragment>
  );
};

export default License;
