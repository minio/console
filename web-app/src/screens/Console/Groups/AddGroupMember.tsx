// This file is part of MinIO Console Server
// Copyright (c) 2023 MinIO, Inc.
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

import React, { useState } from "react";
import { AddMembersToGroupIcon, Button, FormLayout, Grid, ReadBox } from "mds";
import { modalStyleUtils } from "../Common/FormComponents/common/styleLibrary";
import { setModalErrorSnackMessage } from "../../../systemSlice";
import { useAppDispatch } from "../../../store";
import { api } from "api";
import { errorToHandler } from "api/errors";
import UsersSelectors from "./UsersSelectors";
import ModalWrapper from "../Common/ModalWrapper/ModalWrapper";

type UserPickerModalProps = {
  title?: string;
  preSelectedUsers?: string[];
  selectedGroup?: string;
  open: boolean;
  onClose: () => void;
  onSaveClick: () => void;
  groupStatus?: string;
};

const AddGroupMember = ({
  title = "",
  groupStatus = "enabled",
  preSelectedUsers = [],
  selectedGroup = "",
  open,
  onClose,
}: UserPickerModalProps) => {
  const dispatch = useAppDispatch();
  const [selectedUsers, setSelectedUsers] = useState(preSelectedUsers);

  function addMembersToGroup() {
    return api.group
      .updateGroup(selectedGroup, {
        members: selectedUsers,
        status: groupStatus,
      })
      .then(() => {
        onClose();
      })
      .catch((err) => {
        onClose();
        dispatch(setModalErrorSnackMessage(errorToHandler(err.error)));
      });
  }

  return (
    <ModalWrapper
      modalOpen={open}
      onClose={onClose}
      title={title}
      titleIcon={<AddMembersToGroupIcon />}
    >
      <FormLayout withBorders={false} containerPadding={false}>
        <ReadBox label={`Selected Group`} sx={{ width: "100%" }}>
          {selectedGroup}
        </ReadBox>
        <UsersSelectors
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
          editMode={!selectedGroup}
        />
      </FormLayout>
      <Grid item xs={12} sx={modalStyleUtils.modalButtonBar}>
        <Button
          id={"reset-add-group-member"}
          type="button"
          variant="regular"
          onClick={() => {
            setSelectedUsers(preSelectedUsers);
          }}
          label={"Reset"}
        />

        <Button
          id={"save-add-group-member"}
          type="button"
          variant="callAction"
          onClick={() => {
            addMembersToGroup();
          }}
          label={"Save"}
        />
      </Grid>
    </ModalWrapper>
  );
};

export default AddGroupMember;
