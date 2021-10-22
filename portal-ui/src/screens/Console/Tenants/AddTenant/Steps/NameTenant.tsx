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

import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { connect } from "react-redux";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import get from "lodash/get";
import debounce from "lodash/debounce";
import Grid from "@mui/material/Grid";
import {
  modalBasic,
  wizardCommon,
} from "../../../Common/FormComponents/common/styleLibrary";
import { setModalErrorSnackMessage } from "../../../../../actions";
import {
  isPageValid,
  setLimitSize,
  setStorageClassesList,
  updateAddField,
} from "../../actions";
import {
  getLimitSizes,
  IQuotaElement,
  IQuotas,
  Opts,
} from "../../ListTenants/utils";
import { AppState } from "../../../../../store";
import { commonFormValidation } from "../../../../../utils/validationFunctions";
import { clearValidationError } from "../../utils";
import { ErrorResponseHandler } from "../../../../../common/types";
import api from "../../../../../common/api";
import InputBoxWrapper from "../../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import SelectWrapper from "../../../Common/FormComponents/SelectWrapper/SelectWrapper";
import AddIcon from "../../../../../icons/AddIcon";
import AddNamespaceModal from "./helpers/AddNamespaceModal";
import SizePreview from "./SizePreview";
import TenantSize from "./TenantSize";
import { Paper, SelectChangeEvent } from "@mui/material";

const styles = (theme: Theme) =>
  createStyles({
    buttonContainer: {
      textAlign: "right",
    },
    sizePreview: {
      position: "fixed",
    },
    ...modalBasic,
    ...wizardCommon,
  });

interface INameTenantScreen {
  classes: any;
  storageClasses: Opts[];
  setModalErrorSnackMessage: typeof setModalErrorSnackMessage;
  updateAddField: typeof updateAddField;
  isPageValid: typeof isPageValid;
  setStorageClassesList: typeof setStorageClassesList;
  setLimitSize: typeof setLimitSize;
  tenantName: string;
  namespace: string;
  selectedStorageClass: string;
}

const NameTenant = ({
  classes,
  storageClasses,
  tenantName,
  namespace,
  selectedStorageClass,
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
  const [showCreateButton, setShowCreateButton] = useState<boolean>(false);
  const [openAddNSConfirm, setOpenAddNSConfirm] = useState<boolean>(false);

  // Common
  const updateField = useCallback(
    (field: string, value: string) => {
      updateAddField("nameTenant", field, value);
    },
    [updateAddField]
  );

  // Storage classes retrieval
  const getNamespaceInformation = useCallback(() => {
    setShowCreateButton(false);
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
          .catch((err: ErrorResponseHandler) => {
            setLoadingNamespaceInfo(false);
            setShowCreateButton(true);
            console.error("Namespace error: ", err);
          });
      })
      .catch((err: ErrorResponseHandler) => {
        setModalErrorSnackMessage({
          errorMessage: "Error validating if namespace already has tenants",
          detailedError: err.detailedError,
        });
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

  const addNamespace = () => {
    setOpenAddNSConfirm(true);
  };

  const closeAddNamespace = (refresh: boolean) => {
    setOpenAddNSConfirm(false);

    if (refresh) {
      debounceNamespace();
    }
  };

  return (
    <Fragment>
      {openAddNSConfirm && (
        <AddNamespaceModal
          addNamespaceOpen={openAddNSConfirm}
          closeAddNamespaceModalAndRefresh={closeAddNamespace}
          namespace={namespace}
        />
      )}
      <Grid container>
        <Grid item xs={8}>
          <Paper className={classes.paperWrapper}>
            <Grid container>
              <Grid item xs={12}>
                <div className={classes.headerElement}>
                  <h3 className={classes.h3Section}>Name Tenant</h3>
                  <span className={classes.descriptionText}>
                    How would you like to name this new tenant?
                  </span>
                </div>
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
                  overlayIcon={showCreateButton ? <AddIcon /> : null}
                  overlayAction={addNamespace}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <SelectWrapper
                  id="storage_class"
                  name="storage_class"
                  onChange={(e: SelectChangeEvent<string>) => {
                    updateField(
                      "selectedStorageClass",
                      e.target.value as string
                    );
                  }}
                  label="Storage Class"
                  value={selectedStorageClass}
                  options={storageClasses}
                  disabled={storageClasses.length < 1}
                />
              </Grid>
              <TenantSize />
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <div className={classes.sizePreview}>
            <SizePreview />
          </div>
        </Grid>
      </Grid>
    </Fragment>
  );
};

const mapState = (state: AppState) => ({
  tenantName: state.tenants.createTenant.fields.nameTenant.tenantName,
  namespace: state.tenants.createTenant.fields.nameTenant.namespace,
  selectedStorageClass:
    state.tenants.createTenant.fields.nameTenant.selectedStorageClass,
  storageClasses: state.tenants.createTenant.storageClasses,
});

const connector = connect(mapState, {
  setModalErrorSnackMessage,
  updateAddField,
  setStorageClassesList,
  setLimitSize,
  isPageValid,
});

export default withStyles(styles)(connector(NameTenant));
