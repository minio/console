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

import React, { useEffect, useState, useCallback, Fragment } from "react";
import { connect } from "react-redux";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { Grid, Typography } from "@material-ui/core";
import {
  modalBasic,
  wizardCommon,
} from "../../../Common/FormComponents/common/styleLibrary";
import { updateAddField, isPageValid } from "../../actions";
import {
  commonFormValidation,
  IValidation,
} from "../../../../../utils/validationFunctions";
import { AppState } from "../../../../../store";
import { clearValidationError } from "../../utils";
import RadioGroupSelector from "../../../Common/FormComponents/RadioGroupSelector/RadioGroupSelector";
import InputBoxWrapper from "../../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import FormSwitchWrapper from "../../../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";

interface IIdentityProviderProps {
  classes: any;
  idpSelection: string;
  openIDURL: string;
  openIDClientID: string;
  openIDSecretID: string;
  ADURL: string;
  ADSkipTLS: boolean;
  ADServerInsecure: boolean;
  ADUserNameFilter: string;
  ADGroupBaseDN: string;
  ADGroupSearchFilter: string;
  ADNameAttribute: string;
  updateAddField: typeof updateAddField;
  isPageValid: typeof isPageValid;
}

const styles = (theme: Theme) =>
  createStyles({
    buttonContainer: {
      textAlign: "right",
    },
    ...modalBasic,
    ...wizardCommon,
  });

const IdentityProvider = ({
  classes,
  idpSelection,
  openIDURL,
  openIDClientID,
  openIDSecretID,
  ADURL,
  ADSkipTLS,
  ADServerInsecure,
  ADUserNameFilter,
  ADGroupBaseDN,
  ADGroupSearchFilter,
  ADNameAttribute,
  updateAddField,
  isPageValid,
}: IIdentityProviderProps) => {
  const [validationErrors, setValidationErrors] = useState<any>({});

  // Common
  const updateField = useCallback(
    (field: string, value: any) => {
      updateAddField("identityProvider", field, value);
    },
    [updateAddField]
  );

  const cleanValidation = (fieldName: string) => {
    setValidationErrors(clearValidationError(validationErrors, fieldName));
  };

  // Validation

  useEffect(() => {
    let customIDPValidation: IValidation[] = [];

    if (idpSelection === "Built-in") {
      isPageValid("identityProvider", true);
      setValidationErrors({});

      return;
    }

    if (idpSelection === "OpenID") {
      customIDPValidation = [
        ...customIDPValidation,
        {
          fieldKey: "openID_URL",
          required: true,
          value: openIDURL,
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
          fieldKey: "ad_userNameFilter",
          required: true,
          value: ADUserNameFilter,
        },
        {
          fieldKey: "ad_groupBaseDN",
          required: true,
          value: ADGroupBaseDN,
        },
        {
          fieldKey: "ad_groupSearchFilter",
          required: true,
          value: ADGroupSearchFilter,
        },
        {
          fieldKey: "ad_nameAttribute",
          required: true,
          value: ADNameAttribute,
        },
      ];
    }

    const commonVal = commonFormValidation(customIDPValidation);

    isPageValid("identityProvider", Object.keys(commonVal).length === 0);

    setValidationErrors(commonVal);
  }, [
    idpSelection,
    openIDURL,
    openIDClientID,
    openIDSecretID,
    ADURL,
    ADUserNameFilter,
    ADGroupBaseDN,
    ADGroupSearchFilter,
    ADNameAttribute,
    isPageValid,
  ]);

  return (
    <Fragment>
      <div className={classes.headerElement}>
        <h3 className={classes.h3Section}>Identity Provider</h3>
        <span className={classes.descriptionText}>
          Access to the tenant can be controlled via an external Identity
          Manager.
        </span>
      </div>
      <Grid item xs={12}>
        <RadioGroupSelector
          currentSelection={idpSelection}
          id="idp-options"
          name="idp-options"
          label="Protocol"
          onChange={(e) => {
            updateField("idpSelection", e.target.value);
          }}
          selectorOptions={[
            { label: "Built-in", value: "Built-in" },
            { label: "OpenID", value: "OpenID" },
            { label: "Active Directory", value: "AD" },
          ]}
        />
        MinIO supports both OpenID and Active Directory
      </Grid>

      {idpSelection === "OpenID" && (
        <Fragment>
          <Grid item xs={12}>
            <InputBoxWrapper
              id="openID_URL"
              name="openID_URL"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                updateField("openIDURL", e.target.value);
                cleanValidation("openID_URL");
              }}
              label="URL"
              value={openIDURL}
              error={validationErrors["openID_URL"] || ""}
              required
            />
          </Grid>
          <Grid item xs={12}>
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
          <Grid item xs={12}>
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
        </Fragment>
      )}
      {idpSelection === "AD" && (
        <Fragment>
          <Grid item xs={12}>
            <InputBoxWrapper
              id="AD_URL"
              name="AD_URL"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                updateField("ADURL", e.target.value);
                cleanValidation("AD_URL");
              }}
              label="URL"
              value={ADURL}
              error={validationErrors["AD_URL"] || ""}
              required
            />
          </Grid>
          <Grid item xs={12}>
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
          <Grid item xs={12}>
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
          <Grid item xs={12}>
            <InputBoxWrapper
              id="ad_userNameFilter"
              name="ad_userNameFilter"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                updateField("ADUserNameFilter", e.target.value);
                cleanValidation("ad_userNameFilter");
              }}
              label="User Search Filter"
              value={ADUserNameFilter}
              error={validationErrors["ad_userNameFilter"] || ""}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <InputBoxWrapper
              id="ad_groupBaseDN"
              name="ad_groupBaseDN"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                updateField("ADGroupBaseDN", e.target.value);
                cleanValidation("ad_groupBaseDN");
              }}
              label="Group Search Base DN"
              value={ADGroupBaseDN}
              error={validationErrors["ad_groupBaseDN"] || ""}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <InputBoxWrapper
              id="ad_groupSearchFilter"
              name="ad_groupSearchFilter"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                updateField("ADGroupSearchFilter", e.target.value);
                cleanValidation("ad_groupSearchFilter");
              }}
              label="Group Search Filter"
              value={ADGroupSearchFilter}
              error={validationErrors["ad_groupSearchFilter"] || ""}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <InputBoxWrapper
              id="ad_nameAttribute"
              name="ad_nameAttribute"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                updateField("ADNameAttribute", e.target.value);
                cleanValidation("ad_nameAttribute");
              }}
              label="Group Name Attribute"
              value={ADNameAttribute}
              error={validationErrors["ad_nameAttribute"] || ""}
              required
            />
          </Grid>
        </Fragment>
      )}
    </Fragment>
  );
};

const mapState = (state: AppState) => ({
  idpSelection: state.tenants.createTenant.fields.identityProvider.idpSelection,
  openIDURL: state.tenants.createTenant.fields.identityProvider.openIDURL,
  openIDClientID:
    state.tenants.createTenant.fields.identityProvider.openIDClientID,
  openIDSecretID:
    state.tenants.createTenant.fields.identityProvider.openIDSecretID,
  ADURL: state.tenants.createTenant.fields.identityProvider.ADURL,
  ADSkipTLS: state.tenants.createTenant.fields.identityProvider.ADSkipTLS,
  ADServerInsecure:
    state.tenants.createTenant.fields.identityProvider.ADServerInsecure,
  ADUserNameFilter:
    state.tenants.createTenant.fields.identityProvider.ADUserNameFilter,
  ADGroupBaseDN:
    state.tenants.createTenant.fields.identityProvider.ADGroupBaseDN,
  ADGroupSearchFilter:
    state.tenants.createTenant.fields.identityProvider.ADGroupSearchFilter,
  ADNameAttribute:
    state.tenants.createTenant.fields.identityProvider.ADNameAttribute,
});

const connector = connect(mapState, {
  updateAddField,
  isPageValid,
});

export default withStyles(styles)(connector(IdentityProvider));
