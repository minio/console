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

import React, { useEffect, useState } from "react";
import get from "lodash/get";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import {
  formFieldStyles,
  wizardCommon,
} from "../../../../Common/FormComponents/common/styleLibrary";
import InputBoxWrapper from "../../../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import Grid from "@mui/material/Grid";
import { niceBytes } from "../../../../../../common/utils";
import { Paper, SelectChangeEvent } from "@mui/material";
import api from "../../../../../../common/api";
import { ITenant } from "../../../ListTenants/types";
import { ErrorResponseHandler } from "../../../../../../common/types";
import SelectWrapper from "../../../../Common/FormComponents/SelectWrapper/SelectWrapper";
import { IQuotaElement, IQuotas, Opts } from "../../../ListTenants/utils";
import { AppState } from "../../../../../../store";
import { connect } from "react-redux";
import {
  isPoolPageValid,
  setPoolField,
  setPoolStorageClasses,
} from "../../../actions";
import {
  commonFormValidation,
  IValidation,
} from "../../../../../../utils/validationFunctions";
import InputUnitMenu from "../../../../Common/FormComponents/InputUnitMenu/InputUnitMenu";

interface IPoolResourcesProps {
  tenant: ITenant | null;
  classes: any;
  storageClasses: Opts[];
  numberOfNodes: string;
  storageClass: string;
  volumeSize: string;
  volumesPerServer: string;
  setPoolField: typeof setPoolField;
  isPoolPageValid: typeof isPoolPageValid;
  setPoolStorageClasses: typeof setPoolStorageClasses;
}

const styles = (theme: Theme) =>
  createStyles({
    bottomContainer: {
      display: "flex",
      flexGrow: 1,
      alignItems: "center",
      margin: "auto",
      justifyContent: "center",
      "& div": {
        width: 150,
        "@media (max-width: 900px)": {
          flexFlow: "column",
        },
      },
    },
    factorElements: {
      display: "flex",
      justifyContent: "flex-start",
      marginLeft: 30,
    },
    sizeNumber: {
      fontSize: 35,
      fontWeight: 700,
      textAlign: "center",
    },
    sizeDescription: {
      fontSize: 14,
      color: "#777",
      textAlign: "center",
    },
    ...formFieldStyles,
    ...wizardCommon,
  });

const PoolResources = ({
  tenant,
  classes,
  storageClasses,
  numberOfNodes,
  storageClass,
  volumeSize,
  volumesPerServer,
  setPoolField,
  setPoolStorageClasses,
  isPoolPageValid,
}: IPoolResourcesProps) => {
  const [validationErrors, setValidationErrors] = useState<any>({});

  const instanceCapacity: number =
    parseInt(volumeSize) * 1073741824 * parseInt(volumesPerServer);
  const totalCapacity: number = instanceCapacity * parseInt(numberOfNodes);

  // Validation
  useEffect(() => {
    let customAccountValidation: IValidation[] = [
      {
        fieldKey: "number_of_nodes",
        required: true,
        value: numberOfNodes.toString(),
        customValidation:
          parseInt(numberOfNodes) < 1 || isNaN(parseInt(numberOfNodes)),
        customValidationMessage: "Number of servers must be at least 1",
      },
      {
        fieldKey: "pool_size",
        required: true,
        value: volumeSize.toString(),
        customValidation:
          parseInt(volumeSize) < 1 || isNaN(parseInt(volumeSize)),
        customValidationMessage: "Pool Size cannot be 0",
      },
      {
        fieldKey: "volumes_per_server",
        required: true,
        value: volumesPerServer.toString(),
        customValidation:
          parseInt(volumesPerServer) < 1 || isNaN(parseInt(volumesPerServer)),
        customValidationMessage: "1 volume or more are required",
      },
    ];

    const commonVal = commonFormValidation(customAccountValidation);

    isPoolPageValid("setup", Object.keys(commonVal).length === 0);

    setValidationErrors(commonVal);
  }, [
    isPoolPageValid,
    numberOfNodes,
    volumeSize,
    volumesPerServer,
    storageClass,
  ]);

  useEffect(() => {
    if (storageClasses.length === 0 && tenant) {
      api
        .invoke(
          "GET",
          `/api/v1/namespaces/${tenant.namespace}/resourcequotas/${tenant.namespace}-storagequota`
        )
        .then((res: IQuotas) => {
          const elements: IQuotaElement[] = get(res, "elements", []);

          const newStorage = elements.map((storageClass: any) => {
            const name = get(storageClass, "name", "").split(
              ".storageclass.storage.k8s.io/requests.storage"
            )[0];

            return { label: name, value: name };
          });

          setPoolField("setup", "storageClass", newStorage[0].value);

          setPoolStorageClasses(newStorage);
        })
        .catch((err: ErrorResponseHandler) => {
          console.error(err);
        });
    }
  }, [tenant, storageClasses, setPoolStorageClasses, setPoolField]);

  const setFieldInfo = (fieldName: string, value: any) => {
    setPoolField("setup", fieldName, value);
  };

  return (
    <Paper className={classes.paperWrapper}>
      <div className={classes.headerElement}>
        <h3 className={classes.h3Section}>New Pool Configuration</h3>
        <span className={classes.descriptionText}>
          Configure a new Pool to expand MinIO storage
        </span>
      </div>

      <Grid item xs={12} className={classes.formFieldRow}>
        <InputBoxWrapper
          id="number_of_nodes"
          name="number_of_nodes"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const intValue = parseInt(e.target.value);

            if (e.target.validity.valid && !isNaN(intValue)) {
              setFieldInfo("numberOfNodes", intValue);
            } else if (isNaN(intValue)) {
              setFieldInfo("numberOfNodes", 0);
            }
          }}
          label="Number of Servers"
          value={numberOfNodes}
          error={validationErrors["number_of_nodes"] || ""}
          pattern={"[0-9]*"}
        />
      </Grid>
      <Grid item xs={12} className={classes.formFieldRow}>
        <InputBoxWrapper
          id="pool_size"
          name="pool_size"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const intValue = parseInt(e.target.value);

            if (e.target.validity.valid && !isNaN(intValue)) {
              setFieldInfo("volumeSize", intValue);
            } else if (isNaN(intValue)) {
              setFieldInfo("volumeSize", 0);
            }
          }}
          label="Volume Size"
          value={volumeSize}
          error={validationErrors["pool_size"] || ""}
          pattern={"[0-9]*"}
          overlayObject={
            <InputUnitMenu
              id={"quota_unit"}
              onUnitChange={() => {}}
              unitSelected={"Gi"}
              unitsList={[{ label: "Gi", value: "Gi" }]}
              disabled={true}
            />
          }
        />
      </Grid>
      <Grid item xs={12} className={classes.formFieldRow}>
        <InputBoxWrapper
          id="volumes_per_sever"
          name="volumes_per_sever"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const intValue = parseInt(e.target.value);

            if (e.target.validity.valid && !isNaN(intValue)) {
              setFieldInfo("volumesPerServer", intValue);
            } else if (isNaN(intValue)) {
              setFieldInfo("volumesPerServer", 0);
            }
          }}
          label="Volumes per Server"
          value={volumesPerServer}
          error={validationErrors["volumes_per_server"] || ""}
          pattern={"[0-9]*"}
        />
      </Grid>
      <Grid item xs={12} className={classes.formFieldRow}>
        <SelectWrapper
          id="storage_class"
          name="storage_class"
          onChange={(e: SelectChangeEvent<string>) => {
            setFieldInfo("storageClasses", e.target.value as string);
          }}
          label="Storage Class"
          value={storageClass}
          options={storageClasses}
          disabled={storageClasses.length < 1}
        />
      </Grid>
      <Grid item xs={12} className={classes.bottomContainer}>
        <div className={classes.factorElements}>
          <div>
            <div className={classes.sizeNumber}>
              {niceBytes(instanceCapacity.toString(10))}
            </div>
            <div className={classes.sizeDescription}>Instance Capacity</div>
          </div>
          <div>
            <div className={classes.sizeNumber}>
              {niceBytes(totalCapacity.toString(10))}
            </div>
            <div className={classes.sizeDescription}>Total Capacity</div>
          </div>
        </div>
      </Grid>
    </Paper>
  );
};

const mapState = (state: AppState) => {
  const setupFields = state.tenants.addPool.fields.setup;
  return {
    tenant: state.tenants.tenantDetails.tenantInfo,
    storageClasses: state.tenants.addPool.storageClasses,
    numberOfNodes: setupFields.numberOfNodes.toString(),
    storageClass: setupFields.storageClass,
    volumeSize: setupFields.volumeSize.toString(),
    volumesPerServer: setupFields.volumesPerServer.toString(),
  };
};

const connector = connect(mapState, {
  setPoolField,
  isPoolPageValid,
  setPoolStorageClasses,
});

export default withStyles(styles)(connector(PoolResources));
