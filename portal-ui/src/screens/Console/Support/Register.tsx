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

import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import {
  actionsTray,
  containerForHeader,
  searchField,
} from "../Common/FormComponents/common/styleLibrary";
import withStyles from "@mui/styles/withStyles";
import { Button, Grid, Link, Typography } from "@mui/material";
import PageHeader from "../Common/PageHeader/PageHeader";
import PageLayout from "../Common/Layout/PageLayout";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { CopyIcon, UsersIcon } from "../../../icons";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import OnlineRegistrationIcon from "../../../icons/OnlineRegistrationIcon";
import OfflineRegistrationIcon from "../../../icons/OfflineRegistrationIcon";
import InputBoxWrapper from "../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import clsx from "clsx";
import OnlineRegistrationBackIcon from "../../../icons/OnlineRegistrationBackIcon";
import api from "../../../common/api";

import {
  SubnetInfo,
  SubnetLoginRequest,
  SubnetLoginResponse,
  SubnetLoginWithMFARequest,
  SubnetOrganization,
  SubnetRegisterRequest,
  SubnetRegTokenResponse,
} from "../License/types";
import { ErrorResponseHandler } from "../../../common/types";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SelectWrapper from "../Common/FormComponents/SelectWrapper/SelectWrapper";
import { hasPermission } from "../../../common/SecureComponent/SecureComponent";
import {
  CONSOLE_UI_RESOURCE,
  IAM_PAGES,
  IAM_PAGES_PERMISSIONS,
} from "../../../common/SecureComponent/permissions";
import { connect } from "react-redux";
import { setErrorSnackMessage } from "../../../actions";
import HelpBox from "../../../common/HelpBox";
import SettingsIcon from "../../../icons/SettingsIcon";
import RegisterStatus from "./RegisterStatus";

interface IRegister {
  classes: any;
  displayErrorMessage: typeof setErrorSnackMessage;
}

const styles = (theme: Theme) =>
  createStyles({
    loading: {
      paddingTop: 8,
      paddingLeft: 40,
    },
    buttons: {
      justifyContent: "flex-start",
      gap: 20,
    },
    localMessage: {
      fontSize: 24,
      color: "#07193E",
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 10,
    },
    registerActivationIcon: {
      color: theme.palette.primary.main,
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 20,
      "& .min-icon": {
        width: 32.12,
        height: 25,
        marginRight: 10,
        verticalAlign: "middle",
      },
    },
    registerActivationMode: {
      textAlign: "right",
      "& a": {
        cursor: "pointer",
      },
    },
    subnetDescription: {
      textAlign: "left",
      Font: "normal normal normal 14px/17px Lato",
      letterSpacing: 0,
      color: "#000000",
      "& span": {
        fontWeight: "bold",
      },
    },
    subnetLoginInputBoxWrapper: {
      paddingRight: 20,
    },
    registeredStatus: {
      border: "1px solid #E2E2E2",
      padding: "24px 24px 24px 24px",
      borderRadius: 2,
      marginBottom: 25,
      backgroundColor: "#FBFAFA",
      "& .min-icon": {
        width: 20,
        height: 20,
        marginLeft: 48,
        marginRight: 13,
        verticalAlign: "middle",
        marginTop: -3,
      },
      "& span": {
        fontWeight: "bold",
      },
    },
    offlineRegisterButton: {
      textAlign: "right",
      paddingRight: 20,
    },
    copyInputBox: {
      "& button": {
        border: "1px solid #5E5E5E",
        borderRadius: 2,
      },
    },
    link: {
      color: "#2781B0",
    },
    ...actionsTray,
    ...searchField,
    ...containerForHeader(theme.spacing(4)),
  });

const Register = ({ classes, displayErrorMessage }: IRegister) => {
  const [license, setLicense] = useState<string>("");
  const [subnetPassword, setSubnetPassword] = useState<string>("");
  const [subnetEmail, setSubnetEmail] = useState<string>("");
  const [subnetMFAToken, setSubnetMFAToken] = useState<string>("");
  const [subnetOTP, setSubnetOTP] = useState<string>("");
  const [subnetAccessToken, setSubnetAccessToken] = useState<string>("");
  const [selectedSubnetOrganization, setSelectedSubnetOrganization] =
    useState<string>("");
  const [subnetRegToken, setSubnetRegToken] = useState<string>("");
  const [subnetOrganizations, setSubnetOrganizations] = useState<
    SubnetOrganization[]
  >([]);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [onlineActivation, setOnlineActivation] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingLicenseInfo, setLoadingLicenseInfo] = useState<boolean>(false);
  const [clusterRegistered, setClusterRegistered] = useState<boolean>(false);
  const [initialLicenseLoading, setInitialLicenseLoading] =
    useState<boolean>(true);

  const clearForm = () => {
    setSubnetAccessToken("");
    setSelectedSubnetOrganization("");
    setSubnetRegToken("");
    setShowPassword(false);
    setOnlineActivation(true);
    setSubnetOrganizations([]);
    setLicense("");
    setSubnetPassword("");
    setSubnetEmail("");
    setSubnetMFAToken("");
    setSubnetOTP("");
  };

  const getSubnetInfo = hasPermission(
    CONSOLE_UI_RESOURCE,
    IAM_PAGES_PERMISSIONS[IAM_PAGES.LICENSE],
    true
  );

  const fetchLicenseInfo = useCallback(() => {
    if (loadingLicenseInfo) {
      return;
    }
    if (getSubnetInfo) {
      setLoadingLicenseInfo(true);
      api
        .invoke("GET", `/api/v1/subnet/info`)
        .then((res: SubnetInfo) => {
          setClusterRegistered(true);
          setLoadingLicenseInfo(false);
        })
        .catch((err: ErrorResponseHandler) => {
          if (err.errorMessage !== "License not found") {
            displayErrorMessage(err);
          }
          setClusterRegistered(false);
          setLoadingLicenseInfo(false);
        });
    } else {
      setLoadingLicenseInfo(false);
    }
  }, [loadingLicenseInfo, getSubnetInfo, displayErrorMessage]);

  const fetchSubnetRegToken = () => {
    if (loading || subnetRegToken) {
      return;
    }
    setLoading(true);
    api
      .invoke("GET", "/api/v1/subnet/registration-token")
      .then((resp: SubnetRegTokenResponse) => {
        setLoading(false);
        if (resp && resp.regToken) {
          setSubnetRegToken(resp.regToken);
        }
      })
      .catch((err: ErrorResponseHandler) => {
        console.log(err);
        displayErrorMessage(err);
        setLoading(false);
      });
  };

  const callRegister = (token: string, account_id: string) => {
    const request: SubnetRegisterRequest = {
      token: token,
      account_id: account_id,
    };
    api
      .invoke("POST", "/api/v1/subnet/register", request)
      .then(() => {
        setLoading(false);
        clearForm();
        fetchLicenseInfo();
      })
      .catch((err: ErrorResponseHandler) => {
        displayErrorMessage(err);
        setLoading(false);
      });
  };
  const subnetRegister = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    if (subnetAccessToken && selectedSubnetOrganization) {
      callRegister(subnetAccessToken, selectedSubnetOrganization);
    }
  };

  const subnetLoginWithMFA = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const request: SubnetLoginWithMFARequest = {
      username: subnetEmail,
      otp: subnetOTP,
      mfa_token: subnetMFAToken,
    };
    api
      .invoke("POST", "/api/v1/subnet/login/mfa", request)
      .then((resp: SubnetLoginResponse) => {
        setLoading(false);
        if (resp && resp.access_token && resp.organizations.length > 0) {
          if (resp.organizations.length === 1) {
            callRegister(
              resp.access_token,
              resp.organizations[0].accountId.toString()
            );
          } else {
            setSubnetAccessToken(resp.access_token);
            setSubnetOrganizations(resp.organizations);
            setSelectedSubnetOrganization(
              resp.organizations[0].accountId.toString()
            );
          }
        }
      })
      .catch((err: ErrorResponseHandler) => {
        displayErrorMessage(err);
        setLoading(false);
        setSubnetOTP("");
      });
  };

  const subnetLogin = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    let request: SubnetLoginRequest = {
      username: subnetEmail,
      password: subnetPassword,
      apiKey: license,
    };
    api
      .invoke("POST", "/api/v1/subnet/login", request)
      .then((resp: SubnetLoginResponse) => {
        setLoading(false);
        if (resp && resp.registered) {
          clearForm();
          fetchLicenseInfo();
        } else if (resp && resp.mfa_token) {
          setSubnetMFAToken(resp.mfa_token);
        } else if (resp && resp.access_token && resp.organizations.length > 0) {
          setSubnetAccessToken(resp.access_token);
          setSubnetOrganizations(resp.organizations);
          setSelectedSubnetOrganization(
            resp.organizations[0].accountId.toString()
          );
        }
      })
      .catch((err: ErrorResponseHandler) => {
        displayErrorMessage(err);
        setLoading(false);
        clearForm();
      });
  };

  useEffect(() => {
    if (initialLicenseLoading) {
      fetchLicenseInfo();
      setInitialLicenseLoading(false);
    }
  }, [fetchLicenseInfo, initialLicenseLoading, setInitialLicenseLoading]);

  const title = onlineActivation ? (
    <Fragment>
      <OnlineRegistrationIcon />
      Online Activation SUBNET License
    </Fragment>
  ) : (
    <Fragment>
      <OfflineRegistrationIcon />
      Offline Activating SUBNET License
    </Fragment>
  );

  let clusterRegistrationForm: JSX.Element;

  if (onlineActivation) {
    if (subnetAccessToken && subnetOrganizations.length > 0) {
      clusterRegistrationForm = (
        <Fragment>
          <Grid item xs={12} className={classes.subnetDescription}>
            <Typography>Register MinIO cluster</Typography>
          </Grid>
          <br />
          <Grid item xs={4} className={classes.actionsTray}>
            <SelectWrapper
              id="subnet-organization"
              name="subnet-organization"
              onChange={(e) =>
                setSelectedSubnetOrganization(e.target.value as string)
              }
              label="Select an organization"
              value={selectedSubnetOrganization}
              options={subnetOrganizations.map((organization) => ({
                label: organization.company,
                value: organization.accountId.toString(),
              }))}
            />
          </Grid>
          <Grid item xs={12} className={classes.formFieldRow}>
            <Button
              className={classes.button}
              color="primary"
              onClick={() => subnetRegister()}
              disabled={loading || subnetAccessToken.trim().length === 0}
              variant="contained"
            >
              Register
            </Button>
          </Grid>
        </Fragment>
      );
    } else if (subnetMFAToken) {
      clusterRegistrationForm = (
        <Fragment>
          <Grid item xs={12} className={classes.subnetDescription}>
            <Typography>Two-Factor Authentication</Typography>
            <Typography variant="caption" display="block" gutterBottom>
              Please enter the 6-digit verification code that was sent to your
              email address. This code will be valid for 5 minutes.
            </Typography>
          </Grid>
          <br />
          <Grid item xs={3} className={clsx(classes.actionsTray)}>
            <InputBoxWrapper
              overlayIcon={<LockOutlinedIcon />}
              id="subnet-otp"
              name="subnet-otp"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setSubnetOTP(event.target.value)
              }
              placeholder=""
              label=""
              value={subnetOTP}
            />
            <Button
              color="primary"
              onClick={() => subnetLoginWithMFA()}
              disabled={
                loading ||
                subnetOTP.trim().length === 0 ||
                subnetMFAToken.trim().length === 0
              }
              variant="contained"
            >
              Verify
            </Button>
          </Grid>
        </Fragment>
      );
    } else {
      clusterRegistrationForm = (
        <Fragment>
          <Grid item xs={12} className={classes.subnetDescription}>
            The MinIO Subscription Network (SUBNET for short) is a simple, yet
            powerful software stack that ensures commercial customers are
            getting the very best out of their MinIO instances. SUBNET is priced
            on capacity - just like cloud storage and comes in two
            configurations, Standard and Enterprise.
          </Grid>
          <br />
          <Grid item xs={12} className={classes.subnetDescription}>
            You can use your credentials from SUBNET to register.{" "}
            <Link
              className={classes.link}
              color="inherit"
              target="_blank"
              href="https://min.io/product/subnet"
            >
              Learn more about SUBNET.
            </Link>
          </Grid>
          <br />
          <Grid item xs={12} className={clsx(classes.actionsTray)}>
            <InputBoxWrapper
              className={classes.subnetLoginInputBoxWrapper}
              id="subnet-email"
              name="subnet-email"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setSubnetEmail(event.target.value)
              }
              label="Email"
              value={subnetEmail}
              noLabelMinWidth
              overlayIcon={<UsersIcon />}
            />
            <InputBoxWrapper
              className={classes.subnetLoginInputBoxWrapper}
              id="subnet-password"
              name="subnet-password"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setSubnetPassword(event.target.value)
              }
              label="Password"
              type={showPassword ? "text" : "password"}
              value={subnetPassword}
              noLabelMinWidth
              overlayIcon={
                showPassword ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />
              }
              overlayAction={() => setShowPassword(!showPassword)}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={
                loading ||
                subnetEmail.trim().length === 0 ||
                subnetPassword.trim().length === 0
              }
              onClick={() => subnetLogin()}
            >
              Register
            </Button>
          </Grid>
        </Fragment>
      );
    }
  } else {
    clusterRegistrationForm = (
      <Fragment>
        <Grid item xs={12} className={classes.subnetDescription}>
          <span>Step 1:</span> Copy the following registration token
        </Grid>
        <Grid item xs={12} className={clsx(classes.actionsTray)}>
          <InputBoxWrapper
            className={clsx(
              classes.subnetLoginInputBoxWrapper,
              classes.copyInputBox
            )}
            id="registration-token"
            name="registration-token"
            placeholder=""
            label=""
            type="text"
            onChange={() => {}}
            value={subnetRegToken}
            disabled
            overlayIcon={<CopyIcon />}
            overlayAction={() => navigator.clipboard.writeText(subnetRegToken)}
          />
        </Grid>
        <Grid item xs={12} className={classes.subnetDescription}>
          <span>Step 2:</span> Use the previous token to register your cluster
          at:{" "}
          <Link
            className={classes.link}
            color="inherit"
            href="https://subnet.min.io/cluster/register"
            target="_blank"
          >
            https://subnet.min.io/cluster/register
          </Link>
        </Grid>
        <br />
        <Grid item xs={12} className={classes.subnetDescription}>
          <span>Step 3:</span> Enter the API key generated by SUBNET
        </Grid>
        <Grid item xs={12} className={clsx(classes.actionsTray)}>
          <InputBoxWrapper
            className={classes.subnetLoginInputBoxWrapper}
            value={license}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setLicense(event.target.value)
            }
            id="api-key"
            name="api-key"
            placeholder=""
            label=""
            type="text"
          />
        </Grid>
        <Grid item xs={12} className={classes.offlineRegisterButton}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => subnetLogin()}
            disabled={loading || license.trim().length === 0}
          >
            Register
          </Button>
        </Grid>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <PageHeader label="Register" />
      <PageLayout>
        <Grid item xs={12} className={classes.boxy}>
          {clusterRegistered && <RegisterStatus />}
          <Grid container>
            <Grid item xs={6} className={classes.registerActivationIcon}>
              {title}
            </Grid>
            <Grid item xs={6} className={classes.registerActivationMode}>
              {onlineActivation ? (
                <Fragment />
              ) : (
                <Fragment>
                  <OnlineRegistrationBackIcon />
                  <Link
                    className={classes.link}
                    onClick={() => setOnlineActivation(!onlineActivation)}
                  >
                    Back to Online Activation
                  </Link>
                </Fragment>
              )}
            </Grid>
          </Grid>

          {clusterRegistrationForm}
        </Grid>
        {onlineActivation && (
          <Grid item xs={12} marginTop={"15px"}>
            <HelpBox
              title={"Proxy Configuration"}
              iconComponent={<SettingsIcon />}
              help={
                <Fragment>
                  For airgap/firewalled environments it is possible to configure
                  a proxy to connect to Subnet.
                  <br />
                  <br />
                  Alternatively you can try{" "}
                  <Link
                    className={classes.link}
                    onClick={() => {
                      fetchSubnetRegToken();
                      setOnlineActivation(!onlineActivation);
                    }}
                  >
                    Offline Activation.
                  </Link>
                </Fragment>
              }
            />
          </Grid>
        )}
      </PageLayout>
    </Fragment>
  );
};

const connector = connect(null, {
  displayErrorMessage: setErrorSnackMessage,
});

export default withStyles(styles)(connector(Register));
