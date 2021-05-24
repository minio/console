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

import React, { useState, useEffect, Fragment } from "react";
import get from "lodash/get";
import { connect } from "react-redux";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { Button, LinearProgress } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { modalBasic } from "../../Common/FormComponents/common/styleLibrary";
import { setModalErrorSnackMessage } from "../../../../actions";
import {
  ITierResponse,
  ITierElement,
} from "../../Configurations/TiersConfiguration/types";
import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import FormSwitchWrapper from "../../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import api from "../../../../common/api";
import DateSelector from "../../Common/FormComponents/DateSelector/DateSelector";
import SelectWrapper from "../../Common/FormComponents/SelectWrapper/SelectWrapper";
import QueryMultiSelector from "../../Common/FormComponents/QueryMultiSelector/QueryMultiSelector";
import RadioGroupSelector from "../../Common/FormComponents/RadioGroupSelector/RadioGroupSelector";

interface IReplicationModal {
  open: boolean;
  closeModalAndRefresh: (refresh: boolean) => any;
  classes: any;
  bucketName: string;
  setModalErrorSnackMessage: typeof setModalErrorSnackMessage;
}

interface ITiersDropDown {
  label: string;
  value: string;
}

const styles = (theme: Theme) =>
  createStyles({
    minTableHeader: {
      color: "#393939",
      "& tr": {
        "& th": {
          fontWeight: "bold",
        },
      },
    },
    buttonContainer: {
      textAlign: "right",
    },
    ...modalBasic,
  });

const AddLifecycleModal = ({
  open,
  closeModalAndRefresh,
  classes,
  bucketName,
  setModalErrorSnackMessage,
}: IReplicationModal) => {
  const [loadingTiers, setLoadingTiers] = useState<boolean>(true);
  const [tiersList, setTiersList] = useState<ITiersDropDown[]>([]);
  const [addLoading, setAddLoading] = useState(false);
  const [prefix, setPrefix] = useState("");
  const [tags, setTags] = useState<string>("");
  const [storageClass, setStorageClass] = useState("");
  const [NCTransitionSC, setNCTransitionSC] = useState("");
  const [expiredObjectDM, setExpiredObjectDM] = useState<boolean>(false);
  const [NCExpirationDays, setNCExpirationDays] = useState<string>("0");
  const [NCTransitionDays, setNCTransitionDays] = useState<string>("0");
  const [ilmType, setIlmType] = useState<string>("expiry");
  const [expiryType, setExpiryType] = useState<string>("date");
  const [expiryDays, setExpiryDays] = useState<string>("0");
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [transitionDays, setTransitionDays] = useState<string>("0");
  const [transitionDate, setTransitionDate] = useState<string>("");
  const [transitionType, setTransitionType] = useState<string>("date");
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
        .catch((err) => {
          setLoadingTiers(false);
        });
    }
  }, [loadingTiers]);

  useEffect(() => {
    let valid = true;

    if (ilmType === "expiry") {
      if (expiryType === "date" && expiryDate === "") {
        valid = false;
      }
      if (expiryType === "days" && parseInt(expiryDays) < 1) {
        valid = false;
      }
    } else {
      if (transitionType === "date" && transitionDate === "") {
        valid = false;
      }
      if (transitionType === "days" && parseInt(transitionDays) < 1) {
        valid = false;
      }

      if (storageClass === "") {
        valid = false;
      }
    }
    setIsFormValid(valid);
  }, [
    ilmType,
    expiryType,
    expiryDate,
    expiryDays,
    transitionType,
    transitionDate,
    transitionDays,
    storageClass,
  ]);

  const addRecord = () => {
    let rules = {};

    if (ilmType === "expiry") {
      let expiry = {};

      if (expiryType === "date") {
        expiry = {
          expiry_date: `${expiryDate}T23:59:59Z`,
        };
      } else {
        expiry = {
          expiry_days: parseInt(expiryDays),
        };
      }

      rules = {
        ...expiry,
        noncurrentversion_expiration_days: parseInt(NCExpirationDays),
      };
    } else {
      let transition = {};

      if (transitionType === "date") {
        transition = {
          transition_date: `${transitionDate}T23:59:59Z`,
        };
      } else {
        transition = {
          transition_days: parseInt(transitionDays),
        };
      }

      rules = {
        ...transition,
        noncurrentversion_transition_days: parseInt(NCTransitionDays),
        noncurrentversion_transition_storage_class: NCTransitionSC,
        storage_class: storageClass,
      };
    }

    const lifecycleInsert = {
      prefix,
      tags,
      expired_object_delete_marker: expiredObjectDM,
      ...rules,
    };

    api
      .invoke(
        "POST",
        `/api/v1/buckets/${bucketName}/lifecycle`,
        lifecycleInsert
      )
      .then(() => {
        setAddLoading(false);
        closeModalAndRefresh(true);
      })
      .catch((err) => {
        setAddLoading(false);
        setModalErrorSnackMessage(err);
      });
  };

  return (
    <ModalWrapper
      modalOpen={open}
      onClose={() => {
        closeModalAndRefresh(false);
      }}
      title="Add Lifecycle Rule"
    >
      {loadingTiers && (
        <Grid container className={classes.loadingBox}>
          <Grid item xs={12}>
            <LinearProgress />
          </Grid>
        </Grid>
      )}

      {!loadingTiers && (
        <form
          noValidate
          autoComplete="off"
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setAddLoading(true);
            addRecord();
          }}
        >
          <Grid container>
            <Grid item xs={12} className={classes.formScrollable}>
              <h3>Lifecycle Configuration</h3>
              <Grid item xs={12}>
                <RadioGroupSelector
                  currentSelection={ilmType}
                  id="quota_type"
                  name="quota_type"
                  label="ILM Rule"
                  onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                    setIlmType(e.target.value as string);
                  }}
                  selectorOptions={[
                    { value: "expiry", label: "Expiry" },
                    { value: "transition", label: "Transition" },
                  ]}
                />
              </Grid>
              {ilmType === "expiry" ? (
                <Fragment>
                  <Grid item xs={12}>
                    <RadioGroupSelector
                      currentSelection={expiryType}
                      id="expiryType"
                      name="expiryType"
                      label="Expiry Type"
                      onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                        setExpiryType(e.target.value as string);
                      }}
                      selectorOptions={[
                        { value: "date", label: "Date" },
                        { value: "days", label: "Days" },
                      ]}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    {expiryType === "date" ? (
                      <DateSelector
                        id="expiry_date"
                        label="Expiry Date"
                        value={expiryDate}
                        borderBottom={true}
                        onDateChange={(date: string, isValid: boolean) => {
                          if (isValid) {
                            setExpiryDate(date);
                          }
                        }}
                      />
                    ) : (
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
                    )}
                  </Grid>
                  <Grid item xs={12}>
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
                  <Grid item xs={12}>
                    <RadioGroupSelector
                      currentSelection={transitionType}
                      id="transitionType"
                      name="transitionType"
                      label="Transition Type"
                      onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                        setTransitionType(e.target.value as string);
                      }}
                      selectorOptions={[
                        { value: "date", label: "Date" },
                        { value: "days", label: "Days" },
                      ]}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    {transitionType === "date" ? (
                      <DateSelector
                        id="transition_date"
                        label="Transition Date"
                        value={transitionDate}
                        borderBottom={true}
                        onDateChange={(date: string, isValid: boolean) => {
                          if (isValid) {
                            setTransitionDate(date);
                          }
                        }}
                      />
                    ) : (
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
                    )}
                  </Grid>
                  <Grid item xs={12}>
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
                  <Grid item xs={12}>
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
                  <Grid item xs={12}>
                    <SelectWrapper
                      label="Storage Class"
                      id="storage_class"
                      name="storage_class"
                      value={storageClass}
                      onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                        setStorageClass(e.target.value as string);
                      }}
                      options={tiersList}
                    />
                  </Grid>
                </Fragment>
              )}
              <h3>File Configuration</h3>
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
                  elements={""}
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
                  indicatorLabels={["On", "Off"]}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} className={classes.buttonContainer}>
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
      )}
    </ModalWrapper>
  );
};

const connector = connect(null, {
  setModalErrorSnackMessage,
});

export default withStyles(styles)(connector(AddLifecycleModal));
