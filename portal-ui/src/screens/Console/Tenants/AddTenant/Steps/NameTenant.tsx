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

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { connect } from "react-redux";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import get from "lodash/get";
import debounce from "lodash/debounce";
import Grid from "@material-ui/core/Grid";
import {
  modalBasic,
  wizardCommon,
} from "../../../Common/FormComponents/common/styleLibrary";
import { setModalErrorSnackMessage } from "../../../../../actions";
import {
  setAdvancedMode,
  updateAddField,
  isPageValid,
  setStorageClassesList,
  setLimitSize,
} from "../../actions";
import {
  IQuotaElement,
  IQuotas,
  Opts,
  getLimitSizes,
} from "../../ListTenants/utils";
import { AppState } from "../../../../../store";
import { commonFormValidation } from "../../../../../utils/validationFunctions";
import { clearValidationError } from "../../utils";
import api from "../../../../../common/api";
import InputBoxWrapper from "../../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import SelectWrapper from "../../../Common/FormComponents/SelectWrapper/SelectWrapper";
import FormSwitchWrapper from "../../../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";

const styles = (theme: Theme) =>
  createStyles({
    buttonContainer: {
      textAlign: "right",
    },
    ...modalBasic,
    ...wizardCommon,
  });

interface INameTenantScreen {
  classes: any;
  storageClasses: Opts[];
  setModalErrorSnackMessage: typeof setModalErrorSnackMessage;
  setAdvancedMode: typeof setAdvancedMode;
  updateAddField: typeof updateAddField;
  isPageValid: typeof isPageValid;
  setStorageClassesList: typeof setStorageClassesList;
  setLimitSize: typeof setLimitSize;
  tenantName: string;
  namespace: string;
  selectedStorageClass: string;
  advancedMode: boolean;
}

const NameTenant = ({
  classes,
  storageClasses,
  advancedMode,
  tenantName,
  namespace,
  selectedStorageClass,
  setAdvancedMode,
  updateAddField,
  setStorageClassesList,
  setLimitSize,
  isPageValid,
  setModalErrorSnackMessage,
}: INameTenantScreen) => {
  const [validationErrors, setValidationErrors] = useState<any>({});
  const [emptyNamespace, setEmptyNamespace] = useState<boolean>(true);
  const [loadingNamespaceInfo, setLoadingNamespaceInfo] =
    useState<boolean>(false);

  // Common
  const updateField = useCallback(
    (field: string, value: string) => {
      updateAddField("nameTenant", field, value);
    },
    [updateAddField]
  );

  // Storage classes retrieval
  const getNamespaceInformation = useCallback(() => {
    updateField("selectedStorageClass", "");

    setStorageClassesList([]);

    // Empty tenantValidation
    api
      .invoke("GET", `/api/v1/namespaces/${namespace}/tenants`)
      .then((res: any[]) => {
        const tenantsList = get(res, "tenants", []);

        if (tenantsList && tenantsList.length > 0) {
          setEmptyNamespace(false);
          setLoadingNamespaceInfo(false);
          return;
        }
        setEmptyNamespace(true);

        // Storagequotas retrieval
        api
          .invoke(
            "GET",
            `/api/v1/namespaces/${namespace}/resourcequotas/${namespace}-storagequota`
          )
          .then((res: IQuotas) => {
            const elements: IQuotaElement[] = get(res, "elements", []);
            setLimitSize(getLimitSizes(res));

            const newStorage = elements.map((storageClass: any) => {
              const name = get(storageClass, "name", "").split(
                ".storageclass.storage.k8s.io/requests.storage"
              )[0];

              return { label: name, value: name };
            });

            setStorageClassesList(newStorage);
            if (newStorage.length > 0) {
              updateField("selectedStorageClass", newStorage[0].value);
            }
            setLoadingNamespaceInfo(false);
          })
          .catch((err: any) => {
            setLoadingNamespaceInfo(false);
            console.error("Namespace error: ", err);
          });
      })
      .catch((err: any) => {
        console.error(err);
        setModalErrorSnackMessage(
          "Error validating if namespace already has tenants"
        );
      });
  }, [
    namespace,
    setLimitSize,
    setModalErrorSnackMessage,
    setStorageClassesList,
    updateField,
  ]);

  const debounceNamespace = useMemo(
    () => debounce(getNamespaceInformation, 500),
    [getNamespaceInformation]
  );

  useEffect(() => {
    if (namespace !== "") {
      debounceNamespace();
      setLoadingNamespaceInfo(true);

      // Cancel previous debounce calls during useEffect cleanup.
      return debounceNamespace.cancel;
    }
  }, [debounceNamespace, namespace]);

  // Validation
  useEffect(() => {
    let customNamespaceError = false;
    let errorMessage = "";

    if (!emptyNamespace && !loadingNamespaceInfo) {
      customNamespaceError = true;
      errorMessage = "You can only create one tenant per namespace";
    } else if (
      storageClasses.length < 1 &&
      emptyNamespace &&
      !loadingNamespaceInfo
    ) {
      customNamespaceError = true;
      errorMessage = "Please enter a valid namespace";
    }

    const commonValidation = commonFormValidation([
      {
        fieldKey: "tenant-name",
        required: true,
        pattern: /^[a-z0-9-]{3,63}$/,
        customPatternMessage:
          "Name only can contain lowercase letters, numbers and '-'. Min. Length: 3",
        value: tenantName,
      },
      {
        fieldKey: "namespace",
        required: true,
        value: namespace,
        customValidation: customNamespaceError,
        customValidationMessage: errorMessage,
      },
    ]);

    const isValid =
      !("tenant-name" in commonValidation) &&
      !("namespace" in commonValidation) &&
      storageClasses.length > 0;

    isPageValid("nameTenant", isValid);

    setValidationErrors(commonValidation);
  }, [
    storageClasses,
    namespace,
    tenantName,
    isPageValid,
    emptyNamespace,
    loadingNamespaceInfo,
  ]);

  const frmValidationCleanup = (fieldName: string) => {
    setValidationErrors(clearValidationError(validationErrors, fieldName));
  };

  return (
    <React.Fragment>
      <div className={classes.headerElement}>
        <h3 className={classes.h3Section}>Name Tenant</h3>
        <span className={classes.descriptionText}>
          How would you like to name this new tenant?
        </span>
      </div>
      <Grid item xs={12}>
        <InputBoxWrapper
          id="tenant-name"
          name="tenant-name"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            updateField("tenantName", e.target.value);
            frmValidationCleanup("tenant-name");
          }}
          label="Name"
          value={tenantName}
          required
          error={validationErrors["tenant-name"] || ""}
        />
      </Grid>
      <Grid item xs={12}>
        <InputBoxWrapper
          id="namespace"
          name="namespace"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            updateField("namespace", e.target.value);
            frmValidationCleanup("namespace");
          }}
          label="Namespace"
          value={namespace}
          error={validationErrors["namespace"] || ""}
          required
        />
      </Grid>
      <Grid item xs={12}>
        <SelectWrapper
          id="storage_class"
          name="storage_class"
          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
            updateField("selectedStorageClass", e.target.value as string);
          }}
          label="Storage Class"
          value={selectedStorageClass}
          options={storageClasses}
          disabled={storageClasses.length < 1}
        />
      </Grid>
      <Grid item xs={12}>
        <br />
        <span className={classes.descriptionText}>
          Check 'Advanced Mode' for additional configuration options, such as
          configuring an Identity Provider, Encryption at rest, and customized
          TLS/SSL Certificates.
          <br />
          Leave 'Advanced Mode' unchecked to use the secure default settings for
          the tenant.
        </span>
        <br />
        <br />
        <FormSwitchWrapper
          value="adv_mode"
          id="adv_mode"
          name="adv_mode"
          checked={advancedMode}
          onChange={(e) => {
            const targetD = e.target;
            const checked = targetD.checked;

            setAdvancedMode(checked);
          }}
          label={"Advanced Mode"}
        />
      </Grid>
    </React.Fragment>
  );
};

const mapState = (state: AppState) => ({
  advancedMode: state.tenants.createTenant.advancedModeOn,
  tenantName: state.tenants.createTenant.fields.nameTenant.tenantName,
  namespace: state.tenants.createTenant.fields.nameTenant.namespace,
  selectedStorageClass:
    state.tenants.createTenant.fields.nameTenant.selectedStorageClass,
  storageClasses: state.tenants.createTenant.storageClasses,
});

const connector = connect(mapState, {
  setModalErrorSnackMessage,
  setAdvancedMode,
  updateAddField,
  setStorageClassesList,
  setLimitSize,
  isPageValid,
});

export default withStyles(styles)(connector(NameTenant));
