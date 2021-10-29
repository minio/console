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
import { connect } from "react-redux";
import { Button, LinearProgress, SelectChangeEvent } from "@mui/material";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import Grid from "@mui/material/Grid";
import { factorForDropdown, getBytes, units } from "../../../../common/utils";
import { BucketQuota } from "../types";
import { setModalErrorSnackMessage } from "../../../../actions";
import { ErrorResponseHandler } from "../../../../common/types";
import { modalBasic } from "../../Common/FormComponents/common/styleLibrary";
import FormSwitchWrapper from "../../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import RadioGroupSelector from "../../Common/FormComponents/RadioGroupSelector/RadioGroupSelector";
import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import SelectWrapper from "../../Common/FormComponents/SelectWrapper/SelectWrapper";
import api from "../../../../common/api";

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
    multiContainer: {
      display: "flex",
      alignItems: "center" as const,
      justifyContent: "flex-start" as const,
    },
    ...modalBasic,
  });

interface IEnableQuotaProps {
  classes: any;
  open: boolean;
  enabled: boolean;
  cfg: BucketQuota | null;
  selectedBucket: string;
  closeModalAndRefresh: () => void;
  setModalErrorSnackMessage: typeof setModalErrorSnackMessage;
}

const EnableQuota = ({
  classes,
  open,
  enabled,
  cfg,
  selectedBucket,
  closeModalAndRefresh,
  setModalErrorSnackMessage,
}: IEnableQuotaProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [quotaEnabled, setQuotaEnabled] = useState<boolean>(false);
  const [quotaType, setQuotaType] = useState<string>("hard");
  const [quotaSize, setQuotaSize] = useState<string>("1");
  const [quotaUnit, setQuotaUnit] = useState<string>("TiB");

  useEffect(() => {
    if (enabled) {
      setQuotaEnabled(true);
      if (cfg) {
        setQuotaType(cfg.type);
        setQuotaSize(`${cfg.quota}`);
        setQuotaUnit(`B`);

        let maxUnit = "B";
        let maxQuota = cfg.quota;

        for (let i = 0; i < units.length; i++) {
          if (cfg.quota % Math.pow(1024, i) === 0) {
            maxQuota = cfg.quota / Math.pow(1024, i);
            maxUnit = units[i];
          } else {
            break;
          }
        }
        setQuotaSize(`${maxQuota}`);
        setQuotaUnit(maxUnit);
      }
    }
  }, [enabled, cfg]);

  const enableBucketEncryption = (event: React.FormEvent) => {
    event.preventDefault();
    if (loading) {
      return;
    }
    let req = {
      enabled: quotaEnabled,
      amount: parseInt(getBytes(quotaSize, quotaUnit, false)),
      quota_type: quotaType,
    };

    api
      .invoke("PUT", `/api/v1/buckets/${selectedBucket}/quota`, req)
      .then(() => {
        setLoading(false);
        closeModalAndRefresh();
      })
      .catch((err: ErrorResponseHandler) => {
        setLoading(false);
        setModalErrorSnackMessage(err);
      });
  };

  return (
    <ModalWrapper
      modalOpen={open}
      onClose={() => {
        closeModalAndRefresh();
      }}
      title="Enable Bucket Quota"
    >
      <form
        noValidate
        autoComplete="off"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          enableBucketEncryption(e);
        }}
      >
        <Grid container>
          <Grid item xs={12} className={classes.formScrollable}>
            <Grid item xs={12}>
              <FormSwitchWrapper
                value="bucket_quota"
                id="bucket_quota"
                name="bucket_quota"
                checked={quotaEnabled}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setQuotaEnabled(event.target.checked);
                }}
                label={"Quota"}
              />
            </Grid>
            {quotaEnabled && (
              <React.Fragment>
                <Grid item xs={12}>
                  <RadioGroupSelector
                    currentSelection={quotaType}
                    id="quota_type"
                    name="quota_type"
                    label="Quota Type"
                    onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                      setQuotaType(e.target.value as string);
                    }}
                    selectorOptions={[
                      { value: "hard", label: "Hard" },
                      { value: "fifo", label: "FIFO" },
                    ]}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={10}>
                      <InputBoxWrapper
                        type="number"
                        id="quota_size"
                        name="quota_size"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setQuotaSize(e.target.value);
                        }}
                        label="Quota"
                        value={quotaSize}
                        required
                        min="1"
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <div style={{ width: 100 }}>
                        <SelectWrapper
                          label=""
                          id="quota_unit"
                          name="quota_unit"
                          value={quotaUnit}
                          onChange={(e: SelectChangeEvent<string>) => {
                            setQuotaUnit(e.target.value as string);
                          }}
                          options={factorForDropdown()}
                        />
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              </React.Fragment>
            )}
            <Grid item xs={12}>
              <br />
            </Grid>
          </Grid>
          <Grid item xs={12} className={classes.buttonContainer}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              Save
            </Button>
          </Grid>
          {loading && (
            <Grid item xs={12}>
              <LinearProgress />
            </Grid>
          )}
        </Grid>
      </form>
    </ModalWrapper>
  );
};

const connector = connect(null, {
  setModalErrorSnackMessage,
});

export default withStyles(styles)(connector(EnableQuota));
