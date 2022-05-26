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
import {
  IAddPoolFields,
  IEditPoolFields,
  ITenantState,
  LabelKeyPair,
} from "./types";
import {
  ITolerationEffect,
  ITolerationModel,
  ITolerationOperator,
} from "../../../common/types";
import get from "lodash/get";
import { has } from "lodash";
import { Opts } from "./ListTenants/utils";
import { IPool, ITenant } from "./ListTenants/types";

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

export interface PageFieldValue {
  page: keyof IEditPoolFields;
  field: string;
  value: any;
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
  editPool: {
    editPoolLoading: false,
    validPages: ["setup", "affinity", "configure"],
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
    setInitialPoolDetails: (state, action: PayloadAction<IPool>) => {
      let podAffinity: "default" | "nodeSelector" | "none" = "none";
      let withPodAntiAffinity = false;
      let nodeSelectorLabels = "";
      let tolerations: ITolerationModel[] = [
        {
          key: "",
          tolerationSeconds: { seconds: 0 },
          value: "",
          effect: ITolerationEffect.NoSchedule,
          operator: ITolerationOperator.Equal,
        },
      ];
      let nodeSelectorPairs: LabelKeyPair[] = [{ key: "", value: "" }];

      if (action.payload.affinity?.nodeAffinity) {
        podAffinity = "nodeSelector";
        if (action.payload.affinity?.podAntiAffinity) {
          withPodAntiAffinity = true;
        }
      } else if (action.payload.affinity?.podAntiAffinity) {
        podAffinity = "default";
      }

      if (action.payload.affinity?.nodeAffinity) {
        let labelItems: string[] = [];
        nodeSelectorPairs = [];

        action.payload.affinity.nodeAffinity.requiredDuringSchedulingIgnoredDuringExecution.nodeSelectorTerms.forEach(
          (labels) => {
            labels.matchExpressions.forEach((exp) => {
              labelItems.push(`${exp.key}=${exp.values.join(",")}`);
              nodeSelectorPairs.push({
                key: exp.key,
                value: exp.values.join(", "),
              });
            });
          }
        );
        nodeSelectorLabels = labelItems.join("&");
      }

      let securityContextOption = false;

      if (action.payload.securityContext) {
        securityContextOption =
          !!action.payload.securityContext.runAsUser ||
          !!action.payload.securityContext.runAsGroup ||
          !!action.payload.securityContext.fsGroup;
      }

      if (action.payload.tolerations) {
        tolerations = action.payload.tolerations?.map((toleration) => {
          const tolerationItem: ITolerationModel = {
            key: toleration.key,
            tolerationSeconds: toleration.tolerationSeconds,
            value: toleration.value,
            effect: toleration.effect,
            operator: toleration.operator,
          };
          return tolerationItem;
        });
      }

      const volSizeVars = action.payload.volume_configuration.size / 1073741824;

      const newPoolInfoFields: IEditPoolFields = {
        setup: {
          numberOfNodes: action.payload.servers,
          storageClass: action.payload.volume_configuration.storage_class_name,
          volumeSize: volSizeVars,
          volumesPerServer: action.payload.volumes_per_server,
        },
        configuration: {
          securityContextEnabled: securityContextOption,
          securityContext: {
            runAsUser: action.payload.securityContext?.runAsUser || "",
            runAsGroup: action.payload.securityContext?.runAsGroup || "",
            fsGroup: action.payload.securityContext?.fsGroup || "",
            runAsNonRoot: !!action.payload.securityContext?.runAsNonRoot,
          },
        },
        affinity: {
          podAffinity,
          withPodAntiAffinity,
          nodeSelectorLabels,
        },
        tolerations,
        nodeSelectorPairs,
      };

      state.editPool.fields = {
        ...state.editPool.fields,
        ...newPoolInfoFields,
      };
    },
    setEditPoolLoading: (state, action: PayloadAction<boolean>) => {
      state.editPool.editPoolLoading = action.payload;
    },
    setEditPoolField: (state, action: PayloadAction<PageFieldValue>) => {
      if (
        has(
          state.editPool.fields,
          `${action.payload.page}.${action.payload.field}`
        )
      ) {
        const originPageNameItems = get(
          state.editPool.fields,
          `${action.payload.page}`,
          {}
        );

        let newValue: any = {};
        newValue[action.payload.field] = action.payload.value;

        const joinValue = { ...originPageNameItems, ...newValue };

        state.editPool.fields[action.payload.page] = { ...joinValue };
      }
    },
    isEditPoolPageValid: (
      state,
      action: PayloadAction<{
        page: string;
        status: boolean;
      }>
    ) => {
      const edPoolPV = [...state.editPool.validPages];

      if (action.payload.status) {
        if (!edPoolPV.includes(action.payload.page)) {
          edPoolPV.push(action.payload.page);

          state.editPool.validPages = [...edPoolPV];
        }
      } else {
        const newSetOfPages = edPoolPV.filter(
          (elm) => elm !== action.payload.page
        );

        state.editPool.validPages = [...newSetOfPages];
      }
    },
    setEditPoolStorageClasses: (state, action: PayloadAction<Opts[]>) => {
      state.editPool.storageClasses = action.payload;
    },
    setEditPoolTolerationInfo: (
      state,
      action: PayloadAction<{
        index: number;
        tolerationValue: ITolerationModel;
      }>
    ) => {
      const editPoolTolerationValue = [...state.editPool.fields.tolerations];

      editPoolTolerationValue[action.payload.index] =
        action.payload.tolerationValue;
      state.editPool.fields.tolerations = editPoolTolerationValue;
    },
    addNewEditPoolToleration: (state) => {
      state.editPool.fields.tolerations.push({
        key: "",
        tolerationSeconds: { seconds: 0 },
        value: "",
        effect: ITolerationEffect.NoSchedule,
        operator: ITolerationOperator.Equal,
      });
    },
    removeEditPoolToleration: (state, action: PayloadAction<number>) => {
      state.editPool.fields.tolerations =
        state.editPool.fields.tolerations.filter(
          (_, index) => index !== action.payload
        );
    },
    setEditPoolKeyValuePairs: (
      state,
      action: PayloadAction<LabelKeyPair[]>
    ) => {
      state.editPool.fields.nodeSelectorPairs = action.payload;
    },
    resetEditPoolForm: (state) => {
      state.editPool = {
        editPoolLoading: false,
        validPages: ["setup", "affinity", "configure"],
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
  setInitialPoolDetails,
  setEditPoolLoading,
  resetEditPoolForm,
  setEditPoolField,
  isEditPoolPageValid,
  setEditPoolStorageClasses,
  setEditPoolTolerationInfo,
  addNewEditPoolToleration,
  removeEditPoolToleration,
  setEditPoolKeyValuePairs,
} = tenantSlice.actions;

export default tenantSlice.reducer;
