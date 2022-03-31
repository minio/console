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

import { ITenant } from "./ListTenants/types";
import { Opts } from "./ListTenants/utils";
import {
  ADD_TENANT_ADD_CA_KEYPAIR,
  ADD_TENANT_ADD_CONSOLE_CA_KEYPAIR,
  ADD_TENANT_ADD_CONSOLE_CERT,
  ADD_TENANT_ADD_FILE_TO_CA_KEYPAIR,
  ADD_TENANT_ADD_FILE_TO_CONSOLE_CA_KEYPAIR,
  ADD_TENANT_ADD_FILE_TO_MINIO_KEYPAIR,
  ADD_TENANT_ADD_MINIO_KEYPAIR,
  ADD_TENANT_DELETE_CA_KEYPAIR,
  ADD_TENANT_DELETE_CONSOLE_CA_KEYPAIR,
  ADD_TENANT_DELETE_MINIO_KEYPAIR,
  ADD_TENANT_ENCRYPTION_CLIENT_CERT,
  ADD_TENANT_ENCRYPTION_GEMALTO_CA,
  ADD_TENANT_ENCRYPTION_SERVER_CERT,
  ADD_TENANT_ENCRYPTION_VAULT_CA,
  ADD_TENANT_ENCRYPTION_VAULT_CERT,
  ADD_TENANT_RESET_FORM,
  ADD_TENANT_SET_CURRENT_PAGE,
  ADD_TENANT_SET_LIMIT_SIZE,
  ADD_TENANT_SET_PAGE_VALID,
  ADD_TENANT_SET_STORAGE_CLASSES_LIST,
  ADD_TENANT_SET_STORAGE_TYPE,
  ADD_TENANT_UPDATE_FIELD,
  ADD_TENANT_SET_KEY_PAIR_VALUE,
  ADD_TENANT_SET_TOLERATION_VALUE,
  ADD_TENANT_ADD_NEW_TOLERATION,
  ADD_TENANT_REMOVE_TOLERATION_ROW,
  TENANT_DETAILS_SET_CURRENT_TENANT,
  TENANT_DETAILS_SET_LOADING,
  TENANT_DETAILS_SET_TAB,
  TENANT_DETAILS_SET_TENANT,
  LabelKeyPair,
  ADD_POOL_SET_LOADING,
  ADD_POOL_RESET_FORM,
  ADD_POOL_SET_VALUE,
  IAddPoolFields,
  ADD_POOL_SET_PAGE_VALID,
  ADD_POOL_SET_POOL_STORAGE_CLASSES,
  ADD_POOL_SET_TOLERATION_VALUE,
  ADD_POOL_ADD_NEW_TOLERATION,
  ADD_POOL_REMOVE_TOLERATION_ROW, ADD_POOL_SET_KEY_PAIR_VALUE,
} from "./types";
import { ITolerationModel } from "../../../common/types";

// Basic actions
export const setWizardPage = (page: number) => {
  return {
    type: ADD_TENANT_SET_CURRENT_PAGE,
    page,
  };
};

export const updateAddField = (
  pageName: string,
  fieldName: string,
  value: any
) => {
  return {
    type: ADD_TENANT_UPDATE_FIELD,
    pageName,
    field: fieldName,
    value,
  };
};

export const isPageValid = (pageName: string, valid: boolean) => {
  return {
    type: ADD_TENANT_SET_PAGE_VALID,
    pageName,
    valid,
  };
};

// Name Tenant actions

export const setStorageClassesList = (storageClasses: Opts[]) => {
  return {
    type: ADD_TENANT_SET_STORAGE_CLASSES_LIST,
    storageClasses,
  };
};

export const setStorageType = (storageType: string, features?: string[]) => {
  return {
    type: ADD_TENANT_SET_STORAGE_TYPE,
    storageType,
    features,
  };
};

export const setLimitSize = (limitSize: any) => {
  return {
    type: ADD_TENANT_SET_LIMIT_SIZE,
    limitSize,
  };
};

// Security actions

export const addCaCertificate = () => {
  return {
    type: ADD_TENANT_ADD_CA_KEYPAIR,
  };
};

export const deleteCaCertificate = (id: string) => {
  return {
    type: ADD_TENANT_DELETE_CA_KEYPAIR,
    id,
  };
};

export const addFileToCaCertificates = (
  id: string,
  key: string,
  fileName: string,
  value: string
) => {
  return {
    type: ADD_TENANT_ADD_FILE_TO_CA_KEYPAIR,
    id,
    key,
    fileName,
    value,
  };
};

export const addConsoleCaCertificate = () => {
  return {
    type: ADD_TENANT_ADD_CONSOLE_CA_KEYPAIR,
  };
};

export const deleteConsoleCaCertificate = (id: string) => {
  return {
    type: ADD_TENANT_DELETE_CONSOLE_CA_KEYPAIR,
    id,
  };
};

export const addFileToConsoleCaCertificates = (
  id: string,
  key: string,
  fileName: string,
  value: string
) => {
  return {
    type: ADD_TENANT_ADD_FILE_TO_CONSOLE_CA_KEYPAIR,
    id,
    key,
    fileName,
    value,
  };
};

export const addKeyPair = () => {
  return {
    type: ADD_TENANT_ADD_MINIO_KEYPAIR,
  };
};

export const deleteKeyPair = (id: string) => {
  return {
    type: ADD_TENANT_DELETE_MINIO_KEYPAIR,
    id,
  };
};

export const addFileToKeyPair = (
  id: string,
  key: string,
  fileName: string,
  value: string
) => {
  return {
    type: ADD_TENANT_ADD_FILE_TO_MINIO_KEYPAIR,
    id,
    key,
    fileName,
    value,
  };
};

export const addConsoleCertificate = (
  key: string,
  fileName: string,
  value: string
) => {
  return {
    type: ADD_TENANT_ADD_CONSOLE_CERT,
    key,
    fileName,
    value,
  };
};

export const addFileServerCert = (
  key: string,
  fileName: string,
  value: string
) => {
  return {
    type: ADD_TENANT_ENCRYPTION_SERVER_CERT,
    key,
    fileName,
    value,
  };
};

export const addFileClientCert = (
  key: string,
  fileName: string,
  value: string
) => {
  return {
    type: ADD_TENANT_ENCRYPTION_CLIENT_CERT,
    key,
    fileName,
    value,
  };
};

export const addFileVaultCert = (
  key: string,
  fileName: string,
  value: string
) => {
  return {
    type: ADD_TENANT_ENCRYPTION_VAULT_CERT,
    key,
    fileName,
    value,
  };
};

export const addFileVaultCa = (fileName: string, value: string) => {
  return {
    type: ADD_TENANT_ENCRYPTION_VAULT_CA,
    fileName,
    value,
  };
};

export const addFileGemaltoCa = (fileName: string, value: string) => {
  return {
    type: ADD_TENANT_ENCRYPTION_GEMALTO_CA,
    fileName,
    value,
  };
};

export const resetAddTenantForm = () => {
  return {
    type: ADD_TENANT_RESET_FORM,
  };
};

export const setTenantDetailsLoad = (loading: boolean) => {
  return {
    type: TENANT_DETAILS_SET_LOADING,
    state: loading,
  };
};

export const setTenantName = (tenantName: string, tenantNamespace: string) => {
  return {
    type: TENANT_DETAILS_SET_CURRENT_TENANT,
    name: tenantName,
    namespace: tenantNamespace,
  };
};

export const setTenantInfo = (tenant: ITenant | null) => {
  return {
    type: TENANT_DETAILS_SET_TENANT,
    tenant,
  };
};

export const setTenantTab = (tab: string) => {
  return {
    type: TENANT_DETAILS_SET_TAB,
    tab,
  };
};

export const setKeyValuePairs = (newArray: LabelKeyPair[]) => {
  return {
    type: ADD_TENANT_SET_KEY_PAIR_VALUE,
    newArray,
  };
};

export const setTolerationInfo = (
  index: number,
  tolerationValue: ITolerationModel
) => {
  return {
    type: ADD_TENANT_SET_TOLERATION_VALUE,
    index,
    toleration: tolerationValue,
  };
};

export const addNewToleration = () => {
  return {
    type: ADD_TENANT_ADD_NEW_TOLERATION,
  };
};

export const removeToleration = (index: number) => {
  return {
    type: ADD_TENANT_REMOVE_TOLERATION_ROW,
    index,
  };
};

// Add Pool

export const setPoolLoading = (state: boolean) => {
  return {
    type: ADD_POOL_SET_LOADING,
    state,
  };
};

export const resetPoolForm = () => {
  return {
    type: ADD_POOL_RESET_FORM,
  };
};

export const setPoolField = (
  page: keyof IAddPoolFields,
  field: string,
  value: any
) => {
  return {
    type: ADD_POOL_SET_VALUE,
    page,
    field,
    value,
  };
};

export const isPoolPageValid = (page: string, status: boolean) => {
  return {
    type: ADD_POOL_SET_PAGE_VALID,
    page,
    status,
  };
};

export const setPoolStorageClasses = (storageClasses: Opts[]) => {
  return {
    type: ADD_POOL_SET_POOL_STORAGE_CLASSES,
    storageClasses,
  };
};

export const setPoolTolerationInfo = (
  index: number,
  tolerationValue: ITolerationModel
) => {
  return {
    type: ADD_POOL_SET_TOLERATION_VALUE,
    index,
    toleration: tolerationValue,
  };
};

export const addNewPoolToleration = () => {
  return {
    type: ADD_POOL_ADD_NEW_TOLERATION,
  };
};

export const removePoolToleration = (index: number) => {
  return {
    type: ADD_POOL_REMOVE_TOLERATION_ROW,
    index,
  };
};

export const setPoolKeyValuePairs = (newArray: LabelKeyPair[]) => {
  return {
    type: ADD_POOL_SET_KEY_PAIR_VALUE,
    newArray,
  };
};
