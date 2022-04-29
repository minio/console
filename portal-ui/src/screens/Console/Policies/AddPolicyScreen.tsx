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

import React, { Fragment, useState } from "react";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import {
  formFieldStyles,
  modalStyleUtils,
} from "../Common/FormComponents/common/styleLibrary";
import Grid from "@mui/material/Grid";
import { Button, Box } from "@mui/material";
import PageHeader from "../Common/PageHeader/PageHeader";
import history from "../../../../src/history";
import PageLayout from "../Common/Layout/PageLayout";
import InputBoxWrapper from "../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import AddPolicyHelpBox from "./AddPolicyHelpBox";
import CodeMirrorWrapper from "../Common/FormComponents/CodeMirrorWrapper/CodeMirrorWrapper";
import BackLink from "../../../common/BackLink";
import { connect } from "react-redux";
import { AddAccessRuleIcon } from "../../../icons";
import { IAM_PAGES } from "../../../common/SecureComponent/permissions";
import { ErrorResponseHandler } from "../../../../src/common/types";
import api from "../../../../src/common/api";
import { setErrorSnackMessage } from "../../../../src/actions";
import FormLayout from "../Common/FormLayout";

interface IAddPolicyProps {
  classes: any;
  setErrorSnackMessage: typeof setErrorSnackMessage;
}

const styles = (theme: Theme) =>
  createStyles({
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
    ...formFieldStyles,
    ...modalStyleUtils,
  });

const AddPolicyScreen = ({
  classes,
  setErrorSnackMessage,
}: IAddPolicyProps) => {
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [policyName, setPolicyName] = useState<string>("");
  const [policyDefinition, setPolicyDefinition] = useState<string>("");

  const addRecord = (event: React.FormEvent) => {
    event.preventDefault();
    if (addLoading) {
      return;
    }
    setAddLoading(true);
    api
      .invoke("POST", "/api/v1/policies", {
        name: policyName,
        policy: policyDefinition,
      })
      .then((res) => {
        setAddLoading(false);
        history.push(`${IAM_PAGES.POLICIES}`);
      })
      .catch((err: ErrorResponseHandler) => {
        setAddLoading(false);
        setErrorSnackMessage(err);
      });
  };

  const resetForm = () => {
    setPolicyName("");
    setPolicyDefinition("");
  };

  const validSave = policyName.trim() !== "";

  return (
    <Fragment>
      <Grid item xs={12}>
        <PageHeader
          label={<BackLink to={IAM_PAGES.POLICIES} label={"Policies"} />}
        />
        <PageLayout>
          <FormLayout
            title={"Create Policy"}
            icon={<AddAccessRuleIcon />}
            helpbox={<AddPolicyHelpBox />}
          >
            <form
              noValidate
              autoComplete="off"
              onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                addRecord(e);
              }}
            >
              <Grid container item spacing={1} marginTop={"8px"}>
                <Grid item xs={12}>
                  <InputBoxWrapper
                    id="policy-name"
                    name="policy-name"
                    label="Policy Name"
                    autoFocus={true}
                    value={policyName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setPolicyName(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <CodeMirrorWrapper
                    label={"Write Policy"}
                    value={policyDefinition}
                    onBeforeChange={(editor, data, value) => {
                      setPolicyDefinition(value);
                    }}
                    editorHeight={"350px"}
                  />
                </Grid>
                <Grid item xs={12} textAlign={"right"}>
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
                      type="button"
                      variant="outlined"
                      color="primary"
                      onClick={resetForm}
                    >
                      Clear
                    </Button>

                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={addLoading || !validSave}
                    >
                      Save
                    </Button>
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

const mapDispatchToProps = {
  setErrorSnackMessage,
};

const connector = connect(null, mapDispatchToProps);

export default withStyles(styles)(connector(AddPolicyScreen));
