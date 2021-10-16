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

import React, { useState } from "react";
import { connect } from "react-redux";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { LinearProgress, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { containerForHeader } from "../Common/FormComponents/common/styleLibrary";
import { SubscriptionActivateRequest } from "../Buckets/types";
import { setModalErrorSnackMessage } from "../../../actions";
import { ErrorResponseHandler } from "../../../common/types";
import ModalWrapper from "../Common/ModalWrapper/ModalWrapper";
import InputBoxWrapper from "../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import api from "../../../common/api";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const styles = (theme: Theme) =>
  createStyles({
    errorBlock: {
      color: "red",
    },
    subnetLicenseKey: {
      padding: "10px 10px 10px 0px",
      borderRight: "1px solid rgba(0, 0, 0, 0.12)",
      opacity: 0.5,
      "&:hover": { opacity: 1 },
    },
    subnetLoginForm: {
      padding: "10px 0px 10px 10px",
      opacity: 0.5,
      "&:hover": { opacity: 1 },
    },
    licenseKeyField: {},
    pageTitle: {
      marginBottom: 20,
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
  const [loading, setLoading] = useState<boolean>(false);

  const activateProduct = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    let request: SubscriptionActivateRequest = {
      license: license,
      email: subnetEmail,
      password: subnetPassword,
    };
    api
      .invoke("POST", "/api/v1/subscription/validate", request)
      .then(() => {
        setLoading(false);
        setLicense("");
        setSubnetPassword("");
        setSubnetEmail("");
        closeModal();
      })
      .catch((err: ErrorResponseHandler) => {
        setLoading(false);
        setLicense("");
        setSubnetPassword("");
        setSubnetEmail("");
        setModalErrorSnackMessage(err);
      });
  };

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
        <Grid item className={classes.subnetLicenseKey} xs={6}>
          <Grid item xs={12}>
            <Typography variant="caption" display="block" gutterBottom>
              Enter your license key here
            </Typography>
          </Grid>
          <TextField
            id="license-key"
            placeholder=""
            multiline
            rows={3}
            value={license}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setLicense(event.target.value)
            }
            fullWidth
            className={classes.licenseKeyField}
            variant="outlined"
          />
          <br />
          <br />
          <Button
            variant="contained"
            color="primary"
            onClick={() => activateProduct()}
            disabled={loading || license.trim().length === 0}
          >
            Activate
          </Button>
        </Grid>
        <Grid item className={classes.subnetLoginForm} xs={6}>
          <Grid container>
            <Grid item xs={12}>
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
            <Grid item xs={12}>
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
            <Grid item xs={12}>
              <Button
                className={classes.button}
                color="primary"
                onClick={() => activateProduct()}
                disabled={
                  loading ||
                  subnetEmail.trim().length === 0 ||
                  subnetPassword.trim().length === 0
                }
                variant="contained"
              >
                Activate
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
          </Grid>
        </Grid>
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
