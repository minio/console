// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
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

import React, { useEffect, useState, useCallback, Fragment } from "react";
import { connect } from "react-redux";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { AppState } from "../../../../../store";
import { updateAddField, isPageValid } from "../../actions";
import { setModalErrorSnackMessage } from "../../../../../actions";
import {
  modalBasic,
  wizardCommon,
} from "../../../Common/FormComponents/common/styleLibrary";
import { Grid } from "@material-ui/core";
import {
  commonFormValidation,
  IValidation,
} from "../../../../../utils/validationFunctions";
import RadioGroupSelector from "../../../Common/FormComponents/RadioGroupSelector/RadioGroupSelector";
import QueryMultiSelector from "../../../Common/FormComponents/QueryMultiSelector/QueryMultiSelector";
import FormSwitchWrapper from "../../../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";

interface IAffinityProps {
  classes: any;
  podAffinity: string;
  nodeSelectorLabels: string;
  withPodAntiAffinity: boolean;
  setModalErrorSnackMessage: typeof setModalErrorSnackMessage;
  updateAddField: typeof updateAddField;
  isPageValid: typeof isPageValid;
}

const styles = (theme: Theme) =>
  createStyles({
    buttonContainer: {
      textAlign: "right",
    },
    ...modalBasic,
    ...wizardCommon,
  });

const Affinity = ({
  classes,
  podAffinity,
  nodeSelectorLabels,
  withPodAntiAffinity,
  setModalErrorSnackMessage,
  updateAddField,
  isPageValid,
}: IAffinityProps) => {
  const [validationErrors, setValidationErrors] = useState<any>({});

  // Common
  const updateField = useCallback(
    (field: string, value: any) => {
      updateAddField("affinity", field, value);
    },
    [updateAddField]
  );

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

    isPageValid("affinity", Object.keys(commonVal).length === 0);

    setValidationErrors(commonVal);
  }, [isPageValid, podAffinity, nodeSelectorLabels]);

  return (
    <Fragment>
      <div className={classes.headerElement}>
        <h3 className={classes.h3Section}>Pod Affinity</h3>
        <span className={classes.descriptionText}>
          Configure how pods will be assigned to nodes
        </span>
      </div>
      <Grid item xs={12}>
        <RadioGroupSelector
          currentSelection={podAffinity}
          id="affinity-options"
          name="affinity-options"
          label="Type"
          onChange={(e) => {
            updateField("podAffinity", e.target.value);
          }}
          selectorOptions={[
            { label: "None", value: "none" },
            { label: "Default (Pod Anti-afinnity)", value: "default" },
            { label: "Node Selector", value: "nodeSelector" },
          ]}
        />
        MinIO supports multiple configurations for Pod Afinnity
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
            <QueryMultiSelector
              name="labels"
              label="Labels"
              elements={nodeSelectorLabels}
              onChange={(vl: string) => {
                updateField("nodeSelectorLabels", vl);
              }}
              keyPlaceholder="Label Key"
              valuePlaceholder="Label Value"
              tooltip="Labels to be used in nodeSelector assignation. Invalid key-pairs will be ignored"
              withBorder
            />
            <span className={classes.error}>{validationErrors["labels"]}</span>
          </Grid>
        </Fragment>
      )}
    </Fragment>
  );
};

const mapState = (state: AppState) => ({
  podAffinity: state.tenants.createTenant.fields.affinity.podAffinity,
  nodeSelectorLabels:
    state.tenants.createTenant.fields.affinity.nodeSelectorLabels,
  withPodAntiAffinity:
    state.tenants.createTenant.fields.affinity.withPodAntiAffinity,
});

const connector = connect(mapState, {
  setModalErrorSnackMessage,
  updateAddField,
  isPageValid,
});

export default withStyles(styles)(connector(Affinity));
