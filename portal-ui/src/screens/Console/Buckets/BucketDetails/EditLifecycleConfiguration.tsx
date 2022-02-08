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

import React, { useEffect, useState, Fragment } from "react";
import { connect } from "react-redux";
import { Button, LinearProgress, SelectChangeEvent } from "@mui/material";
import { Theme } from "@mui/material/styles";
import get from "lodash/get";
import Grid from "@mui/material/Grid";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import {
  createTenantCommon,
  formFieldStyles,
  modalStyleUtils,
  spacingUtils,
} from "../../Common/FormComponents/common/styleLibrary";
import { setModalErrorSnackMessage } from "../../../../actions";
import { LifeCycleItem } from "../types";
import { ErrorResponseHandler } from "../../../../common/types";
import { LifecycleConfigIcon } from "../../../../icons";
import { ITiersDropDown } from "./AddLifecycleModal";
import {
  ITierElement,
  ITierResponse,
} from "../../Configurations/TiersConfiguration/types";
import api from "../../../../common/api";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import FormSwitchWrapper from "../../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import QueryMultiSelector from "../../Common/FormComponents/QueryMultiSelector/QueryMultiSelector";
import SelectWrapper from "../../Common/FormComponents/SelectWrapper/SelectWrapper";
import RadioGroupSelector from "../../Common/FormComponents/RadioGroupSelector/RadioGroupSelector";

const styles = (theme: Theme) =>
  createStyles({
    dateSelector: {
      "& div": {
        borderBottom: 0,
        marginBottom: 0,

        "& div:nth-child(2)": {
          border: "1px solid #EAEAEA",
          paddingLeft: 5,

          "& div": {
            border: 0,
          },
        },
      },
    },
    ...spacingUtils,
    ...modalStyleUtils,
    ...formFieldStyles,
    ...createTenantCommon,
  });

interface IAddUserContentProps {
  classes: any;
  closeModalAndRefresh: (reload: boolean) => void;
  selectedBucket: string;
  lifecycle: LifeCycleItem;
  open: boolean;
  setModalErrorSnackMessage: typeof setModalErrorSnackMessage;
}

const EditLifecycleConfiguration = ({
  classes,
  closeModalAndRefresh,
  selectedBucket,
  lifecycle,
  open,
  setModalErrorSnackMessage,
}: IAddUserContentProps) => {
  const [loadingTiers, setLoadingTiers] = useState<boolean>(true);
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [tags, setTags] = useState<string>("");
  const [enabled, setEnabled] = useState<boolean>(false);
  const [tiersList, setTiersList] = useState<ITiersDropDown[]>([]);
  const [prefix, setPrefix] = useState("");
  const [storageClass, setStorageClass] = useState("");
  const [NCTransitionSC, setNCTransitionSC] = useState("");
  const [expiredObjectDM, setExpiredObjectDM] = useState<boolean>(false);
  const [NCExpirationDays, setNCExpirationDays] = useState<string>("0");
  const [NCTransitionDays, setNCTransitionDays] = useState<string>("0");
  const [ilmType, setIlmType] = useState<string>("expiry");
  const [expiryDays, setExpiryDays] = useState<string>("0");
  const [transitionDays, setTransitionDays] = useState<string>("0");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  useEffect(() => {
    if (loadingTiers) {
      api
        .invoke("GET", `/api/v1/admin/tiers`)
        .then((res: ITierResponse) => {
          const tiersList: ITierElement[] | null = get(res, "items", []);

          if (tiersList !== null && tiersList.length >= 1) {
            const objList = tiersList.map((tier: ITierElement) => {
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
        .catch((err: ErrorResponseHandler) => {
          setLoadingTiers(false);
        });
    }
  }, [loadingTiers]);

  useEffect(() => {
    let valid = true;

    if (ilmType !== "expiry") {
      if (storageClass === "") {
        valid = false;
      }
    }
    setIsFormValid(valid);
  }, [ilmType, expiryDays, transitionDays, storageClass]);

  useEffect(() => {
    console.log("lifecycle::", lifecycle);
    if (lifecycle.status === "Enabled") {
      setEnabled(true);
    }

    let transitionMode = false;

    if (lifecycle.transition) {
      if (lifecycle.transition.days && lifecycle.transition.days !== 0) {
        setTransitionDays(lifecycle.transition.days.toString());
        setIlmType("transition");
        transitionMode = true;
      }

      // Fallback to old rules by date
      if (
        lifecycle.transition.date &&
        lifecycle.transition.date !== "0001-01-01T00:00:00Z"
      ) {
        setIlmType("transition");
        transitionMode = true;
      }
    }

    if (lifecycle.expiration) {
      if (lifecycle.expiration.days && lifecycle.expiration.days !== 0) {
        setExpiryDays(lifecycle.expiration.days.toString());
        setIlmType("expiry");
        transitionMode = false;
      }

      // Fallback to old rules by date
      if (
        lifecycle.expiration.date &&
        lifecycle.expiration.date !== "0001-01-01T00:00:00Z"
      ) {
        setIlmType("expiry");
        transitionMode = false;
      }
    }

    // Transition fields
    if (transitionMode) {
      setStorageClass(lifecycle.transition?.storage_class || "");
      setNCTransitionDays(
        lifecycle.transition?.noncurrent_transition_days?.toString() || "0"
      );
      setNCTransitionSC(lifecycle.transition?.noncurrent_storage_class || "");
    } else {
      // Expiry fields
      setNCExpirationDays(
        lifecycle.expiration?.noncurrent_expiration_days?.toString() || "0"
      );
    }

    setExpiredObjectDM(!!lifecycle.expiration?.delete_marker);
    setPrefix(lifecycle.prefix || "");

    if (lifecycle.tags) {
      const tgs = lifecycle.tags.reduce(
        (stringLab: string, currItem: any, index: number) => {
          return `${stringLab}${index !== 0 ? "&" : ""}${currItem.key}=${
            currItem.value
          }`;
        },
        ""
      );

      setTags(tgs);
    }
  }, [lifecycle]);

  const saveRecord = (event: React.FormEvent) => {
    event.preventDefault();

    if (addLoading) {
      return;
    }
    setAddLoading(true);
    if (selectedBucket !== null && lifecycle !== null) {
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

      const lifecycleUpdate = {
        type: ilmType,
        disable: !enabled,
        prefix,
        tags,
        expired_object_delete_marker: expiredObjectDM,
        ...rules,
      };

      api
        .invoke(
          "PUT",
          `/api/v1/buckets/${selectedBucket}/lifecycle/${lifecycle.id}`,
          lifecycleUpdate
        )
        .then((res) => {
          setAddLoading(false);
          closeModalAndRefresh(true);
        })
        .catch((err: ErrorResponseHandler) => {
          setAddLoading(false);
          setModalErrorSnackMessage(err);
        });
    }
  };

  return (
    <ModalWrapper
      onClose={() => {
        closeModalAndRefresh(false);
      }}
      modalOpen={open}
      title={"Edit Lifecycle Configuration"}
      titleIcon={<LifecycleConfigIcon />}
    >
      <form
        noValidate
        autoComplete="off"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          saveRecord(e);
        }}
      >
        <Grid container>
          <Grid item xs={12} className={classes.formScrollable}>
            <Grid item xs={12} className={classes.formFieldRow}>
              <InputBoxWrapper
                id="id"
                name="id"
                label="Id"
                value={lifecycle.id}
                onChange={() => {}}
                disabled
              />
            </Grid>
            <Grid item xs={12} className={classes.formFieldRow}>
              <FormSwitchWrapper
                label="Rule State"
                indicatorLabels={["Enabled", "Disabled"]}
                checked={enabled}
                value={"user_enabled"}
                id="user-status"
                name="user-status"
                onChange={(e) => {
                  setEnabled(e.target.checked);
                }}
              />
            </Grid>
            <Grid item xs={12} className={classes.formFieldRow}>
              <fieldset className={classes.fieldGroup}>
                <legend className={classes.descriptionText}>
                  Lifecycle Configuration
                </legend>

                <Grid item xs={12}>
                  <RadioGroupSelector
                    currentSelection={ilmType}
                    id="quota_type"
                    name="quota_type"
                    label="ILM Rule"
                    selectorOptions={[
                      { value: "expiry", label: "Expiry" },
                      { value: "transition", label: "Transition" },
                    ]}
                    onChange={() => {}}
                    disableOptions
                  />
                </Grid>
                {ilmType === "expiry" ? (
                  <Fragment>
                    <Grid item xs={12} className={classes.formFieldRow}>
                      <InputBoxWrapper
                        type="number"
                        id="expiry_days"
                        name="expiry_days"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setExpiryDays(e.target.value);
                        }}
                        label="Expiry Days"
                        value={expiryDays}
                        min="0"
                      />
                    </Grid>

                    <Grid item xs={12} className={classes.formFieldRow}>
                      <InputBoxWrapper
                        type="number"
                        id="noncurrentversion_expiration_days"
                        name="noncurrentversion_expiration_days"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setNCExpirationDays(e.target.value);
                        }}
                        label="Non-current Expiration Days"
                        value={NCExpirationDays}
                        min="0"
                      />
                    </Grid>
                  </Fragment>
                ) : (
                  <Fragment>
                    <Grid item xs={12} className={classes.formFieldRow}>
                      <InputBoxWrapper
                        type="number"
                        id="transition_days"
                        name="transition_days"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setTransitionDays(e.target.value);
                        }}
                        label="Transition Days"
                        value={transitionDays}
                        min="0"
                      />
                    </Grid>
                    <Grid item xs={12} className={classes.formFieldRow}>
                      <InputBoxWrapper
                        type="number"
                        id="noncurrentversion_transition_days"
                        name="noncurrentversion_transition_days"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setNCTransitionDays(e.target.value);
                        }}
                        label="Non-current Transition Days"
                        value={NCTransitionDays}
                        min="0"
                      />
                    </Grid>
                    <Grid item xs={12} className={classes.formFieldRow}>
                      <InputBoxWrapper
                        id="noncurrentversion_t_SC"
                        name="noncurrentversion_t_SC"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setNCTransitionSC(e.target.value);
                        }}
                        placeholder="Set Non-current Version Transition Storage Class"
                        label="Non-current Version Transition Storage Class"
                        value={NCTransitionSC}
                      />
                    </Grid>
                    <Grid item xs={12} className={classes.formFieldRow}>
                      <SelectWrapper
                        label="Storage Class"
                        id="storage_class"
                        name="storage_class"
                        value={storageClass}
                        onChange={(e: SelectChangeEvent<string>) => {
                          setStorageClass(e.target.value as string);
                        }}
                        options={tiersList}
                      />
                    </Grid>
                  </Fragment>
                )}
              </fieldset>
            </Grid>
            <Grid item xs={12} className={classes.formFieldRow}>
              <fieldset className={classes.fieldGroup}>
                <legend className={classes.descriptionText}>
                  File Configuration
                </legend>

                <Grid item xs={12}>
                  <InputBoxWrapper
                    id="prefix"
                    name="prefix"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setPrefix(e.target.value);
                    }}
                    label="Prefix"
                    value={prefix}
                  />
                </Grid>
                <Grid item xs={12}>
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
                </Grid>
                <Grid item xs={12}>
                  <FormSwitchWrapper
                    value="expired_delete_marker"
                    id="expired_delete_marker"
                    name="expired_delete_marker"
                    checked={expiredObjectDM}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setExpiredObjectDM(event.target.checked);
                    }}
                    label={"Expired Object Delete Marker"}
                  />
                </Grid>
              </fieldset>
            </Grid>
          </Grid>
          <Grid item xs={12} className={classes.modalButtonBar}>
            <Button
              type="button"
              variant="outlined"
              color="primary"
              disabled={addLoading}
              onClick={() => {
                closeModalAndRefresh(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={addLoading || !isFormValid}
            >
              Save
            </Button>
          </Grid>
          {addLoading && (
            <Grid item xs={12}>
              <LinearProgress />
            </Grid>
          )}
        </Grid>
      </form>
    </ModalWrapper>
  );
};

const mapDispatchToProps = {
  setModalErrorSnackMessage,
};

const connector = connect(null, mapDispatchToProps);

export default withStyles(styles)(connector(EditLifecycleConfiguration));
