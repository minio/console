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
import {
  Button,
  Loader,
  Grid,
  FormLayout,
  RadioGroup,
  InputBox,
  ProgressBar,
} from "mds";
import { api } from "api";
import { ObjectRetentionMode, ObjectRetentionUnit } from "api/consoleApi";
import { errorToHandler } from "api/errors";

import { modalStyleUtils } from "../../Common/FormComponents/common/styleLibrary";
import { setModalErrorSnackMessage } from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";

interface ISetRetentionConfigProps {
  open: boolean;
  bucketName: string;
  closeModalAndRefresh: () => void;
}

const SetRetentionConfig = ({
  open,
  bucketName,
  closeModalAndRefresh,
}: ISetRetentionConfigProps) => {
  const dispatch = useAppDispatch();
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [loadingForm, setLoadingForm] = useState<boolean>(true);
  const [retentionMode, setRetentionMode] = useState<
    ObjectRetentionMode | undefined
  >(ObjectRetentionMode.Compliance);
  const [retentionUnit, setRetentionUnit] = useState<
    ObjectRetentionUnit | undefined
  >(ObjectRetentionUnit.Days);
  const [retentionValidity, setRetentionValidity] = useState<
    number | undefined
  >(1);
  const [valid, setValid] = useState<boolean>(false);

  const setRetention = (event: React.FormEvent) => {
    event.preventDefault();
    if (addLoading) {
      return;
    }
    setAddLoading(true);
    api.buckets
      .setBucketRetentionConfig(bucketName, {
        mode: retentionMode || ObjectRetentionMode.Compliance,
        unit: retentionUnit || ObjectRetentionUnit.Days,
        validity: retentionValidity || 1,
      })
      .then(() => {
        setAddLoading(false);
        closeModalAndRefresh();
      })
      .catch((err) => {
        setAddLoading(false);
        dispatch(setModalErrorSnackMessage(errorToHandler(err.error)));
      });
  };

  useEffect(() => {
    if (Number.isNaN(retentionValidity) || (retentionValidity || 1) < 1) {
      setValid(false);
      return;
    }
    setValid(true);
  }, [retentionValidity]);

  useEffect(() => {
    if (loadingForm) {
      api.buckets
        .getBucketRetentionConfig(bucketName)
        .then((res) => {
          setLoadingForm(false);

          // We set default values
          setRetentionMode(res.data.mode);
          setRetentionValidity(res.data.validity);
          setRetentionUnit(res.data.unit);
        })
        .catch(() => {
          setLoadingForm(false);
        });
    }
  }, [loadingForm, bucketName]);

  return (
    <ModalWrapper
      title="Set Retention Configuration"
      modalOpen={open}
      onClose={() => {
        closeModalAndRefresh();
      }}
    >
      {loadingForm ? (
        <Loader style={{ width: 16, height: 16 }} />
      ) : (
        <form
          noValidate
          autoComplete="off"
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            setRetention(e);
          }}
        >
          <FormLayout containerPadding={false} withBorders={false}>
            <RadioGroup
              currentValue={retentionMode as string}
              id="retention_mode"
              name="retention_mode"
              label="Retention Mode"
              onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                setRetentionMode(e.target.value as ObjectRetentionMode);
              }}
              selectorOptions={[
                { value: "compliance", label: "Compliance" },
                { value: "governance", label: "Governance" },
              ]}
              helpTip={
                <Fragment>
                  {" "}
                  <a
                    href="https://min.io/docs/minio/macos/administration/object-management/object-retention.html#minio-object-locking-compliance"
                    target="blank"
                  >
                    Compliance
                  </a>{" "}
                  lock protects Objects from write operations by all users,
                  including the MinIO root user.
                  <br />
                  <br />
                  <a
                    href="https://min.io/docs/minio/macos/administration/object-management/object-retention.html#minio-object-locking-governance"
                    target="blank"
                  >
                    Governance
                  </a>{" "}
                  lock protects Objects from write operations by non-privileged
                  users.
                </Fragment>
              }
              helpTipPlacement="right"
            />
            <RadioGroup
              currentValue={retentionUnit as string}
              id="retention_unit"
              name="retention_unit"
              label="Retention Unit"
              onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                setRetentionUnit(e.target.value as ObjectRetentionUnit);
              }}
              selectorOptions={[
                { value: "days", label: "Days" },
                { value: "years", label: "Years" },
              ]}
            />
            <InputBox
              type="number"
              id="retention_validity"
              name="retention_validity"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setRetentionValidity(e.target.valueAsNumber);
              }}
              label="Retention Validity"
              value={String(retentionValidity)}
              required
              min="1"
            />
            <Grid item xs={12} sx={modalStyleUtils.modalButtonBar}>
              <Button
                id={"cancel"}
                type="button"
                variant="regular"
                disabled={addLoading}
                onClick={() => {
                  closeModalAndRefresh();
                }}
                label={"Cancel"}
              />
              <Button
                id={"set"}
                type="submit"
                variant="callAction"
                color="primary"
                disabled={addLoading || !valid}
                label={"Set"}
              />
            </Grid>
            {addLoading && (
              <Grid item xs={12}>
                <ProgressBar />
              </Grid>
            )}
          </FormLayout>
        </form>
      )}
    </ModalWrapper>
  );
};

export default SetRetentionConfig;
