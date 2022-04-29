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
import { ITenantIdentityProviderResponse } from "../types";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import {
  containerForHeader,
  createTenantCommon,
  formFieldStyles,
  modalBasic,
  spacingUtils,
  tenantDetailsStyles,
  wizardCommon,
} from "../../Common/FormComponents/common/styleLibrary";
import Grid from "@mui/material/Grid";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { Button, DialogContentText, Typography } from "@mui/material";
import api from "../../../../common/api";
import { setErrorSnackMessage } from "../../../../actions";
import { connect } from "react-redux";
import { AppState } from "../../../../store";
import { ErrorResponseHandler } from "../../../../common/types";
import Loader from "../../Common/Loader/Loader";
import RadioGroupSelector from "../../Common/FormComponents/RadioGroupSelector/RadioGroupSelector";
import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import { clearValidationError } from "../utils";
import {
  commonFormValidation,
  IValidation,
} from "../../../../utils/validationFunctions";
import FormSwitchWrapper from "../../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ConfirmDialog from "../../Common/ModalWrapper/ConfirmDialog";
import { ConfirmModalIcon } from "../../../../icons";

interface ITenantIdentityProvider {
  classes: any;
  loadingTenant: boolean;
  tenant: ITenant | null;
  setErrorSnackMessage: typeof setErrorSnackMessage;
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

const TenantIdentityProvider = ({
  classes,
  tenant,
  loadingTenant,
  setErrorSnackMessage,
}: ITenantIdentityProvider) => {
  const [isSending, setIsSending] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [idpSelection, setIdpSelection] = useState<string>("Built-in");
  const [openIDConfigurationURL, setOpenIDConfigurationURL] =
    useState<string>("");
  const [openIDClientID, setOpenIDClientID] = useState<string>("");
  const [openIDSecretID, setOpenIDSecretID] = useState<string>("");
  const [showOIDCSecretID, setShowOIDCSecretID] = useState<boolean>(false);
  const [openIDCallbackURL, setOpenIDCallbackURL] = useState<string>("");
  const [openIDClaimName, setOpenIDClaimName] = useState<string>("");
  const [openIDScopes, setOpenIDScopes] = useState<string>("");
  const [ADURL, setADURL] = useState<string>("");
  const [ADLookupBindDN, setADLookupBindDN] = useState<string>("");
  const [ADLookupBindPassword, setADLookupBindPassword] = useState<string>("");
  const [showADLookupBindPassword, setShowADLookupBindPassword] =
    useState<boolean>(false);
  const [ADUserDNSearchBaseDN, setADUserDNSearchBaseDN] = useState<string>("");
  const [ADUserDNSearchFilter, setADUserDNSearchFilter] = useState<string>("");
  const [ADGroupSearchBaseDN, setADGroupSearchBaseDN] = useState<string>("");
  const [ADGroupSearchFilter, setADGroupSearchFilter] = useState<string>("");
  const [ADSkipTLS, setADSkipTLS] = useState<boolean>(false);
  const [ADServerInsecure, setADServerInsecure] = useState<boolean>(false);
  const [ADServerStartTLS, setADServerStartTLS] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<any>({});
  const cleanValidation = (fieldName: string) => {
    setValidationErrors(clearValidationError(validationErrors, fieldName));
  };
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  // Validation
  useEffect(() => {
    let identityProviderValidation: IValidation[] = [];

    if (idpSelection === "OpenID") {
      identityProviderValidation = [
        ...identityProviderValidation,
        {
          fieldKey: "openID_CONFIGURATION_URL",
          required: true,
          value: openIDConfigurationURL,
        },
        {
          fieldKey: "openID_clientID",
          required: true,
          value: openIDClientID,
        },
        {
          fieldKey: "openID_secretID",
          required: true,
          value: openIDSecretID,
        },
        {
          fieldKey: "openID_claimName",
          required: true,
          value: openIDClaimName,
        },
      ];
    }

    if (idpSelection === "AD") {
      identityProviderValidation = [
        ...identityProviderValidation,
        {
          fieldKey: "AD_URL",
          required: true,
          value: ADURL,
        },
        {
          fieldKey: "ad_lookupBindDN",
          required: true,
          value: ADLookupBindDN,
        },
      ];
    }

    const commonVal = commonFormValidation(identityProviderValidation);

    setIsFormValid(Object.keys(commonVal).length === 0);

    setValidationErrors(commonVal);
  }, [
    idpSelection,
    openIDConfigurationURL,
    openIDClientID,
    openIDSecretID,
    openIDClaimName,
    ADURL,
    ADLookupBindDN,
  ]);

  const getTenantIdentityProviderInfo = useCallback(() => {
    api
      .invoke(
        "GET",
        `/api/v1/namespaces/${tenant?.namespace}/tenants/${tenant?.name}/identity-provider`
      )
      .then((res: ITenantIdentityProviderResponse) => {
        if (res) {
          if (res.oidc) {
            setIdpSelection("OpenID");
            setOpenIDConfigurationURL(res.oidc.configuration_url);
            setOpenIDClientID(res.oidc.client_id);
            setOpenIDSecretID(res.oidc.secret_id);
            setOpenIDCallbackURL(res.oidc.callback_url);
            setOpenIDClaimName(res.oidc.claim_name);
            setOpenIDScopes(res.oidc.scopes);
          } else if (res.active_directory) {
            setIdpSelection("AD");
            setADURL(res.active_directory.url);
            setADLookupBindDN(res.active_directory.lookup_bind_dn);
            setADLookupBindPassword(res.active_directory.lookup_bind_password);
            setADUserDNSearchBaseDN(
              res.active_directory.user_dn_search_base_dn
            );
            setADUserDNSearchFilter(res.active_directory.user_dn_search_filter);
            setADGroupSearchBaseDN(res.active_directory.group_search_base_dn);
            setADGroupSearchFilter(res.active_directory.group_search_filter);
            setADSkipTLS(res.active_directory.skip_tls_verification);
            setADServerInsecure(res.active_directory.server_insecure);
            setADServerStartTLS(res.active_directory.server_start_tls);
          }
        }
      })
      .catch((err: ErrorResponseHandler) => {
        setErrorSnackMessage(err);
      });
  }, [tenant, setErrorSnackMessage]);

  useEffect(() => {
    if (tenant) {
      getTenantIdentityProviderInfo();
    }
  }, [tenant, getTenantIdentityProviderInfo]);

  const updateTenantIdentityProvider = () => {
    setIsSending(true);
    let payload: ITenantIdentityProviderResponse = {};
    switch (idpSelection) {
      case "AD":
        payload.active_directory = {
          url: ADURL,
          lookup_bind_dn: ADLookupBindDN,
          lookup_bind_password: ADLookupBindPassword,
          user_dn_search_base_dn: ADUserDNSearchBaseDN,
          user_dn_search_filter: ADUserDNSearchFilter,
          group_search_base_dn: ADGroupSearchBaseDN,
          group_search_filter: ADGroupSearchFilter,
          skip_tls_verification: ADSkipTLS,
          server_insecure: ADServerInsecure,
          server_start_tls: ADServerStartTLS,
        };
        break;
      case "OpenID":
        payload.oidc = {
          configuration_url: openIDConfigurationURL,
          client_id: openIDClientID,
          secret_id: openIDSecretID,
          callback_url: openIDCallbackURL,
          claim_name: openIDClaimName,
          scopes: openIDScopes,
        };
        break;
      default:
      // Built-in IDP will be used by default
    }

    api
      .invoke(
        "POST",
        `/api/v1/namespaces/${tenant?.namespace}/tenants/${tenant?.name}/identity-provider`,
        payload
      )
      .then(() => {
        setIsSending(false);
        // Close confirmation modal
        setDialogOpen(false);
        getTenantIdentityProviderInfo();
      })
      .catch((err: ErrorResponseHandler) => {
        setErrorSnackMessage(err);
        setIsSending(false);
      });
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
        onConfirm={updateTenantIdentityProvider}
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
        <Fragment>
          <Grid item xs={12}>
            <h1 className={classes.sectionTitle}>Identity Provider</h1>
            <hr className={classes.hrClass} />
          </Grid>
          <Grid item xs={12} className={classes.protocolRadioOptions}>
            <RadioGroupSelector
              currentSelection={idpSelection}
              id="idp-options"
              name="idp-options"
              label="Protocol"
              onChange={(e) => {
                setIdpSelection(e.target.value);
              }}
              selectorOptions={[
                { label: "Built-in", value: "Built-in" },
                { label: "OpenID", value: "OpenID" },
                { label: "Active Directory", value: "AD" },
              ]}
            />
          </Grid>

          {idpSelection === "OpenID" && (
            <Fragment>
              <Grid item xs={12} className={classes.formFieldRow}>
                <InputBoxWrapper
                  id="openID_CONFIGURATION_URL"
                  name="openID_CONFIGURATION_URL"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setOpenIDConfigurationURL(e.target.value);
                    cleanValidation("openID_CONFIGURATION_URL");
                  }}
                  label="Configuration URL"
                  value={openIDConfigurationURL}
                  placeholder="https://your-identity-provider.com/.well-known/openid-configuration"
                  error={validationErrors["openID_CONFIGURATION_URL"] || ""}
                  required
                />
              </Grid>
              <Grid item xs={12} className={classes.formFieldRow}>
                <InputBoxWrapper
                  id="openID_clientID"
                  name="openID_clientID"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setOpenIDClientID(e.target.value);
                    cleanValidation("openID_clientID");
                  }}
                  label="Client ID"
                  value={openIDClientID}
                  error={validationErrors["openID_clientID"] || ""}
                  required
                />
              </Grid>
              <Grid item xs={12} className={classes.formFieldRow}>
                <InputBoxWrapper
                  type={showOIDCSecretID ? "text" : "password"}
                  id="openID_secretID"
                  name="openID_secretID"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setOpenIDSecretID(e.target.value);
                    cleanValidation("openID_secretID");
                  }}
                  label="Secret ID"
                  value={openIDSecretID}
                  error={validationErrors["openID_secretID"] || ""}
                  required
                  overlayIcon={
                    showOIDCSecretID ? (
                      <VisibilityOffIcon />
                    ) : (
                      <RemoveRedEyeIcon />
                    )
                  }
                  overlayAction={() => setShowOIDCSecretID(!showOIDCSecretID)}
                />
              </Grid>
              <Grid item xs={12} className={classes.formFieldRow}>
                <InputBoxWrapper
                  id="openID_callbackURL"
                  name="openID_callbackURL"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setOpenIDCallbackURL(e.target.value);
                    cleanValidation("openID_callbackURL");
                  }}
                  label="Callback URL"
                  value={openIDCallbackURL}
                  placeholder="https://your-console-endpoint:9443/oauth_callback"
                  error={validationErrors["openID_callbackURL"] || ""}
                />
              </Grid>
              <Grid item xs={12} className={classes.formFieldRow}>
                <InputBoxWrapper
                  id="openID_claimName"
                  name="openID_claimName"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setOpenIDClaimName(e.target.value);
                    cleanValidation("openID_claimName");
                  }}
                  label="Claim Name"
                  value={openIDClaimName}
                  error={validationErrors["openID_claimName"] || ""}
                  required
                />
              </Grid>
              <Grid item xs={12} className={classes.formFieldRow}>
                <InputBoxWrapper
                  id="openID_scopes"
                  name="openID_scopes"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setOpenIDScopes(e.target.value);
                    cleanValidation("openID_scopes");
                  }}
                  label="Scopes"
                  value={openIDScopes}
                />
              </Grid>
            </Fragment>
          )}

          {idpSelection === "AD" && (
            <Fragment>
              <Grid item xs={12} className={classes.formFieldRow}>
                <InputBoxWrapper
                  id="AD_URL"
                  name="AD_URL"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setADURL(e.target.value);
                    cleanValidation("AD_URL");
                  }}
                  label="LDAP Server Address"
                  value={ADURL}
                  placeholder="ldap-server:636"
                  error={validationErrors["AD_URL"] || ""}
                  required
                />
              </Grid>
              <Grid item xs={12} className={classes.formFieldRow}>
                <FormSwitchWrapper
                  value="ad_skipTLS"
                  id="ad_skipTLS"
                  name="ad_skipTLS"
                  checked={ADSkipTLS}
                  onChange={(e) => {
                    const targetD = e.target;
                    const checked = targetD.checked;
                    setADSkipTLS(checked);
                  }}
                  label={"Skip TLS Verification"}
                />
              </Grid>
              <Grid item xs={12} className={classes.formFieldRow}>
                <FormSwitchWrapper
                  value="ad_serverInsecure"
                  id="ad_serverInsecure"
                  name="ad_serverInsecure"
                  checked={ADServerInsecure}
                  onChange={(e) => {
                    const targetD = e.target;
                    const checked = targetD.checked;
                    setADServerInsecure(checked);
                  }}
                  label={"Server Insecure"}
                />
              </Grid>
              {ADServerInsecure ? (
                <Grid item xs={12}>
                  <Typography
                    className={classes.error}
                    variant="caption"
                    display="block"
                    gutterBottom
                  >
                    Warning: All traffic with Active Directory will be
                    unencrypted
                  </Typography>
                  <br />
                </Grid>
              ) : null}
              <Grid item xs={12} className={classes.formFieldRow}>
                <FormSwitchWrapper
                  value="ad_serverStartTLS"
                  id="ad_serverStartTLS"
                  name="ad_serverStartTLS"
                  checked={ADServerStartTLS}
                  onChange={(e) => {
                    const targetD = e.target;
                    const checked = targetD.checked;
                    setADServerStartTLS(checked);
                  }}
                  label={"Start TLS connection to AD/LDAP server"}
                />
              </Grid>
              <Grid item xs={12} className={classes.formFieldRow}>
                <InputBoxWrapper
                  id="ad_lookupBindDN"
                  name="ad_lookupBindDN"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setADLookupBindDN(e.target.value);
                    cleanValidation("ad_lookupBindDN");
                  }}
                  label="Lookup Bind DN"
                  value={ADLookupBindDN}
                  placeholder="cn=admin,dc=min,dc=io"
                  error={validationErrors["ad_lookupBindDN"] || ""}
                  required
                />
              </Grid>
              <Grid item xs={12} className={classes.formFieldRow}>
                <InputBoxWrapper
                  type={showADLookupBindPassword ? "text" : "password"}
                  id="ad_lookupBindPassword"
                  name="ad_lookupBindPassword"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setADLookupBindPassword(e.target.value);
                  }}
                  label="Lookup Bind Password"
                  value={ADLookupBindPassword}
                  placeholder="admin"
                  overlayIcon={
                    showADLookupBindPassword ? (
                      <VisibilityOffIcon />
                    ) : (
                      <RemoveRedEyeIcon />
                    )
                  }
                  overlayAction={() =>
                    setShowADLookupBindPassword(!showADLookupBindPassword)
                  }
                />
              </Grid>
              <Grid item xs={12} className={classes.formFieldRow}>
                <InputBoxWrapper
                  id="ad_userDNSearchBaseDN"
                  name="ad_userDNSearchBaseDN"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setADUserDNSearchBaseDN(e.target.value);
                  }}
                  label="User DN Search Base DN"
                  value={ADUserDNSearchBaseDN}
                  placeholder="dc=min,dc=io"
                />
              </Grid>
              <Grid item xs={12} className={classes.formFieldRow}>
                <InputBoxWrapper
                  id="ad_userDNSearchFilter"
                  name="ad_userDNSearchFilter"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setADUserDNSearchFilter(e.target.value);
                  }}
                  label="User DN Search Filter"
                  value={ADUserDNSearchFilter}
                  placeholder="(sAMAcountName=%s)"
                />
              </Grid>
              <Grid item xs={12} className={classes.formFieldRow}>
                <InputBoxWrapper
                  id="ad_groupSearchBaseDN"
                  name="ad_groupSearchBaseDN"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setADGroupSearchBaseDN(e.target.value);
                  }}
                  label="Group Search Base DN"
                  value={ADGroupSearchBaseDN}
                  placeholder="ou=hwengg,dc=min,dc=io;ou=swengg,dc=min,dc=io"
                />
              </Grid>
              <Grid item xs={12} className={classes.formFieldRow}>
                <InputBoxWrapper
                  id="ad_groupSearchFilter"
                  name="ad_groupSearchFilter"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setADGroupSearchFilter(e.target.value);
                  }}
                  label="Group Search Filter"
                  value={ADGroupSearchFilter}
                  placeholder="(&(objectclass=groupOfNames)(member=%s))"
                />
              </Grid>
            </Fragment>
          )}

          <Grid item xs={12} className={classes.buttonContainer}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!isFormValid || isSending}
              onClick={() => setDialogOpen(true)}
            >
              Save
            </Button>
          </Grid>
        </Fragment>
      )}
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
};

const connector = connect(mapState, mapDispatchToProps);

export default withStyles(styles)(connector(TenantIdentityProvider));
