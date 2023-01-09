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

import React, { Fragment, useEffect, useState } from "react";
import get from "lodash/get";
import { Button } from "mds";
import { useSelector } from "react-redux";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  LinearProgress,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";

import {
  ITierElement,
  ITierResponse,
} from "../../Configurations/TiersConfiguration/types";
import { ErrorResponseHandler } from "../../../../common/types";
import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import api from "../../../../common/api";
import SelectWrapper from "../../Common/FormComponents/SelectWrapper/SelectWrapper";
import QueryMultiSelector from "../../Common/FormComponents/QueryMultiSelector/QueryMultiSelector";
import RadioGroupSelector from "../../Common/FormComponents/RadioGroupSelector/RadioGroupSelector";
import {
  createTenantCommon,
  formFieldStyles,
  modalStyleUtils,
  spacingUtils,
} from "../../Common/FormComponents/common/styleLibrary";
import { LifecycleConfigIcon } from "mds";
import InputUnitMenu from "../../Common/FormComponents/InputUnitMenu/InputUnitMenu";
import { BucketVersioning } from "../types";
import FormSwitchWrapper from "../../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import { selDistSet, setModalErrorSnackMessage } from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";

interface IReplicationModal {
  open: boolean;
  closeModalAndRefresh: (refresh: boolean) => any;
  classes: any;
  bucketName: string;
}

export interface ITiersDropDown {
  label: string;
  value: string;
}

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
    formFieldRowFilter: {
      "& .MuiPaper-root": { padding: 0 },
    },
    ...spacingUtils,
    ...modalStyleUtils,
    ...formFieldStyles,
    ...createTenantCommon,
  });

const AddLifecycleModal = ({
  open,
  closeModalAndRefresh,
  classes,
  bucketName,
}: IReplicationModal) => {
  const dispatch = useAppDispatch();
  const distributedSetup = useSelector(selDistSet);
  const [loadingTiers, setLoadingTiers] = useState<boolean>(true);
  const [tiersList, setTiersList] = useState<ITiersDropDown[]>([]);
  const [addLoading, setAddLoading] = useState(false);
  const [isVersioned, setIsVersioned] = useState<boolean>(false);
  const [prefix, setPrefix] = useState("");
  const [tags, setTags] = useState<string>("");
  const [storageClass, setStorageClass] = useState("");

  const [ilmType, setIlmType] = useState<string>("expiry");
  const [targetVersion, setTargetVersion] = useState<"current" | "noncurrent">(
    "current"
  );

  const [lifecycleDays, setLifecycleDays] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [expiredObjectDM, setExpiredObjectDM] = useState<boolean>(false);
  const [loadingVersioning, setLoadingVersioning] = useState<boolean>(true);

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
  }, [ilmType, lifecycleDays, storageClass]);

  useEffect(() => {
    if (loadingVersioning && distributedSetup) {
      api
        .invoke("GET", `/api/v1/buckets/${bucketName}/versioning`)
        .then((res: BucketVersioning) => {
          setIsVersioned(res.is_versioned);
          setLoadingVersioning(false);
        })
        .catch((err: ErrorResponseHandler) => {
          dispatch(setModalErrorSnackMessage(err));
          setLoadingVersioning(false);
        });
    }
  }, [loadingVersioning, dispatch, bucketName, distributedSetup]);

  const addRecord = () => {
    let rules = {};

    if (ilmType === "expiry") {
      let expiry: { [key: string]: number } = {};

      if (targetVersion === "current") {
        expiry["expiry_days"] = parseInt(lifecycleDays);
      } else {
        expiry["noncurrentversion_expiration_days"] = parseInt(lifecycleDays);
      }

      rules = {
        ...expiry,
      };
    } else {
      let transition: { [key: string]: number | string } = {};
      if (targetVersion === "current") {
        transition["transition_days"] = parseInt(lifecycleDays);
        transition["storage_class"] = storageClass;
      } else {
        transition["noncurrentversion_transition_days"] =
          parseInt(lifecycleDays);
        transition["noncurrentversion_transition_storage_class"] = storageClass;
      }

      rules = {
        ...transition,
      };
    }

    const lifecycleInsert = {
      type: ilmType,
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
      .catch((err: ErrorResponseHandler) => {
        setAddLoading(false);
        dispatch(setModalErrorSnackMessage(err));
      });
  };

  return (
    <ModalWrapper
      modalOpen={open}
      onClose={() => {
        closeModalAndRefresh(false);
      }}
      title="Add Lifecycle Rule"
      titleIcon={<LifecycleConfigIcon />}
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
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <RadioGroupSelector
                      currentSelection={ilmType}
                      id="ilm_type"
                      name="ilm_type"
                      label="Type of lifecycle"
                      onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                        setIlmType(e.target.value as string);
                      }}
                      selectorOptions={[
                        { value: "expiry", label: "Expiry" },
                        { value: "transition", label: "Transition" },
                      ]}
                    />
                  </Grid>
                  {isVersioned && (
                    <Grid item xs={12}>
                      <SelectWrapper
                        value={targetVersion}
                        id="object_version"
                        name="object_version"
                        label="Object Version"
                        onChange={(e) => {
                          setTargetVersion(
                            e.target.value as "current" | "noncurrent"
                          );
                        }}
                        options={[
                          { value: "current", label: "Current Version" },
                          { value: "noncurrent", label: "Non-Current Version" },
                        ]}
                      />
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <InputBoxWrapper
                      id="expiry_days"
                      name="expiry_days"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        if (e.target.validity.valid) {
                          setLifecycleDays(e.target.value);
                        }
                      }}
                      pattern={"[0-9]*"}
                      label="After"
                      value={lifecycleDays}
                      overlayObject={
                        <InputUnitMenu
                          id={"expire-current-unit"}
                          unitSelected={"days"}
                          unitsList={[{ label: "Days", value: "days" }]}
                          disabled={true}
                        />
                      }
                    />
                  </Grid>

                  {ilmType === "expiry" ? (
                    <Fragment></Fragment>
                  ) : (
                    <Fragment>
                      <Grid item xs={12}>
                        <SelectWrapper
                          label="To Tier"
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
                  <Grid item xs={12} className={classes.formFieldRowFilter}>
                    <Accordion>
                      <AccordionSummary>
                        <Typography>Filters</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid item xs={12}>
                          <InputBoxWrapper
                            id="prefix"
                            name="prefix"
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
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
                      </AccordionDetails>
                    </Accordion>
                  </Grid>
                  {ilmType === "expiry" && targetVersion === "noncurrent" && (
                    <Grid item xs={12} className={classes.formFieldRowFilter}>
                      <Accordion>
                        <AccordionSummary>
                          <Typography>Advanced</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid item xs={12}>
                            <FormSwitchWrapper
                              value="expired_delete_marker"
                              id="expired_delete_marker"
                              name="expired_delete_marker"
                              checked={expiredObjectDM}
                              onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                              ) => {
                                setExpiredObjectDM(event.target.checked);
                              }}
                              label={"Expire Delete Marker"}
                              description={
                                "Remove the reference to the object if no versions are left"
                              }
                            />
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} className={classes.modalButtonBar}>
              <Button
                id={"reset"}
                type="button"
                variant="regular"
                disabled={addLoading}
                onClick={() => {
                  closeModalAndRefresh(false);
                }}
                label={"Cancel"}
              />
              <Button
                id={"save-lifecycle"}
                type="submit"
                variant="callAction"
                color="primary"
                disabled={addLoading || !isFormValid}
                label={"Save"}
              />
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

export default withStyles(styles)(AddLifecycleModal);
