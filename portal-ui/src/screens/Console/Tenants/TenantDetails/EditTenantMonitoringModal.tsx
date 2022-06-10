import React, { useEffect, useState } from "react";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Theme } from "@mui/material/styles";
import {
  formFieldStyles,
  modalBasic,
  modalStyleUtils,
} from "../../Common/FormComponents/common/styleLibrary";
import { Button, Grid } from "@mui/material";
import api from "../../../../common/api";
import { IKeyValue, ITenant } from "../ListTenants/types";
import { ErrorResponseHandler } from "../../../../common/types";
import KeyPairEdit from "./KeyPairEdit";
import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import {
  commonFormValidation,
  IValidation,
} from "../../../../utils/validationFunctions";
import InputUnitMenu from "../../Common/FormComponents/InputUnitMenu/InputUnitMenu";

import { setModalErrorSnackMessage } from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";

interface IEditTenantMonitoringProps {
  tenant: ITenant;
  classes: any;
  open: boolean;
  onClose: (shouldReload: boolean) => void;
  image: string;
  sidecarImage: string;
  initImage: string;
  labels: IKeyValue[];
  annotations: IKeyValue[];
  nodeSelector: IKeyValue[];
  diskCapacityGB: number;
  serviceAccountName: string;
  tenantName: string;
  tenantNamespace: string;
  storageClassName: string;
  cpuRequest: string;
  memRequest: string;
}

const styles = (theme: Theme) =>
  createStyles({
    buttonContainer: {
      textAlign: "right",
    },
    ...modalBasic,
    ...modalStyleUtils,
    ...formFieldStyles,
  });

const EditTenantMonitoringModal = ({
  tenant,
  classes,
  open,
  onClose,
  image,
  sidecarImage,
  initImage,
  labels,
  annotations,
  nodeSelector,
  diskCapacityGB,
  serviceAccountName,
  storageClassName,
  tenantName,
  tenantNamespace,
  cpuRequest,
  memRequest,
}: IEditTenantMonitoringProps) => {
  const dispatch = useAppDispatch();
  const [validationErrors, setValidationErrors] = useState<any>({});
  const [newLabels, setNewLabels] = useState<IKeyValue[]>(
    labels.length > 0 ? [...labels] : [{ key: "", value: "" }]
  );
  const [newAnnotations, setNewAnnotations] = useState<IKeyValue[]>(
    annotations.length > 0 ? [...annotations] : [{ key: "", value: "" }]
  );
  const [newNodeSelector, setNewNodeSelector] = useState<IKeyValue[]>(
    nodeSelector.length > 0 ? [...nodeSelector] : [{ key: "", value: "" }]
  );
  const [newImage, setNewImage] = useState<string>(image);
  const [newSidecarImage, setNewSidecarImage] = useState<string>(sidecarImage);
  const [newInitImage, setNewInitImage] = useState<string>(initImage);
  const [newDiskCapacityGB, setNewDiskCapacityGB] = useState<string>(
    diskCapacityGB.toString()
  );
  const [newCPURequest, setNewCPURequest] = useState<string>(cpuRequest);
  const [newMemRequest, setNewMemRequest] = useState<string>(
    memRequest
      ? Math.floor(parseInt(memRequest, 10) / 1000000000).toString()
      : ""
  );
  const [newServiceAccountName, setNewServiceAccountName] =
    useState<string>(serviceAccountName);
  const [newStorageClassName, setNewStorageClassName] =
    useState<string>(storageClassName);

  const [labelsError, setLabelsError] = useState<any>({});
  const [annotationsError, setAnnotationsError] = useState<any>({});
  const [nodeSelectorError, setNodeSelectorError] = useState<any>({});

  const trim = (x: IKeyValue[]): IKeyValue[] => {
    let retval: IKeyValue[] = [];
    for (let i = 0; i < x.length; i++) {
      if (x[i].key !== "") {
        retval.push(x[i]);
      }
    }
    return retval;
  };

  useEffect(() => {
    let tenantMonitoringValidation: IValidation[] = [];

    tenantMonitoringValidation.push({
      fieldKey: `image`,
      required: false,
      value: newImage,
      pattern:
        /^([a-zA-Z0-9])([a-zA-Z0-9-._])*([a-zA-Z0-9]?)+(\/(([a-zA-Z0-9])([a-zA-Z0-9-._])*([a-zA-Z0-9])?)+)*:([a-zA-Z0-9])[a-zA-Z0-9-.]{0,127}$/,
      customPatternMessage: "Invalid image",
    });
    tenantMonitoringValidation.push({
      fieldKey: `sidecarImage`,
      required: false,
      value: newSidecarImage,
      pattern:
        /^([a-zA-Z0-9])([a-zA-Z0-9-._])*([a-zA-Z0-9]?)+(\/(([a-zA-Z0-9])([a-zA-Z0-9-._])*([a-zA-Z0-9])?)+)*:([a-zA-Z0-9])[a-zA-Z0-9-.]{0,127}$/,
      customPatternMessage: "Invalid image",
    });
    tenantMonitoringValidation.push({
      fieldKey: `initImage`,
      required: false,
      value: newInitImage,
      pattern:
        /^([a-zA-Z0-9])([a-zA-Z0-9-._])*([a-zA-Z0-9]?)+(\/(([a-zA-Z0-9])([a-zA-Z0-9-._])*([a-zA-Z0-9])?)+)*:([a-zA-Z0-9])[a-zA-Z0-9-.]{0,127}$/,
      customPatternMessage: "Invalid image",
    });
    tenantMonitoringValidation.push({
      fieldKey: `diskCapacityGB`,
      required: true,
      value: newDiskCapacityGB as any as string,
      pattern: /^[0-9]*$/,
      customPatternMessage: "Must be an integer between 0 and 10",
    });
    tenantMonitoringValidation.push({
      fieldKey: `newCPURequest`,
      required: false,
      value: newCPURequest as any as string,
      pattern: /^[0-9]*$/,
      customPatternMessage: "Must be an integer between 0 and 10",
    });
    tenantMonitoringValidation.push({
      fieldKey: `newMemRequest`,
      required: false,
      value: newMemRequest as any as string,
      pattern: /^[0-9]*$/,
      customPatternMessage: "Must be an integer between 0 and 10",
    });
    tenantMonitoringValidation.push({
      fieldKey: `serviceAccountName`,
      required: false,
      value: newServiceAccountName,
      pattern: /^[a-zA-Z0-9-.]{1,253}$/,
      customPatternMessage: "Invalid service account name",
    });
    tenantMonitoringValidation.push({
      fieldKey: `storageClassName`,
      required: false,
      value: newStorageClassName,
      pattern: /^[a-zA-Z0-9-.]{1,253}$/,
      customPatternMessage: "Invalid storage class name",
    });

    const commonVal = commonFormValidation(tenantMonitoringValidation);
    setValidationErrors(commonVal);
  }, [
    newImage,
    newSidecarImage,
    newInitImage,
    newDiskCapacityGB,
    newServiceAccountName,
    newStorageClassName,
    newCPURequest,
    newMemRequest,
    setValidationErrors,
  ]);

  const checkValid = (): boolean => {
    if (
      Object.keys(validationErrors).length !== 0 ||
      Object.keys(labelsError).length !== 0 ||
      Object.keys(annotationsError).length !== 0 ||
      Object.keys(nodeSelectorError).length !== 0
    ) {
      let err: ErrorResponseHandler = {
        errorMessage: "Invalid entry",
        detailedError: "",
      };
      dispatch(setModalErrorSnackMessage(err));
      return false;
    } else {
      return true;
    }
  };

  const submitMonitoringInfo = (event: React.FormEvent) => {
    event.preventDefault();

    api
      .invoke(
        "PUT",
        `/api/v1/namespaces/${tenantNamespace}/tenants/${tenantName}/monitoring`,
        {
          labels: trim(newLabels),
          annotations: trim(newAnnotations),
          nodeSelector: trim(newNodeSelector),
          image: newImage,
          sidecarImage: newSidecarImage,
          initImage: newInitImage,
          diskCapacityGB: newDiskCapacityGB,
          serviceAccountName: newServiceAccountName,
          storageClassName: newStorageClassName,
          monitoringCPURequest: newCPURequest,
          monitoringMemRequest: newMemRequest + "Gi",
        }
      )
      .then(() => {
        onClose(true);
      })
      .catch((err: ErrorResponseHandler) => {});
  };

  return (
    <ModalWrapper
      onClose={() => onClose(true)}
      modalOpen={open}
      title="Edit Monitoring Configuration"
    >
      <form noValidate autoComplete="off" onSubmit={submitMonitoringInfo}>
        <Grid container>
          <Grid xs={12} className={classes.modalFormScrollable}>
            <Grid item xs={12} className={classes.formFieldRow}>
              <InputBoxWrapper
                id={`image`}
                label={"Image"}
                placeholder={"Image"}
                name={`image`}
                value={newImage}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setNewImage(event.target.value);
                }}
                key={`image`}
                error={validationErrors[`image`] || ""}
              />
            </Grid>
            <Grid item xs={12} className={classes.formFieldRow}>
              <InputBoxWrapper
                id={`sidecarImage`}
                label={"Sidecar Image"}
                placeholder={"Sidecar Image"}
                name={`sidecarImage`}
                value={newSidecarImage}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setNewSidecarImage(event.target.value);
                }}
                key={`sidecarImage`}
                error={validationErrors[`sidecarImage`] || ""}
              />
            </Grid>
            <Grid item xs={12} className={classes.formFieldRow}>
              <InputBoxWrapper
                id={`initImage`}
                label={"Init Image"}
                placeholder={"Init Image"}
                name={`initImage`}
                value={newInitImage}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setNewInitImage(event.target.value);
                }}
                key={`initImage`}
                error={validationErrors[`initImage`] || ""}
              />
            </Grid>
            <Grid item xs={12} className={classes.formFieldRow}>
              <InputBoxWrapper
                id={`diskCapacityGB`}
                label={"Disk Capacity"}
                placeholder={"Disk Capacity"}
                name={`diskCapacityGB`}
                value={newDiskCapacityGB}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setNewDiskCapacityGB(event.target.value);
                }}
                key={`diskCapacityGB`}
                error={validationErrors[`diskCapacityGB`] || ""}
                overlayObject={
                  <InputUnitMenu
                    id={"size-unit"}
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
                id={`cpuRequest`}
                label={"CPU Request"}
                placeholder={"CPU Request"}
                name={`cpuRequest`}
                value={newCPURequest}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setNewCPURequest(event.target.value);
                }}
                key={`cpuRequest`}
                error={validationErrors[`cpuRequest`] || ""}
              />
            </Grid>
            <Grid item xs={12} className={classes.formFieldRow}>
              <InputBoxWrapper
                id={`memRequest`}
                label={"Memory Request"}
                placeholder={"Memory request"}
                name={`memRequest`}
                value={newMemRequest}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (event.target.validity.valid) {
                    setNewMemRequest(event.target.value);
                  }
                }}
                pattern={"[0-9]*"}
                key={`memRequest`}
                error={validationErrors[`memRequest`] || ""}
                overlayObject={
                  <InputUnitMenu
                    id={"size-unit"}
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
                id={`serviceAccountName`}
                label={"Service Account"}
                placeholder={"Service Account Name"}
                name={`serviceAccountName`}
                value={newServiceAccountName}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setNewServiceAccountName(event.target.value);
                }}
                key={`serviceAccountName`}
                error={validationErrors[`serviceAccountName`] || ""}
              />
            </Grid>
            <Grid item xs={12} className={classes.formFieldRow}>
              <InputBoxWrapper
                id={`storageClassName`}
                label={"Storage Class"}
                placeholder={"Storage Class Name"}
                name={`storageClassName`}
                value={newStorageClassName}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setNewStorageClassName(event.target.value);
                }}
                key={`storageClassName`}
                error={validationErrors[`storageClassName`] || ""}
              />
            </Grid>
            <Grid item xs={12} className={classes.formFieldRow}>
              <span className={classes.inputLabel}>Labels</span>
              <KeyPairEdit
                newValues={newLabels}
                setNewValues={setNewLabels}
                paramName={"Labels"}
                error={labelsError}
                setError={setLabelsError}
              />
            </Grid>
            <Grid item xs={12} className={classes.formFieldRow}>
              <span className={classes.inputLabel}>Annotations</span>
              <KeyPairEdit
                newValues={newAnnotations}
                setNewValues={setNewAnnotations}
                paramName={"Annotations"}
                error={annotationsError}
                setError={setAnnotationsError}
              />
            </Grid>
            <Grid item xs={12} className={classes.formFieldRow}>
              <span className={classes.inputLabel}>Node Selector</span>
              <KeyPairEdit
                newValues={newNodeSelector}
                setNewValues={setNewNodeSelector}
                paramName={"Node Selector"}
                error={nodeSelectorError}
                setError={setNodeSelectorError}
              />
            </Grid>
          </Grid>
          <Grid xs={12} className={classes.buttonContainer}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!checkValid()}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
    </ModalWrapper>
  );
};

export default withStyles(styles)(EditTenantMonitoringModal);
