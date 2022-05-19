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

import React, { Fragment, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Grid, IconButton, Paper } from "@mui/material";
import {
  createTenantCommon,
  modalBasic,
  wizardCommon,
} from "../../../Common/FormComponents/common/styleLibrary";

import { AppState } from "../../../../../store";
import { KeyPair } from "../../ListTenants/utils";
import FormSwitchWrapper from "../../../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import FileSelector from "../../../Common/FormComponents/FileSelector/FileSelector";
import AddIcon from "../../../../../icons/AddIcon";
import RemoveIcon from "../../../../../icons/RemoveIcon";
import SectionTitle from "../../../Common/SectionTitle";
import {
  addCaCertificate,
  addFileToCaCertificates,
  addFileToKeyPair,
  addKeyPair,
  deleteCaCertificate,
  deleteKeyPair,
  isPageValid,
  updateAddField,
} from "../../tenantsSlice";

interface ISecurityProps {
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    minioCertificateRows: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      borderBottom: "1px solid #EAEAEA",
      "&:last-child": {
        borderBottom: 0,
      },
      "@media (max-width: 900px)": {
        flex: 1,
      },
    },
    fileItem: {
      marginRight: 10,
      display: "flex",
      "& div label": {
        minWidth: 50,
      },

      "@media (max-width: 900px)": {
        flexFlow: "column",
      },
    },
    minioCertsContainer: {
      marginBottom: 15,
    },
    minioCACertsRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",

      borderBottom: "1px solid #EAEAEA",
      "&:last-child": {
        borderBottom: 0,
      },
      "@media (max-width: 900px)": {
        flex: 1,

        "& div label": {
          minWidth: 50,
        },
      },
    },
    rowActions: {
      display: "flex",
      justifyContent: "flex-end",
      "@media (max-width: 900px)": {
        flex: 1,
      },
    },
    overlayAction: {
      marginLeft: 10,
      "& svg": {
        maxWidth: 15,
        maxHeight: 15,
      },
      "& button": {
        background: "#EAEAEA",
      },
    },

    ...createTenantCommon,
    ...modalBasic,
    ...wizardCommon,
  });

const Security = ({ classes }: ISecurityProps) => {
  const dispatch = useDispatch();

  const enableTLS = useSelector(
    (state: AppState) => state.tenants.createTenant.fields.security.enableTLS
  );
  const enableAutoCert = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.security.enableAutoCert
  );
  const enableCustomCerts = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.security.enableCustomCerts
  );
  const minioCertificates = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.certificates.minioCertificates
  );
  const caCertificates = useSelector(
    (state: AppState) => state.tenants.createTenant.certificates.caCertificates
  );

  // Common
  const updateField = useCallback(
    (field: string, value: any) => {
      dispatch(
        updateAddField({ pageName: "security", field: field, value: value })
      );
    },
    [dispatch]
  );

  // Validation

  useEffect(() => {
    if (!enableTLS) {
      dispatch(isPageValid({ pageName: "security", valid: true }));
      return;
    }
    if (enableAutoCert) {
      dispatch(isPageValid({ pageName: "security", valid: true }));
      return;
    }
    if (enableCustomCerts) {
      dispatch(isPageValid({ pageName: "security", valid: true }));
      return;
    }
    dispatch(isPageValid({ pageName: "security", valid: false }));
  }, [enableTLS, enableAutoCert, enableCustomCerts, dispatch]);

  return (
    <Paper className={classes.paperWrapper}>
      <div className={classes.headerElement}>
        <h3 className={classes.h3Section}>Security</h3>
      </div>
      <Grid container spacing={1}>
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
            label={"TLS"}
            description={
              "Securing all the traffic using TLS. This is required for Encryption Configuration"
            }
          />
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
                label={"AutoCert"}
                description={
                  "The internode certificates will be generated and managed by MinIO Operator"
                }
              />
            </Grid>
            <Grid item xs={12}>
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
                description={"Certificates used to terminated TLS at MinIO"}
              />
            </Grid>
            {enableCustomCerts && (
              <Fragment>
                <Grid item xs={12} className={classes.minioCertsContainer}>
                  <SectionTitle>MinIO Certificates</SectionTitle>
                  {minioCertificates.map((keyPair: KeyPair) => (
                    <Grid
                      item
                      xs={12}
                      key={`minio-certs-${keyPair.id}`}
                      className={classes.minioCertificateRows}
                    >
                      <Grid item xs={10} className={classes.fileItem}>
                        <FileSelector
                          onChange={(encodedValue, fileName) => {
                            dispatch(
                              addFileToKeyPair({
                                id: keyPair.id,
                                key: "cert",
                                fileName: fileName,
                                value: encodedValue,
                              })
                            );
                          }}
                          accept=".cer,.crt,.cert,.pem"
                          id="tlsCert"
                          name="tlsCert"
                          label="Cert"
                          value={keyPair.cert}
                        />
                        <FileSelector
                          onChange={(encodedValue, fileName) => {
                            dispatch(
                              addFileToKeyPair({
                                id: keyPair.id,
                                key: "key",
                                fileName: fileName,
                                value: encodedValue,
                              })
                            );
                          }}
                          accept=".key,.pem"
                          id="tlsKey"
                          name="tlsKey"
                          label="Key"
                          value={keyPair.key}
                        />
                      </Grid>

                      <Grid item xs={2} className={classes.rowActions}>
                        <div className={classes.overlayAction}>
                          <IconButton
                            size={"small"}
                            onClick={() => {
                              dispatch(addKeyPair());
                            }}
                          >
                            <AddIcon />
                          </IconButton>
                        </div>
                        <div className={classes.overlayAction}>
                          <IconButton
                            size={"small"}
                            onClick={() => {
                              dispatch(deleteKeyPair(keyPair.id));
                            }}
                          >
                            <RemoveIcon />
                          </IconButton>
                        </div>
                      </Grid>
                    </Grid>
                  ))}
                </Grid>

                <Grid item xs={12} className={classes.minioCertsContainer}>
                  <SectionTitle>MinIO CA Certificates</SectionTitle>

                  {caCertificates.map((keyPair: KeyPair) => (
                    <Grid
                      item
                      xs={12}
                      key={`minio-CA-certs-${keyPair.id}`}
                      className={classes.minioCACertsRow}
                    >
                      <Grid item xs={6}>
                        <FileSelector
                          onChange={(encodedValue, fileName) => {
                            dispatch(
                              addFileToCaCertificates({
                                id: keyPair.id,
                                key: "cert",
                                fileName: fileName,
                                value: encodedValue,
                              })
                            );
                          }}
                          accept=".cer,.crt,.cert,.pem"
                          id="tlsCert"
                          name="tlsCert"
                          label="Cert"
                          value={keyPair.cert}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <div className={classes.rowActions}>
                          <div className={classes.overlayAction}>
                            <IconButton
                              size={"small"}
                              onClick={() => {
                                dispatch(addCaCertificate());
                              }}
                            >
                              <AddIcon />
                            </IconButton>
                          </div>
                          <div className={classes.overlayAction}>
                            <IconButton
                              size={"small"}
                              onClick={() => {
                                dispatch(deleteCaCertificate(keyPair.id));
                              }}
                            >
                              <RemoveIcon />
                            </IconButton>
                          </div>
                        </div>
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              </Fragment>
            )}
          </Fragment>
        )}
      </Grid>
    </Paper>
  );
};

export default withStyles(styles)(Security);
