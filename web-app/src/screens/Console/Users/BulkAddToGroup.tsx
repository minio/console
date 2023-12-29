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
import {
  AddMembersToGroupIcon,
  Button,
  FormLayout,
  Grid,
  ProgressBar,
  ReadBox,
} from "mds";

import { modalStyleUtils } from "../Common/FormComponents/common/styleLibrary";
import { ErrorResponseHandler } from "../../../common/types";
import api from "../../../common/api";
import GroupsSelectors from "./GroupsSelectors";
import ModalWrapper from "../Common/ModalWrapper/ModalWrapper";
import { setModalErrorSnackMessage } from "../../../systemSlice";
import { useAppDispatch } from "../../../store";

interface IAddToGroup {
  open: boolean;
  checkedUsers: any;
  closeModalAndRefresh: any;
}

const BulkAddToGroup = ({
  open,
  checkedUsers,
  closeModalAndRefresh,
}: IAddToGroup) => {
  const dispatch = useAppDispatch();
  //Local States
  const [saving, isSaving] = useState<boolean>(false);
  const [accepted, setAccepted] = useState<boolean>(false);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  //Effects
  useEffect(() => {
    if (saving) {
      if (selectedGroups.length > 0) {
        api
          .invoke("PUT", "/api/v1/users-groups-bulk", {
            groups: selectedGroups,
            users: checkedUsers,
          })
          .then(() => {
            isSaving(false);
            setAccepted(true);
          })
          .catch((err: ErrorResponseHandler) => {
            isSaving(false);
            dispatch(setModalErrorSnackMessage(err));
          });
      } else {
        isSaving(false);
        dispatch(
          setModalErrorSnackMessage({
            errorMessage: "You need to select at least one group to assign",
            detailedError: "",
          }),
        );
      }
    }
  }, [
    saving,
    isSaving,
    closeModalAndRefresh,
    selectedGroups,
    checkedUsers,
    dispatch,
  ]);

  //Fetch Actions
  const setSaving = (event: React.FormEvent) => {
    event.preventDefault();

    isSaving(true);
  };

  const resetForm = () => {
    setSelectedGroups([]);
  };

  return (
    <ModalWrapper
      modalOpen={open}
      onClose={() => {
        closeModalAndRefresh(accepted);
      }}
      title={
        accepted
          ? "The selected users were added to the following groups."
          : "Add Users to Group"
      }
      titleIcon={<AddMembersToGroupIcon />}
    >
      {accepted ? (
        <React.Fragment>
          <FormLayout
            withBorders={false}
            containerPadding={false}
            sx={{ margin: "30px 0" }}
          >
            <ReadBox label={"Groups"} sx={{ width: "100%" }}>
              {selectedGroups.join(", ")}
            </ReadBox>
            <ReadBox label={"Users"} sx={{ width: "100%" }}>
              {" "}
              {checkedUsers.join(", ")}{" "}
            </ReadBox>
          </FormLayout>
        </React.Fragment>
      ) : (
        <form noValidate autoComplete="off" onSubmit={setSaving}>
          <FormLayout withBorders={false} containerPadding={false}>
            <ReadBox label={"Selected Users"} sx={{ width: "100%" }}>
              {checkedUsers.join(", ")}
            </ReadBox>
            <GroupsSelectors
              selectedGroups={selectedGroups}
              setSelectedGroups={setSelectedGroups}
            />
          </FormLayout>
          <Grid item xs={12} sx={modalStyleUtils.modalButtonBar}>
            <Button
              id={"clear-bulk-add-group"}
              type="button"
              variant="regular"
              color="primary"
              onClick={resetForm}
              label={"Clear"}
            />
            <Button
              id={"save-add-group"}
              type="submit"
              variant="callAction"
              disabled={saving || selectedGroups.length < 1}
              label={"Save"}
            />
          </Grid>
          {saving && (
            <Grid item xs={12}>
              <ProgressBar />
            </Grid>
          )}
        </form>
      )}
    </ModalWrapper>
  );
};

export default BulkAddToGroup;
