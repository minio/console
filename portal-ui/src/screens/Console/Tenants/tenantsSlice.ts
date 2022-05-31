// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAddPoolFields, ITenantState, LabelKeyPair } from "./types";
import {
  ITolerationEffect,
  ITolerationModel,
  ITolerationOperator,
} from "../../../common/types";
import get from "lodash/get";
import { has } from "lodash";
import { Opts } from "./ListTenants/utils";
import { ITenant } from "./ListTenants/types";

export interface FileValue {
  fileName: string;
  value: string;
}

export interface KeyFileValue {
  key: string;
  fileName: string;
  value: string;
}

export interface CertificateFile {
  id: string;
  key: string;
  fileName: string;
  value: string;
}

const initialState: ITenantState = {
  tenantDetails: {
    currentTenant: "",
    currentNamespace: "",
    loadingTenant: false,
    tenantInfo: null,
    currentTab: "summary",
    selectedPool: null,
    poolDetailsOpen: false,
  },
  addPool: {
    addPoolLoading: false,
    validPages: ["affinity", "configure"],
    storageClasses: [],
    limitSize: {},
    fields: {
      setup: {
        numberOfNodes: 0,
        storageClass: "",
        volumeSize: 0,
        volumesPerServer: 0,
      },
      affinity: {
        nodeSelectorLabels: "",
        podAffinity: "default",
        withPodAntiAffinity: true,
      },
      configuration: {
        securityContextEnabled: false,
        securityContext: {
          runAsUser: "1000",
          runAsGroup: "1000",
          fsGroup: "1000",
          runAsNonRoot: true,
        },
      },
      nodeSelectorPairs: [{ key: "", value: "" }],
      tolerations: [
        {
          key: "",
          tolerationSeconds: { seconds: 0 },
          value: "",
          effect: ITolerationEffect.NoSchedule,
          operator: ITolerationOperator.Equal,
        },
      ],
    },
  },
};

export const tenantSlice = createSlice({
  name: "tenant",
  initialState,
  reducers: {
    setTenantDetailsLoad: (state, action: PayloadAction<boolean>) => {
      state.tenantDetails.loadingTenant = action.payload;
    },
    setTenantName: (
      state,
      action: PayloadAction<{
        name: string;
        namespace: string;
      }>
    ) => {
      state.tenantDetails.currentTenant = action.payload.name;
      state.tenantDetails.currentNamespace = action.payload.namespace;
    },
    setTenantInfo: (state, action: PayloadAction<ITenant | null>) => {
      if (action.payload) {
        state.tenantDetails.tenantInfo = action.payload;
      }
    },
    setTenantTab: (state, action: PayloadAction<string>) => {
      state.tenantDetails.currentTab = action.payload;
    },

    setPoolLoading: (state, action: PayloadAction<boolean>) => {
      state.addPool.addPoolLoading = action.payload;
    },
    setPoolField: (
      state,
      action: PayloadAction<{
        page: keyof IAddPoolFields;
        field: string;
        value: any;
      }>
    ) => {
      if (
        has(
          state.addPool.fields,
          `${action.payload.page}.${action.payload.field}`
        )
      ) {
        const originPageNameItems = get(
          state.addPool.fields,
          `${action.payload.page}`,
          {}
        );

        let newValue: any = {};
        newValue[action.payload.field] = action.payload.value;

        state.addPool.fields[action.payload.page] = {
          ...originPageNameItems,
          ...newValue,
        };
      }
    },
    isPoolPageValid: (
      state,
      action: PayloadAction<{
        page: string;
        status: boolean;
      }>
    ) => {
      if (action.payload.status) {
        if (!state.addPool.validPages.includes(action.payload.page)) {
          state.addPool.validPages.push(action.payload.page);
        }
      } else {
        state.addPool.validPages = state.addPool.validPages.filter(
          (elm) => elm !== action.payload.page
        );
      }
    },
    setPoolStorageClasses: (state, action: PayloadAction<Opts[]>) => {
      state.addPool.storageClasses = action.payload;
    },
    setPoolTolerationInfo: (
      state,
      action: PayloadAction<{
        index: number;
        tolerationValue: ITolerationModel;
      }>
    ) => {
      state.addPool.fields.tolerations[action.payload.index] =
        action.payload.tolerationValue;
    },
    addNewPoolToleration: (state) => {
      state.addPool.fields.tolerations.push({
        key: "",
        tolerationSeconds: { seconds: 0 },
        value: "",
        effect: ITolerationEffect.NoSchedule,
        operator: ITolerationOperator.Equal,
      });
    },
    removePoolToleration: (state, action: PayloadAction<number>) => {
      state.addPool.fields.tolerations =
        state.addPool.fields.tolerations.filter(
          (_, index) => index !== action.payload
        );
    },
    setPoolKeyValuePairs: (state, action: PayloadAction<LabelKeyPair[]>) => {
      state.addPool.fields.nodeSelectorPairs = action.payload;
    },
    resetPoolForm: (state) => {
      state.addPool = {
        addPoolLoading: false,
        validPages: ["affinity", "configure"],
        storageClasses: [],
        limitSize: {},
        fields: {
          setup: {
            numberOfNodes: 0,
            storageClass: "",
            volumeSize: 0,
            volumesPerServer: 0,
          },
          affinity: {
            nodeSelectorLabels: "",
            podAffinity: "default",
            withPodAntiAffinity: true,
          },
          configuration: {
            securityContextEnabled: false,
            securityContext: {
              runAsUser: "1000",
              runAsGroup: "1000",
              fsGroup: "1000",
              runAsNonRoot: true,
            },
          },
          nodeSelectorPairs: [{ key: "", value: "" }],
          tolerations: [
            {
              key: "",
              tolerationSeconds: { seconds: 0 },
              value: "",
              effect: ITolerationEffect.NoSchedule,
              operator: ITolerationOperator.Equal,
            },
          ],
        },
      };
    },
    setSelectedPool: (state, action: PayloadAction<string | null>) => {
      state.tenantDetails.selectedPool = action.payload;
    },
    setOpenPoolDetails: (state, action: PayloadAction<boolean>) => {
      state.tenantDetails.poolDetailsOpen = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setTenantDetailsLoad,
  setTenantName,
  setTenantInfo,
  setTenantTab,
  setPoolLoading,
  resetPoolForm,
  setPoolField,
  isPoolPageValid,
  setPoolStorageClasses,
  setPoolTolerationInfo,
  addNewPoolToleration,
  removePoolToleration,
  setPoolKeyValuePairs,
  setSelectedPool,
  setOpenPoolDetails,
} = tenantSlice.actions;

export default tenantSlice.reducer;
