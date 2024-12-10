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
import {
  AddAccessRuleIcon,
  BackLink,
  Box,
  Button,
  FormLayout,
  Grid,
  InputBox,
  PageLayout,
} from "mds";
import AddPolicyHelpBox from "./AddPolicyHelpBox";
import CodeMirrorWrapper from "../Common/FormComponents/CodeMirrorWrapper/CodeMirrorWrapper";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";
import HelpMenu from "../HelpMenu";
import { IAM_PAGES } from "../../../common/SecureComponent/permissions";
import { setErrorSnackMessage, setHelpName } from "../../../systemSlice";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../store";
import { emptyPolicy } from "./utils";
import { api } from "../../../api";

const AddPolicyScreen = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [policyName, setPolicyName] = useState<string>("");
  const [policyDefinition, setPolicyDefinition] = useState<string>(emptyPolicy);

  const addRecord = (event: React.FormEvent) => {
    event.preventDefault();
    if (addLoading) {
      return;
    }
    setAddLoading(true);
    api.policies
      .addPolicy({
        name: policyName.trim(),
        policy: policyDefinition,
      })
      .then((res) => {
        setAddLoading(false);
        navigate(`${IAM_PAGES.POLICIES}`);
      })
      .catch((err) => {
        setAddLoading(false);
        dispatch(
          setErrorSnackMessage({
            errorMessage: "There was an error creating a Policy ",
            detailedError:
              "There was an error creating a Policy: " +
              (err.error.detailedMessage || "") +
              ". Please check Policy syntax.",
          }),
        );
      });
  };

  const resetForm = () => {
    setPolicyName("");
    setPolicyDefinition("");
  };

  const validatePolicyname = (policyName: string) => {
    if (policyName.trim() === "") {
      return "Policy name cannot be empty";
    } else return "";
  };

  const validSave = policyName.trim() !== "" && policyDefinition.trim() !== "";

  useEffect(() => {
    dispatch(setHelpName("add_policy"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Fragment>
      <Grid item xs={12}>
        <PageHeaderWrapper
          label={
            <BackLink
              label={"Policies"}
              onClick={() => navigate(IAM_PAGES.POLICIES)}
            />
          }
          actions={<HelpMenu />}
        />
        <PageLayout>
          <FormLayout
            title={"Create Policy"}
            icon={<AddAccessRuleIcon />}
            helpBox={<AddPolicyHelpBox />}
          >
            <form
              noValidate
              autoComplete="off"
              onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                addRecord(e);
              }}
            >
              <Grid container>
                <Grid item xs={12}>
                  <InputBox
                    id="policy-name"
                    name="policy-name"
                    label="Policy Name"
                    autoFocus={true}
                    value={policyName}
                    error={validatePolicyname(policyName)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setPolicyName(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <CodeMirrorWrapper
                    label={"Write Policy"}
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
                <Grid item xs={12} sx={{ textAlign: "right" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      marginTop: "20px",
                      gap: "15px",
                    }}
                  >
                    <Button
                      id={"clear"}
                      type="button"
                      variant="regular"
                      onClick={resetForm}
                      label={"Clear"}
                    />

                    <Button
                      id={"save-policy"}
                      type="submit"
                      variant="callAction"
                      color="primary"
                      disabled={addLoading || !validSave}
                      label={"Save"}
                    />
                  </Box>
                </Grid>
              </Grid>
            </form>
          </FormLayout>
        </PageLayout>
      </Grid>
    </Fragment>
  );
};

export default AddPolicyScreen;
