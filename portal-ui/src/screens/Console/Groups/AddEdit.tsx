// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
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

import React, { useEffect, useState } from "react";
import { GroupInfo, fetchGroupInfo } from "./Utils";
import { useParams } from "react-router";
import { useAsync } from "react-async-hook";
import { useDispatch } from "react-redux";
import FormSwitchWrapper from "../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import Grid from "@mui/material/Grid";
import InputBoxWrapper from "../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import PredefinedList from "../Common/FormComponents/PredefinedList/PredefinedList";
import UsersSelectors from "./UsersSelectors";
import { Box, Button } from "@mui/material";
import api from "../../../common/api";
import { ErrorResponseHandler } from "../../../common/types";
import { setModalErrorSnackMessage, setSnackBarMessage } from "../../../actions";
import history from "../../../history";
import createStyles from "@mui/styles/createStyles";
import { actionsTray } from "../Common/FormComponents/common/styleLibrary";
import withStyles from "@mui/styles/withStyles";
import GroupPageHeader from "./GroupPageHeader";
import FormTitle from "./FormTitle";
import ReturnToGroups from "./ReturnToGroups";
import { GroupsIcon } from "../../../icons";
import { groupPageStyles } from "./Styles";


const styles = () =>
  createStyles({
    ...actionsTray,
    ...groupPageStyles
  });

type AddEditProps = {
  classes?: any,
}
const AddEdit = ({
                   classes = {}
                 }: AddEditProps) => {

  const {
    groupName: selectedGroup = ""
  } = useParams<{ groupName?: string }>();

  const dispatch = useDispatch();

  const {
    error,
    result = {}
  } = useAsync(async () => {
    // Add scenario.
    if (!selectedGroup) {
      return {};
    } else {
      //Edit scenario.
      return fetchGroupInfo(selectedGroup);
    }
  }, [selectedGroup]);


  if (error) {
    // @ts-ignore
    dispatch(setModalErrorSnackMessage(error));
  }

  const {
    name: editGroupName = "",
    members: editSelectedUsers = [],
    status: groupStatus
  } = result as GroupInfo;

  const [groupEnabled, setGroupEnabled] = useState<boolean>(false);
  const [groupName, setGroupName] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [validGroup, setValidGroup] = useState<boolean>(false);
  const [saving, isSaving] = useState<boolean>(false);

  const onFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    isSaving(true);
    saveOrUpdate();
  };
  const onResetForm = () => {
    if (selectedGroup === "") {
      setGroupName("");
    }

    setSelectedUsers([]);
  };


  useEffect(() => {
    setGroupEnabled(groupStatus === "enabled");
    setGroupName(editGroupName);
    setSelectedUsers(editSelectedUsers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupStatus, editGroupName, editSelectedUsers.length]);

  const isEditMode = selectedGroup !== "";

  useEffect(() => {
    if (isEditMode) {
      setValidGroup(true);
    }
  }, [isEditMode]);


  const saveOrUpdate = () => {
    const httpMethod = isEditMode ? "PUT" : "POST";
    const httpUrl = isEditMode ? `/api/v1/group?name=${encodeURI(groupName)}` : "/api/v1/groups";

    let requestData;
    if (isEditMode) {
      requestData = {
        group: groupName,
        members: selectedUsers,
        status: groupEnabled ? "enabled" : "disabled"
      };
    } else {
      requestData = {
        group: groupName,
        members: selectedUsers
      };
    }

    api
      .invoke(httpMethod, httpUrl, requestData)
      .then(async () => {
        isSaving(false);
        if (!isEditMode) {
          //New -> Save -> Edit
          history.push(`/groups/edit/${groupName}`);
        }
        dispatch(setSnackBarMessage(`Successfully saved.`));
      })
      .catch((err: ErrorResponseHandler) => {
        isSaving(false);
        dispatch(setModalErrorSnackMessage(err));
      });
  };

  return (
    <React.Fragment>
      <GroupPageHeader />

      <Grid container>
        <Grid item xs={12} className={classes.pageContainer}>
          <ReturnToGroups />
          <Box className={classes.pageBox}>

            <FormTitle title={isEditMode ? "Edit Group" : "Create Group"} icon={<GroupsIcon />}
                       rightItems={isEditMode ? (<div className={classes.titleRightItems}>
                         <FormSwitchWrapper
                           indicatorLabels={["Enabled", "Disabled"]}
                           checked={groupEnabled}
                           value={"group_enabled"}
                           id="group-status"
                           name="group-status"
                           onChange={(e) => {
                             setGroupEnabled(e.target.checked);
                           }}
                           switchOnly
                         />
                       </div>) : null} />


            <form noValidate autoComplete="off" onSubmit={onFormSubmit}>
              <Grid container>
                <Grid item xs={12}>
                  {!isEditMode ? (
                    <Grid item xs={12} className={classes.fieldContainer}>
                      <InputBoxWrapper
                        id="group-name"
                        name="group-name"
                        label="Group Name"
                        value={groupName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const groupNameText = e.target.value.trim();
                          setGroupName(groupNameText);
                          if (groupNameText) {
                            setValidGroup(true);
                          }
                        }}
                      />
                    </Grid>
                  ) : (
                    <Grid item xs={12} className={classes.fieldContainer}>
                      <PredefinedList label={"Group Name"} content={selectedGroup} />
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <UsersSelectors
                      classes={{
                        paper: classes.multiSelectorPaper,
                        tableBlock: classes.tableBlock,
                        multiSelectTable: classes.multiSelectTable,
                        filterField: classes.filterField
                      }}
                      selectedUsers={selectedUsers}
                      setSelectedUsers={setSelectedUsers}
                      editMode={isEditMode}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12} className={classes.buttonBar}>
                  <Button
                    type="button"
                    color="primary"
                    disableRipple={true}
                    variant="outlined"
                    onClick={onResetForm}
                  >
                    Clear
                  </Button>
                  <Button
                    type="submit"
                    disableRipple={true}
                    variant="contained"
                    color="primary"
                    disabled={saving || !validGroup}
                  >
                    Save
                  </Button>
                </Grid>

              </Grid>
            </form>

          </Box>

        </Grid>

      </Grid>
    </React.Fragment>

  );

};

export default withStyles(styles)(AddEdit);
