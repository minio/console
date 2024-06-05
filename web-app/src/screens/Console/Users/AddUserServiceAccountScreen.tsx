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

import React, { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  BackLink,
  Box,
  Button,
  FormLayout,
  Grid,
  InputBox,
  PageLayout,
  PasswordKeyIcon,
  ServiceAccountCredentialsIcon,
  ServiceAccountIcon,
  Switch,
  HelpTip,
  DateTimeInput,
} from "mds";
import { modalStyleUtils } from "../Common/FormComponents/common/styleLibrary";
import { NewServiceAccount } from "../Common/CredentialsPrompt/types";
import { IAM_PAGES } from "../../../common/SecureComponent/permissions";
import { ErrorResponseHandler } from "../../../common/types";
import { getRandomString } from "../../../common/utils";
import { setErrorSnackMessage, setHelpName } from "../../../systemSlice";
import { useAppDispatch } from "../../../store";
import CodeMirrorWrapper from "../Common/FormComponents/CodeMirrorWrapper/CodeMirrorWrapper";
import api from "../../../../src/common/api";
import CredentialsPrompt from "../Common/CredentialsPrompt/CredentialsPrompt";
import AddUserServiceAccountHelpBox from "./AddUserServiceAccountHelpBox";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";
import HelpMenu from "../HelpMenu";
import PanelTitle from "../Common/PanelTitle/PanelTitle";

const AddServiceAccount = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const navigate = useNavigate();

  const [addSending, setAddSending] = useState<boolean>(false);
  const [accessKey, setAccessKey] = useState<string>(getRandomString(20));
  const [secretKey, setSecretKey] = useState<string>(getRandomString(40));
  const [isRestrictedByPolicy, setIsRestrictedByPolicy] =
    useState<boolean>(false);
  const [newServiceAccount, setNewServiceAccount] =
    useState<NewServiceAccount | null>(null);
  const [policyJSON, setPolicyJSON] = useState<string>("");

  const userName = params.userName || "";

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [comments, setComments] = useState<string>("");
  const [expiry, setExpiry] = useState<any>();

  useEffect(() => {
    if (addSending) {
      const expiryDt = expiry ? expiry.toJSDate().toISOString() : null;
      api
        .invoke(
          "POST",
          `/api/v1/user/${encodeURIComponent(
            userName,
          )}/service-account-credentials`,
          {
            policy: policyJSON,
            accessKey: accessKey,
            secretKey: secretKey,
            description: description,
            comment: comments,
            name: name,
            expiry: expiryDt,
          },
        )
        .then((res) => {
          setAddSending(false);
          setNewServiceAccount({
            accessKey: res.accessKey || "",
            secretKey: res.secretKey || "",
            url: res.url || "",
          });
        })
        .catch((err: ErrorResponseHandler) => {
          setAddSending(false);
          dispatch(setErrorSnackMessage(err));
        });
    }
  }, [
    addSending,
    setAddSending,
    dispatch,
    policyJSON,
    userName,
    accessKey,
    secretKey,
    name,
    description,
    expiry,
    comments,
  ]);

  useEffect(() => {
    if (isRestrictedByPolicy) {
      api
        .invoke("GET", `/api/v1/user/${encodeURIComponent(userName)}/policies`)

        .then((res) => {
          setPolicyJSON(JSON.stringify(JSON.parse(res.policy), null, 4));
        })
        .catch((err: ErrorResponseHandler) => {
          setErrorSnackMessage(err);
        });
    }
  }, [isRestrictedByPolicy, userName]);

  const addUserServiceAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setAddSending(true);
  };

  const resetForm = () => {
    setNewServiceAccount(null);
    setAccessKey("");
    setSecretKey("");
  };

  const closeCredentialsModal = () => {
    setNewServiceAccount(null);
    navigate(`${IAM_PAGES.USERS}/${encodeURIComponent(userName)}`);
  };

  useEffect(() => {
    dispatch(setHelpName("add_user_SA"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      {newServiceAccount && (
        <CredentialsPrompt
          newServiceAccount={newServiceAccount}
          open
          closeModal={() => {
            closeCredentialsModal();
          }}
          entity="Access Key"
        />
      )}
      <Grid item xs={12}>
        <PageHeaderWrapper
          label={
            <BackLink
              onClick={() =>
                navigate(`${IAM_PAGES.USERS}/${encodeURIComponent(userName)}`)
              }
              label={"User Details - " + userName}
            />
          }
          actions={<HelpMenu />}
        />
        <PageLayout>
          <FormLayout
            helpBox={<AddUserServiceAccountHelpBox />}
            icon={<ServiceAccountCredentialsIcon />}
            title={`Create Access Key for ${userName}`}
          >
            <form
              noValidate
              autoComplete="off"
              onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                addUserServiceAccount(e);
              }}
            >
              <InputBox
                value={accessKey}
                label={"Access Key"}
                id={"accessKey"}
                name={"accessKey"}
                placeholder={"Enter Access Key"}
                onChange={(e) => {
                  setAccessKey(e.target.value);
                }}
                startIcon={<ServiceAccountIcon />}
              />
              <InputBox
                value={secretKey}
                label={"Secret Key"}
                id={"secretKey"}
                name={"secretKey"}
                type={"password"}
                placeholder={"Enter Secret Key"}
                onChange={(e) => {
                  setSecretKey(e.target.value);
                }}
                startIcon={<PasswordKeyIcon />}
              />

              <Switch
                value="serviceAccountPolicy"
                id="serviceAccountPolicy"
                name="serviceAccountPolicy"
                checked={isRestrictedByPolicy}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setIsRestrictedByPolicy(event.target.checked);
                }}
                label={"Restrict beyond user policy"}
                description={
                  "You can specify an optional JSON-formatted IAM policy to further restrict Access Key access to a subset of the actions and resources explicitly allowed for the parent user. Additional access beyond that of the parent user cannot be implemented through these policies."
                }
              />
              {isRestrictedByPolicy && (
                <Grid item xs={12}>
                  <Box>
                    <HelpTip
                      content={
                        <Fragment>
                          <a
                            target="blank"
                            href="https://min.io/docs/minio/kubernetes/upstream/administration/identity-access-management/policy-based-access-control.html#policy-document-structure"
                          >
                            Guide to access policy structure
                          </a>
                        </Fragment>
                      }
                      placement="right"
                    >
                      <PanelTitle>
                        Current User Policy - edit the JSON to remove
                        permissions for this Access Key
                      </PanelTitle>
                    </HelpTip>
                  </Box>
                  <Grid item xs={12} sx={{ ...modalStyleUtils.formScrollable }}>
                    <CodeMirrorWrapper
                      value={policyJSON}
                      onChange={(value) => {
                        setPolicyJSON(value);
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
                </Grid>
              )}

              <Box
                sx={{
                  marginBottom: "15px",
                  marginTop: "15px",
                  width: "100%",
                  "& label": { width: "180px" },
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

              <InputBox
                value={name}
                label={"Name"}
                id={"name"}
                name={"name"}
                type={"text"}
                placeholder={"Enter a name"}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              <InputBox
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
              <InputBox
                value={comments}
                label={"Comments"}
                id={"comment"}
                name={"comment"}
                type={"text"}
                placeholder={"Enter a comment"}
                onChange={(e) => {
                  setComments(e.target.value);
                }}
              />
              <Grid item xs={12} sx={{ ...modalStyleUtils.modalButtonBar }}>
                <Button
                  id={"clear"}
                  type="button"
                  variant="regular"
                  onClick={resetForm}
                  label={"Clear"}
                />

                <Button
                  id={"create-sa"}
                  type="submit"
                  variant="callAction"
                  color="primary"
                  label={"Create"}
                />
              </Grid>
            </form>
          </FormLayout>
        </PageLayout>
      </Grid>
    </Fragment>
  );
};

export default AddServiceAccount;
