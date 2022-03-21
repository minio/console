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

import { ITenantState, SetStorageType } from "../types";
import {
  IMkEnvs,
  IntegrationConfiguration,
  mkPanelConfigurations,
  resourcesConfigurations,
} from "../AddTenant/Steps/TenantResources/utils";
import get from "lodash/get";
import { getBytesNumber } from "../../../../common/utils";

export const addTenantSetStorageTypeReducer = (
  action: SetStorageType,
  state: ITenantState
) => {
  let size = state.createTenant.fields.tenantSize.volumeSize;
  let sizeFactor = state.createTenant.fields.tenantSize.sizeFactor;
  let volumeSize = state.createTenant.fields.tenantSize.volumeSize;
  // for the aws marketplace integration we have some constraints
  // on the minimum cluster size

  if (action.features !== undefined && action.features.length > 0) {
    let formToRender = IMkEnvs.default;
    const possibleVariables = Object.keys(resourcesConfigurations);

    possibleVariables.forEach((element) => {
      if (action.features !== undefined && action.features.includes(element)) {
        formToRender = get(resourcesConfigurations, element, IMkEnvs.default);
      }
    });

    // if the size is less than the minimum for the selected storage type
    // we will override the current total storage entered amount with the minimum
    if (formToRender !== undefined) {
      const setConfigs = mkPanelConfigurations[formToRender];
      const keyCount = Object.keys(setConfigs).length;

      //Configuration is filled
      if (keyCount > 0) {
        const configs: IntegrationConfiguration[] = get(
          setConfigs,
          "configurations",
          []
        );
        const mainSelection = configs.find(
          (item) => item.typeSelection === action.storageType
        );
        if (mainSelection !== undefined && mainSelection.minimumVolumeSize) {
          const minimumSize = getBytesNumber(
            mainSelection.minimumVolumeSize?.driveSize,
            mainSelection.minimumVolumeSize?.sizeUnit,
            true
          );

          const drivesPerServer =
            state.createTenant.fields.tenantSize.drivesPerServer;
          const nodes = state.createTenant.fields.tenantSize.drivesPerServer;

          const currentSize = getBytesNumber(size.toString(), sizeFactor, true);
          if (currentSize < minimumSize) {
            size = minimumSize.toString(10);
            const totalSize =
              parseInt(nodes) *
              parseInt(drivesPerServer) *
              parseInt(mainSelection.minimumVolumeSize.driveSize);

            volumeSize = totalSize.toString(10);
            sizeFactor = mainSelection.minimumVolumeSize.sizeUnit;
          }
        }
      }
    }
  }

  const newstate = {
    ...state,
    createTenant: {
      ...state.createTenant,
      fields: {
        ...state.createTenant.fields,
        nameTenant: {
          ...state.createTenant.fields.nameTenant,
          selectedStorageType: action.storageType,
        },
        tenantSize: {
          ...state.createTenant.fields.tenantSize,
          size: size,
          volumeSize: volumeSize,
          sizeFactor: sizeFactor,
        },
      },
    },
  };
  return { ...newstate };
};
