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
import { Theme } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import {
  BackLink,
  Button,
  IAMPoliciesIcon,
  PageLayout,
  PasswordKeyIcon,
  ServiceAccountCredentialsIcon,
} from "mds";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import {
  formFieldStyles,
  modalStyleUtils,
} from "../Common/FormComponents/common/styleLibrary";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";
import CodeMirrorWrapper from "../Common/FormComponents/CodeMirrorWrapper/CodeMirrorWrapper";
import InputBoxWrapper from "../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import FormSwitchWrapper from "../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";

import { NewServiceAccount } from "../Common/CredentialsPrompt/types";

import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { IAM_PAGES } from "../../../common/SecureComponent/permissions";
import { ErrorResponseHandler } from "../../../../src/common/types";
import api from "../../../../src/common/api";
import CredentialsPrompt from "../Common/CredentialsPrompt/CredentialsPrompt";
import SectionTitle from "../Common/SectionTitle";

import AddUserServiceAccountHelpBox from "./AddUserServiceAccountHelpBox";
import {
  decodeURLString,
  encodeURLString,
  getRandomString,
} from "../../../common/utils";
import { setErrorSnackMessage } from "../../../systemSlice";
import { useAppDispatch } from "../../../store";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";

interface IAddServiceAccountProps {
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    ...formFieldStyles,
    ...modalStyleUtils,
  });

const AddServiceAccount = ({ classes }: IAddServiceAccountProps) => {
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
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [policyJSON, setPolicyJSON] = useState<string>("");

  const userName = decodeURLString(params.userName || "");

  useEffect(() => {
    if (addSending) {
      api
        .invoke(
          "POST",
          `/api/v1/user/${encodeURLString(
            userName
          )}/service-account-credentials`,
          {
            policy: policyJSON,
            accessKey: accessKey,
            secretKey: secretKey,
          }
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
  ]);

  useEffect(() => {
    if (isRestrictedByPolicy) {
      api
        .invoke("GET", `/api/v1/user/${encodeURLString(userName)}/policies`)

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
    setShowPassword(false);
  };

  const closeCredentialsModal = () => {
    setNewServiceAccount(null);
    navigate(`${IAM_PAGES.USERS}/${encodeURLString(userName)}`);
  };

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
                navigate(`${IAM_PAGES.USERS}/${encodeURLString(userName)}`)
              }
              label={"User Details - " + userName}
            />
          }
        />
        <PageLayout>
          <Box
            sx={{
              display: "grid",
              padding: "25px",
              gap: "25px",
              gridTemplateColumns: {
                md: "2fr 1.2fr",
                xs: "1fr",
              },
              border: "1px solid #eaeaea",
            }}
          >
            <Box>
              <SectionTitle icon={<ServiceAccountCredentialsIcon />}>
                {`Create Access Key for ${userName}`}
              </SectionTitle>
              <form
                noValidate
                autoComplete="off"
                onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                  addUserServiceAccount(e);
                }}
              >
                <Grid container item spacing="20" sx={{ marginTop: 1 }}>
                  <Grid item xs={12}>
                    <Grid container item spacing="20">
                      <Grid item xs={12}>
                        <Grid container>
                          <Grid item xs={1}>
                            <PasswordKeyIcon />
                          </Grid>
                          <Grid item>
                            <Grid container item spacing="20">
                              <Grid item xs={12}>
                                {" "}
                                <div className={classes.stackedInputs}>
                                  <InputBoxWrapper
                                    value={accessKey}
                                    label={"Access Key"}
                                    id={"accessKey"}
                                    name={"accessKey"}
                                    placeholder={"Enter Access Key"}
                                    onChange={(e) => {
                                      setAccessKey(e.target.value);
                                    }}
                                  />
                                </div>
                              </Grid>
                              <Grid item xs={12}>
                                <div className={classes.stackedInputs}>
                                  <InputBoxWrapper
                                    value={secretKey}
                                    label={"Secret Key"}
                                    id={"secretKey"}
                                    name={"secretKey"}
                                    type={showPassword ? "text" : "password"}
                                    placeholder={"Enter Secret Key"}
                                    onChange={(e) => {
                                      setSecretKey(e.target.value);
                                    }}
                                    overlayIcon={
                                      showPassword ? (
                                        <VisibilityOffIcon />
                                      ) : (
                                        <RemoveRedEyeIcon />
                                      )
                                    }
                                    overlayAction={() =>
                                      setShowPassword(!showPassword)
                                    }
                                  />
                                </div>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid container item spacing="20">
                    <Grid item xs={12}>
                      <Grid container>
                        <Grid item xs={1}>
                          <IAMPoliciesIcon />
                        </Grid>
                        <Grid item xs={11}>
                          <FormSwitchWrapper
                            value="serviceAccountPolicy"
                            id="serviceAccountPolicy"
                            name="serviceAccountPolicy"
                            checked={isRestrictedByPolicy}
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setIsRestrictedByPolicy(event.target.checked);
                            }}
                            label={"Restrict beyond user policy"}
                            tooltip={
                              "You can specify an optional JSON-formatted IAM policy to further restrict Access Key access to a subset of the actions and resources explicitly allowed for the parent user. Additional access beyond that of the parent user cannot be implemented through these policies."
                            }
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    {isRestrictedByPolicy && (
                      <Grid
                        item
                        xs={12}
                        className={classes.codeMirrorContainer}
                      >
                        <Grid item xs={12} className={classes.formScrollable}>
                          <CodeMirrorWrapper
                            label={"Policy"}
                            value={policyJSON}
                            onBeforeChange={(editor, data, value) => {
                              setPolicyJSON(value);
                            }}
                          />
                        </Grid>
                      </Grid>
                    )}
                  </Grid>
                  <Grid item xs={12} className={classes.modalButtonBar}>
                    <Button
                      id={"clear-add-sa"}
                      type="button"
                      variant="regular"
                      onClick={resetForm}
                      label={"Clear"}
                    />
                    <Button
                      id="create-sa"
                      type="submit"
                      variant="callAction"
                      label={"Create"}
                    />
                  </Grid>
                </Grid>
              </form>
            </Box>
            <AddUserServiceAccountHelpBox />
          </Box>
        </PageLayout>
      </Grid>
    </Fragment>
  );
};

export default withStyles(styles)(AddServiceAccount);
