// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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
import { Button, ChangeAccessPolicyIcon, Grid } from "mds";
import { api } from "api";
import { errorToHandler } from "api/errors";
import CodeMirrorWrapper from "../Common/FormComponents/CodeMirrorWrapper/CodeMirrorWrapper";
import { ApiError } from "api/consoleApi";
import { useAppDispatch } from "store";
import { encodeURLString } from "common/utils";
import { setErrorSnackMessage, setModalErrorSnackMessage } from "systemSlice";
import ModalWrapper from "../Common/ModalWrapper/ModalWrapper";
import { modalStyleUtils } from "../Common/FormComponents/common/styleLibrary";

interface IServiceAccountPolicyProps {
  open: boolean;
  selectedAccessKey: string | null;
  closeModalAndRefresh: () => void;
}

const ServiceAccountPolicy = ({
  open,
  selectedAccessKey,
  closeModalAndRefresh,
}: IServiceAccountPolicyProps) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [policyDefinition, setPolicyDefinition] = useState<string>("");
  useEffect(() => {
    if (!loading && selectedAccessKey !== "") {
      const sourceAccKey = encodeURLString(selectedAccessKey);
      setLoading(true);
      api.serviceAccounts
        .getServiceAccountPolicy(sourceAccKey)
        .then((res) => {
          setLoading(false);
          setPolicyDefinition(res.data);
        })
        .catch((err) => {
          setLoading(false);
          dispatch(setModalErrorSnackMessage(errorToHandler(err)));
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAccessKey]);

  const setPolicy = (event: React.FormEvent, newPolicy: string) => {
    event.preventDefault();
    api.serviceAccounts
      .setServiceAccountPolicy(encodeURLString(selectedAccessKey), {
        policy: newPolicy,
      })
      .then(() => {
        closeModalAndRefresh();
      })
      .catch(async (res) => {
        const err = (await res.json()) as ApiError;
        dispatch(setErrorSnackMessage(errorToHandler(err)));
      });
  };

  return (
    <ModalWrapper
      title="Access Key Policy"
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
          setPolicy(e, policyDefinition);
        }}
      >
        <Grid container>
          <Grid item xs={12}>
            <CodeMirrorWrapper
              label={`Access Key Policy`}
              value={policyDefinition}
              onChange={(value) => {
                setPolicyDefinition(value);
              }}
              editorHeight={"350px"}
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
          <Grid item xs={12} sx={modalStyleUtils.modalButtonBar}>
            <Button
              id={"cancel-sa-policy"}
              type="button"
              variant="regular"
              onClick={() => {
                closeModalAndRefresh();
              }}
              disabled={loading}
              label={"Cancel"}
            />
            <Button
              id={"save-sa-policy"}
              type="submit"
              variant="callAction"
              color="primary"
              disabled={loading}
              label={"Set"}
            />
          </Grid>
        </Grid>
      </form>
    </ModalWrapper>
  );
};

export default ServiceAccountPolicy;
