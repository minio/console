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
import { Box, PageLayout, Tabs } from "mds";
import { SubnetRegTokenResponse } from "../License/types";
import { ErrorResponseHandler } from "../../../common/types";
import { useSelector } from "react-redux";
import { setErrorSnackMessage, setHelpName } from "../../../systemSlice";
import { AppState, useAppDispatch } from "../../../store";
import { ClusterRegistered, ProxyConfiguration } from "./utils";
import { fetchLicenseInfo } from "./registerThunks";
import {
  resetRegisterForm,
  setCurTab,
  setLoading,
  setSubnetRegToken,
} from "./registerSlice";
import OfflineRegistration from "./OfflineRegistration";
import SubnetMFAToken from "./SubnetMFAToken";
import ClusterRegistrationForm from "./ClusterRegistrationForm";
import OnlineRegistration from "./OnlineRegistration";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";
import HelpMenu from "../HelpMenu";
import api from "../../../common/api";
import ApiKeyRegister from "./ApiKeyRegister";

const Register = () => {
  const dispatch = useAppDispatch();

  const subnetMFAToken = useSelector(
    (state: AppState) => state.register.subnetMFAToken,
  );
  const subnetAccessToken = useSelector(
    (state: AppState) => state.register.subnetAccessToken,
  );

  const subnetRegToken = useSelector(
    (state: AppState) => state.register.subnetRegToken,
  );
  const subnetOrganizations = useSelector(
    (state: AppState) => state.register.subnetOrganizations,
  );

  const loading = useSelector((state: AppState) => state.register.loading);
  const loadingLicenseInfo = useSelector(
    (state: AppState) => state.register.loadingLicenseInfo,
  );
  const clusterRegistered = useSelector(
    (state: AppState) => state.register.clusterRegistered,
  );
  const licenseInfo = useSelector(
    (state: AppState) => state.register.licenseInfo,
  );
  const curTab = useSelector((state: AppState) => state.register.curTab);

  const [initialLicenseLoading, setInitialLicenseLoading] =
    useState<boolean>(true);

  useEffect(() => {
    // when unmounted, reset
    return () => {
      dispatch(resetRegisterForm());
    };
  }, [dispatch]);

  useEffect(() => {
    if (curTab === "simple-tab-2" && !loading && !subnetRegToken) {
      const fetchSubnetRegToken = () => {
        dispatch(setLoading(true));
        api
          .invoke("GET", "/api/v1/subnet/registration-token")
          .then((resp: SubnetRegTokenResponse) => {
            dispatch(setLoading(false));
            if (resp && resp.regToken) {
              dispatch(setSubnetRegToken(resp.regToken));
            }
          })
          .catch((err: ErrorResponseHandler) => {
            console.error(err);
            dispatch(setErrorSnackMessage(err));
            dispatch(setLoading(false));
          });
      };
      fetchSubnetRegToken();
    }
  }, [curTab, loading, subnetRegToken, dispatch]);

  useEffect(() => {
    if (initialLicenseLoading) {
      dispatch(fetchLicenseInfo());
      setInitialLicenseLoading(false);
    }
  }, [initialLicenseLoading, setInitialLicenseLoading, dispatch]);

  let clusterRegistrationForm: React.ReactElement = <Fragment />;

  if (subnetAccessToken && subnetOrganizations.length > 0) {
    clusterRegistrationForm = <ClusterRegistrationForm />;
  } else if (subnetMFAToken) {
    clusterRegistrationForm = <SubnetMFAToken />;
  } else {
    clusterRegistrationForm = <OnlineRegistration />;
  }

  const apiKeyRegistration = (
    <Fragment>
      <Box
        withBorders
        sx={{
          display: "flex",
          flexFlow: "column",
          padding: "43px",
        }}
      >
        {clusterRegistered && licenseInfo ? (
          <ClusterRegistered email={licenseInfo.email} />
        ) : (
          <ApiKeyRegister registerEndpoint={"/api/v1/subnet/login"} />
        )}
      </Box>
      <ProxyConfiguration />
    </Fragment>
  );

  const offlineRegistration = <OfflineRegistration />;

  const regUi = (
    <Fragment>
      <Box
        withBorders
        sx={{
          display: "flex",
          flexFlow: "column",
          padding: "43px",
        }}
      >
        {clusterRegistered && licenseInfo ? (
          <ClusterRegistered email={licenseInfo.email} />
        ) : (
          clusterRegistrationForm
        )}
      </Box>

      {!clusterRegistered && <ProxyConfiguration />}
    </Fragment>
  );

  const loadingUi = <div>Loading..</div>;
  const uiToShow = loadingLicenseInfo ? loadingUi : regUi;

  useEffect(() => {
    dispatch(setHelpName("register"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <PageHeaderWrapper
        label="Register to MinIO Subscription Network"
        actions={<HelpMenu />}
      />

      <PageLayout>
        <Tabs
          horizontal
          currentTabOrPath={curTab}
          onTabClick={(newValue: string) => {
            dispatch(setCurTab(newValue));
          }}
          options={[
            {
              tabConfig: {
                label: "Credentials",
                id: "simple-tab-0",
              },
              content: uiToShow,
            },
            {
              tabConfig: {
                label: "API Key",
                id: "simple-tab-1",
              },
              content: apiKeyRegistration,
            },
            {
              tabConfig: {
                label: "Air-Gap",
                id: "simple-tab-2",
              },
              content: offlineRegistration,
            },
          ]}
        />
      </PageLayout>
    </Fragment>
  );
};

export default Register;
