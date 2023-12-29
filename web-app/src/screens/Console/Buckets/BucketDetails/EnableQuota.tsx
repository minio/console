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
import {
  BucketQuotaIcon,
  Button,
  FormLayout,
  InputBox,
  Switch,
  Grid,
  ProgressBar,
} from "mds";
import {
  calculateBytes,
  getBytes,
  k8sScalarUnitsExcluding,
} from "../../../../common/utils";

import { modalStyleUtils } from "../../Common/FormComponents/common/styleLibrary";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import InputUnitMenu from "../../Common/FormComponents/InputUnitMenu/InputUnitMenu";

import { setModalErrorSnackMessage } from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";
import { BucketQuota } from "api/consoleApi";
import { api } from "api";
import { errorToHandler } from "api/errors";

interface IEnableQuotaProps {
  open: boolean;
  enabled: boolean;
  cfg: BucketQuota | null;
  selectedBucket: string;
  closeModalAndRefresh: () => void;
}

const EnableQuota = ({
  open,
  enabled,
  cfg,
  selectedBucket,
  closeModalAndRefresh,
}: IEnableQuotaProps) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [quotaEnabled, setQuotaEnabled] = useState<boolean>(false);
  const [quotaSize, setQuotaSize] = useState<string>("1");
  const [quotaUnit, setQuotaUnit] = useState<string>("Ti");
  const [validInput, setValidInput] = useState<boolean>(false);

  useEffect(() => {
    if (enabled) {
      setQuotaEnabled(true);
      if (cfg) {
        const unitCalc = calculateBytes(cfg.quota || 0, true, false, true);

        setQuotaSize(unitCalc.total.toString());
        setQuotaUnit(unitCalc.unit);
        setValidInput(true);
      }
    }
  }, [enabled, cfg]);

  useEffect(() => {
    const valRegExp = /^\d*(?:\.\d{1,2})?$/;

    if (!quotaEnabled) {
      setValidInput(true);
      return;
    }

    setValidInput(valRegExp.test(quotaSize));
  }, [quotaEnabled, quotaSize]);

  const enableBucketEncryption = () => {
    if (loading || !validInput) {
      return;
    }

    api.buckets
      .setBucketQuota(selectedBucket, {
        enabled: quotaEnabled,
        amount: parseInt(getBytes(quotaSize, quotaUnit, true)),
        quota_type: "hard",
      })
      .then(() => {
        setLoading(false);
        closeModalAndRefresh();
      })
      .catch((err) => {
        setLoading(false);
        dispatch(setModalErrorSnackMessage(errorToHandler(err.error)));
      });
  };

  return (
    <ModalWrapper
      modalOpen={open}
      onClose={() => {
        closeModalAndRefresh();
      }}
      title="Enable Bucket Quota"
      titleIcon={<BucketQuotaIcon />}
    >
      <form
        noValidate
        autoComplete="off"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          enableBucketEncryption();
        }}
      >
        <FormLayout withBorders={false} containerPadding={false}>
          <Switch
            value="bucket_quota"
            id="bucket_quota"
            name="bucket_quota"
            checked={quotaEnabled}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setQuotaEnabled(event.target.checked);
            }}
            label={"Enabled"}
          />
          {quotaEnabled && (
            <InputBox
              id="quota_size"
              name="quota_size"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setQuotaSize(e.target.value);
                if (!e.target.validity.valid) {
                  setValidInput(false);
                } else {
                  setValidInput(true);
                }
              }}
              label="Quota"
              value={quotaSize}
              required
              min="1"
              overlayObject={
                <InputUnitMenu
                  id={"quota_unit"}
                  onUnitChange={(newValue) => {
                    setQuotaUnit(newValue);
                  }}
                  unitSelected={quotaUnit}
                  unitsList={k8sScalarUnitsExcluding(["Ki"])}
                  disabled={false}
                />
              }
              error={!validInput ? "Please enter a valid quota" : ""}
            />
          )}
          <Grid item xs={12} sx={modalStyleUtils.modalButtonBar}>
            <Button
              id={"cancel"}
              type="button"
              variant="regular"
              disabled={loading}
              onClick={() => {
                closeModalAndRefresh();
              }}
              label={"Cancel"}
            />

            <Button
              id={"save"}
              type="submit"
              variant="callAction"
              disabled={loading || !validInput}
              label={"Save"}
            />
          </Grid>
          {loading && (
            <Grid item xs={12}>
              <ProgressBar />
            </Grid>
          )}
        </FormLayout>
      </form>
    </ModalWrapper>
  );
};

export default EnableQuota;
