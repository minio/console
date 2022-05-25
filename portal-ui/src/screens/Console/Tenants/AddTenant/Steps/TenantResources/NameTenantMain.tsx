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
import { useDispatch, useSelector } from "react-redux";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import get from "lodash/get";
import debounce from "lodash/debounce";
import Grid from "@mui/material/Grid";
import {
  formFieldStyles,
  modalBasic,
  wizardCommon,
} from "../../../../Common/FormComponents/common/styleLibrary";

import {
  getLimitSizes,
  IQuotaElement,
  IQuotas,
} from "../../../ListTenants/utils";
import { AppState } from "../../../../../../store";
import { commonFormValidation } from "../../../../../../utils/validationFunctions";
import { clearValidationError } from "../../../utils";
import { ErrorResponseHandler } from "../../../../../../common/types";
import api from "../../../../../../common/api";
import InputBoxWrapper from "../../../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import SelectWrapper from "../../../../Common/FormComponents/SelectWrapper/SelectWrapper";
import AddIcon from "../../../../../../icons/AddIcon";
import AddNamespaceModal from "../helpers/AddNamespaceModal";
import SizePreview from "../SizePreview";
import TenantSize from "./TenantSize";
import { Paper, SelectChangeEvent } from "@mui/material";
import { IMkEnvs, mkPanelConfigurations } from "./utils";
import { setModalErrorSnackMessage } from "../../../../../../systemSlice";
import {
  isPageValid,
  setLimitSize,
  setStorageClassesList,
  setStorageType,
  updateAddField,
} from "../../../tenantsSlice";

const styles = (theme: Theme) =>
  createStyles({
    sizePreview: {
      position: "fixed",
      marginLeft: 10,
      background: "#FFFFFF",
      border: "1px solid #EAEAEA",
      padding: 2,
    },
    ...formFieldStyles,
    ...modalBasic,
    ...wizardCommon,
  });

interface INameTenantMainScreen {
  classes: any;
  formToRender?: IMkEnvs;
}

const NameTenantMain = ({ classes, formToRender }: INameTenantMainScreen) => {
  const dispatch = useDispatch();

  const tenantName = useSelector(
    (state: AppState) => state.tenants.createTenant.fields.nameTenant.tenantName
  );
  const namespace = useSelector(
    (state: AppState) => state.tenants.createTenant.fields.nameTenant.namespace
  );
  const selectedStorageClass = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.nameTenant.selectedStorageClass
  );
  const selectedStorageType = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.nameTenant.selectedStorageType
  );
  const storageClasses = useSelector(
    (state: AppState) => state.tenants.createTenant.storageClasses
  );
  const features = useSelector(
    (state: AppState) => state.console.session.features
  );

  const [validationErrors, setValidationErrors] = useState<any>({});
  const [emptyNamespace, setEmptyNamespace] = useState<boolean>(true);
  const [loadingNamespaceInfo, setLoadingNamespaceInfo] =
    useState<boolean>(false);
  const [showCreateButton, setShowCreateButton] = useState<boolean>(false);
  const [openAddNSConfirm, setOpenAddNSConfirm] = useState<boolean>(false);

  // Common
  const updateField = useCallback(
    (field: string, value: string) => {
      dispatch(
        updateAddField({ pageName: "nameTenant", field: field, value: value })
      );
    },
    [dispatch]
  );

  // Storage classes retrieval
  const getNamespaceInformation = useCallback(() => {
    setShowCreateButton(false);
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
            dispatch(setLimitSize(getLimitSizes(res)));

            const newStorage = elements.map((storageClass: any) => {
              const name = get(storageClass, "name", "").split(
                ".storageclass.storage.k8s.io/requests.storage"
              )[0];

              return { label: name, value: name };
            });

            dispatch(setStorageClassesList(newStorage));

            const stExists = newStorage.findIndex(
              (storageClass) => storageClass.value === selectedStorageClass
            );

            if (newStorage.length > 0 && stExists === -1) {
              updateField("selectedStorageClass", newStorage[0].value);
            } else if (newStorage.length === 0) {
              updateField("selectedStorageClass", "");
              dispatch(setStorageClassesList([]));
            }
            setLoadingNamespaceInfo(false);
          })
          .catch((err: ErrorResponseHandler) => {
            setLoadingNamespaceInfo(false);
            setShowCreateButton(true);
            updateField("selectedStorageClass", "");
            dispatch(setStorageClassesList([]));
            console.error("Namespace error: ", err);
          });
      })
      .catch((err: ErrorResponseHandler) => {
        dispatch(
          setModalErrorSnackMessage({
            errorMessage: "Error validating if namespace already has tenants",
            detailedError: err.detailedError,
          })
        );
      });
  }, [namespace, dispatch, updateField, selectedStorageClass]);

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
      ((formToRender === IMkEnvs.default && storageClasses.length > 0) ||
        (formToRender !== IMkEnvs.default && selectedStorageType !== ""));

    dispatch(isPageValid({ pageName: "nameTenant", valid: isValid }));

    setValidationErrors(commonValidation);
  }, [
    storageClasses,
    namespace,
    tenantName,
    dispatch,
    emptyNamespace,
    loadingNamespaceInfo,
    selectedStorageType,
    formToRender,
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
        <Grid item xs={8} md={9}>
          <Paper className={classes.paperWrapper} sx={{ minHeight: 550 }}>
            <Grid container>
              <Grid item xs={12}>
                <div className={classes.headerElement}>
                  <h3 className={classes.h3Section}>Name</h3>
                  <span className={classes.descriptionText}>
                    How would you like to name this new tenant?
                  </span>
                </div>
                <div className={classes.formFieldRow}>
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
                </div>
              </Grid>
              <Grid item xs={12} className={classes.formFieldRow}>
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
                  overlayId={"add-namespace"}
                  overlayIcon={showCreateButton ? <AddIcon /> : null}
                  overlayAction={addNamespace}
                  required
                />
              </Grid>
              {formToRender === IMkEnvs.default ? (
                <Grid item xs={12} className={classes.formFieldRow}>
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
              ) : (
                <Grid item xs={12} className={classes.formFieldRow}>
                  <SelectWrapper
                    id="storage_type"
                    name="storage_type"
                    onChange={(e: SelectChangeEvent<string>) => {
                      setStorageType({
                        storageType: e.target.value as string,
                        features: features,
                      });
                    }}
                    label={get(
                      mkPanelConfigurations,
                      `${formToRender}.variantSelectorLabel`,
                      "Storage Type"
                    )}
                    value={selectedStorageType}
                    options={get(
                      mkPanelConfigurations,
                      `${formToRender}.variantSelectorValues`,
                      []
                    )}
                  />
                </Grid>
              )}
              {formToRender === IMkEnvs.default ? (
                <TenantSize />
              ) : (
                get(
                  mkPanelConfigurations,
                  `${formToRender}.sizingComponent`,
                  null
                )
              )}
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={4} md={3}>
          <div className={classes.sizePreview}>
            <SizePreview />
          </div>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default withStyles(styles)(NameTenantMain);
