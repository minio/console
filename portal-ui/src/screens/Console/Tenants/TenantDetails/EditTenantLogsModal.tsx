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
import { clearValidationError } from "../utils";
import { setModalErrorSnackMessage } from "../../../../actions";

interface IEditTenantLogsProps {
  tenant: ITenant;
  classes: any;
  open: boolean;
  onClose: (shouldReload: boolean) => void;
  image: string;
  labels: IKeyValue[];
  annotations: IKeyValue[];
  nodeSelector: IKeyValue[];
  diskCapacityGB: number;
  serviceAccountName: string;
  dbImage: string;
  dbLabels: IKeyValue[];
  dbAnnotations: IKeyValue[];
  dbNodeSelector: IKeyValue[];
  dbServiceAccountName: string;
  cpuRequest: string;
  memRequest: string; 
  dbCPURequest:string;
  dbMemRequest:string;   
}

const styles = (theme: Theme) =>
  createStyles({
    buttonContainer: {
      textAlign: "right",
    },
    multiContainer: {
      display: "flex",
      alignItems: "center" as const,
      justifyContent: "flex-start" as const,
    },
    sizeFactorContainer: {
      marginLeft: 8,
    },
    bottomContainer: {
      display: "flex",
      flexGrow: 1,
      alignItems: "center",
      "& div": {
        flexGrow: 1,
        width: "100%",
      },
    },
    factorElements: {
      display: "flex",
      justifyContent: "flex-start",
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
    shortened: {
      gridTemplateColumns: "auto auto 20px 20px",
      display: "grid",
      gridGap: 20,
    },
    ...modalBasic,
    ...modalStyleUtils,
    ...formFieldStyles,
  });

const EditTenantLogsModal = ({
  tenant,
  classes,
  open,
  onClose,
  image,
  labels,
  annotations,
  nodeSelector,
  diskCapacityGB,
  serviceAccountName,
  dbLabels,
  dbAnnotations,
  dbNodeSelector,
  dbImage,
  dbServiceAccountName,
  cpuRequest,
  memRequest,
  dbCPURequest,
  dbMemRequest
}: IEditTenantLogsProps) => {
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
  const [newDiskCapacityGB, setNewDiskCapacityGB] =
    useState<number>(diskCapacityGB);
  const [newServiceAccountName, setNewServiceAccountName] = useState<string>(
    serviceAccountName != null ? serviceAccountName : ""
  );
  const [newDbLabels, setNewDbLabels] = useState<IKeyValue[]>(
    dbLabels.length > 0 ? [...dbLabels] : [{ key: "", value: "" }]
  );
  const [newDbAnnotations, setNewDbAnnotations] = useState<IKeyValue[]>(
    dbAnnotations.length > 0 ? [...dbAnnotations] : [{ key: "", value: "" }]
  );
  const [newDbNodeSelector, setNewDbNodeSelector] = useState<IKeyValue[]>(
    dbNodeSelector.length > 0 ? [...dbNodeSelector] : [{ key: "", value: "" }]
  );
  const [newCPURequest, setNewCPURequest] = useState<string>(cpuRequest);
  const [newMemRequest, setNewMemRequest] = useState<string>( memRequest ?
    Math.floor(parseInt(memRequest, 10) / 1000000000).toString() : "0"
  );
  const [newDBCPURequest, setNewDBCPURequest] = useState<string>(dbCPURequest);
  const [newDBMemRequest, setNewDBMemRequest] = useState<string>(dbMemRequest ?
    Math.floor(parseInt(dbMemRequest, 10) / 1000000000).toString() : "0"
  );
  const [newDbImage, setNewDbImage] = useState<string>(dbImage);
  const [newDbServiceAccountName, setNewDbServiceAccountName] =
    useState<string>(dbServiceAccountName != null ? dbServiceAccountName : "");
  const [labelsError, setLabelsError] = useState<any>({});
  const [annotationsError, setAnnotationsError] = useState<any>({});
  const [nodeSelectorError, setNodeSelectorError] = useState<any>({});
  const [dbLabelsError, setDbLabelsError] = useState<any>({});
  const [dbAnnotationsError, setDbAnnotationsError] = useState<any>({});
  const [dbNodeSelectorError, setDbNodeSelectorError] = useState<any>({});

  const trim = (x: IKeyValue[]): IKeyValue[] => {
    let retval: IKeyValue[] = [];
    for (let i = 0; i < x.length; i++) {
      if (x[i].key !== "") {
        retval.push(x[i]);
      }
    }
    return retval;
  };

  const cleanValidation = (fieldName: string) => {
    setValidationErrors(clearValidationError(validationErrors, fieldName));
  };

  useEffect(() => {
    let tenantLogValidation: IValidation[] = [];

    tenantLogValidation.push({
      fieldKey: `image`,
      required: false,
      value: newImage,
      pattern:
        /^([a-zA-Z0-9])([a-zA-Z0-9-._])*([a-zA-Z0-9]?)+(\/(([a-zA-Z0-9])([a-zA-Z0-9-._])*([a-zA-Z0-9])?)+)*:([a-zA-Z0-9])[a-zA-Z0-9-.]{0,127}$/,
      customPatternMessage: "Invalid image",
    });
    tenantLogValidation.push({
      fieldKey: `dbImage`,
      required: false,
      value: newDbImage,
      pattern:
        /^([a-zA-Z0-9])([a-zA-Z0-9-._])*([a-zA-Z0-9]?)+(\/(([a-zA-Z0-9])([a-zA-Z0-9-._])*([a-zA-Z0-9])?)+)*:([a-zA-Z0-9])[a-zA-Z0-9-.]{0,127}$/,
      customPatternMessage: "Invalid image",
    });
    tenantLogValidation.push({
      fieldKey: `diskCapacityGB`,
      required: true,
      value: newDiskCapacityGB as any as string,
      pattern: /^[0-9]*$/,
      customPatternMessage: "Must be an integer between 0 and 10",
    });
    tenantLogValidation.push({
      fieldKey: `serviceAccountName`,
      required: false,
      value: newServiceAccountName,
      pattern: /^[a-zA-Z0-9-.]{1,253}$/,
      customPatternMessage: "Invalid service account name",
    });
    tenantLogValidation.push({
      fieldKey: `dbServiceAccountName`,
      required: false,
      value: newDbServiceAccountName,
      pattern: /^[a-zA-Z0-9-.]{1,253}$/,
      customPatternMessage: "Invalid service account name",
    });

    tenantLogValidation.push({
      fieldKey: `cpuRequest`,
      required: true,
      value: newCPURequest as any as string,
      pattern: /^[0-9]*$/,
      customPatternMessage: "Please enter an integer value for number of CPUs requested",
    });
    tenantLogValidation.push({
      fieldKey: `memRequest`,
      required: true,
      value: newMemRequest as any as string,
      pattern: /^[0-9]*$/,
      customPatternMessage: "Please enter an integer value (Gi) for memory requested",
    });
    tenantLogValidation.push({
      fieldKey: `dbCPURequest`,
      required: true,
      value: newDBCPURequest as any as string,
      pattern: /^[0-9]*$/,
      customPatternMessage: "Please enter an integer value for number of  DB CPUs requested",
    });
    tenantLogValidation.push({
      fieldKey: `dbMemRequest`,
      required: true,
      value: newDBMemRequest as any as string,
      pattern: /^[0-9]*$/,
      customPatternMessage: "Please enter an integer value (Gi) for DB memory requested",
    });

    const commonVal = commonFormValidation(tenantLogValidation);
    setValidationErrors(commonVal);
  }, [
    newImage,
    newDbImage,
    newDiskCapacityGB,
    newServiceAccountName,
    newDbServiceAccountName,
    newCPURequest,
    newMemRequest,
    newDBCPURequest,
    newDBMemRequest,
    setValidationErrors,
  ]);

  const checkValid = (): boolean => {
    if (
      Object.keys(validationErrors).length !== 0 ||
      Object.keys(labelsError).length !== 0 ||
      Object.keys(annotationsError).length !== 0 ||
      Object.keys(nodeSelectorError).length !== 0 ||
      Object.keys(dbLabelsError).length !== 0 ||
      Object.keys(dbAnnotationsError).length !== 0 ||
      Object.keys(dbNodeSelectorError).length !== 0
    ) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <ModalWrapper
      onClose={() => onClose(true)}
      modalOpen={open}
      title="Edit Logging"
    >
      <form
        noValidate
        autoComplete="off"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          if (!checkValid()) {
            setModalErrorSnackMessage({
              errorMessage: "Some fields have invalid values",
              detailedError: "",
            });
          } else {
            api
              .invoke(
                "PUT",
                `/api/v1/namespaces/${tenant.namespace}/tenants/${tenant.name}/log`,
                {
                  labels: trim(newLabels),
                  annotations: trim(newAnnotations),
                  nodeSelector: trim(newNodeSelector),
                  image: newImage,
                  diskCapacityGB: newDiskCapacityGB,
                  serviceAccountName: newServiceAccountName,
                  dbLabels: trim(newDbLabels),
                  dbAnnotations: trim(newDbAnnotations),
                  dbNodeSelector: trim(newDbNodeSelector),
                  dbImage: newDbImage,
                  dbServiceAccountName: newDbServiceAccountName,
                  logCPURequest: newCPURequest,
                  logMemRequest: newMemRequest + "Gi",
                  logDBCPURequest: newDBCPURequest,
                  logDBMemRequest: newDBMemRequest+ "Gi",
                }
              )
              .then(() => {
                onClose(true);
              })
              .catch((err: ErrorResponseHandler) => {});
          }
        }}
      >
        <h2>Logging API </h2>
        <hr className={classes.hrClass} />
        <h4>Image</h4>
        <InputBoxWrapper
          id={`image`}
          label={""}
          placeholder={"Image"}
          name={`image`}
          value={newImage}
          onChange={(e) => {
            setNewImage(e.target.value);
            cleanValidation(`image`);
          }}
          key={`image`}
          error={validationErrors[`image`] || ""}
        />
        <h4>Disk Capacity (GB)</h4>
        <InputBoxWrapper
          id={`diskCapacityGB`}
          label={""}
          placeholder={"Disk Capacity (GB)"}
          name={`diskCapacityGB`}
          value={newDiskCapacityGB as any as string}
          onChange={(e) => {
            setNewDiskCapacityGB(e.target.value as any as number);
            cleanValidation(`diskCapacityGB`);
          }}
          key={`diskCapacityGB`}
          error={validationErrors[`diskCapacityGB`] || ""}
        />
        <h4>Service Account Name</h4>
        <InputBoxWrapper
          id={`serviceAccountName`}
          label={""}
          placeholder={"Service Account Name"}
          name={`serviceAccountName`}
          value={newServiceAccountName}
          onChange={(e) => {
            setNewServiceAccountName(e.target.value);
            cleanValidation(`serviceAccountName`);
          }}
          key={`serviceAccountName`}
          error={validationErrors[`serviceAccountName`] || ""}
        />
        <h4>Logging CPU Request</h4>
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
        <h4>Logging Memory Request (Gi)</h4>
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
        <h2>Database Configuration </h2>
        <hr className={classes.hrClass} />
        <h4>Postgres Image</h4>
        <InputBoxWrapper
          id={`dbImage`}
          label={""}
          placeholder={"Db Image"}
          name={`dbImage`}
          value={newDbImage}
          onChange={(e) => {
            setNewDbImage(e.target.value);
            cleanValidation(`dbImage`);
          }}
          key={`dbImage`}
          error={validationErrors[`dbImage`] || ""}
        />
        <h4>Service Account</h4>
        <InputBoxWrapper
          id={`dbServiceAccountName`}
          label={""}
          placeholder={"Db Service Account Name"}
          name={`dbServiceAccountName`}
          value={newDbServiceAccountName}
          onChange={(e) => {
            setNewDbServiceAccountName(e.target.value);
            cleanValidation(`dbServiceAccountName`);
          }}
          key={`dbServiceAccountName`}
          error={validationErrors[`dbServiceAccountName`] || ""}
        />
         <h4>Logging DB CPU Request</h4>
        <InputBoxWrapper
          id={`dbCpuRequest`}
          label={""}
          placeholder={"DB CPU Request"}
          name={`dbCpuRequest`}
          value={newDBCPURequest}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setNewDBCPURequest(event.target.value);
          }}
          key={`cpuRequest`}
          error={validationErrors[`dbCPURequest`] || ""}
        />
        <h4>Logging DB Memory Request (Gi)</h4>
        <InputBoxWrapper
          id={`dbMemRequest`}
          label={""}
          placeholder={"DB Memory request"}
          name={`dbMemRequest`}
          value={newDBMemRequest}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setNewDBMemRequest(event.target.value);
          }}
          key={`memRequest`}
          error={validationErrors[`dbMemRequest`] || ""}
        />
        <h4>Labels</h4>
        <KeyPairEdit
          newValues={newDbLabels}
          setNewValues={setNewDbLabels}
          paramName={"Db Labels"}
          error={dbLabelsError}
          setError={setDbLabelsError}
        />
        <h4>Annotations</h4>
        <KeyPairEdit
          newValues={newDbAnnotations}
          setNewValues={setNewDbAnnotations}
          paramName={"Db Annotations"}
          error={dbAnnotationsError}
          setError={setDbAnnotationsError}
        />
        <h4>Node Selector</h4>
        <KeyPairEdit
          newValues={newDbNodeSelector}
          setNewValues={setNewDbNodeSelector}
          paramName={"DbNode Selector"}
          error={dbNodeSelectorError}
          setError={setDbNodeSelectorError}
        />
        
        <br />
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

export default withStyles(styles)(EditTenantLogsModal);
