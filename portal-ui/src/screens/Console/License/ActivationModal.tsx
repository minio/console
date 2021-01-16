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
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { LinearProgress } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { containerForHeader } from "../Common/FormComponents/common/styleLibrary";
import { SubscriptionActivateRequest } from "../Buckets/types";
import { setModalErrorSnackMessage } from "../../../actions";
import ModalWrapper from "../Common/ModalWrapper/ModalWrapper";
import InputBoxWrapper from "../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import api from "../../../common/api";

const styles = (theme: Theme) =>
  createStyles({
    errorBlock: {
      color: "red",
    },
    subnetLicenseKey: {
      padding: "10px 10px 10px 0px",
      borderRight: "1px solid rgba(0, 0, 0, 0.12)",
    },
    subnetLoginForm: {
      padding: "10px 0px 10px 10px",
    },
    licenseKeyField: {
      marginBottom: 20,
    },
    pageTitle: {
      marginBottom: 20,
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
      .catch((err) => {
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
        <Grid item className={classes.subnetLicenseKey} xs={6}>
          <Grid item xs={12}>
            <Typography
              component="h2"
              variant="h6"
              className={classes.pageTitle}
            >
              License Key
            </Typography>
          </Grid>
          <TextField
            id="license-key"
            placeholder="Enter your license key here"
            multiline
            rows={6}
            value={license}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setLicense(event.target.value)
            }
            fullWidth
            className={classes.licenseKeyField}
          />
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
          <Grid item xs={12}>
            <Typography
              component="h2"
              variant="h6"
              className={classes.pageTitle}
            >
              Subscription Network (SUBNET)
            </Typography>
          </Grid>
          <Grid container>
            <Grid item xs={12}>
              <InputBoxWrapper
                id="subnet-email"
                name="subnet-email"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setSubnetEmail(event.target.value);
                }}
                label="Email"
                type="text"
                value={subnetEmail}
              />
            </Grid>
            <Grid item xs={12}>
              <InputBoxWrapper
                id="subnet-password"
                name="subnet-password"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setSubnetPassword(event.target.value);
                }}
                label="Password"
                type="password"
                value={subnetPassword}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => activateProduct()}
                disabled={
                  loading ||
                  subnetEmail.trim().length === 0 ||
                  subnetPassword.trim().length === 0
                }
              >
                Login
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
