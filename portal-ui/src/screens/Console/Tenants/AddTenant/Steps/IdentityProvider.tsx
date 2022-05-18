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
import { useDispatch, useSelector } from "react-redux";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Grid, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import CasinoIcon from "@mui/icons-material/Casino";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  createTenantCommon,
  formFieldStyles,
  modalBasic,
  wizardCommon,
} from "../../../Common/FormComponents/common/styleLibrary";

import {
  commonFormValidation,
  IValidation,
} from "../../../../../utils/validationFunctions";
import { AppState } from "../../../../../store";
import { clearValidationError, getRandomString } from "../../utils";
import RadioGroupSelector from "../../../Common/FormComponents/RadioGroupSelector/RadioGroupSelector";
import InputBoxWrapper from "../../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import FormSwitchWrapper from "../../../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "../../../../../icons/RemoveIcon";
import { isPageValid, updateAddField } from "../../tenantsSlice";

interface IIdentityProviderProps {
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    shortened: {
      gridTemplateColumns: "auto auto 50px 50px",
      display: "grid",
      gridGap: 15,
      marginBottom: 10,
      "& input": {
        fontWeight: 400,
      },
    },
    buttonTray: {
      marginLeft: 10,
      display: "flex",
      height: 38,
      "& button": {
        background: "#EAEAEA",
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
    protocolRadioOptions: {
      display: "flex",
      flexFlow: "column",
      marginBottom: 10,

      "& label": {
        fontSize: 14,
      },
      "& div": {
        display: "flex",
        flexFlow: "column",
        alignItems: "baseline",
      },
    },
    adUserDnRows: {
      display: "flex",
    },
    ...createTenantCommon,
    ...formFieldStyles,
    ...modalBasic,
    ...wizardCommon,
  });

const IdentityProvider = ({ classes }: IIdentityProviderProps) => {
  const dispatch = useDispatch();

  const idpSelection = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.identityProvider.idpSelection
  );
  const accessKeys = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.identityProvider.accessKeys
  );
  const secretKeys = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.identityProvider.secretKeys
  );
  const openIDConfigurationURL = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.identityProvider.openIDConfigurationURL
  );
  const openIDClientID = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.identityProvider.openIDClientID
  );
  const openIDSecretID = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.identityProvider.openIDSecretID
  );
  const openIDCallbackURL = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.identityProvider.openIDCallbackURL
  );
  const openIDClaimName = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.identityProvider.openIDClaimName
  );
  const openIDScopes = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.identityProvider.openIDScopes
  );
  const ADURL = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.identityProvider.ADURL
  );
  const ADSkipTLS = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.identityProvider.ADSkipTLS
  );
  const ADServerInsecure = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.identityProvider.ADServerInsecure
  );
  const ADGroupSearchBaseDN = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.identityProvider.ADGroupSearchBaseDN
  );
  const ADGroupSearchFilter = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.identityProvider.ADGroupSearchFilter
  );
  const ADUserDNs = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.identityProvider.ADUserDNs
  );
  const ADLookupBindDN = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.identityProvider.ADLookupBindDN
  );
  const ADLookupBindPassword = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.identityProvider.ADLookupBindPassword
  );
  const ADUserDNSearchBaseDN = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.identityProvider.ADUserDNSearchBaseDN
  );
  const ADUserDNSearchFilter = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.identityProvider.ADUserDNSearchFilter
  );
  const ADServerStartTLS = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.identityProvider.ADServerStartTLS
  );

  const [validationErrors, setValidationErrors] = useState<any>({});

  const updateField = useCallback(
    (field: string, value: any) => {
      dispatch(
        updateAddField({
          pageName: "identityProvider",
          field: field,
          value: value,
        })
      );
    },
    [dispatch]
  );
  const updateUserField = (index: number, value: string) => {
    const newUserField = [...accessKeys];
    newUserField[index] = value;
    updateField("accessKeys", newUserField);
  };
  const updatePwordField = (index: number, value: string) => {
    const newUserField = [...secretKeys];
    newUserField[index] = value;
    updateField("secretKeys", newUserField);
  };
  const updateADUserField = (index: number, value: string) => {
    const newADUserDNsField = [...ADUserDNs];
    newADUserDNsField[index] = value;
    updateField("ADUserDNs", newADUserDNsField);
  };
  const cleanValidation = (fieldName: string) => {
    setValidationErrors(clearValidationError(validationErrors, fieldName));
  };

  // Validation

  useEffect(() => {
    let customIDPValidation: IValidation[] = [];

    if (idpSelection === "Built-in") {
      customIDPValidation = [...customIDPValidation];
      for (var i = 0; i < accessKeys.length; i++) {
        customIDPValidation.push({
          fieldKey: `accesskey-${i.toString()}`,
          required: true,
          value: accessKeys[i],
          pattern: /^[a-zA-Z0-9-]{8,63}$/,
          customPatternMessage: "Keys must be at least length 8",
        });
        customIDPValidation.push({
          fieldKey: `secretkey-${i.toString()}`,
          required: true,
          value: secretKeys[i],
          pattern: /^[a-zA-Z0-9-]{8,63}$/,
          customPatternMessage: "Keys must be at least length 8",
        });
      }
    }

    if (idpSelection === "OpenID") {
      customIDPValidation = [
        ...customIDPValidation,
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
      customIDPValidation = [
        ...customIDPValidation,
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
      // validate user DNs
      for (let i = 0; i < ADUserDNs.length; i++) {
        customIDPValidation.push({
          fieldKey: `ad-userdn-${i.toString()}`,
          required: true,
          value: ADUserDNs[i],
        });
      }
    }

    const commonVal = commonFormValidation(customIDPValidation);

    dispatch(
      isPageValid({
        pageName: "identityProvider",
        valid: Object.keys(commonVal).length === 0,
      })
    );

    setValidationErrors(commonVal);
  }, [
    ADLookupBindDN,
    idpSelection,
    accessKeys,
    secretKeys,
    openIDClientID,
    openIDSecretID,
    ADURL,
    ADGroupSearchBaseDN,
    ADGroupSearchFilter,
    ADUserDNs,
    dispatch,
    openIDConfigurationURL,
    openIDClaimName,
  ]);
  let inputs = null;
  if (idpSelection === "Built-in") {
    inputs = accessKeys.map((_, index) => {
      return (
        <Fragment key={`identityField-${index.toString()}`}>
          <div className={classes.shortened}>
            <InputBoxWrapper
              id={`accesskey-${index.toString()}`}
              label={""}
              placeholder={"Access Key"}
              name={`accesskey-${index.toString()}`}
              value={accessKeys[index]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                updateUserField(index, e.target.value);
                cleanValidation(`accesskey-${index.toString()}`);
              }}
              index={index}
              key={`csv-accesskey-${index.toString()}`}
              error={validationErrors[`accesskey-${index.toString()}`] || ""}
            />
            <InputBoxWrapper
              id={`secretkey-${index.toString()}`}
              label={""}
              placeholder={"Secret Key"}
              name={`secretkey-${index.toString()}`}
              value={secretKeys[index]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                updatePwordField(index, e.target.value);
                cleanValidation(`secretkey-${index.toString()}`);
              }}
              index={index}
              key={`csv-secretkey-${index.toString()}`}
              error={validationErrors[`secretkey-${index.toString()}`] || ""}
            />
            <div className={classes.buttonTray}>
              <Tooltip title="Add User" aria-label="add">
                <div className={classes.overlayAction}>
                  <IconButton
                    size={"small"}
                    onClick={() => {
                      accessKeys.push("");
                      secretKeys.push("");
                      updateUserField(accessKeys.length - 1, "");
                      updatePwordField(secretKeys.length - 1, "");
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </div>
              </Tooltip>
              <Tooltip title="Remove" aria-label="add">
                <div className={classes.overlayAction}>
                  <IconButton
                    size={"small"}
                    onClick={() => {
                      if (accessKeys.length > 1) {
                        accessKeys.splice(index, 1);
                        secretKeys.splice(index, 1);
                        updateUserField(
                          accessKeys.length - 1,
                          accessKeys[accessKeys.length - 1]
                        );
                      }
                    }}
                  >
                    <RemoveIcon />
                  </IconButton>
                </div>
              </Tooltip>
              <Tooltip title="Randomize Credentials" aria-label="add">
                <div className={classes.overlayAction}>
                  <IconButton
                    onClick={() => {
                      updateUserField(index, getRandomString(16));
                      updatePwordField(index, getRandomString(32));
                    }}
                    size={"small"}
                  >
                    <CasinoIcon />
                  </IconButton>
                </div>
              </Tooltip>
            </div>
          </div>
        </Fragment>
      );
    });
  }
  if (idpSelection === "AD") {
    inputs = ADUserDNs.map((_, index) => {
      return (
        <Fragment key={`identityField-${index.toString()}`}>
          <div className={classes.adUserDnRows}>
            <InputBoxWrapper
              id={`ad-userdn-${index.toString()}`}
              label={""}
              placeholder=""
              name={`ad-userdn-${index.toString()}`}
              value={ADUserDNs[index]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                updateADUserField(index, e.target.value);
                cleanValidation(`ad-userdn-${index.toString()}`);
              }}
              index={index}
              key={`csv-ad-userdn-${index.toString()}`}
              error={validationErrors[`ad-userdn-${index.toString()}`] || ""}
            />
            <div className={classes.buttonTray}>
              <Tooltip title="Add User" aria-label="add">
                <IconButton
                  size={"small"}
                  onClick={() => {
                    ADUserDNs.push("");
                    updateADUserField(ADUserDNs.length - 1, "");
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Remove" aria-label="add">
                <IconButton
                  size={"small"}
                  style={{ marginLeft: 16 }}
                  onClick={() => {
                    if (ADUserDNs.length > 1) {
                      ADUserDNs.splice(index, 1);
                      updateUserField(
                        ADUserDNs.length - 1,
                        ADUserDNs[ADUserDNs.length - 1]
                      );
                    }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </Fragment>
      );
    });
  }
  return (
    <Paper className={classes.paperWrapper}>
      <div className={classes.headerElement}>
        <h3 className={classes.h3Section}>Identity Provider</h3>
        <span className={classes.descriptionText}>
          Access to the tenant can be controlled via an external Identity
          Manager.
        </span>
      </div>
      <Grid item xs={12} className={classes.protocolRadioOptions}>
        <label>Protocol</label>
        <RadioGroupSelector
          currentSelection={idpSelection}
          id="idp-options"
          name="idp-options"
          label=" "
          onChange={(e) => {
            updateField("idpSelection", e.target.value);
          }}
          selectorOptions={[
            { label: "Built-in", value: "Built-in" },
            { label: "OpenID", value: "OpenID" },
            { label: "Active Directory", value: "AD" },
          ]}
        />
      </Grid>
      {idpSelection === "Built-in" && (
        <Fragment>
          Add additional users
          {inputs}
        </Fragment>
      )}
      {idpSelection === "OpenID" && (
        <Fragment>
          <Grid item xs={12} className={classes.formFieldRow}>
            <InputBoxWrapper
              id="openID_CONFIGURATION_URL"
              name="openID_CONFIGURATION_URL"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                updateField("openIDConfigurationURL", e.target.value);
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
                updateField("openIDClientID", e.target.value);
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
              id="openID_secretID"
              name="openID_secretID"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                updateField("openIDSecretID", e.target.value);
                cleanValidation("openID_secretID");
              }}
              label="Secret ID"
              value={openIDSecretID}
              error={validationErrors["openID_secretID"] || ""}
              required
            />
          </Grid>
          <Grid item xs={12} className={classes.formFieldRow}>
            <InputBoxWrapper
              id="openID_callbackURL"
              name="openID_callbackURL"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                updateField("openIDCallbackURL", e.target.value);
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
                updateField("openIDClaimName", e.target.value);
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
                updateField("openIDScopes", e.target.value);
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
                updateField("ADURL", e.target.value);
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
                updateField("ADSkipTLS", checked);
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
                updateField("ADServerInsecure", checked);
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
                Warning: All traffic with Active Directory will be unencrypted
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
                updateField("ADServerStartTLS", checked);
              }}
              label={"Start TLS connection to AD/LDAP server"}
            />
          </Grid>
          <Grid item xs={12} className={classes.formFieldRow}>
            <InputBoxWrapper
              id="ad_lookupBindDN"
              name="ad_lookupBindDN"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                updateField("ADLookupBindDN", e.target.value);
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
              id="ad_lookupBindPassword"
              name="ad_lookupBindPassword"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                updateField("ADLookupBindPassword", e.target.value);
              }}
              label="Lookup Bind Password"
              value={ADLookupBindPassword}
              placeholder="admin"
            />
          </Grid>
          <Grid item xs={12} className={classes.formFieldRow}>
            <InputBoxWrapper
              id="ad_userDNSearchBaseDN"
              name="ad_userDNSearchBaseDN"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                updateField("ADUserDNSearchBaseDN", e.target.value);
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
                updateField("ADUserDNSearchFilter", e.target.value);
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
                updateField("ADGroupSearchBaseDN", e.target.value);
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
                updateField("ADGroupSearchFilter", e.target.value);
              }}
              label="Group Search Filter"
              value={ADGroupSearchFilter}
              placeholder="(&(objectclass=groupOfNames)(member=%s))"
            />
          </Grid>
          <fieldset className={classes.fieldGroup}>
            <legend className={classes.descriptionText}>
              List of user DNs (Distinguished Names) to be Tenant Administrators
            </legend>
            <Grid item xs={12}>
              {inputs}
            </Grid>
          </fieldset>
        </Fragment>
      )}
    </Paper>
  );
};

export default withStyles(styles)(IdentityProvider);
