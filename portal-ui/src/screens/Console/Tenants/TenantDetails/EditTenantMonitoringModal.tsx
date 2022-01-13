import React, { useEffect, useState } from "react";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Theme } from "@mui/material/styles";
import { modalBasic } from "../../Common/FormComponents/common/styleLibrary";
import { Button } from "@mui/material";
import api from "../../../../common/api";
import { ITenant } from "../ListTenants/types";
import { ErrorResponseHandler } from "../../../../common/types";
import { IKeyValue } from "../ListTenants/types";
import KeyPairEdit from "./KeyPairEdit";
import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import {
  commonFormValidation,
  IValidation,
} from "../../../../utils/validationFunctions";
import { setModalErrorSnackMessage } from "../../../../actions";

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
    Math.floor(parseInt(memRequest, 10) / 1000000000).toString()
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
      pattern: /^[0-9]?(10)?$/,
      customPatternMessage: "Must be an integer between 0 and 10",
    });
    tenantMonitoringValidation.push({
      fieldKey: `newCPURequest`,
      required: false,
      value: newCPURequest as any as string,
      pattern: /^[0-9]?(10)?$/,
      customPatternMessage: "Must be an integer between 0 and 10",
    });
    tenantMonitoringValidation.push({
      fieldKey: `newMemRequest`,
      required: false,
      value: newMemRequest as any as string,
      pattern: /^[0-9]?(10)?$/,
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
      setModalErrorSnackMessage(err);
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
        <h2>Prometheus configuration</h2>
        <hr className={classes.hrClass} />
        <h4>Image</h4>
        <InputBoxWrapper
          id={`image`}
          label={""}
          placeholder={"Image"}
          name={`image`}
          value={newImage}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setNewImage(event.target.value);
          }}
          key={`image`}
          error={validationErrors[`image`] || ""}
        />
        <h4>Sidecar Image</h4>
        <InputBoxWrapper
          id={`sidecarImage`}
          label={""}
          placeholder={"Sidecar Image"}
          name={`sidecarImage`}
          value={newSidecarImage}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setNewSidecarImage(event.target.value);
          }}
          key={`sidecarImage`}
          error={validationErrors[`sidecarImage`] || ""}
        />
        <h4>Init Image</h4>
        <InputBoxWrapper
          id={`initImage`}
          label={""}
          placeholder={"Init Image"}
          name={`initImage`}
          value={newInitImage}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setNewInitImage(event.target.value);
          }}
          key={`initImage`}
          error={validationErrors[`initImage`] || ""}
        />
        <h4>Disk Capacity (GB)</h4>
        <InputBoxWrapper
          id={`diskCapacityGB`}
          label={""}
          placeholder={"Disk Capacity (GB)"}
          name={`diskCapacityGB`}
          value={newDiskCapacityGB}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setNewDiskCapacityGB(event.target.value);
          }}
          key={`diskCapacityGB`}
          error={validationErrors[`diskCapacityGB`] || ""}
        />
        <h4>Prometheus CPU Request</h4>
        <InputBoxWrapper
          id={`cpuRequest`}
          label={""}
          placeholder={"CPU Request"}
          name={`cpuRequest`}
          value={newCPURequest}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setNewCPURequest(event.target.value);
          }}
          key={`cpuRequest`}
          error={validationErrors[`cpuRequest`] || ""}
        />
        <h4>Prometheus Memory Request (Gi)</h4>
        <InputBoxWrapper
          id={`memRequest`}
          label={""}
          placeholder={"Memory request"}
          name={`memRequest`}
          value={newMemRequest}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setNewMemRequest(event.target.value);
          }}
          key={`memRequest`}
          error={validationErrors[`memRequest`] || ""}
        />
        <h4>Service Account Name</h4>
        <InputBoxWrapper
          id={`serviceAccountName`}
          label={""}
          placeholder={"Service Account Name"}
          name={`serviceAccountName`}
          value={newServiceAccountName}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setNewServiceAccountName(event.target.value);
          }}
          key={`serviceAccountName`}
          error={validationErrors[`serviceAccountName`] || ""}
        />
        <h4>Storage Class Name</h4>
        <InputBoxWrapper
          id={`storageClassName`}
          label={""}
          placeholder={"Storage Class Name"}
          name={`storageClassName`}
          value={newStorageClassName}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setNewStorageClassName(event.target.value);
          }}
          key={`storageClassName`}
          error={validationErrors[`storageClassName`] || ""}
        />
        <h4>Labels</h4>
        <KeyPairEdit
          newValues={newLabels}
          setNewValues={setNewLabels}
          paramName={"Labels"}
          error={labelsError}
          setError={setLabelsError}
        />
        <h4>Annotations</h4>
        <KeyPairEdit
          newValues={newAnnotations}
          setNewValues={setNewAnnotations}
          paramName={"Annotations"}
          error={annotationsError}
          setError={setAnnotationsError}
        />
        <h4>Node Selector</h4>
        <KeyPairEdit
          newValues={newNodeSelector}
          setNewValues={setNewNodeSelector}
          paramName={"Node Selector"}
          error={nodeSelectorError}
          setError={setNodeSelectorError}
        />

        <div className={classes.buttonContainer}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!checkValid()}
          >
            Save
          </Button>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default withStyles(styles)(EditTenantMonitoringModal);
