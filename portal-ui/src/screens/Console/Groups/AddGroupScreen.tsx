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
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import {
  formFieldStyles,
  modalStyleUtils,
} from "../Common/FormComponents/common/styleLibrary";
import Grid from "@mui/material/Grid";
import { Button, LinearProgress } from "@mui/material";
import PageHeader from "../Common/PageHeader/PageHeader";
import PageLayout from "../Common/Layout/PageLayout";
import history from "../../../../src/history";
import InputBoxWrapper from "../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import AddGroupHelpBox from "./AddGroupHelpBox";
import UsersSelectors from "./UsersSelectors";
import BackLink from "../../../common/BackLink";
import { connect } from "react-redux";
import { CreateGroupIcon } from "../../../icons";
import { IAM_PAGES } from "../../../common/SecureComponent/permissions";
import { ErrorResponseHandler } from "../../../../src/common/types";
import api from "../../../../src/common/api";
import { setErrorSnackMessage } from "../../../../src/actions";
import FormLayout from "../Common/FormLayout";

interface IAddGroupProps {
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
      paddingBottom: 40,
      paddingTop: 10,
      textAlign: "end",
    },
    headIcon: {
      fontWeight: "bold",
      size: "50",
    },
    ...formFieldStyles,
    ...modalStyleUtils,
  });

const AddGroupScreen = ({ classes, setErrorSnackMessage }: IAddGroupProps) => {
  const [groupName, setGroupName] = useState<string>("");
  const [saving, isSaving] = useState<boolean>(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [validGroup, setValidGroup] = useState<boolean>(false);

  useEffect(() => {
    setValidGroup(groupName.trim() !== "");
  }, [groupName, selectedUsers]);

  useEffect(() => {
    if (saving) {
      const saveRecord = () => {
        api
          .invoke("POST", "/api/v1/groups", {
            group: groupName,
            members: selectedUsers,
          })
          .then((res) => {
            isSaving(false);
            history.push(`${IAM_PAGES.GROUPS}`);
          })
          .catch((err: ErrorResponseHandler) => {
            isSaving(false);
            setErrorSnackMessage(err);
          });
      };

      saveRecord();
    }
  }, [saving, groupName, selectedUsers, setErrorSnackMessage]);

  //Fetch Actions
  const setSaving = (event: React.FormEvent) => {
    event.preventDefault();

    isSaving(true);
  };

  const resetForm = () => {
    setGroupName("");
    setSelectedUsers([]);
  };

  return (
    <Fragment>
      <Grid item xs={12}>
        <PageHeader
          label={<BackLink to={IAM_PAGES.GROUPS} label={"Groups"} />}
        />
        <PageLayout>
          <FormLayout
            title={"Create Group"}
            icon={<CreateGroupIcon />}
            helpbox={<AddGroupHelpBox />}
          >
            <form noValidate autoComplete="off" onSubmit={setSaving}>
              <Grid container marginTop={"16px"}>
                <Grid item xs={12} className={classes.formFieldRow}>
                  <InputBoxWrapper
                    id="group-name"
                    name="group-name"
                    label="Group Name"
                    autoFocus={true}
                    value={groupName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setGroupName(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12} className={classes.userSelector}>
                  <UsersSelectors
                    selectedUsers={selectedUsers}
                    setSelectedUsers={setSelectedUsers}
                    editMode={true}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} className={classes.modalButtonBar}>
                <Button
                  type="button"
                  variant="outlined"
                  color="primary"
                  className={classes.spacerRight}
                  onClick={resetForm}
                >
                  Clear
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={saving || !validGroup}
                >
                  Save
                </Button>
              </Grid>
              {saving && (
                <Grid item xs={12}>
                  <LinearProgress />
                </Grid>
              )}
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

export default withStyles(styles)(connector(AddGroupScreen));
