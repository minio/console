import React, { Fragment, useEffect } from "react";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Theme } from "@mui/material/styles";
import { modalBasic } from "../../Common/FormComponents/common/styleLibrary";
import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { IKeyValue } from "../ListTenants/types";
import {
  commonFormValidation,
  IValidation,
} from "../../../../utils/validationFunctions";
import { clearValidationError } from "../utils";

interface IKeyPairEditProps {
  classes: any;
  paramName: string;
  error: any;
  setError: (e: any) => void;
  newValues: IKeyValue[];
  setNewValues: (vals: IKeyValue[]) => void;
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
  });

const KeyPairEdit = ({
  classes,
  paramName,
  newValues,
  setNewValues,
  error,
  setError,
}: IKeyPairEditProps) => {
  const cleanValidation = (fieldName: string) => {
    setError(clearValidationError(error, fieldName));
  };

  useEffect(() => {
    let keyPairValidation: IValidation[] = [];

    for (var i = 0; i < newValues.length; i++) {
      keyPairValidation.push({
        fieldKey: `key-${i.toString()}`,
        required: false,
        value: newValues[i].key,
        customPatternMessage: "Invalid key",
      });
      keyPairValidation.push({
        fieldKey: `val-${i.toString()}`,
        required: false,
        value: newValues[i].value,
        customPatternMessage: "Invalid value",
      });
    }

    const commonVal = commonFormValidation(keyPairValidation);
    setError(commonVal);
  }, [newValues, setError]);

  let keyValueInputs = newValues.map((_, index) => {
    return (
      <Fragment key={`keyvalue-${index.toString()}`}>
        <div className={classes.shortened}>
          <InputBoxWrapper
            id={`key-${index.toString()}`}
            label={""}
            placeholder={"Key"}
            name={`key-${index.toString()}`}
            value={newValues[index].key}
            onChange={(e) => {
              let tempLabels = [...newValues];
              tempLabels[index].key = e.target.value;
              setNewValues(tempLabels);
              cleanValidation(`key-${index.toString()}`);
            }}
            index={index}
            key={`csv-key-${index.toString()}`}
            error={error[`key-${index.toString()}`] || ""}
          />
          <InputBoxWrapper
            id={`val-${index.toString()}`}
            label={""}
            placeholder={"Value"}
            name={`val-${index.toString()}`}
            value={newValues[index].value}
            onChange={(e) => {
              let tempLabels = [...newValues];
              tempLabels[index].value = e.target.value;
              setNewValues(tempLabels);
              cleanValidation(`val-${index.toString()}`);
            }}
            index={index}
            key={`csv-val-${index.toString()}`}
            error={error[`val-${index.toString()}`] || ""}
          />
          <Tooltip title={`Add ${paramName}`} aria-label="addlabel">
            <IconButton
              size={"small"}
              onClick={() => {
                let tempLabels = [...newValues];
                tempLabels.push({ key: "", value: "" });
                setNewValues(tempLabels);
              }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Remove" aria-label="removeLabel">
            <IconButton
              size={"small"}
              style={{ marginLeft: 16 }}
              onClick={() => {
                if (newValues.length === 1) {
                  setNewValues([{ key: "", value: "" }]);
                }
                if (newValues.length > 1) {
                  let tempLabels = [...newValues];
                  tempLabels.splice(index, 1);
                  setNewValues(tempLabels);
                }
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </div>
      </Fragment>
    );
  });

  return <Fragment>{keyValueInputs}</Fragment>;
};

export default withStyles(styles)(KeyPairEdit);
