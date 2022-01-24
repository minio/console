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
import { connect } from "react-redux";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { LinearProgress } from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { containerForHeader } from "../Common/FormComponents/common/styleLibrary";
import {
  SubnetLoginRequest,
  SubnetLoginResponse,
  SubnetLoginWithMFARequest,
  SubnetOrganization,
  SubnetRegisterRequest,
  SubnetRegTokenResponse,
} from "./types";
import { setModalErrorSnackMessage } from "../../../actions";
import { ErrorResponseHandler } from "../../../common/types";
import ModalWrapper from "../Common/ModalWrapper/ModalWrapper";
import InputBoxWrapper from "../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import api from "../../../common/api";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import { formFieldStyles } from "../Common/FormComponents/common/styleLibrary";
import RadioGroupSelector from "../Common/FormComponents/RadioGroupSelector/RadioGroupSelector";
import Link from "@mui/material/Link";

const styles = (theme: Theme) =>
  createStyles({
    subnetLicenseKey: {},
    subnetLoginForm: {},
    licenseKeyField: {},
    pageTitle: {
      marginBottom: 20,
    },
    registrationMode: {
      cursor: "pointer",
    },
    button: {
      textTransform: "none",
      fontSize: 15,
      fontWeight: 700,
      background:
        "transparent linear-gradient(90deg, #073052 0%, #081c42 100%) 0% 0% no-repeat padding-box",
      color: "#fff",
    },
    buttonSignup: {
      textTransform: "none",
      fontSize: 15,
      fontWeight: 700,
      marginLeft: 15,
    },
    ...formFieldStyles,
    ...containerForHeader(theme.spacing(4)),
  });

interface IActivationModal {
  classes: any;
  open: boolean;
  closeModal: () => void;
  setModalErrorSnackMessage: typeof setModalErrorSnackMessage;
}

const ActivationModal = ({
  classes,
  open,
  closeModal,
  setModalErrorSnackMessage,
}: IActivationModal) => {
  const [license, setLicense] = useState<string>("");
  const [subnetPassword, setSubnetPassword] = useState<string>("");
  const [subnetEmail, setSubnetEmail] = useState<string>("");
  const [subnetMFAToken, setSubnetMFAToken] = useState<string>("");
  const [subnetOTP, setSubnetOTP] = useState<string>("");
  const [subnetAccessToken, setSubnetAccessToken] = useState<string>("");
  const [selectedSubnetOrganisation, setSelectedSubnetOrganisation] =
    useState<string>("");
  const [subnetRegToken, setSubnetRegToken] = useState<string>("");
  const [subnetOrganizations, setSubnetOrganizations] = useState<
    SubnetOrganization[]
  >([]);
  const [onlineActivation, setOnlineActivation] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(false);

  const clearForm = () => {
    setLicense("");
    setSubnetPassword("");
    setSubnetEmail("");
    setSubnetMFAToken("");
    setSubnetOTP("");
  };

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
        setLoading(false);
        setModalErrorSnackMessage(err);
      });
  };

  const subnetRegister = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    if (subnetAccessToken && selectedSubnetOrganisation) {
      const request: SubnetRegisterRequest = {
        token: subnetAccessToken,
        account_id: selectedSubnetOrganisation,
      };
      api
        .invoke("POST", "/api/v1/subnet/register", request)
        .then(() => {
          setLoading(false);
          clearForm();
          closeModal();
        })
        .catch((err: ErrorResponseHandler) => {
          setLoading(false);
          setModalErrorSnackMessage(err);
        });
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
          setSubnetAccessToken(resp.access_token);
          setSubnetOrganizations(resp.organizations);
          setSelectedSubnetOrganisation(
            resp.organizations[0].accountId.toString()
          );
        }
      })
      .catch((err: ErrorResponseHandler) => {
        setLoading(false);
        setSubnetOTP("");
        setModalErrorSnackMessage(err);
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
          closeModal();
        } else if (resp && resp.mfa_token) {
          setSubnetMFAToken(resp.mfa_token);
        } else if (resp && resp.access_token && resp.organizations.length > 0) {
          setSubnetAccessToken(resp.access_token);
          setSubnetOrganizations(resp.organizations);
          setSelectedSubnetOrganisation(
            resp.organizations[0].accountId.toString()
          );
        }
      })
      .catch((err: ErrorResponseHandler) => {
        setLoading(false);
        clearForm();
        setModalErrorSnackMessage(err);
      });
  };

  let clusterRegistrationForm: JSX.Element;
  if (subnetAccessToken && subnetOrganizations.length > 0) {
    clusterRegistrationForm = (
      <Fragment>
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom component="div">
            Register MinIO cluster
          </Typography>
        </Grid>
        <Grid item xs={12} className={classes.formFieldRow}>
          <RadioGroupSelector
            tooltip={"Please choose the organization for this cluster."}
            currentSelection={selectedSubnetOrganisation}
            id="subnet-organisation"
            name="subnet-organisation"
            label="Select an Organisation"
            onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
              setSelectedSubnetOrganisation(e.target.value as string);
            }}
            selectorOptions={subnetOrganizations.map((organisation) => ({
              value: organisation.accountId.toString(),
              label: organisation.company,
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
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom component="div">
            Two-Factor Authentication
          </Typography>
          <Typography variant="caption" display="block" gutterBottom>
            Please enter the 6-digit verification code that was sent to your
            email address. This code will be valid for 5 minutes.
          </Typography>
        </Grid>
        <Grid item xs={12} className={classes.formFieldRow}>
          <InputBoxWrapper
            overlayIcon={<LockOutlinedIcon />}
            id="subnet-otp"
            name="subnet-otp"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setSubnetOTP(event.target.value);
            }}
            placeholder=""
            label=""
            type="text"
            value={subnetOTP}
          />
        </Grid>
        <Grid item xs={12} className={classes.formFieldRow}>
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
        <Grid item xs={12} className={classes.formFieldRow}>
          <InputBoxWrapper
            overlayIcon={<PersonOutlineOutlinedIcon />}
            id="subnet-email"
            name="subnet-email"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setSubnetEmail(event.target.value);
            }}
            placeholder="email"
            label=""
            type="text"
            value={subnetEmail}
          />
        </Grid>
        <Grid item xs={12} className={classes.formFieldRow}>
          <InputBoxWrapper
            overlayIcon={<LockOutlinedIcon />}
            id="subnet-password"
            name="subnet-password"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setSubnetPassword(event.target.value);
            }}
            placeholder="password"
            label=""
            type="password"
            value={subnetPassword}
          />
        </Grid>
        <Grid item xs={12} className={classes.formFieldRow}>
          <Button
            color="primary"
            onClick={() => subnetLogin()}
            disabled={
              loading ||
              subnetEmail.trim().length === 0 ||
              subnetPassword.trim().length === 0
            }
            variant="contained"
          >
            Login
          </Button>
          <Button
            className={classes.buttonSignup}
            color="primary"
            target="_blank"
            rel="noopener noreferrer"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.open("https://min.io/pricing", "_blank");
            }}
            variant="outlined"
          >
            Sign Up
          </Button>
        </Grid>
        <Typography variant="caption" display="block" gutterBottom>
          <Link
            className={classes.registrationMode}
            color="inherit"
            onClick={() => {
              fetchSubnetRegToken();
              setOnlineActivation(false);
            }}
          >
            Offline Activation
          </Link>
        </Typography>
      </Fragment>
    );
  }

  return open ? (
    <ModalWrapper
      title=""
      modalOpen={open}
      onClose={() => {
        setLicense("");
        setSubnetPassword("");
        setSubnetEmail("");
        closeModal();
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Grid container alignItems="center" item xs={12}>
        <Grid item xs={12}>
          <Typography component="h2" variant="h6" className={classes.pageTitle}>
            Activate SUBNET License
          </Typography>
        </Grid>
        {onlineActivation ? (
          <Grid item className={classes.subnetLoginForm} xs={12}>
            <Grid container>{clusterRegistrationForm}</Grid>
          </Grid>
        ) : (
          <Grid item className={classes.subnetLicenseKey} xs={12}>
            <Typography variant="caption" display="block" gutterBottom>
              Step 1: Copy the following registration token
            </Typography>
            <Grid item xs={12} className={classes.formFieldRow}>
              <InputBoxWrapper
                onChange={() => {}}
                id="registration-token"
                name="registration-token"
                placeholder=""
                label=""
                type="text"
                value={subnetRegToken}
                disabled
              />
            </Grid>
            <Grid item xs={12} className={classes.formFieldRow}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigator.clipboard.writeText(subnetRegToken)}
              >
                Copy
              </Button>
            </Grid>
            <Typography variant="caption" display="block" gutterBottom>
              Step 2: Use the previous token to register your cluster at:{" "}
              <Link
                color="inherit"
                href="https://subnet.min.io/cluster/register"
                target="_blank"
              >
                https://subnet.min.io/cluster/register
              </Link>
            </Typography>
            <Typography variant="caption" display="block" gutterBottom>
              Step 3: Enter the API key generated by SUBNET
            </Typography>
            <Grid item xs={12} className={classes.formFieldRow}>
              <InputBoxWrapper
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
            <Grid item xs={12} className={classes.formFieldRow}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => subnetLogin()}
                disabled={loading || license.trim().length === 0}
              >
                Activate
              </Button>
            </Grid>
            <Typography variant="caption" display="block" gutterBottom>
              <Link
                className={classes.registrationMode}
                color="inherit"
                onClick={() => setOnlineActivation(true)}
              >
                Online Activation
              </Link>
            </Typography>
          </Grid>
        )}
      </Grid>
      {loading && (
        <Grid item xs={12}>
          <LinearProgress />
        </Grid>
      )}
    </ModalWrapper>
  ) : null;
};

const mapDispatchToProps = {
  setModalErrorSnackMessage,
};

const connector = connect(null, mapDispatchToProps);

export default withStyles(styles)(connector(ActivationModal));
