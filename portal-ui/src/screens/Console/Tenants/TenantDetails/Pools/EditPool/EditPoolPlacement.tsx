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

import React, { Fragment, useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Grid, IconButton, Paper, SelectChangeEvent } from "@mui/material";
import { AppState } from "../../../../../../store";
import {
  setEditPoolField,
  isEditPoolPageValid,
  setEditPoolKeyValuePairs,
  setEditPoolTolerationInfo,
  addNewEditPoolToleration,
  removeEditPoolToleration,
} from "../../../actions";
import { setModalErrorSnackMessage } from "../../../../../../actions";
import {
  modalBasic,
  wizardCommon,
} from "../../../../Common/FormComponents/common/styleLibrary";
import {
  commonFormValidation,
  IValidation,
} from "../../../../../../utils/validationFunctions";
import {
  ErrorResponseHandler,
  ITolerationModel,
} from "../../../../../../common/types";
import { LabelKeyPair } from "../../../types";
import RadioGroupSelector from "../../../../Common/FormComponents/RadioGroupSelector/RadioGroupSelector";
import FormSwitchWrapper from "../../../../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import api from "../../../../../../common/api";
import InputBoxWrapper from "../../../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import AddIcon from "../../../../../../icons/AddIcon";
import RemoveIcon from "../../../../../../icons/RemoveIcon";
import SelectWrapper from "../../../../Common/FormComponents/SelectWrapper/SelectWrapper";
import TolerationSelector from "../../../../Common/TolerationSelector/TolerationSelector";

interface IAffinityProps {
  classes: any;
  podAffinity: string;
  nodeSelectorLabels: string;
  withPodAntiAffinity: boolean;
  keyValuePairs: LabelKeyPair[];
  tolerations: ITolerationModel[];
  setModalErrorSnackMessage: typeof setModalErrorSnackMessage;
  setEditPoolField: typeof setEditPoolField;
  isEditPoolPageValid: typeof isEditPoolPageValid;
  setEditPoolKeyValuePairs: typeof setEditPoolKeyValuePairs;
  setEditPoolTolerationInfo: typeof setEditPoolTolerationInfo;
  removeEditPoolToleration: typeof removeEditPoolToleration;
  addNewEditPoolToleration: typeof addNewEditPoolToleration;
}

const styles = (theme: Theme) =>
  createStyles({
    overlayAction: {
      marginLeft: 10,
      display: "flex",
      alignItems: "center",
      "& svg": {
        maxWidth: 15,
        maxHeight: 15,
      },
      "& button": {
        background: "#EAEAEA",
      },
    },
    affinityConfigField: {
      display: "flex",
    },
    affinityFieldLabel: {
      display: "flex",
      flexFlow: "column",
      flex: 1,
    },
    radioField: {
      display: "flex",
      alignItems: "flex-start",
      marginTop: 10,
      "& div:first-child": {
        display: "flex",
        flexFlow: "column",
        alignItems: "baseline",
        textAlign: "left !important",
      },
    },
    affinityLabelKey: {
      "& div:first-child": {
        marginBottom: 0,
      },
    },
    affinityLabelValue: {
      marginLeft: 10,
      "& div:first-child": {
        marginBottom: 0,
      },
    },
    rowActions: {
      display: "flex",
      alignItems: "center",
    },
    affinityRow: {
      marginBottom: 10,
      display: "flex",
    },
    ...modalBasic,
    ...wizardCommon,
  });

interface OptionPair {
  label: string;
  value: string;
}

const Affinity = ({
  classes,
  podAffinity,
  nodeSelectorLabels,
  withPodAntiAffinity,
  setModalErrorSnackMessage,
  keyValuePairs,
  setEditPoolField,
  isEditPoolPageValid,
  setEditPoolKeyValuePairs,
  setEditPoolTolerationInfo,
  addNewEditPoolToleration,
  removeEditPoolToleration,
  tolerations,
}: IAffinityProps) => {
  const [validationErrors, setValidationErrors] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [keyValueMap, setKeyValueMap] = useState<{ [key: string]: string[] }>(
    {}
  );
  const [keyOptions, setKeyOptions] = useState<OptionPair[]>([]);

  // Common
  const updateField = useCallback(
    (field: string, value: any) => {
      setEditPoolField("affinity", field, value);
    },
    [setEditPoolField]
  );

  useEffect(() => {
    if (loading) {
      api
        .invoke("GET", `/api/v1/nodes/labels`)
        .then((res: { [key: string]: string[] }) => {
          setLoading(false);
          setKeyValueMap(res);
          let keys: OptionPair[] = [];
          for (let k in res) {
            keys.push({
              label: k,
              value: k,
            });
          }
          setKeyOptions(keys);
        })
        .catch((err: ErrorResponseHandler) => {
          setLoading(false);
          setModalErrorSnackMessage(err);
          setKeyValueMap({});
        });
    }
  }, [setModalErrorSnackMessage, loading]);

  useEffect(() => {
    if (keyValuePairs) {
      const vlr = keyValuePairs
        .filter((kvp) => kvp.key !== "")
        .map((kvp) => `${kvp.key}=${kvp.value}`)
        .filter((kvs, i, a) => a.indexOf(kvs) === i);
      const vl = vlr.join("&");
      updateField("nodeSelectorLabels", vl);
    }
  }, [keyValuePairs, updateField]);

  // Validation
  useEffect(() => {
    let customAccountValidation: IValidation[] = [];

    if (podAffinity === "nodeSelector") {
      let valid = true;

      const splittedLabels = nodeSelectorLabels.split("&");

      if (splittedLabels.length === 1 && splittedLabels[0] === "") {
        valid = false;
      }

      splittedLabels.forEach((item: string, index: number) => {
        const splitItem = item.split("=");

        if (splitItem.length !== 2) {
          valid = false;
        }

        if (index + 1 !== splittedLabels.length) {
          if (splitItem[0] === "" || splitItem[1] === "") {
            valid = false;
          }
        }
      });

      customAccountValidation = [
        ...customAccountValidation,
        {
          fieldKey: "labels",
          required: true,
          value: nodeSelectorLabels,
          customValidation: !valid,
          customValidationMessage:
            "You need to add at least one label key-pair",
        },
      ];
    }

    const commonVal = commonFormValidation(customAccountValidation);

    isEditPoolPageValid("affinity", Object.keys(commonVal).length === 0);

    setValidationErrors(commonVal);
  }, [isEditPoolPageValid, podAffinity, nodeSelectorLabels]);

  const updateToleration = (index: number, field: string, value: any) => {
    const alterToleration = { ...tolerations[index], [field]: value };

    setEditPoolTolerationInfo(index, alterToleration);
  };

  return (
    <Paper className={classes.paperWrapper}>
      <div className={classes.headerElement}>
        <h3 className={classes.h3Section}>Pod Placement</h3>
      </div>
      <Grid item xs={12} className={classes.affinityConfigField}>
        <Grid item className={classes.affinityFieldLabel}>
          <div className={classes.label}>Type</div>
          <div
            className={`${classes.descriptionText} ${classes.affinityHelpText}`}
          >
            MinIO supports multiple configurations for Pod Affinity
          </div>
          <Grid item className={classes.radioField}>
            <RadioGroupSelector
              currentSelection={podAffinity}
              id="affinity-options"
              name="affinity-options"
              label={" "}
              onChange={(e) => {
                updateField("podAffinity", e.target.value);
              }}
              selectorOptions={[
                { label: "None", value: "none" },
                { label: "Default (Pod Anti-Affinity)", value: "default" },
                { label: "Node Selector", value: "nodeSelector" },
              ]}
            />
          </Grid>
        </Grid>
      </Grid>
      {podAffinity === "nodeSelector" && (
        <Fragment>
          <br />
          <Grid item xs={12}>
            <FormSwitchWrapper
              value="with_pod_anti_affinity"
              id="with_pod_anti_affinity"
              name="with_pod_anti_affinity"
              checked={withPodAntiAffinity}
              onChange={(e) => {
                const targetD = e.target;
                const checked = targetD.checked;

                updateField("withPodAntiAffinity", checked);
              }}
              label={"With Pod Anti-Affinity"}
            />
          </Grid>
          <Grid item xs={12}>
            <h3>Labels</h3>
            <span className={classes.error}>{validationErrors["labels"]}</span>
            <Grid container>
              {keyValuePairs &&
                keyValuePairs.map((kvp, i) => {
                  return (
                    <Grid
                      item
                      xs={12}
                      className={classes.affinityRow}
                      key={`affinity-keyVal-${i.toString()}`}
                    >
                      <Grid item xs={5} className={classes.affinityLabelKey}>
                        {keyOptions.length > 0 && (
                          <SelectWrapper
                            onChange={(e: SelectChangeEvent<string>) => {
                              const newKey = e.target.value as string;
                              const arrCp: LabelKeyPair[] = Object.assign(
                                [],
                                keyValuePairs
                              );

                              arrCp[i].key = e.target.value as string;
                              arrCp[i].value = keyValueMap[newKey][0];
                              setEditPoolKeyValuePairs(arrCp);
                            }}
                            id="select-access-policy"
                            name="select-access-policy"
                            label={""}
                            value={kvp.key}
                            options={keyOptions}
                          />
                        )}
                        {keyOptions.length === 0 && (
                          <InputBoxWrapper
                            id={`nodeselector-key-${i.toString()}`}
                            label={""}
                            name={`nodeselector-${i.toString()}`}
                            value={kvp.key}
                            onChange={(e) => {
                              const arrCp: LabelKeyPair[] = Object.assign(
                                [],
                                keyValuePairs
                              );
                              arrCp[i].key = e.target.value;
                              setEditPoolKeyValuePairs(arrCp);
                            }}
                            index={i}
                            placeholder={"Key"}
                          />
                        )}
                      </Grid>
                      <Grid item xs={5} className={classes.affinityLabelValue}>
                        {keyOptions.length > 0 && (
                          <SelectWrapper
                            onChange={(e: SelectChangeEvent<string>) => {
                              const arrCp: LabelKeyPair[] = Object.assign(
                                [],
                                keyValuePairs
                              );
                              arrCp[i].value = e.target.value as string;
                              setEditPoolKeyValuePairs(arrCp);
                            }}
                            id="select-access-policy"
                            name="select-access-policy"
                            label={""}
                            value={kvp.value}
                            options={
                              keyValueMap[kvp.key]
                                ? keyValueMap[kvp.key].map((v) => {
                                    return { label: v, value: v };
                                  })
                                : []
                            }
                          />
                        )}
                        {keyOptions.length === 0 && (
                          <InputBoxWrapper
                            id={`nodeselector-value-${i.toString()}`}
                            label={""}
                            name={`nodeselector-${i.toString()}`}
                            value={kvp.value}
                            onChange={(e) => {
                              const arrCp: LabelKeyPair[] = Object.assign(
                                [],
                                keyValuePairs
                              );
                              arrCp[i].value = e.target.value;
                              setEditPoolKeyValuePairs(arrCp);
                            }}
                            index={i}
                            placeholder={"value"}
                          />
                        )}
                      </Grid>
                      <Grid item xs={2} className={classes.rowActions}>
                        <div className={classes.overlayAction}>
                          <IconButton
                            size={"small"}
                            onClick={() => {
                              const arrCp = Object.assign([], keyValuePairs);
                              if (keyOptions.length > 0) {
                                arrCp.push({
                                  key: keyOptions[0].value,
                                  value: keyValueMap[keyOptions[0].value][0],
                                });
                              } else {
                                arrCp.push({ key: "", value: "" });
                              }

                              setEditPoolKeyValuePairs(arrCp);
                            }}
                          >
                            <AddIcon />
                          </IconButton>
                        </div>
                        {keyValuePairs.length > 1 && (
                          <div className={classes.overlayAction}>
                            <IconButton
                              size={"small"}
                              onClick={() => {
                                const arrCp = keyValuePairs.filter(
                                  (item, index) => index !== i
                                );
                                setEditPoolKeyValuePairs(arrCp);
                              }}
                            >
                              <RemoveIcon />
                            </IconButton>
                          </div>
                        )}
                      </Grid>
                    </Grid>
                  );
                })}
            </Grid>
          </Grid>
        </Fragment>
      )}
      <Grid item xs={12} className={classes.affinityConfigField}>
        <Grid item className={classes.affinityFieldLabel}>
          <h3>Tolerations</h3>
          <span className={classes.error}>
            {validationErrors["tolerations"]}
          </span>
          <Grid container>
            {tolerations &&
              tolerations.map((tol, i) => {
                return (
                  <Grid
                    item
                    xs={12}
                    className={classes.affinityRow}
                    key={`affinity-keyVal-${i.toString()}`}
                  >
                    <TolerationSelector
                      effect={tol.effect}
                      onEffectChange={(value) => {
                        updateToleration(i, "effect", value);
                      }}
                      tolerationKey={tol.key}
                      onTolerationKeyChange={(value) => {
                        updateToleration(i, "key", value);
                      }}
                      operator={tol.operator}
                      onOperatorChange={(value) => {
                        updateToleration(i, "operator", value);
                      }}
                      value={tol.value}
                      onValueChange={(value) => {
                        updateToleration(i, "value", value);
                      }}
                      tolerationSeconds={tol.tolerationSeconds?.seconds || 0}
                      onSecondsChange={(value) => {
                        updateToleration(i, "tolerationSeconds", {
                          seconds: value,
                        });
                      }}
                      index={i}
                    />
                    <div className={classes.overlayAction}>
                      <IconButton
                        size={"small"}
                        onClick={addNewEditPoolToleration}
                        disabled={i !== tolerations.length - 1}
                      >
                        <AddIcon />
                      </IconButton>
                    </div>

                    <div className={classes.overlayAction}>
                      <IconButton
                        size={"small"}
                        onClick={() => removeEditPoolToleration(i)}
                        disabled={tolerations.length <= 1}
                      >
                        <RemoveIcon />
                      </IconButton>
                    </div>
                  </Grid>
                );
              })}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

const mapState = (state: AppState) => {
  const editPool = state.tenants.editPool;

  return {
    podAffinity: editPool.fields.affinity.podAffinity,
    nodeSelectorLabels: editPool.fields.affinity.nodeSelectorLabels,
    withPodAntiAffinity: editPool.fields.affinity.withPodAntiAffinity,
    keyValuePairs: editPool.fields.nodeSelectorPairs,
    tolerations: editPool.fields.tolerations,
  };
};

const connector = connect(mapState, {
  setModalErrorSnackMessage,
  setEditPoolField,
  isEditPoolPageValid,
  setEditPoolKeyValuePairs,
  setEditPoolTolerationInfo,
  addNewEditPoolToleration,
  removeEditPoolToleration,
});

export default withStyles(styles)(connector(Affinity));
