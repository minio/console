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
import { Button, LinearProgress } from "@mui/material";
import { CreateUserIcon } from "../../../icons";

import PageHeader from "../Common/PageHeader/PageHeader";
import PageLayout from "../Common/Layout/PageLayout";
import InputBoxWrapper from "../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";

import PolicySelectors from "../Policies/PolicySelectors";
import BackLink from "../../../common/BackLink";
import GroupsSelectors from "./GroupsSelectors";

import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { IAM_PAGES } from "../../../common/SecureComponent/permissions";
import { ErrorResponseHandler } from "../../../../src/common/types";
import api from "../../../../src/common/api";

import FormLayout from "../Common/FormLayout";
import AddUserHelpBox from "./AddUserHelpBox";
import { setErrorSnackMessage } from "../../../systemSlice";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../store";

interface IAddUserProps {
  classes: any;
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

const AddUser = ({ classes }: IAddUserProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [accessKey, setAccessKey] = useState<string>("");
  const [secretKey, setSecretKey] = useState<string>("");
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const sendEnabled = accessKey.trim() !== "";

  const saveRecord = (event: React.FormEvent) => {
    event.preventDefault();

    if (secretKey.length < 8) {
      dispatch(
        setErrorSnackMessage({
          errorMessage: "Passwords must be at least 8 characters long",
          detailedError: "",
        })
      );
      setAddLoading(false);
      return;
    }

    if (addLoading) {
      return;
    }
    setAddLoading(true);
    api
      .invoke("POST", "/api/v1/users", {
        accessKey,
        secretKey,
        groups: selectedGroups,
        policies: selectedPolicies,
      })
      .then((res) => {
        setAddLoading(false);
        navigate(`${IAM_PAGES.USERS}`);
      })
      .catch((err: ErrorResponseHandler) => {
        setAddLoading(false);
        dispatch(setErrorSnackMessage(err));
      });
  };

  const resetForm = () => {
    setSelectedGroups([]);
    setAccessKey("");
    setSecretKey("");
    setSelectedPolicies([]);
    setShowPassword(false);
  };

  return (
    <Fragment>
      <Grid item xs={12}>
        <PageHeader label={<BackLink to={IAM_PAGES.USERS} label={"Users"} />} />
        <PageLayout>
          <FormLayout
            title={"Create User"}
            icon={<CreateUserIcon />}
            helpbox={<AddUserHelpBox />}
          >
            <form
              noValidate
              autoComplete="off"
              onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                saveRecord(e);
              }}
            >
              <Grid item xs={12}>
                <div className={classes.formFieldRow}>
                  <InputBoxWrapper
                    className={classes.spacerBottom}
                    classes={{
                      inputLabel: classes.sizedLabel,
                    }}
                    id="accesskey-input"
                    name="accesskey-input"
                    label="User Name"
                    value={accessKey}
                    autoFocus={true}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setAccessKey(e.target.value);
                    }}
                  />
                </div>
                <div className={classes.formFieldRow}>
                  <InputBoxWrapper
                    className={classes.spacerBottom}
                    classes={{
                      inputLabel: classes.sizedLabel,
                    }}
                    id="standard-multiline-static"
                    name="standard-multiline-static"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={secretKey}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setSecretKey(e.target.value);
                    }}
                    autoComplete="current-password"
                    overlayIcon={
                      showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <RemoveRedEyeIcon />
                      )
                    }
                    overlayAction={() => setShowPassword(!showPassword)}
                  />
                </div>
                <Grid container item spacing="20">
                  <Grid item xs={12}>
                    <PolicySelectors
                      selectedPolicy={selectedPolicies}
                      setSelectedPolicy={setSelectedPolicies}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <GroupsSelectors
                      selectedGroups={selectedGroups}
                      setSelectedGroups={(elements: string[]) => {
                        setSelectedGroups(elements);
                      }}
                    />
                  </Grid>
                </Grid>
                {addLoading && (
                  <Grid item xs={12}>
                    <LinearProgress />
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

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={addLoading || !sendEnabled}
                >
                  Save
                </Button>
              </Grid>
            </form>
          </FormLayout>
        </PageLayout>
      </Grid>
    </Fragment>
  );
};

export default withStyles(styles)(AddUser);
