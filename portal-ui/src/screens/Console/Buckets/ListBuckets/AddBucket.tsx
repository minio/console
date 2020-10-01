// This file is part of MinIO Console Server
// Copyright (c) 2020 MinIO, Inc.
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
import Typography from "@material-ui/core/Typography";
import { Button, LinearProgress } from "@material-ui/core";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { modalBasic } from "../../Common/FormComponents/common/styleLibrary";
import api from "../../../../common/api";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import CheckboxWrapper from "../../Common/FormComponents/CheckboxWrapper/CheckboxWrapper";
import SelectWrapper from "../../Common/FormComponents/SelectWrapper/SelectWrapper";
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
} from "../actions";
import { useDebounce } from "use-debounce";
import { MakeBucketRequest } from "../types";

const styles = (theme: Theme) =>
  createStyles({
    errorBlock: {
      color: "red",
    },
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
      alignSelf: "flex-start" as const,
    },
    ...modalBasic,
  });

interface IAddBucketProps {
  classes: any;
  open: boolean;
  closeModalAndRefresh: () => void;
  addBucketName: typeof addBucketName;
  addBucketVersioned: typeof addBucketVersioned;
  addBucketQuota: typeof addBucketQuota;
  addBucketQuotaType: typeof addBucketQuotaType;
  addBucketQuotaSize: typeof addBucketQuotaSize;
  addBucketQuotaUnit: typeof addBucketQuotaUnit;
  bucketName: string;
  versioned: boolean;
  enableQuota: boolean;
  quotaType: string;
  quotaSize: string;
  quotaUnit: string;
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
  bucketName,
  versioned,
  enableQuota,
  quotaType,
  quotaSize,
  quotaUnit,
}: IAddBucketProps) => {
  const [bName, setBName] = useState<string>(bucketName);
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [addError, setAddError] = useState<string>("");

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

    api
      .invoke("POST", "/api/v1/buckets", request)
      .then((res) => {
        setAddLoading(false);
        setAddError("");
        closeModalAndRefresh();
      })
      .catch((err) => {
        setAddLoading(false);
        setAddError(err);
      });
  };

  const [value] = useDebounce(bName, 1000);

  useEffect(() => {
    console.log("called");
    addBucketName(value);
  }, [value]);

  return (
    <ModalWrapper
      title="Create Bucket"
      modalOpen={open}
      onClose={() => {
        setAddError("");
        closeModalAndRefresh();
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
            {addError !== "" && (
              <Grid item xs={12}>
                <Typography
                  component="p"
                  variant="body1"
                  className={classes.errorBlock}
                >
                  {addError}
                </Typography>
              </Grid>
            )}
            <Grid item xs={12}>
              <InputBoxWrapper
                id="bucket-name"
                name="bucket-name"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setBName(event.target.value);
                }}
                label="Bucket Name"
                value={bName}
              />
            </Grid>
            <Grid item xs={12}>
              <CheckboxWrapper
                value="versioned"
                id="versioned"
                name="versioned"
                checked={versioned}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  addBucketVersioned(event.target.checked);
                }}
                label={"Turn On Versioning"}
              />
            </Grid>
            <Grid item xs={12}>
              <CheckboxWrapper
                value="bucket_quota"
                id="bucket_quota"
                name="bucket_quota"
                checked={enableQuota}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  addBucketQuota(event.target.checked);
                }}
                label={"Enable Bucket Quota"}
              />
            </Grid>
            {enableQuota && (
              <React.Fragment>
                <Grid item xs={12}>
                  <SelectWrapper
                    value={quotaType}
                    label="Quota Type"
                    id="quota_type"
                    name="quota_type"
                    onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                      addBucketQuotaType(e.target.value as string);
                    }}
                    options={[
                      { value: "hard", label: "Hard" },
                      { value: "fifo", label: "FIFO" },
                    ]}
                  />
                </Grid>
                <Grid item xs={12}>
                  <div className={classes.multiContainer}>
                    <div>
                      <InputBoxWrapper
                        type="number"
                        id="quota_size"
                        name="quota_size"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          addBucketQuotaSize(e.target.value);
                        }}
                        label="Size"
                        value={quotaSize}
                        required
                        min="1"
                      />
                    </div>
                    <div className={classes.sizeFactorContainer}>
                      <SelectWrapper
                        label=""
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
          </Grid>
          <Grid item xs={12} className={classes.buttonContainer}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={addLoading}
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
});

const connector = connect(mapState, {
  addBucketName: addBucketName,
  addBucketVersioned: addBucketVersioned,
  addBucketQuota: addBucketQuota,
  addBucketQuotaType: addBucketQuotaType,
  addBucketQuotaSize: addBucketQuotaSize,
  addBucketQuotaUnit: addBucketQuotaUnit,
});

export default connector(withStyles(styles)(AddBucket));
