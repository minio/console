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
import { useNavigate } from "react-router-dom";
import { modalStyleUtils } from "../Common/FormComponents/common/styleLibrary";

import {
  BackLink,
  Button,
  CreateGroupIcon,
  FormLayout,
  Grid,
  InputBox,
  PageLayout,
  ProgressBar,
} from "mds";
import { api } from "api";
import { errorToHandler } from "api/errors";
import { IAM_PAGES } from "../../../common/SecureComponent/permissions";
import { setErrorSnackMessage, setHelpName } from "../../../systemSlice";
import { useAppDispatch } from "../../../store";
import AddGroupHelpBox from "./AddGroupHelpBox";
import UsersSelectors from "./UsersSelectors";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";
import HelpMenu from "../HelpMenu";

const AddGroupScreen = () => {
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
        api.groups
          .addGroup({
            group: groupName,
            members: selectedUsers,
          })
          .then((res) => {
            isSaving(false);
            navigate(`${IAM_PAGES.GROUPS}`);
          })
          .catch((err) => {
            isSaving(false);
            dispatch(setErrorSnackMessage(errorToHandler(err.error)));
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

  useEffect(() => {
    dispatch(setHelpName("add_group"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <PageHeaderWrapper
        label={
          <BackLink
            label={"Groups"}
            onClick={() => navigate(IAM_PAGES.GROUPS)}
          />
        }
        actions={<HelpMenu />}
      />
      <PageLayout>
        <FormLayout
          title={"Create Group"}
          icon={<CreateGroupIcon />}
          helpBox={<AddGroupHelpBox />}
        >
          <form noValidate autoComplete="off" onSubmit={setSaving}>
            <InputBox
              id="group-name"
              name="group-name"
              label="Group Name"
              autoFocus={true}
              value={groupName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setGroupName(e.target.value);
              }}
            />
            <UsersSelectors
              selectedUsers={selectedUsers}
              setSelectedUsers={setSelectedUsers}
              editMode={true}
            />
            <Grid item xs={12} sx={modalStyleUtils.modalButtonBar}>
              <Button
                id={"clear-group"}
                type="button"
                variant="regular"
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
                <ProgressBar />
              </Grid>
            )}
          </form>
        </FormLayout>
      </PageLayout>
    </Fragment>
  );
};

export default AddGroupScreen;
