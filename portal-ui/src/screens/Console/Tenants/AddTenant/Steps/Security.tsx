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

import React, { useEffect, useCallback, Fragment } from "react";
import { connect } from "react-redux";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Button, Divider, Grid, Paper, Typography } from "@mui/material";
import {
  modalBasic,
  wizardCommon,
} from "../../../Common/FormComponents/common/styleLibrary";
import {
  updateAddField,
  isPageValid,
  addFileToCaCertificates,
  deleteCaCertificate,
  addCaCertificate,
  addKeyPair,
  addFileToKeyPair,
  deleteKeyPair,
} from "../../actions";
import { AppState } from "../../../../../store";
import { KeyPair } from "../../ListTenants/utils";
import FormSwitchWrapper from "../../../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import FileSelector from "../../../Common/FormComponents/FileSelector/FileSelector";

interface ISecurityProps {
  classes: any;
  enableTLS: boolean;
  enableAutoCert: boolean;
  enableCustomCerts: boolean;
  minioCertificates: KeyPair[];
  caCertificates: KeyPair[];
  updateAddField: typeof updateAddField;
  isPageValid: typeof isPageValid;
  addFileToCaCertificates: typeof addFileToCaCertificates;
  deleteCaCertificate: typeof deleteCaCertificate;
  addCaCertificate: typeof addCaCertificate;
  addKeyPair: typeof addKeyPair;
  addFileToKeyPair: typeof addFileToKeyPair;
  deleteKeyPair: typeof deleteKeyPair;
}

const styles = (theme: Theme) =>
  createStyles({
    buttonContainer: {
      textAlign: "right",
    },
    ...modalBasic,
    ...wizardCommon,
  });

const Security = ({
  classes,
  enableTLS,
  enableAutoCert,
  enableCustomCerts,
  minioCertificates,
  caCertificates,
  updateAddField,
  isPageValid,
  addFileToCaCertificates,
  deleteCaCertificate,
  addCaCertificate,
  addKeyPair,
  addFileToKeyPair,
  deleteKeyPair,
}: ISecurityProps) => {
  // Common
  const updateField = useCallback(
    (field: string, value: any) => {
      updateAddField("security", field, value);
    },
    [updateAddField]
  );

  // Validation

  useEffect(() => {
    if (!enableTLS) {
      isPageValid("security", true);
      return;
    }
    if (enableAutoCert) {
      isPageValid("security", true);
      return;
    }
    if (enableCustomCerts) {
      isPageValid("security", true);
      return;
    }
    isPageValid("security", false);
  }, [enableTLS, enableAutoCert, enableCustomCerts, isPageValid]);

  return (
    <Paper className={classes.paperWrapper}>
      <div className={classes.headerElement}>
        <h3 className={classes.h3Section}>Security</h3>
      </div>
      <Grid item xs={12}>
        <FormSwitchWrapper
          value="enableTLS"
          id="enableTLS"
          name="enableTLS"
          checked={enableTLS}
          onChange={(e) => {
            const targetD = e.target;
            const checked = targetD.checked;

            updateField("enableTLS", checked);
          }}
          label={"Enable TLS"}
        />
        Enable TLS for the tenant, this is required for Encryption Configuration
        {enableTLS && (
          <Fragment>
            <br />
            <br />
            <Typography variant="caption" display="block" gutterBottom>
              AutoCert: MinIO Operator will generate all TLS certificates
              automatically
            </Typography>
            <Typography variant="caption" display="block" gutterBottom>
              Custom certificates: Allow user to provide your own certificates
            </Typography>
            <br />
          </Fragment>
        )}
      </Grid>
      {enableTLS && (
        <Fragment>
          <Grid item xs={12}>
            <FormSwitchWrapper
              value="enableAutoCert"
              id="enableAutoCert"
              name="enableAutoCert"
              checked={enableAutoCert}
              onChange={(e) => {
                const targetD = e.target;
                const checked = targetD.checked;

                updateField("enableAutoCert", checked);
              }}
              label={"Enable AutoCert"}
            />
            <FormSwitchWrapper
              value="enableCustomCerts"
              id="enableCustomCerts"
              name="enableCustomCerts"
              checked={enableCustomCerts}
              onChange={(e) => {
                const targetD = e.target;
                const checked = targetD.checked;

                updateField("enableCustomCerts", checked);
              }}
              label={"Custom Certificates"}
            />
          </Grid>
          {enableCustomCerts && (
            <Fragment>
              <Grid container>
                <Grid item xs={12}>
                  <Typography variant="overline" display="block" gutterBottom>
                    MinIO Certificates
                  </Typography>
                </Grid>
                {minioCertificates.map((keyPair: KeyPair) => (
                  <Fragment key={keyPair.id}>
                    <Grid item xs={5}>
                      <FileSelector
                        onChange={(encodedValue, fileName) => {
                          addFileToKeyPair(
                            keyPair.id,
                            "cert",
                            fileName,
                            encodedValue
                          );
                        }}
                        accept=".cer,.crt,.cert,.pem"
                        id="tlsCert"
                        name="tlsCert"
                        label="Cert"
                        value={keyPair.cert}
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <FileSelector
                        onChange={(encodedValue, fileName) => {
                          addFileToKeyPair(
                            keyPair.id,
                            "key",
                            fileName,
                            encodedValue
                          );
                        }}
                        accept=".key,.pem"
                        id="tlsKey"
                        name="tlsKey"
                        label="Key"
                        value={keyPair.key}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <Button
                        onClick={() => {
                          deleteKeyPair(keyPair.id);
                        }}
                        color="secondary"
                      >
                        Remove
                      </Button>
                    </Grid>
                  </Fragment>
                ))}
                <Grid item xs={12}>
                  <Button onClick={addKeyPair} color="primary">
                    Add More
                  </Button>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12}>
                  <br />
                  <Divider />
                  <br />
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12}>
                  <Typography variant="overline" display="block" gutterBottom>
                    MinIO CA Certificates
                  </Typography>
                </Grid>
                {caCertificates.map((keyPair: KeyPair) => (
                  <Fragment key={keyPair.id}>
                    <Grid item xs={10}>
                      <FileSelector
                        onChange={(encodedValue, fileName) => {
                          addFileToCaCertificates(
                            keyPair.id,
                            "cert",
                            fileName,
                            encodedValue
                          );
                        }}
                        accept=".cer,.crt,.cert,.pem"
                        id="tlsCert"
                        name="tlsCert"
                        label="Cert"
                        value={keyPair.cert}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <Button
                        onClick={() => {
                          deleteCaCertificate(keyPair.id);
                        }}
                        color="secondary"
                      >
                        Remove
                      </Button>
                    </Grid>
                  </Fragment>
                ))}
                <Grid item xs={12}>
                  <Button onClick={addCaCertificate} color="primary">
                    Add More
                  </Button>
                </Grid>
              </Grid>
            </Fragment>
          )}
        </Fragment>
      )}
    </Paper>
  );
};

const mapState = (state: AppState) => ({
  enableTLS: state.tenants.createTenant.fields.security.enableTLS,
  enableAutoCert: state.tenants.createTenant.fields.security.enableAutoCert,
  enableCustomCerts:
    state.tenants.createTenant.fields.security.enableCustomCerts,
  minioCertificates: state.tenants.createTenant.certificates.minioCertificates,
  caCertificates: state.tenants.createTenant.certificates.caCertificates,
});

const connector = connect(mapState, {
  updateAddField,
  isPageValid,
  addFileToCaCertificates,
  deleteCaCertificate,
  addCaCertificate,
  addKeyPair,
  addFileToKeyPair,
  deleteKeyPair,
});

export default withStyles(styles)(connector(Security));
