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

import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import { Button, LinearProgress } from "@material-ui/core";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { modalBasic } from "../../Common/FormComponents/common/styleLibrary";
import api from "../../../../common/api";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import SelectWrapper from "../../Common/FormComponents/SelectWrapper/SelectWrapper";
import RadioGroupSelector from "../../Common/FormComponents/RadioGroupSelector/RadioGroupSelector";
import { factorForDropdown, getBytes } from "../../../../common/utils";
import { AppState } from "../../../../store";
import { connect } from "react-redux";
import {
  addBucketName,
  addBucketQuota,
  addBucketQuotaSize,
  addBucketQuotaType,
  addBucketQuotaUnit,
  addBucketVersioned,
  addBucketRetention,
  addBucketRetentionMode,
  addBucketRetentionUnit,
  addBucketRetentionValidity,
} from "../actions";
import { useDebounce } from "use-debounce";
import { MakeBucketRequest } from "../types";
import FormSwitchWrapper from "../../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import { setModalErrorSnackMessage } from "../../../../actions";

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
    quotaSizeContainer: {
      flexGrow: 1,
    },
    sizeFactorContainer: {
      flexGrow: 0,
      maxWidth: 80,
      marginLeft: 8,
      alignSelf: "flex-start" as const,
    },
    ...modalBasic,
  });

interface IAddBucketProps {
  classes: any;
  open: boolean;
  closeModalAndRefresh: (refresh: boolean) => void;
  addBucketName: typeof addBucketName;
  addBucketVersioned: typeof addBucketVersioned;
  addBucketQuota: typeof addBucketQuota;
  addBucketQuotaType: typeof addBucketQuotaType;
  addBucketQuotaSize: typeof addBucketQuotaSize;
  addBucketQuotaUnit: typeof addBucketQuotaUnit;
  addBucketRetention: typeof addBucketRetention;
  addBucketRetentionMode: typeof addBucketRetentionMode;
  addBucketRetentionUnit: typeof addBucketRetentionUnit;
  addBucketRetentionValidity: typeof addBucketRetentionValidity;
  setModalError: typeof setModalErrorSnackMessage;
  bucketName: string;
  versioned: boolean;
  enableQuota: boolean;
  quotaType: string;
  quotaSize: string;
  quotaUnit: string;
  enableRetention: boolean;
  retentionMode: string;
  retentionUnit: string;
  retentionValidity: number;
}

const AddBucket = ({
  classes,
  open,
  closeModalAndRefresh,
  addBucketName,
  addBucketVersioned,
  addBucketQuota,
  addBucketQuotaType,
  addBucketQuotaSize,
  addBucketQuotaUnit,
  addBucketRetention,
  addBucketRetentionMode,
  addBucketRetentionUnit,
  addBucketRetentionValidity,
  setModalError,
  bucketName,
  versioned,
  enableQuota,
  quotaType,
  quotaSize,
  quotaUnit,
  enableRetention,
  retentionMode,
  retentionUnit,
  retentionValidity,
}: IAddBucketProps) => {
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [sendEnabled, setSendEnabled] = useState<boolean>(false);

  const addRecord = (event: React.FormEvent) => {
    event.preventDefault();
    if (addLoading) {
      return;
    }
    setAddLoading(true);

    let request: MakeBucketRequest = {
      name: bucketName,
      versioning: versioned,
    };

    if (enableQuota) {
      const amount = getBytes(quotaSize, quotaUnit, false);
      request.quota = {
        enabled: true,
        quota_type: quotaType,
        amount: parseInt(amount),
      };
    }

    if (enableRetention) {
      request.retention = {
        mode: retentionMode,
        unit: retentionUnit,
        validity: retentionValidity,
      };
    }

    api
      .invoke("POST", "/api/v1/buckets", request)
      .then((res) => {
        setAddLoading(false);
        closeModalAndRefresh(true);
      })
      .catch((err) => {
        setAddLoading(false);
        setModalError(err);
      });

    resetForm();
  };

  const [value] = useDebounce(bucketName, 1000);

  useEffect(() => {
    addBucketName(value);
  }, [value, addBucketName]);

  const resetForm = () => {
    addBucketName("");
    addBucketVersioned(false);
    addBucketQuota(false);
    addBucketQuotaType("hard");
    addBucketQuotaSize("1");
    addBucketQuotaUnit("TiB");
    addBucketRetention(false);
    addBucketRetentionMode("compliance");
    addBucketRetentionUnit("days");
    addBucketRetentionValidity(1);
  };

  useEffect(() => {
    let valid = false;

    if (bucketName.trim() !== "") {
      valid = true;
    }

    if (enableQuota && valid) {
      if (quotaSize.trim() === "" || parseInt(quotaSize) === 0) {
        valid = false;
      }
    }

    if (!versioned || !enableRetention) {
      addBucketRetention(false);
      addBucketRetentionMode("compliance");
      addBucketRetentionUnit("days");
      addBucketRetentionValidity(1);
    }

    if (
      enableRetention &&
      (Number.isNaN(retentionValidity) || retentionValidity < 1)
    ) {
      valid = false;
    }

    setSendEnabled(valid);
  }, [
    bucketName,
    versioned,
    quotaType,
    quotaSize,
    quotaUnit,
    enableQuota,
    enableRetention,
    addBucketRetention,
    addBucketRetentionMode,
    addBucketRetentionUnit,
    addBucketRetentionValidity,
    retentionValidity,
  ]);

  return (
    <ModalWrapper
      title="Create Bucket"
      modalOpen={open}
      onClose={() => {
        closeModalAndRefresh(false);
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <form
        noValidate
        autoComplete="off"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          addRecord(e);
        }}
      >
        <Grid container>
          <Grid item xs={12} className={classes.formScrollable}>
            <Grid item xs={12}>
              <InputBoxWrapper
                id="bucket-name"
                name="bucket-name"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  addBucketName(event.target.value);
                }}
                label="Bucket Name"
                value={bucketName}
              />
            </Grid>
            <Grid item xs={12}>
              <FormSwitchWrapper
                value="versioned"
                id="versioned"
                name="versioned"
                checked={versioned}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  addBucketVersioned(event.target.checked);
                }}
                label={"Versioning"}
                indicatorLabels={["On", "Off"]}
              />
            </Grid>
            <Grid item xs={12}>
              <FormSwitchWrapper
                value="bucket_quota"
                id="bucket_quota"
                name="bucket_quota"
                checked={enableQuota}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  addBucketQuota(event.target.checked);
                }}
                label={"Enable Bucket Quota"}
                indicatorLabels={["On", "Off"]}
              />
            </Grid>
            {enableQuota && (
              <React.Fragment>
                <Grid item xs={12}>
                  <RadioGroupSelector
                    currentSelection={quotaType}
                    id="quota_type"
                    name="quota_type"
                    label="Quota Type"
                    onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                      addBucketQuotaType(e.target.value as string);
                    }}
                    selectorOptions={[
                      { value: "hard", label: "Hard" },
                      { value: "fifo", label: "FIFO" },
                    ]}
                  />
                </Grid>
                <Grid item xs={12}>
                  <div className={classes.multiContainer}>
                    <div className={classes.quotaSizeContainer}>
                      <InputBoxWrapper
                        type="number"
                        id="quota_size"
                        name="quota_size"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          addBucketQuotaSize(e.target.value);
                        }}
                        label="Quota"
                        value={quotaSize}
                        required
                        min="1"
                      />
                    </div>
                    <div className={classes.sizeFactorContainer}>
                      <SelectWrapper
                        label="&nbsp;"
                        id="quota_unit"
                        name="quota_unit"
                        value={quotaUnit}
                        onChange={(
                          e: React.ChangeEvent<{ value: unknown }>
                        ) => {
                          addBucketQuotaUnit(e.target.value as string);
                        }}
                        options={factorForDropdown()}
                      />
                    </div>
                  </div>
                </Grid>
              </React.Fragment>
            )}
            {versioned && (
              <Grid item xs={12}>
                <FormSwitchWrapper
                  value="bucket_retention"
                  id="bucket_retention"
                  name="bucket_retention"
                  checked={enableRetention}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    addBucketRetention(event.target.checked);
                  }}
                  label={"Enable Bucket Retention"}
                  indicatorLabels={["On", "Off"]}
                />
              </Grid>
            )}
            {enableRetention && (
              <React.Fragment>
                <Grid item xs={12}>
                  <RadioGroupSelector
                    currentSelection={retentionMode}
                    id="retention_mode"
                    name="retention_mode"
                    label="Retention Mode"
                    onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                      addBucketRetentionMode(e.target.value as string);
                    }}
                    selectorOptions={[
                      { value: "compliance", label: "Compliance" },
                      { value: "governance", label: "Governance" },
                    ]}
                  />
                </Grid>
                <Grid item xs={12}>
                  <RadioGroupSelector
                    currentSelection={retentionUnit}
                    id="retention_unit"
                    name="retention_unit"
                    label="Retention Unit"
                    onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                      addBucketRetentionUnit(e.target.value as string);
                    }}
                    selectorOptions={[
                      { value: "days", label: "Days" },
                      { value: "years", label: "Years" },
                    ]}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputBoxWrapper
                    type="number"
                    id="retention_validity"
                    name="retention_validity"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      addBucketRetentionValidity(e.target.valueAsNumber);
                    }}
                    label="Retention Validity"
                    value={String(retentionValidity)}
                    required
                    min="1"
                  />
                </Grid>
              </React.Fragment>
            )}
          </Grid>
          <Grid item xs={12} className={classes.buttonContainer}>
            <button
              type="button"
              color="primary"
              className={classes.clearButton}
              onClick={resetForm}
            >
              Clear
            </button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={addLoading || !sendEnabled}
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

const mapState = (state: AppState) => ({
  addBucketModalOpen: state.buckets.open,
  bucketName: state.buckets.addBucketName,
  versioned: state.buckets.addBucketVersioning,
  enableQuota: state.buckets.addBucketQuotaEnabled,
  quotaType: state.buckets.addBucketQuotaType,
  quotaSize: state.buckets.addBucketQuotaSize,
  quotaUnit: state.buckets.addBucketQuotaUnit,
  enableRetention: state.buckets.addBucketRetentionEnabled,
  retentionMode: state.buckets.addBucketRetentionMode,
  retentionUnit: state.buckets.addBucketRetentionUnit,
  retentionValidity: state.buckets.addBucketRetentionValidity,
});

const connector = connect(mapState, {
  addBucketName: addBucketName,
  addBucketVersioned: addBucketVersioned,
  addBucketQuota: addBucketQuota,
  addBucketQuotaType: addBucketQuotaType,
  addBucketQuotaSize: addBucketQuotaSize,
  addBucketQuotaUnit: addBucketQuotaUnit,
  addBucketRetention: addBucketRetention,
  addBucketRetentionMode: addBucketRetentionMode,
  addBucketRetentionUnit: addBucketRetentionUnit,
  addBucketRetentionValidity: addBucketRetentionValidity,
  setModalError: setModalErrorSnackMessage,
});

export default connector(withStyles(styles)(AddBucket));
