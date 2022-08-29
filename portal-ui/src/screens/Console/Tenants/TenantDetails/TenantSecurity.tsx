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
import { connect, useSelector } from "react-redux";
import { Theme } from "@mui/material/styles";
import { Button, DialogContentText, IconButton } from "@mui/material";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import Grid from "@mui/material/Grid";
import {
  fsGroupChangePolicyType,
  ICertificateInfo,
  ITenantSecurityResponse,
} from "../types";
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
import { AppState, useAppDispatch } from "../../../../store";
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
import SecurityContextSelector from "../securityContextSelector";
import {
  setRunAsUser,
  setFSGroup,
  setRunAsGroup,
  setRunAsNonRoot,
  setFSGroupChangePolicy,
} from "../tenantSecurityContextSlice";
import RemoveIcon from "../../../../icons/RemoveIcon";

interface ITenantSecurity {
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    ...tenantDetailsStyles,
    ...spacingUtils,
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
  const dispatch = useAppDispatch();

  const tenant = useSelector((state: AppState) => state.tenants.tenantInfo);
  const loadingTenant = useSelector(
    (state: AppState) => state.tenants.loadingTenant
  );

  const [isSending, setIsSending] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [enableTLS, setEnableTLS] = useState<boolean>(false);
  const [enableAutoCert, setEnableAutoCert] = useState<boolean>(false);
  const [enableCustomCerts, setEnableCustomCerts] = useState<boolean>(false);
  const [certificatesToBeRemoved, setCertificatesToBeRemoved] = useState<
    string[]
  >([]);
  // MinIO certificates
  const [minioCertificates, setMinioCertificates] = useState<KeyPair[]>([
    {
      id: Date.now().toString(),
      key: "",
      cert: "",
      encoded_key: "",
      encoded_cert: "",
    },
  ]);
  const [minioCaCertificates, setMinioCaCertificates] = useState<KeyPair[]>([
    {
      id: Date.now().toString(),
      key: "",
      cert: "",
      encoded_key: "",
      encoded_cert: "",
    },
  ]);
  const [minioTLSCertificateSecrets, setMinioTLSCertificateSecrets] = useState<
    ICertificateInfo[]
  >([]);
  const [minioTLSCaCertificateSecrets, setMinioTLSCaCertificateSecrets] =
    useState<ICertificateInfo[]>([]);

  const runAsGroup = useSelector(
    (state: AppState) => state.editTenantSecurityContext.runAsGroup
  );
  const runAsUser = useSelector(
    (state: AppState) => state.editTenantSecurityContext.runAsUser
  );
  const fsGroup = useSelector(
    (state: AppState) => state.editTenantSecurityContext.fsGroup
  );
  const runAsNonRoot = useSelector(
    (state: AppState) => state.editTenantSecurityContext.runAsNonRoot
  );
  const fsGroupChangePolicy = useSelector(
    (state: AppState) => state.editTenantSecurityContext.fsGroupChangePolicy
  );

  const getTenantSecurityInfo = useCallback(() => {
    api
      .invoke(
        "GET",
        `/api/v1/namespaces/${tenant?.namespace}/tenants/${tenant?.name}/security`
      )
      .then((res: ITenantSecurityResponse) => {
        setEnableAutoCert(res.autoCert);
        setEnableTLS(res.autoCert);
        if (res.customCertificates.minio || res.customCertificates.minioCAs) {
          setEnableCustomCerts(true);
          setEnableTLS(true);
        }
        setMinioTLSCertificateSecrets(res.customCertificates.minio || []);
        setMinioTLSCaCertificateSecrets(res.customCertificates.minioCAs || []);
        dispatch(setRunAsGroup(res.securityContext.runAsGroup));
        dispatch(setRunAsUser(res.securityContext.runAsUser));
        dispatch(setFSGroup(res.securityContext.fsGroup));
        dispatch(setRunAsNonRoot(res.securityContext.runAsNonRoot));
        dispatch(
          setFSGroupChangePolicy(res.securityContext.fsGroupChangePolicy)
        );
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
      securityContext: {
        runAsGroup: runAsGroup,
        runAsUser: runAsUser,
        runAsNonRoot: runAsNonRoot,
        fsGroup: fsGroup,
        fsGroupChangePolicy: fsGroupChangePolicy,
      },
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
                  setEnableTLS(checked);
                }}
                label={"TLS"}
                description={
                  "Securing all the traffic using TLS. This is required for Encryption Configuration"
                }
              />
            </Grid>
            {enableTLS && (
              <Fragment>
                <Grid item xs={12} className={classes.formFieldRow}>
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
                    label={"AutoCert"}
                    description={
                      "The internode certificates will be generated and managed by MinIO Operator"
                    }
                  />
                </Grid>
                <Grid item xs={12} className={classes.formFieldRow}>
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
                    <Grid item xs={12} className={classes.formFieldRow}>
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

                    <Grid item xs={12} className={classes.formFieldRow}>
                      {minioCertificates.map((keyPair, index) => (
                        <Grid
                          item
                          xs={12}
                          key={keyPair.id}
                          className={classes.minioCertificateRows}
                        >
                          <Grid item xs={10} className={classes.fileItem}>
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
                          <Grid item xs={2} className={classes.rowActions}>
                            <div className={classes.overlayAction}>
                              <IconButton
                                size={"small"}
                                onClick={() => addKeyPair("minio")}
                                disabled={
                                  index !== minioCertificates.length - 1
                                }
                              >
                                <AddIcon />
                              </IconButton>
                            </div>
                            <div className={classes.overlayAction}>
                              <IconButton
                                size={"small"}
                                onClick={() =>
                                  deleteKeyPair("minio", keyPair.id)
                                }
                                disabled={minioCertificates.length <= 1}
                              >
                                <RemoveIcon />
                              </IconButton>
                            </div>
                          </Grid>
                        </Grid>
                      ))}
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
                      {minioCaCertificates.map((keyPair: KeyPair, index) => (
                        <Grid
                          item
                          xs={12}
                          key={keyPair.id}
                          className={classes.minioCACertsRow}
                        >
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
                          <Grid item xs={2}>
                            <div className={classes.rowActions}>
                              <div className={classes.overlayAction}>
                                <IconButton
                                  size={"small"}
                                  onClick={() => addKeyPair("minioCAs")}
                                  disabled={
                                    index !== minioCaCertificates.length - 1
                                  }
                                >
                                  <AddIcon />
                                </IconButton>
                              </div>
                              <div className={classes.overlayAction}>
                                <IconButton
                                  size={"small"}
                                  onClick={() =>
                                    deleteKeyPair("minioCAs", keyPair.id)
                                  }
                                  disabled={minioCaCertificates.length <= 1}
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
            <Grid item xs={12} className={classes.formFieldRow}>
              <h1 className={classes.sectionTitle}>Security Context</h1>
              <hr className={classes.hrClass} />
            </Grid>
            <Grid item xs={12} className={classes.formFieldRow}>
              <SecurityContextSelector
                classes={classes}
                runAsGroup={runAsGroup}
                runAsUser={runAsUser}
                fsGroup={fsGroup}
                runAsNonRoot={runAsNonRoot}
                fsGroupChangePolicy={fsGroupChangePolicy}
                setFSGroup={(value: string) => dispatch(setFSGroup(value))}
                setRunAsUser={(value: string) => dispatch(setRunAsUser(value))}
                setRunAsGroup={(value: string) =>
                  dispatch(setRunAsGroup(value))
                }
                setRunAsNonRoot={(value: boolean) =>
                  dispatch(setRunAsNonRoot(value))
                }
                setFSGroupChangePolicy={(value: fsGroupChangePolicyType) =>
                  dispatch(setFSGroupChangePolicy(value))
                }
              />
            </Grid>
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
