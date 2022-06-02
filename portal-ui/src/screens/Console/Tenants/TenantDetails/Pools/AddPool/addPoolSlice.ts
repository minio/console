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
  ITolerationEffect,
  ITolerationModel,
  ITolerationOperator,
} from "../../../../../../common/types";
import { IAddPool, IAddPoolFields, LabelKeyPair } from "../../../types";
import { has } from "lodash";
import get from "lodash/get";
import { Opts } from "../../../ListTenants/utils";

const initialState: IAddPool = {
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

export const addPoolSlice = createSlice({
  name: "trace",
  initialState,
  reducers: {
    setPoolLoading: (state, action: PayloadAction<boolean>) => {
      state.addPoolLoading = action.payload;
    },
    setPoolField: (
      state,
      action: PayloadAction<{
        page: keyof IAddPoolFields;
        field: string;
        value: any;
      }>
    ) => {
      if (has(state.fields, `${action.payload.page}.${action.payload.field}`)) {
        const originPageNameItems = get(
          state.fields,
          `${action.payload.page}`,
          {}
        );

        let newValue: any = {};
        newValue[action.payload.field] = action.payload.value;

        state.fields[action.payload.page] = {
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
        if (!state.validPages.includes(action.payload.page)) {
          state.validPages.push(action.payload.page);
        }
      } else {
        state.validPages = state.validPages.filter(
          (elm) => elm !== action.payload.page
        );
      }
    },
    setPoolStorageClasses: (state, action: PayloadAction<Opts[]>) => {
      state.storageClasses = action.payload;
    },
    setPoolTolerationInfo: (
      state,
      action: PayloadAction<{
        index: number;
        tolerationValue: ITolerationModel;
      }>
    ) => {
      state.fields.tolerations[action.payload.index] =
        action.payload.tolerationValue;
    },
    addNewPoolToleration: (state) => {
      state.fields.tolerations.push({
        key: "",
        tolerationSeconds: { seconds: 0 },
        value: "",
        effect: ITolerationEffect.NoSchedule,
        operator: ITolerationOperator.Equal,
      });
    },
    removePoolToleration: (state, action: PayloadAction<number>) => {
      state.fields.tolerations = state.fields.tolerations.filter(
        (_, index) => index !== action.payload
      );
    },
    setPoolKeyValuePairs: (state, action: PayloadAction<LabelKeyPair[]>) => {
      state.fields.nodeSelectorPairs = action.payload;
    },
    resetPoolForm: () => initialState,
  },
});

export const {
  setPoolLoading,
  resetPoolForm,
  setPoolField,
  isPoolPageValid,
  setPoolStorageClasses,
  setPoolTolerationInfo,
  addNewPoolToleration,
  removePoolToleration,
  setPoolKeyValuePairs,
} = addPoolSlice.actions;

export default addPoolSlice.reducer;
