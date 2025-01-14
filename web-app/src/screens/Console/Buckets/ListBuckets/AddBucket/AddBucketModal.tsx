// This file is part of MinIO Console Server
// Copyright (c) 2025 MinIO, Inc.
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

import { useNavigate } from "react-router-dom";
import { Box, Button, FormLayout, Grid, ProgressBar } from "mds";
import { AppState, useAppDispatch } from "../../../../../store";
import { useSelector } from "react-redux";
import { setErrorSnackMessage, setHelpName } from "../../../../../systemSlice";
import TooltipWrapper from "../../../Common/TooltipWrapper/TooltipWrapper";
import {
  resetForm,
  setAddBucketOpen,
  setIsDirty,
  setName,
} from "./addBucketsSlice";
import { addBucketAsync } from "./addBucketThunks";
import AddBucketName from "./AddBucketName";
import { api } from "../../../../../api";
import { errorToHandler } from "../../../../../api/errors";
import ModalWrapper from "../../../Common/ModalWrapper/ModalWrapper";

const AddBucketModal = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const validBucketCharacters = new RegExp(
    `^[a-z0-9][a-z0-9\\.\\-]{1,61}[a-z0-9]$`,
  );
  const ipAddressFormat = new RegExp(`^(\\d+\\.){3}\\d+$`);
  const bucketName = useSelector((state: AppState) => state.addBucket.name);
  const isDirty = useSelector((state: AppState) => state.addBucket.isDirty);
  const [validationResult, setValidationResult] = useState<boolean[]>([]);
  const errorList = validationResult.filter((v) => !v);

  const hasErrors = errorList.length > 0;
  const [records, setRecords] = useState<string[]>([]);
  const addLoading = useSelector((state: AppState) => state.addBucket.loading);
  const addError = useSelector((state: AppState) => state.addBucket.error);
  const modalOpen = useSelector(
    (state: AppState) => state.addBucket.addBucketOpen,
  );
  const invalidFields = useSelector(
    (state: AppState) => state.addBucket.invalidFields,
  );
  const navigateTo = useSelector(
    (state: AppState) => state.addBucket.navigateTo,
  );

  useEffect(() => {
    if (addError) {
      dispatch(setErrorSnackMessage(errorToHandler(addError)));
    }
  }, [addError, dispatch]);

  useEffect(() => {
    const bucketNameErrors = [
      !(isDirty && (bucketName.length < 3 || bucketName.length > 63)),
      validBucketCharacters.test(bucketName),
      !(
        bucketName.includes(".-") ||
        bucketName.includes("-.") ||
        bucketName.includes("..")
      ),
      !ipAddressFormat.test(bucketName),
      !bucketName.startsWith("xn--"),
      !bucketName.endsWith("-s3alias"),
      !records.includes(bucketName),
    ];
    setValidationResult(bucketNameErrors);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bucketName, isDirty]);

  useEffect(() => {
    dispatch(setName(""));
    dispatch(setIsDirty(false));
    const fetchRecords = () => {
      api.buckets
        .listBuckets()
        .then((res) => {
          if (res.data) {
            var bucketList: string[] = [];
            if (res.data.buckets != null && res.data.buckets.length > 0) {
              res.data.buckets.forEach((bucket) => {
                bucketList.push(bucket.name);
              });
            }
            setRecords(bucketList);
          } else if (res.error) {
            dispatch(setErrorSnackMessage(errorToHandler(res.error)));
          }
        })
        .catch((err) => {
          dispatch(setErrorSnackMessage(errorToHandler(err)));
        });
    };
    fetchRecords();
  }, [dispatch]);

  const resForm = () => {
    dispatch(resetForm());
  };

  useEffect(() => {
    if (navigateTo !== "") {
      const goTo = `${navigateTo}`;
      dispatch(setAddBucketOpen(false));
      dispatch(resetForm());
      navigate(goTo);
    }
  }, [navigateTo, navigate, dispatch]);

  useEffect(() => {
    dispatch(setHelpName("add_bucket"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <ModalWrapper
        onClose={() => {
          dispatch(setAddBucketOpen(false));
        }}
        modalOpen={modalOpen}
        title={"Create Bucket"}
      >
        <FormLayout withBorders={false}>
          <form
            noValidate
            autoComplete="off"
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              dispatch(addBucketAsync());
            }}
          >
            <Box>
              <AddBucketName hasErrors={hasErrors} />
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 10,
                marginTop: 15,
              }}
            >
              <Button
                id={"clear"}
                type="button"
                variant={"regular"}
                className={"clearButton"}
                onClick={resForm}
                label={"Clear"}
              />
              <TooltipWrapper
                tooltip={
                  invalidFields.length > 0 || !isDirty || hasErrors
                    ? "You must apply a valid name to the bucket"
                    : ""
                }
              >
                <Button
                  id={"create-bucket"}
                  type="submit"
                  variant="callAction"
                  color="primary"
                  disabled={
                    addLoading ||
                    invalidFields.length > 0 ||
                    !isDirty ||
                    hasErrors
                  }
                  label={"Create Bucket"}
                />
              </TooltipWrapper>
            </Box>
            {addLoading && (
              <Grid item xs={12}>
                <ProgressBar />
              </Grid>
            )}
          </form>
        </FormLayout>
      </ModalWrapper>
    </Fragment>
  );
};

export default AddBucketModal;
