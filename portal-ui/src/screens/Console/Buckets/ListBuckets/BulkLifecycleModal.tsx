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

import React, { Fragment, useEffect, useState } from "react";
import {
  FormLayout,
  Grid,
  InputBox,
  RadioGroup,
  ReadBox,
  Select,
  Switch,
  Tooltip,
} from "mds";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import get from "lodash/get";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {
  createTenantCommon,
  formFieldStyles,
  modalStyleUtils,
  spacingUtils,
} from "../../Common/FormComponents/common/styleLibrary";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import GenericWizard from "../../Common/GenericWizard/GenericWizard";
import QueryMultiSelector from "../../Common/FormComponents/QueryMultiSelector/QueryMultiSelector";
import { ITiersDropDown } from "../types";
import { setModalErrorSnackMessage } from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";
import { api } from "api";
import { MultiLifecycleResult, Tier } from "api/consoleApi";
import { errorToHandler } from "api/errors";

interface IBulkReplicationModal {
  open: boolean;
  closeModalAndRefresh: (clearSelection: boolean) => any;
  classes: any;
  buckets: string[];
}

const styles = (theme: Theme) =>
  createStyles({
    resultGrid: {
      display: "grid",
      gridTemplateColumns: "45px auto",
      alignItems: "center",
      justifyContent: "stretch",
    },
    errorIcon: {
      paddingTop: 5,
      color: "#C72C48",
    },
    successIcon: {
      paddingTop: 5,
      color: "#42C91A",
    },
    ...spacingUtils,
    ...modalStyleUtils,
    ...formFieldStyles,
    ...createTenantCommon,
  });

const AddBulkReplicationModal = ({
  open,
  closeModalAndRefresh,
  classes,
  buckets,
}: IBulkReplicationModal) => {
  const dispatch = useAppDispatch();
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [loadingTiers, setLoadingTiers] = useState<boolean>(true);
  const [tiersList, setTiersList] = useState<ITiersDropDown[]>([]);
  const [prefix, setPrefix] = useState("");
  const [tags, setTags] = useState<string>("");
  const [storageClass, setStorageClass] = useState("");
  const [NCTransitionSC, setNCTransitionSC] = useState("");
  const [expiredObjectDM, setExpiredObjectDM] = useState<boolean>(false);
  const [NCExpirationDays, setNCExpirationDays] = useState<string>("0");
  const [NCTransitionDays, setNCTransitionDays] = useState<string>("0");
  const [ilmType, setIlmType] = useState<"expiry" | "transition">("expiry");
  const [expiryDays, setExpiryDays] = useState<string>("0");
  const [transitionDays, setTransitionDays] = useState<string>("0");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [results, setResults] = useState<MultiLifecycleResult | null>(null);

  useEffect(() => {
    if (loadingTiers) {
      api.admin
        .tiersList()
        .then((res) => {
          const tiersList: Tier[] | null = get(res.data, "items", []);

          if (tiersList !== null && tiersList.length >= 1) {
            const objList = tiersList.map((tier: Tier) => {
              const tierType = tier.type;
              const value = get(tier, `${tierType}.name`, "");

              return { label: value, value: value };
            });

            setTiersList(objList);
            if (objList.length > 0) {
              setStorageClass(objList[0].value);
            }
          }
          setLoadingTiers(false);
        })
        .catch((err) => {
          setLoadingTiers(false);
          dispatch(setModalErrorSnackMessage(errorToHandler(err.error)));
        });
    }
  }, [loadingTiers, dispatch]);

  useEffect(() => {
    let valid = true;

    if (ilmType !== "expiry") {
      if (storageClass === "") {
        valid = false;
      }
    }
    setIsFormValid(valid);
  }, [ilmType, expiryDays, transitionDays, storageClass]);

  const LogoToShow = ({ errString }: { errString: string }) => {
    switch (errString) {
      case "":
        return (
          <div className={classes.successIcon}>
            <CheckCircleOutlineIcon />
          </div>
        );
      case "n/a":
        return null;
      default:
        if (errString) {
          return (
            <div className={classes.errorIcon}>
              <Tooltip tooltip={errString} placement="top">
                <ErrorOutlineIcon />
              </Tooltip>
            </div>
          );
        }
    }
    return null;
  };

  const createLifecycleRules = (to: any) => {
    let rules = {};

    if (ilmType === "expiry") {
      let expiry = {
        expiry_days: parseInt(expiryDays),
      };

      rules = {
        ...expiry,
        noncurrentversion_expiration_days: parseInt(NCExpirationDays),
      };
    } else {
      let transition = {
        transition_days: parseInt(transitionDays),
      };

      rules = {
        ...transition,
        noncurrentversion_transition_days: parseInt(NCTransitionDays),
        noncurrentversion_transition_storage_class: NCTransitionSC,
        storage_class: storageClass,
      };
    }

    const lifecycleInsert = {
      buckets,
      type: ilmType,
      prefix,
      tags,
      expired_object_delete_marker: expiredObjectDM,
      ...rules,
    };

    api.buckets
      .addMultiBucketLifecycle(lifecycleInsert)
      .then((res) => {
        setAddLoading(false);
        setResults(res.data);
        to("++");
      })
      .catch((err) => {
        setAddLoading(false);
        dispatch(setModalErrorSnackMessage(errorToHandler(err.error)));
      });
  };

  return (
    <ModalWrapper
      modalOpen={open}
      onClose={() => {
        closeModalAndRefresh(false);
      }}
      title="Set Lifecycle to multiple buckets"
    >
      <GenericWizard
        loadingStep={addLoading || loadingTiers}
        wizardSteps={[
          {
            label: "Lifecycle Configuration",
            componentRender: (
              <Fragment>
                <Grid item xs={12}>
                  <ReadBox label="Local Buckets to replicate">
                    {buckets.join(", ")}
                  </ReadBox>
                </Grid>
                <h4>Remote Endpoint Configuration</h4>
                <FormLayout withBorders={false} containerPadding={false}>
                  <fieldset className={"inputItem"}>
                    <legend>Lifecycle Configuration</legend>
                    <RadioGroup
                      currentValue={ilmType}
                      id="quota_type"
                      name="quota_type"
                      label="ILM Rule"
                      onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                        setIlmType(e.target.value as "expiry" | "transition");
                      }}
                      selectorOptions={[
                        { value: "expiry", label: "Expiry" },
                        { value: "transition", label: "Transition" },
                      ]}
                    />
                    {ilmType === "expiry" ? (
                      <Fragment>
                        <InputBox
                          type="number"
                          id="expiry_days"
                          name="expiry_days"
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            setExpiryDays(e.target.value);
                          }}
                          label="Expiry Days"
                          value={expiryDays}
                          min="0"
                        />
                        <InputBox
                          type="number"
                          id="noncurrentversion_expiration_days"
                          name="noncurrentversion_expiration_days"
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            setNCExpirationDays(e.target.value);
                          }}
                          label="Non-current Expiration Days"
                          value={NCExpirationDays}
                          min="0"
                        />
                      </Fragment>
                    ) : (
                      <Fragment>
                        <InputBox
                          type="number"
                          id="transition_days"
                          name="transition_days"
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            setTransitionDays(e.target.value);
                          }}
                          label="Transition Days"
                          value={transitionDays}
                          min="0"
                        />
                        <InputBox
                          type="number"
                          id="noncurrentversion_transition_days"
                          name="noncurrentversion_transition_days"
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            setNCTransitionDays(e.target.value);
                          }}
                          label="Non-current Transition Days"
                          value={NCTransitionDays}
                          min="0"
                        />
                        <InputBox
                          id="noncurrentversion_t_SC"
                          name="noncurrentversion_t_SC"
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            setNCTransitionSC(e.target.value);
                          }}
                          placeholder="Set Non-current Version Transition Storage Class"
                          label="Non-current Version Transition Storage Class"
                          value={NCTransitionSC}
                        />
                        <Select
                          label="Storage Class"
                          id="storage_class"
                          name="storage_class"
                          value={storageClass}
                          onChange={(value) => {
                            setStorageClass(value);
                          }}
                          options={tiersList}
                        />
                      </Fragment>
                    )}
                  </fieldset>
                  <fieldset className={"inputItem"}>
                    <legend>File Configuration</legend>
                    <InputBox
                      id="prefix"
                      name="prefix"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setPrefix(e.target.value);
                      }}
                      label="Prefix"
                      value={prefix}
                    />
                    <QueryMultiSelector
                      name="tags"
                      label="Tags"
                      elements={tags}
                      onChange={(vl: string) => {
                        setTags(vl);
                      }}
                      keyPlaceholder="Tag Key"
                      valuePlaceholder="Tag Value"
                      withBorder
                    />
                    <Switch
                      value="expired_delete_marker"
                      id="expired_delete_marker"
                      name="expired_delete_marker"
                      checked={expiredObjectDM}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>,
                      ) => {
                        setExpiredObjectDM(event.target.checked);
                      }}
                      label={"Expired Object Delete Marker"}
                    />
                  </fieldset>
                </FormLayout>
              </Fragment>
            ),
            buttons: [
              {
                type: "custom",
                label: "Create Rules",
                enabled: !loadingTiers && !addLoading && isFormValid,
                action: createLifecycleRules,
              },
            ],
          },
          {
            label: "Results",
            componentRender: (
              <Fragment>
                <h3>Multi Bucket lifecycle Assignments Results</h3>
                <Grid container>
                  <Grid item xs={12} className={classes.formScrollable}>
                    <h4>Buckets Results</h4>
                    {results?.results?.map((resultItem) => {
                      return (
                        <div className={classes.resultGrid}>
                          {LogoToShow({ errString: resultItem.error || "" })}
                          <span>{resultItem.bucketName}</span>
                        </div>
                      );
                    })}
                  </Grid>
                </Grid>
              </Fragment>
            ),
            buttons: [
              {
                type: "custom",
                label: "Done",
                enabled: !addLoading,
                action: () => closeModalAndRefresh(true),
              },
            ],
          },
        ]}
        forModal
      />
    </ModalWrapper>
  );
};

export default withStyles(styles)(AddBulkReplicationModal);
