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

import { ITenant } from "../ListTenants/types";
import { ICertificateInfo, ITenantSecurityResponse } from "../types";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import {
  containerForHeader,
  tenantDetailsStyles,
} from "../../Common/FormComponents/common/styleLibrary";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import React, { Fragment, useEffect, useState } from "react";
import Moment from "react-moment";
import FormSwitchWrapper from "../../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import {
  Button,
  CircularProgress,
  Divider,
  Typography,
} from "@material-ui/core";
import { KeyPair } from "../ListTenants/utils";
import FileSelector from "../../Common/FormComponents/FileSelector/FileSelector";
import api from "../../../../common/api";
import { setErrorSnackMessage } from "../../../../actions";
import { connect } from "react-redux";
import { AppState } from "../../../../store";
import { setTenantDetailsLoad } from "../actions";
import ConfirmationDialog from "./ConfirmationDialog";

interface ITenantSecurity {
  classes: any;
  loadingTenant: boolean;
  tenant: ITenant | null;
  setErrorSnackMessage: typeof setErrorSnackMessage;
  setTenantDetailsLoad: typeof setTenantDetailsLoad;
}

const styles = (theme: Theme) =>
  createStyles({
    ...tenantDetailsStyles,
    loaderAlign: {
      textAlign: "center",
    },
    title: {
      marginTop: 35,
    },
    bold: { fontWeight: "bold" },
    italic: { fontStyle: "italic" },
    underline: { textDecorationLine: "underline" },
    paperContainer: {
      padding: "15px 15px 15px 50px",
    },
    verifiedIcon: {
      width: 96,
      position: "absolute",
      right: 0,
      bottom: 29,
    },
    noUnderLine: {
      textDecoration: "none",
    },
    certificateInfo: {
      height: "auto",
      margin: 5,
    },
    certificateInfoName: {
      fontWeight: "bold",
    },
    ...containerForHeader(theme.spacing(4)),
  });

const TenantSecurity = ({
  classes,
  tenant,
  loadingTenant,
  setErrorSnackMessage,
  setTenantDetailsLoad,
}: ITenantSecurity) => {
  const [isSending, setIsSending] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [enableAutoCert, setEnableAutoCert] = useState<boolean>(false);
  const [enableCustomCerts, setEnableCustomCerts] = useState<boolean>(false);
  const [certificatesToBeRemoved, setCertificatesToBeRemoved] = useState<
    string[]
  >([]);
  // Console certificates
  const [consoleCertificates, setConsoleCertificates] = useState<KeyPair[]>([
    {
      cert: "",
      encoded_cert: "",
      encoded_key: "",
      id: Date.now().toString(),
      key: "",
    },
  ]);
  const [consoleCaCertificates, setConsoleCaCertificates] = useState<KeyPair[]>(
    [
      {
        cert: "",
        encoded_cert: "",
        encoded_key: "",
        id: Date.now().toString(),
        key: "",
      },
    ]
  );
  const [consoleTLSCertificateSecrets, setConsoleTLSCertificateSecrets] =
    useState<ICertificateInfo[]>([]);
  const [consoleTLSCaCertificateSecrets, setConsoleTLSCaCertificateSecrets] =
    useState<ICertificateInfo[]>([]);
  // MinIO certificates
  const [minioCertificates, setMinioCertificates] = useState<KeyPair[]>([
    {
      cert: "",
      encoded_cert: "",
      encoded_key: "",
      id: Date.now().toString(),
      key: "",
    },
  ]);
  const [minioCaCertificates, setMinioCaCertificates] = useState<KeyPair[]>([
    {
      cert: "",
      encoded_cert: "",
      encoded_key: "",
      id: Date.now().toString(),
      key: "",
    },
  ]);
  const [minioTLSCertificateSecrets, setMinioTLSCertificateSecrets] = useState<
    ICertificateInfo[]
  >([]);
  const [minioTLSCaCertificateSecrets, setMinioTLSCaCertificateSecrets] =
    useState<ICertificateInfo[]>([]);

  useEffect(() => {
    if (tenant) {
      getTenantSecurityInfo();
    }
  }, [tenant]);

  const getTenantSecurityInfo = () => {
    api
      .invoke(
        "GET",
        `/api/v1/namespaces/${tenant?.namespace}/tenants/${tenant?.name}/security`
      )
      .then((res: ITenantSecurityResponse) => {
        setEnableAutoCert(res.autoCert);
        if (
          res.customCertificates.minio ||
          res.customCertificates.minioCAs ||
          res.customCertificates.console ||
          res.customCertificates.consoleCAs
        ) {
          setEnableCustomCerts(true);
        }
        setMinioTLSCertificateSecrets(res.customCertificates.minio || []);
        setMinioTLSCaCertificateSecrets(res.customCertificates.minioCAs || []);
        setConsoleTLSCertificateSecrets(res.customCertificates.console || []);
        setConsoleTLSCaCertificateSecrets(
          res.customCertificates.consoleCAs || []
        );
      })
      .catch((err) => {
        setErrorSnackMessage(err.message);
      });
  };

  const updateTenantSecurity = () => {
    setIsSending(true);
    let payload = {
      autoCert: enableAutoCert,
      customCertificates: {},
    };
    if (enableCustomCerts) {
      payload["customCertificates"] = {
        secretsToBeDeleted: certificatesToBeRemoved,
        minio: minioCertificates
          .map((keyPair: KeyPair) => ({
            crt: keyPair.encoded_cert,
            key: keyPair.encoded_key,
          }))
          .filter((cert: any) => cert.crt && cert.key),
        minioCAs: minioCaCertificates
          .map((keyPair: KeyPair) => keyPair.encoded_cert)
          .filter((cert: any) => cert),
        console: consoleCertificates
          .map((keyPair: KeyPair) => ({
            crt: keyPair.encoded_cert,
            key: keyPair.encoded_key,
          }))
          .filter((cert: any) => cert.crt && cert.key),
        consoleCAs: consoleCaCertificates
          .map((keyPair: KeyPair) => keyPair.encoded_cert)
          .filter((cert: any) => cert),
      };
    } else {
      payload["customCertificates"] = {
        secretsToBeDeleted: [
          ...minioTLSCertificateSecrets.map((cert) => cert.name),
          ...minioTLSCaCertificateSecrets.map((cert) => cert.name),
          ...consoleTLSCertificateSecrets.map((cert) => cert.name),
          ...consoleTLSCaCertificateSecrets.map((cert) => cert.name),
        ],
        minio: [],
        minioCAs: [],
        console: [],
        consoleCAs: [],
      };
    }
    api
      .invoke(
        "POST",
        `/api/v1/namespaces/${tenant?.namespace}/tenants/${tenant?.name}/security`,
        payload
      )
      .then(() => {
        setIsSending(false);
        // Close confirmation modal
        setDialogOpen(false);
        // Refresh Information and reset forms
        setMinioCertificates([
          {
            cert: "",
            encoded_cert: "",
            encoded_key: "",
            id: Date.now().toString(),
            key: "",
          },
        ]);
        setMinioCaCertificates([
          {
            cert: "",
            encoded_cert: "",
            encoded_key: "",
            id: Date.now().toString(),
            key: "",
          },
        ]);
        setConsoleCertificates([
          {
            cert: "",
            encoded_cert: "",
            encoded_key: "",
            id: Date.now().toString(),
            key: "",
          },
        ]);
        setConsoleCaCertificates([
          {
            cert: "",
            encoded_cert: "",
            encoded_key: "",
            id: Date.now().toString(),
            key: "",
          },
        ]);
        getTenantSecurityInfo();
      })
      .catch((err) => {
        setErrorSnackMessage(err);
        setIsSending(false);
      });
  };

  const removeCertificate = (certificateInfo: ICertificateInfo) => {
    // TLS certificate secrets can be referenced MinIO, Console or KES, we need to remove the secret from all list and update
    // the arrays
    // Add certificate to the global list of secrets to be removed
    setCertificatesToBeRemoved([
      ...certificatesToBeRemoved,
      certificateInfo.name,
    ]);

    // Update MinIO TLS certificate secrets
    const updatedMinIOTLSCertificateSecrets = minioTLSCertificateSecrets.filter(
      (certificateSecret) => certificateSecret.name !== certificateInfo.name
    );
    const updatedMinIOTLSCaCertificateSecrets =
      minioTLSCaCertificateSecrets.filter(
        (certificateSecret) => certificateSecret.name !== certificateInfo.name
      );
    setMinioTLSCertificateSecrets(updatedMinIOTLSCertificateSecrets);
    setMinioTLSCaCertificateSecrets(updatedMinIOTLSCaCertificateSecrets);

    // Update Console TLS certificate secrets
    const updatedConsoleTLSCertificateSecrets =
      consoleTLSCertificateSecrets.filter(
        (certificateSecret) => certificateSecret.name !== certificateInfo.name
      );
    const updatedConsoleTLSCaCertificateSecrets =
      consoleTLSCaCertificateSecrets.filter(
        (certificateSecret) => certificateSecret.name !== certificateInfo.name
      );
    setConsoleTLSCertificateSecrets(updatedConsoleTLSCertificateSecrets);
    setConsoleTLSCaCertificateSecrets(updatedConsoleTLSCaCertificateSecrets);
  };

  const addFileToKeyPair = (
    type: string,
    id: string,
    key: string,
    fileName: string,
    value: string
  ) => {
    let certificates = minioCertificates;
    let updateCertificates: any = () => {};

    switch (type) {
      case "minio": {
        certificates = minioCertificates;
        updateCertificates = setMinioCertificates;
        break;
      }
      case "minioCAs": {
        certificates = minioCaCertificates;
        updateCertificates = setMinioCaCertificates;
        break;
      }
      case "console": {
        certificates = consoleCertificates;
        updateCertificates = setConsoleCertificates;
        break;
      }
      case "consoleCAs": {
        certificates = consoleCaCertificates;
        updateCertificates = setConsoleCaCertificates;
        break;
      }
      default:
    }

    const NCertList = certificates.map((item: KeyPair) => {
      if (item.id === id) {
        return {
          ...item,
          [key]: fileName,
          [`encoded_${key}`]: value,
        };
      }
      return item;
    });
    updateCertificates(NCertList);
  };

  const deleteKeyPair = (type: string, id: string) => {
    let certificates = minioCertificates;
    let updateCertificates: any = () => {};

    switch (type) {
      case "minio": {
        certificates = minioCertificates;
        updateCertificates = setMinioCertificates;
        break;
      }
      case "minioCAs": {
        certificates = minioCaCertificates;
        updateCertificates = setMinioCaCertificates;
        break;
      }
      case "console": {
        certificates = consoleCertificates;
        updateCertificates = setConsoleCertificates;
        break;
      }
      case "consoleCAs": {
        certificates = consoleCaCertificates;
        updateCertificates = setConsoleCaCertificates;
        break;
      }
      default:
    }

    if (certificates.length > 1) {
      const cleanCertsList = certificates.filter(
        (item: KeyPair) => item.id !== id
      );
      updateCertificates(cleanCertsList);
    }
  };

  const addKeyPair = (type: string) => {
    let certificates = minioCertificates;
    let updateCertificates: any = () => {};

    switch (type) {
      case "minio": {
        certificates = minioCertificates;
        updateCertificates = setMinioCertificates;
        break;
      }
      case "minioCAs": {
        certificates = minioCaCertificates;
        updateCertificates = setMinioCaCertificates;
        break;
      }
      case "console": {
        certificates = consoleCertificates;
        updateCertificates = setConsoleCertificates;
        break;
      }
      case "consoleCAs": {
        certificates = consoleCaCertificates;
        updateCertificates = setConsoleCaCertificates;
        break;
      }
      default:
    }
    const updatedCertificates = [
      ...certificates,
      {
        id: Date.now().toString(),
        key: "",
        cert: "",
        encoded_key: "",
        encoded_cert: "",
      },
    ];
    updateCertificates(updatedCertificates);
  };
  return (
    <React.Fragment>
      <ConfirmationDialog
        open={dialogOpen}
        title="Save and Restart"
        description="Are you sure you want to save the changes and restart the service?"
        onClose={() => setDialogOpen(false)}
        cancelOnClick={() => setDialogOpen(false)}
        okOnClick={updateTenantSecurity}
        cancelLabel="Cancel"
        okLabel={"Restart"}
      />
      <br />
      <Paper className={classes.paperContainer}>
        {loadingTenant ? (
          <div className={classes.loaderAlign}>
            <CircularProgress />
          </div>
        ) : (
          <Fragment>
            <Grid item xs={12} className={classes.title}>
              <FormSwitchWrapper
                value="enableAutoCert"
                id="enableAutoCert"
                name="enableAutoCert"
                checked={enableAutoCert}
                onChange={(e) => {
                  const targetD = e.target;
                  const checked = targetD.checked;
                  setEnableAutoCert(checked);
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
                  setEnableCustomCerts(checked);
                }}
                label={"Custom Certificates"}
              />
            </Grid>
            {enableCustomCerts && (
              <Fragment>
                <Grid container>
                  <Grid container item xs={12}>
                    <Typography variant="overline" display="block" gutterBottom>
                      MinIO Certificates
                    </Typography>
                  </Grid>
                  <Grid container item xs={12}>
                    {minioTLSCertificateSecrets.map(
                      (certificateInfo: ICertificateInfo) => (
                        <Chip
                          key={certificateInfo.name}
                          variant="outlined"
                          color="primary"
                          className={classes.certificateInfo}
                          label={
                            <div>
                              <Typography
                                variant="subtitle1"
                                display="block"
                                gutterBottom
                              >
                                {certificateInfo.name}
                              </Typography>
                              <Typography
                                className={classes.italic}
                                variant="caption"
                                display="block"
                                gutterBottom
                              >
                                {certificateInfo.domains.join(", ")}
                              </Typography>
                              <Typography
                                className={classes.bold}
                                variant="overline"
                                gutterBottom
                              >
                                Expiry:&nbsp;
                              </Typography>
                              <Typography variant="caption" gutterBottom>
                                <Moment format="YYYY-MM-DD">
                                  {certificateInfo.expiry}
                                </Moment>
                              </Typography>
                            </div>
                          }
                          onDelete={() => removeCertificate(certificateInfo)}
                        />
                      )
                    )}
                  </Grid>
                  <Grid container item xs={12}>
                    <br />
                  </Grid>
                  <Grid container item xs={12}>
                    {minioCertificates.map((keyPair) => (
                      <Fragment key={keyPair.id}>
                        <Grid item xs={5}>
                          <FileSelector
                            onChange={(encodedValue, fileName) =>
                              addFileToKeyPair(
                                "minio",
                                keyPair.id,
                                "cert",
                                fileName,
                                encodedValue
                              )
                            }
                            accept=".cer,.crt,.cert,.pem"
                            id="tlsCert"
                            name="tlsCert"
                            label="Cert"
                            value={keyPair.cert}
                          />
                        </Grid>
                        <Grid item xs={5}>
                          <FileSelector
                            onChange={(encodedValue, fileName) =>
                              addFileToKeyPair(
                                "minio",
                                keyPair.id,
                                "key",
                                fileName,
                                encodedValue
                              )
                            }
                            accept=".key,.pem"
                            id="tlsKey"
                            name="tlsKey"
                            label="Key"
                            value={keyPair.key}
                          />
                        </Grid>
                        <Grid item xs={1}>
                          <Button
                            onClick={() => deleteKeyPair("minio", keyPair.id)}
                            color="secondary"
                          >
                            Remove
                          </Button>
                        </Grid>
                      </Fragment>
                    ))}
                  </Grid>
                  <Grid container item xs={12}>
                    <Button onClick={() => addKeyPair("minio")} color="primary">
                      Add More
                    </Button>
                  </Grid>
                  <Grid container item xs={12}>
                    <br />
                  </Grid>
                  <Grid container item xs={12}>
                    <Typography variant="overline" display="block" gutterBottom>
                      MinIO CA Certificates
                    </Typography>
                  </Grid>
                  <Grid container item xs={12}>
                    {minioTLSCaCertificateSecrets.map(
                      (certificateInfo: ICertificateInfo) => (
                        <Chip
                          key={certificateInfo.name}
                          variant="outlined"
                          color="primary"
                          className={classes.certificateInfo}
                          label={
                            <div>
                              <Typography
                                variant="subtitle1"
                                display="block"
                                gutterBottom
                              >
                                {certificateInfo.name}
                              </Typography>
                              <Typography
                                className={classes.italic}
                                variant="caption"
                                display="block"
                                gutterBottom
                              >
                                {certificateInfo.domains.join(", ")}
                              </Typography>
                              <Typography
                                className={classes.bold}
                                variant="overline"
                                gutterBottom
                              >
                                Expiry:&nbsp;
                              </Typography>
                              <Typography variant="caption" gutterBottom>
                                <Moment format="YYYY-MM-DD">
                                  {certificateInfo.expiry}
                                </Moment>
                              </Typography>
                            </div>
                          }
                          onDelete={() => removeCertificate(certificateInfo)}
                        />
                      )
                    )}
                  </Grid>
                  <Grid container item xs={12}>
                    <br />
                  </Grid>
                  <Grid container item xs={12}>
                    {minioCaCertificates.map((keyPair: KeyPair) => (
                      <Fragment key={keyPair.id}>
                        <Grid item xs={10}>
                          <FileSelector
                            onChange={(encodedValue, fileName) =>
                              addFileToKeyPair(
                                "minioCAs",
                                keyPair.id,
                                "cert",
                                fileName,
                                encodedValue
                              )
                            }
                            accept=".cer,.crt,.cert,.pem"
                            id="tlsCert"
                            name="tlsCert"
                            label="Cert"
                            value={keyPair.cert}
                          />
                        </Grid>
                        <Grid item xs={1}>
                          <Button
                            onClick={() =>
                              deleteKeyPair("minioCAs", keyPair.id)
                            }
                            color="secondary"
                          >
                            Remove
                          </Button>
                        </Grid>
                      </Fragment>
                    ))}
                  </Grid>
                  <Grid container item xs={12}>
                    <Button
                      onClick={() => addKeyPair("minioCAs")}
                      color="primary"
                    >
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
                {tenant?.consoleEnabled ? (
                  <Fragment>
                    <Grid container>
                      <Grid container item xs={12}>
                        <Typography
                          variant="overline"
                          display="block"
                          gutterBottom
                        >
                          Console Certificates
                        </Typography>
                      </Grid>
                      <Grid container item xs={12}>
                        {consoleTLSCertificateSecrets.map(
                          (certificateInfo: ICertificateInfo) => (
                            <Chip
                              key={certificateInfo.name}
                              variant="outlined"
                              color="primary"
                              className={classes.certificateInfo}
                              label={
                                <div>
                                  <Typography
                                    variant="subtitle1"
                                    display="block"
                                    gutterBottom
                                  >
                                    {certificateInfo.name}
                                  </Typography>
                                  <Typography
                                    className={classes.italic}
                                    variant="caption"
                                    display="block"
                                    gutterBottom
                                  >
                                    {certificateInfo.domains.join(", ")}
                                  </Typography>
                                  <Typography
                                    className={classes.bold}
                                    variant="overline"
                                    gutterBottom
                                  >
                                    Expiry:&nbsp;
                                  </Typography>
                                  <Typography variant="caption" gutterBottom>
                                    <Moment format="YYYY-MM-DD">
                                      {certificateInfo.expiry}
                                    </Moment>
                                  </Typography>
                                </div>
                              }
                              onDelete={() =>
                                removeCertificate(certificateInfo)
                              }
                            />
                          )
                        )}
                      </Grid>
                      <Grid container item xs={12}>
                        <br />
                      </Grid>
                      <Grid container item xs={12}>
                        {consoleCertificates.map((keyPair: KeyPair) => (
                          <Fragment key={keyPair.id}>
                            <Grid item xs={6}>
                              <FileSelector
                                onChange={(encodedValue, fileName) =>
                                  addFileToKeyPair(
                                    "console",
                                    keyPair.id,
                                    "cert",
                                    fileName,
                                    encodedValue
                                  )
                                }
                                accept=".cer,.crt,.cert,.pem"
                                id="consoleCert"
                                name="consoleCert"
                                label="Cert"
                                value={keyPair.cert}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <FileSelector
                                onChange={(encodedValue, fileName) =>
                                  addFileToKeyPair(
                                    "console",
                                    keyPair.id,
                                    "key",
                                    fileName,
                                    encodedValue
                                  )
                                }
                                accept=".key,.pem"
                                id="consoleKey"
                                name="consoleKey"
                                label="Key"
                                value={keyPair.key}
                              />
                            </Grid>
                          </Fragment>
                        ))}
                      </Grid>
                      <Grid container item xs={12}>
                        <Typography
                          variant="overline"
                          display="block"
                          gutterBottom
                        >
                          Console CA Certificates
                        </Typography>
                      </Grid>
                      <Grid container item xs={12}>
                        {consoleTLSCaCertificateSecrets.map(
                          (certificateInfo: ICertificateInfo) => (
                            <Chip
                              key={certificateInfo.name}
                              variant="outlined"
                              color="primary"
                              className={classes.certificateInfo}
                              label={
                                <div>
                                  <Typography
                                    variant="subtitle1"
                                    display="block"
                                    gutterBottom
                                  >
                                    {certificateInfo.name}
                                  </Typography>
                                  <Typography
                                    className={classes.italic}
                                    variant="caption"
                                    display="block"
                                    gutterBottom
                                  >
                                    {certificateInfo.domains.join(", ")}
                                  </Typography>
                                  <Typography
                                    className={classes.bold}
                                    variant="overline"
                                    gutterBottom
                                  >
                                    Expiry:&nbsp;
                                  </Typography>
                                  <Typography variant="caption" gutterBottom>
                                    <Moment format="YYYY-MM-DD">
                                      {certificateInfo.expiry}
                                    </Moment>
                                  </Typography>
                                </div>
                              }
                              onDelete={() =>
                                removeCertificate(certificateInfo)
                              }
                            />
                          )
                        )}
                      </Grid>
                      <Grid container item xs={12}>
                        <br />
                      </Grid>
                      <Grid container item xs={12}>
                        {consoleCaCertificates.map((keyPair: KeyPair) => (
                          <Fragment key={keyPair.id}>
                            <Grid item xs={10}>
                              <FileSelector
                                onChange={(encodedValue, fileName) =>
                                  addFileToKeyPair(
                                    "consoleCAs",
                                    keyPair.id,
                                    "cert",
                                    fileName,
                                    encodedValue
                                  )
                                }
                                accept=".cer,.crt,.cert,.pem"
                                id="tlsCert"
                                name="tlsCert"
                                label="Cert"
                                value={keyPair.cert}
                              />
                            </Grid>
                            <Grid item xs={1}>
                              <Button
                                onClick={() =>
                                  deleteKeyPair("consoleCAs", keyPair.id)
                                }
                                color="secondary"
                              >
                                Remove
                              </Button>
                            </Grid>
                          </Fragment>
                        ))}
                      </Grid>
                      <Grid container item xs={12}>
                        <Button
                          onClick={() => addKeyPair("consoleCAs")}
                          color="primary"
                        >
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
                  </Fragment>
                ) : null}
              </Fragment>
            )}
            <Grid item xs={12} className={classes.buttonContainer}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={dialogOpen || isSending}
                onClick={() => setDialogOpen(true)}
              >
                Save
              </Button>
            </Grid>
          </Fragment>
        )}
      </Paper>
    </React.Fragment>
  );
};

const mapState = (state: AppState) => ({
  loadingTenant: state.tenants.tenantDetails.loadingTenant,
  selectedTenant: state.tenants.tenantDetails.currentTenant,
  tenant: state.tenants.tenantDetails.tenantInfo,
});

const mapDispatchToProps = {
  setErrorSnackMessage,
  setTenantDetailsLoad,
};

const connector = connect(mapState, mapDispatchToProps);

export default withStyles(styles)(connector(TenantSecurity));
