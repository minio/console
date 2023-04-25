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
import { useNavigate } from "react-router-dom";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import {
  formFieldStyles,
  modalStyleUtils,
} from "../Common/FormComponents/common/styleLibrary";
import Grid from "@mui/material/Grid";
import { LinearProgress } from "@mui/material";
import { BackLink, Button, CreateGroupIcon, FormLayout } from "mds";
import PageLayout from "../Common/Layout/PageLayout";
import InputBoxWrapper from "../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import AddGroupHelpBox from "./AddGroupHelpBox";
import UsersSelectors from "./UsersSelectors";
import { IAM_PAGES } from "../../../common/SecureComponent/permissions";
import { ErrorResponseHandler } from "../../../../src/common/types";
import api from "../../../../src/common/api";

import { setErrorSnackMessage } from "../../../systemSlice";
import { useAppDispatch } from "../../../store";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";

interface IAddGroupProps {
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    ...formFieldStyles,
    ...modalStyleUtils,
  });

const AddGroupScreen = ({ classes }: IAddGroupProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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
            navigate(`${IAM_PAGES.GROUPS}`);
          })
          .catch((err: ErrorResponseHandler) => {
            isSaving(false);
            dispatch(setErrorSnackMessage(err));
          });
      };

      saveRecord();
    }
  }, [saving, groupName, selectedUsers, dispatch, navigate]);

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
        <PageHeaderWrapper
          label={
            <BackLink
              label={"Groups"}
              onClick={() => navigate(IAM_PAGES.GROUPS)}
            />
          }
        />
        <PageLayout>
          <FormLayout
            title={"Create Group"}
            icon={<CreateGroupIcon />}
            helpBox={<AddGroupHelpBox />}
          >
            <form noValidate autoComplete="off" onSubmit={setSaving}>
              <Grid container>
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
                  id={"clear-group"}
                  type="button"
                  variant="regular"
                  style={classes.spacerRight}
                  onClick={resetForm}
                  label={"Clear"}
                />

                <Button
                  id={"save-group"}
                  type="submit"
                  variant="callAction"
                  disabled={saving || !validGroup}
                  label={"Save"}
                />
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

export default withStyles(styles)(AddGroupScreen);
