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

import React, { Fragment, useState, useEffect } from "react";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import {
  formFieldStyles,
  modalStyleUtils,
} from "../Common/FormComponents/common/styleLibrary";
import Grid from "@mui/material/Grid";
import { Button, Box } from "@mui/material";
import { PasswordKeyIcon, ServiceAccountCredentialsIcon } from "../../../icons";
import CodeMirrorWrapper from "../Common/FormComponents/CodeMirrorWrapper/CodeMirrorWrapper";
import PageHeader from "../Common/PageHeader/PageHeader";
import PageLayout from "../Common/Layout/PageLayout";
import history from "../../../../src/history";
import InputBoxWrapper from "../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import FormSwitchWrapper from "../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import AddServiceAccountHelpBox from "./AddServiceAccountHelpBox";
import BackLink from "../../../common/BackLink";
import { NewServiceAccount } from "../Common/CredentialsPrompt/types";
import { connect } from "react-redux";
import { IAMPoliciesIcon } from "../../../icons";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { IAM_PAGES } from "../../../common/SecureComponent/permissions";
import { ErrorResponseHandler } from "../../../../src/common/types";
import api from "../../../../src/common/api";
import CredentialsPrompt from "../Common/CredentialsPrompt/CredentialsPrompt";
import { setErrorSnackMessage } from "../../../../src/actions";
import SectionTitle from "../Common/SectionTitle";
import { getRandomString } from "../../../screens/Console/Tenants/utils";

interface IAddServiceAccountProps {
  classes: any;
  setErrorSnackMessage: typeof setErrorSnackMessage;
}

const styles = (theme: Theme) =>
  createStyles({
    buttonContainer: {
      textAlign: "right",
    },
    bottomContainer: {
      display: "flex",
      flexGrow: 1,
      alignItems: "center",
      margin: "auto",
      justifyContent: "center",
      "& div": {
        width: 150,
        "@media (max-width: 900px)": {
          flexFlow: "column",
        },
      },
    },
    factorElements: {
      display: "flex",
      justifyContent: "flex-start",
      marginLeft: 30,
    },
    sizeNumber: {
      fontSize: 35,
      fontWeight: 700,
      textAlign: "center",
    },
    sizeDescription: {
      fontSize: 14,
      color: "#777",
      textAlign: "center",
    },
    pageBox: {
      border: "1px solid #EAEAEA",
      borderTop: 0,
    },
    addPoolTitle: {
      border: "1px solid #EAEAEA",
      borderBottom: 0,
    },
    headTitle: {
      fontWeight: "bold",
      fontSize: 20,
      paddingLeft: 20,
      paddingTop: 10,
      paddingBottom: 40,
      textAlign: "end",
    },
    headIcon: {
      fontWeight: "bold",
      size: "50",
    },
    ...formFieldStyles,
    ...modalStyleUtils,
  });

const AddServiceAccount = ({
  classes,
  setErrorSnackMessage,
}: IAddServiceAccountProps) => {
  const [addSending, setAddSending] = useState<boolean>(false);
  const [policyDefinition, setPolicyDefinition] = useState<string>("");
  const [accessKey, setAccessKey] = useState<string>(getRandomString(16));
  const [secretKey, setSecretKey] = useState<string>(getRandomString(32));
  const [isRestrictedByPolicy, setIsRestrictedByPolicy] =
    useState<boolean>(false);
  const [newServiceAccount, setNewServiceAccount] =
    useState<NewServiceAccount | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    if (addSending) {
      api
        .invoke("POST", `/api/v1/service-account-credentials`, {
          policy: policyDefinition,
          accessKey: accessKey,
          secretKey: secretKey,
        })
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
          setErrorSnackMessage(err);
        });
    }
  }, [
    addSending,
    setAddSending,
    setErrorSnackMessage,
    policyDefinition,
    accessKey,
    secretKey,
  ]);

  const addServiceAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setAddSending(true);
  };

  const resetForm = () => {
    setPolicyDefinition("");
    setNewServiceAccount(null);
    setAccessKey("");
    setSecretKey("");
    setShowPassword(false);
  };

  const closeCredentialsModal = () => {
    setNewServiceAccount(null);
    history.push(`${IAM_PAGES.ACCOUNT}`);
  };

  return (
    <Fragment>
      {newServiceAccount !== null && (
        <CredentialsPrompt
          newServiceAccount={newServiceAccount}
          open={newServiceAccount !== null}
          closeModal={() => {
            closeCredentialsModal();
          }}
          entity="Service Account"
        />
      )}
      <Grid item xs={12}>
        <PageHeader
          label={<BackLink to={IAM_PAGES.ACCOUNT} label={"Service Accounts"} />}
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
                Create Service Account
              </SectionTitle>

              <form
                noValidate
                autoComplete="off"
                onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                  addServiceAccount(e);
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
                              "You can specify an optional JSON-formatted IAM policy to further restrict Service Account access to a subset of the actions and resources explicitly allowed for the parent user. Additional access beyond that of the parent user cannot be implemented through these policies."
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
                        <CodeMirrorWrapper
                          label={"Policy "}
                          value={policyDefinition}
                          onBeforeChange={(editor, data, value) => {
                            setPolicyDefinition(value);
                          }}
                        />
                      </Grid>
                    )}
                  </Grid>
                  <Grid item xs={12} className={classes.modalButtonBar}>
                    <Button
                      type="button"
                      variant="outlined"
                      color="primary"
                      onClick={resetForm}
                    >
                      Clear
                    </Button>

                    <Button type="submit" variant="contained" color="primary">
                      Create
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Box>
            <AddServiceAccountHelpBox />
          </Box>
        </PageLayout>
      </Grid>
    </Fragment>
  );
};

const mapDispatchToProps = {
  setErrorSnackMessage,
};

const connector = connect(null, mapDispatchToProps);

export default withStyles(styles)(connector(AddServiceAccount));
