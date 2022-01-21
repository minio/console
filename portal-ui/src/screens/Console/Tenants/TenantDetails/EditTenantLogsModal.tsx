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

    const commonVal = commonFormValidation(tenantLogValidation);
    setValidationErrors(commonVal);
  }, [
    newImage,
    newDbImage,
    newDiskCapacityGB,
    newServiceAccountName,
    newDbServiceAccountName,
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
                }
              )
              .then(() => {
                onClose(true);
              })
              .catch((err: ErrorResponseHandler) => {});
          }
        }}
      >
        <Grid container>
          <Grid xs={12} className={classes.modalFormScrollable}>
            <Grid item xs={12} className={classes.formFieldRow}>
              <h4>Logging API </h4>
            </Grid>
            <Grid item xs={12} className={classes.formFieldRow}>
              <InputBoxWrapper
                id={`image`}
                label={"Image"}
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
            </Grid>
            <Grid item xs={12} className={classes.formFieldRow}>
              <InputBoxWrapper
                id={`diskCapacityGB`}
                label={"Disk Capacity (GB)"}
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
            </Grid>
            <Grid item xs={12} className={classes.formFieldRow}>
              <InputBoxWrapper
                id={`serviceAccountName`}
                label={"Service Account"}
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
            <Grid item xs={12} className={classes.formFieldRow}>
              <h4>Database Configuration </h4>
            </Grid>
            <Grid item xs={12} className={classes.formFieldRow}>
              <InputBoxWrapper
                id={`dbImage`}
                label={"Postgres Image"}
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
            </Grid>
            <Grid item xs={12} className={classes.formFieldRow}>
              <InputBoxWrapper
                id={`dbServiceAccountName`}
                label={"Service Account"}
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
            </Grid>
            <Grid item xs={12} className={classes.formFieldRow}>
              <span className={classes.inputLabel}>Labels</span>
              <KeyPairEdit
                newValues={newDbLabels}
                setNewValues={setNewDbLabels}
                paramName={"Db Labels"}
                error={dbLabelsError}
                setError={setDbLabelsError}
              />
            </Grid>
            <Grid item xs={12} className={classes.formFieldRow}>
              <span className={classes.inputLabel}>Annotations</span>
              <KeyPairEdit
                newValues={newDbAnnotations}
                setNewValues={setNewDbAnnotations}
                paramName={"Db Annotations"}
                error={dbAnnotationsError}
                setError={setDbAnnotationsError}
              />
            </Grid>
            <Grid item xs={12} className={classes.formFieldRow}>
              <span className={classes.inputLabel}>Node Selector</span>
              <KeyPairEdit
                newValues={newDbNodeSelector}
                setNewValues={setNewDbNodeSelector}
                paramName={"DbNode Selector"}
                error={dbNodeSelectorError}
                setError={setDbNodeSelectorError}
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

export default withStyles(styles)(EditTenantLogsModal);
