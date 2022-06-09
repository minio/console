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
import { connect, useDispatch, useSelector } from "react-redux";
import { Theme } from "@mui/material/styles";
import { Button, DialogContentText } from "@mui/material";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import Grid from "@mui/material/Grid";
import { ICertificateInfo, ITenantSecurityResponse } from "../types";
import {
  containerForHeader,
  createTenantCommon,
  formFieldStyles,
  modalBasic,
  spacingUtils,
  tenantDetailsStyles,
  wizardCommon,
} from "../../Common/FormComponents/common/styleLibrary";

import { KeyPair } from "../ListTenants/utils";
import { AppState } from "../../../../store";
import { ErrorResponseHandler } from "../../../../common/types";
import { AddIcon, ConfirmModalIcon } from "../../../../icons";
import { setErrorSnackMessage } from "../../../../systemSlice";
import FormSwitchWrapper from "../../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import FileSelector from "../../Common/FormComponents/FileSelector/FileSelector";
import api from "../../../../common/api";
import ConfirmDialog from "../../Common/ModalWrapper/ConfirmDialog";
import Loader from "../../Common/Loader/Loader";
import TLSCertificate from "../../Common/TLSCertificate/TLSCertificate";
import SectionTitle from "../../Common/SectionTitle";

interface ITenantSecurity {
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    ...tenantDetailsStyles,
    ...spacingUtils,
    loaderAlign: {
      textAlign: "center",
    },
    bold: { fontWeight: "bold" },
    italic: { fontStyle: "italic" },
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
    ...containerForHeader(theme.spacing(4)),
    ...createTenantCommon,
    ...formFieldStyles,
    ...modalBasic,
    ...wizardCommon,
  });

const TenantSecurity = ({ classes }: ITenantSecurity) => {
  const dispatch = useDispatch();

  const tenant = useSelector((state: AppState) => state.tenants.tenantInfo);
  const loadingTenant = useSelector(
    (state: AppState) => state.tenants.loadingTenant
  );

  const [isSending, setIsSending] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [enableAutoCert, setEnableAutoCert] = useState<boolean>(false);
  const [enableCustomCerts, setEnableCustomCerts] = useState<boolean>(false);
  const [certificatesToBeRemoved, setCertificatesToBeRemoved] = useState<
    string[]
  >([]);
  // MinIO certificates
  const [minioCertificates, setMinioCertificates] = useState<KeyPair[]>([]);
  const [minioCaCertificates, setMinioCaCertificates] = useState<KeyPair[]>([]);
  const [minioTLSCertificateSecrets, setMinioTLSCertificateSecrets] = useState<
    ICertificateInfo[]
  >([]);
  const [minioTLSCaCertificateSecrets, setMinioTLSCaCertificateSecrets] =
    useState<ICertificateInfo[]>([]);

  const getTenantSecurityInfo = useCallback(() => {
    api
      .invoke(
        "GET",
        `/api/v1/namespaces/${tenant?.namespace}/tenants/${tenant?.name}/security`
      )
      .then((res: ITenantSecurityResponse) => {
        setEnableAutoCert(res.autoCert);
        if (res.customCertificates.minio || res.customCertificates.minioCAs) {
          setEnableCustomCerts(true);
        }
        setMinioTLSCertificateSecrets(res.customCertificates.minio || []);
        setMinioTLSCaCertificateSecrets(res.customCertificates.minioCAs || []);
      })
      .catch((err: ErrorResponseHandler) => {
        dispatch(setErrorSnackMessage(err));
      });
  }, [tenant, dispatch]);

  useEffect(() => {
    if (tenant) {
      getTenantSecurityInfo();
    }
  }, [tenant, getTenantSecurityInfo]);

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
      };
    } else {
      payload["customCertificates"] = {
        secretsToBeDeleted: [
          ...minioTLSCertificateSecrets.map((cert) => cert.name),
          ...minioTLSCaCertificateSecrets.map((cert) => cert.name),
        ],
        minio: [],
        minioCAs: [],
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
        getTenantSecurityInfo();
      })
      .catch((err: ErrorResponseHandler) => {
        dispatch(setErrorSnackMessage(err));
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
      <ConfirmDialog
        title={"Save and Restart"}
        confirmText={"Restart"}
        cancelText="Cancel"
        titleIcon={<ConfirmModalIcon />}
        isLoading={isSending}
        onClose={() => setDialogOpen(false)}
        isOpen={dialogOpen}
        onConfirm={updateTenantSecurity}
        confirmationContent={
          <DialogContentText>
            Are you sure you want to save the changes and restart the service?
          </DialogContentText>
        }
      />
      {loadingTenant ? (
        <div className={classes.loaderAlign}>
          <Loader />
        </div>
      ) : (
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <h1 className={classes.sectionTitle}>Security</h1>
            <hr className={classes.hrClass} />
          </Grid>
          <Grid item xs={12}>
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
              label={"TLS"}
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
                setEnableCustomCerts(checked);
              }}
              label={"Custom Certificates"}
              description={"Certificates used to terminated TLS at MinIO"}
            />
          </Grid>

          {enableCustomCerts && (
            <Fragment>
              <Grid item xs={12}>
                <SectionTitle>MinIO Certificates</SectionTitle>
              </Grid>
              <Grid item xs={12}>
                {minioTLSCertificateSecrets.map(
                  (certificateInfo: ICertificateInfo) => (
                    <TLSCertificate
                      certificateInfo={certificateInfo}
                      onDelete={() => removeCertificate(certificateInfo)}
                    />
                  )
                )}
              </Grid>

              <Grid item xs={12}>
                {minioCertificates.map((keyPair) => (
                  <Grid
                    container
                    key={keyPair.id}
                    alignItems={"center"}
                    style={{ borderBottom: "1px solid #eaeaea" }}
                  >
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
                    <Grid item xs={2}>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => deleteKeyPair("minio", keyPair.id)}
                      >
                        Remove
                      </Button>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
              <Grid item xs={12} textAlign={"right"}>
                <Button
                  variant="outlined"
                  color="primary"
                  endIcon={<AddIcon />}
                  onClick={() => addKeyPair("minio")}
                >
                  Add Certificate
                </Button>
              </Grid>

              <Grid item xs={12}>
                <SectionTitle>MinIO CA Certificates</SectionTitle>
              </Grid>
              <Grid item xs={12}>
                {minioTLSCaCertificateSecrets.map(
                  (certificateInfo: ICertificateInfo) => (
                    <TLSCertificate
                      certificateInfo={certificateInfo}
                      onDelete={() => removeCertificate(certificateInfo)}
                    />
                  )
                )}
              </Grid>

              <Grid item xs={12}>
                {minioCaCertificates.map((keyPair: KeyPair) => (
                  <Grid
                    container
                    key={keyPair.id}
                    style={{ borderBottom: "1px solid #eaeaea" }}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    <Grid item xs={5} className={classes.fileItem}>
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
                    <Grid item xs={2}>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => deleteKeyPair("minioCAs", keyPair.id)}
                      >
                        Remove
                      </Button>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
              <Grid item xs={12} textAlign={"right"}>
                <Button
                  variant="outlined"
                  color="primary"
                  endIcon={<AddIcon />}
                  onClick={() => addKeyPair("minioCAs")}
                >
                  Add CA Certificate
                </Button>
              </Grid>
            </Fragment>
          )}

          <Grid item xs={12} textAlign={"right"}>
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
        </Grid>
      )}
    </React.Fragment>
  );
};

const mapState = (state: AppState) => ({
  loadingTenant: state.tenants.loadingTenant,
  selectedTenant: state.tenants.currentTenant,
  tenant: state.tenants.tenantInfo,
});

const connector = connect(mapState, null);

export default withStyles(styles)(connector(TenantSecurity));
