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
import { api } from "api";
import { BucketAccess } from "api/consoleApi";
import { errorToHandler } from "api/errors";
import {
  Box,
  Button,
  ChangeAccessPolicyIcon,
  FormLayout,
  Grid,
  Select,
} from "mds";
import { modalStyleUtils } from "../../Common/FormComponents/common/styleLibrary";
import { setModalErrorSnackMessage } from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";
import { emptyPolicy } from "../../Policies/utils";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import CodeMirrorWrapper from "../../Common/FormComponents/CodeMirrorWrapper/CodeMirrorWrapper";

interface ISetAccessPolicyProps {
  open: boolean;
  bucketName: string;
  actualPolicy: BucketAccess | string;
  actualDefinition: string;
  closeModalAndRefresh: () => void;
}

const SetAccessPolicy = ({
  open,
  bucketName,
  actualPolicy,
  actualDefinition,
  closeModalAndRefresh,
}: ISetAccessPolicyProps) => {
  const dispatch = useAppDispatch();
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [accessPolicy, setAccessPolicy] = useState<BucketAccess | string>("");
  const [policyDefinition, setPolicyDefinition] = useState<string>(emptyPolicy);
  const addRecord = (event: React.FormEvent) => {
    event.preventDefault();
    if (addLoading || !accessPolicy) {
      return;
    }
    setAddLoading(true);
    api.buckets
      .bucketSetPolicy(bucketName, {
        access: accessPolicy as BucketAccess,
        definition: policyDefinition,
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
    setAccessPolicy(actualPolicy);
    setPolicyDefinition(
      actualDefinition
        ? JSON.stringify(JSON.parse(actualDefinition), null, 4)
        : emptyPolicy,
    );
  }, [setAccessPolicy, actualPolicy, setPolicyDefinition, actualDefinition]);

  return (
    <ModalWrapper
      title="Change Access Policy"
      modalOpen={open}
      onClose={() => {
        closeModalAndRefresh();
      }}
      titleIcon={<ChangeAccessPolicyIcon />}
    >
      <form
        noValidate
        autoComplete="off"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          addRecord(e);
        }}
      >
        <FormLayout withBorders={false} containerPadding={false}>
          <Select
            value={accessPolicy}
            label="Access Policy"
            id="select-access-policy"
            name="select-access-policy"
            onChange={(value) => {
              setAccessPolicy(value as BucketAccess);
            }}
            options={[
              { value: BucketAccess.PRIVATE, label: "Private" },
              { value: BucketAccess.PUBLIC, label: "Public" },
              { value: BucketAccess.CUSTOM, label: "Custom" },
            ]}
          />
          {accessPolicy === "PUBLIC" && (
            <Box
              className={"muted"}
              style={{
                marginTop: "25px",
                fontSize: "14px",
                fontStyle: "italic",
              }}
            >
              * Warning: With Public access anyone will be able to upload,
              download and delete files from this Bucket *
            </Box>
          )}
          {accessPolicy === "CUSTOM" && (
            <Grid item xs={12}>
              <CodeMirrorWrapper
                label={`Write Policy`}
                value={policyDefinition}
                onChange={(value) => {
                  setPolicyDefinition(value);
                }}
                editorHeight={"300px"}
                helptip={
                  <Fragment>
                    <a
                      target="blank"
                      href="https://min.io/docs/minio/kubernetes/upstream/administration/identity-access-management/policy-based-access-control.html#policy-document-structure"
                    >
                      Guide to access policy structure
                    </a>
                  </Fragment>
                }
              />
            </Grid>
          )}
        </FormLayout>
        <Box sx={modalStyleUtils.modalButtonBar}>
          <Button
            id={"cancel"}
            type="button"
            variant="regular"
            onClick={() => {
              closeModalAndRefresh();
            }}
            disabled={addLoading}
            label={"Cancel"}
          />
          <Button
            id={"set"}
            type="submit"
            variant="callAction"
            disabled={
              addLoading || (accessPolicy === "CUSTOM" && !policyDefinition)
            }
            label={"Set"}
          />
        </Box>
      </form>
    </ModalWrapper>
  );
};

export default SetAccessPolicy;
