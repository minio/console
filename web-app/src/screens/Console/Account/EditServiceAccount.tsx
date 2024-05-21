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
import {
  Box,
  Button,
  ChangeAccessPolicyIcon,
  DateTimeInput,
  Grid,
  InputBox,
  Switch,
} from "mds";
import { api } from "api";
import { errorToHandler } from "api/errors";
import CodeMirrorWrapper from "../Common/FormComponents/CodeMirrorWrapper/CodeMirrorWrapper";
import { ApiError } from "api/consoleApi";
import { useAppDispatch } from "store";
import { setErrorSnackMessage, setModalErrorSnackMessage } from "systemSlice";
import ModalWrapper from "../Common/ModalWrapper/ModalWrapper";
import { modalStyleUtils } from "../Common/FormComponents/common/styleLibrary";
import { DateTime } from "luxon";

interface IServiceAccountPolicyProps {
  open: boolean;
  selectedAccessKey: string | null;
  closeModalAndRefresh: () => void;
}

const EditServiceAccount = ({
  open,
  selectedAccessKey,
  closeModalAndRefresh,
}: IServiceAccountPolicyProps) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [policyDefinition, setPolicyDefinition] = useState<any>("");

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [expiry, setExpiry] = useState<any>();
  const [status, setStatus] = useState<string | undefined>("enabled");

  useEffect(() => {
    if (!loading && selectedAccessKey !== "") {
      setLoading(true);
      api.serviceAccounts
        .getServiceAccount(selectedAccessKey || "")
        .then((res) => {
          setLoading(false);
          const saInfo = res.data;

          setName(saInfo?.name || "");

          if (saInfo?.expiration) {
            setExpiry(DateTime.fromISO(saInfo?.expiration));
          }

          setDescription(saInfo?.description || "");
          setStatus(saInfo.accountStatus);

          setPolicyDefinition(saInfo.policy || "");
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
      .updateServiceAccount(selectedAccessKey || "", {
        policy: newPolicy,
        description: description,
        expiry: expiry,
        name: name,
        status: status,
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
      title={`Edit details of - ${selectedAccessKey}`}
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
          <Box
            sx={{
              marginBottom: "15px",
              marginTop: "15px",
              display: "flex",
              width: "100%",
              "& label": { width: "195px" },
            }}
          >
            <DateTimeInput
              noLabelMinWidth
              value={expiry}
              onChange={(e) => {
                setExpiry(e);
              }}
              id="expiryTime"
              label={"Expiry"}
              timeFormat={"24h"}
              secondsSelector={false}
            />
          </Box>
          <Grid
            xs={12}
            sx={{
              marginBottom: "15px",
            }}
          >
            <InputBox
              value={name}
              size={120}
              label={"Name"}
              id={"name"}
              name={"name"}
              type={"text"}
              placeholder={"Enter a name"}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </Grid>
          <Grid
            xs={12}
            sx={{
              marginBottom: "15px",
            }}
          >
            <InputBox
              size={120}
              value={description}
              label={"Description"}
              id={"description"}
              name={"description"}
              type={"text"}
              placeholder={"Enter a description"}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </Grid>
          <Grid
            xs={12}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "start",
              fontWeight: 600,
              color: "rgb(7, 25, 62)",
              gap: 2,
              marginBottom: "15px",
            }}
          >
            <label style={{ width: "150px" }}>Status</label>
            <Box
              sx={{
                padding: "2px",
              }}
            >
              <Switch
                style={{
                  gap: "115px",
                }}
                indicatorLabels={["Enabled", "Disabled"]}
                checked={status === "on"}
                id="saStatus"
                name="saStatus"
                label=""
                onChange={(e) => {
                  setStatus(e.target.checked ? "on" : "off");
                }}
                value="yes"
              />
            </Box>
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
              label={"Update"}
            />
          </Grid>
        </Grid>
      </form>
    </ModalWrapper>
  );
};

export default EditServiceAccount;
