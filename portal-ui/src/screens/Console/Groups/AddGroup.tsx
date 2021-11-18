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
import { connect } from "react-redux";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Button, LinearProgress } from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  formFieldStyles,
  modalBasic,
  spacingUtils,
} from "../Common/FormComponents/common/styleLibrary";
import { setModalErrorSnackMessage } from "../../../actions";
import { ErrorResponseHandler } from "../../../common/types";
import api from "../../../common/api";
import UsersSelectors from "./UsersSelectors";
import ModalWrapper from "../Common/ModalWrapper/ModalWrapper";
import InputBoxWrapper from "../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import FormSwitchWrapper from "../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import PredefinedList from "../Common/FormComponents/PredefinedList/PredefinedList";

interface IGroupProps {
  open: boolean;
  selectedGroup: any;
  closeModalAndRefresh: any;
  classes: any;
  setModalErrorSnackMessage: typeof setModalErrorSnackMessage;
}

interface MainGroupProps {
  members: string[];
  name: string;
  status: string;
}

const styles = (theme: Theme) =>
  createStyles({
    strongText: {
      fontWeight: 700,
    },
    keyName: {
      marginLeft: 5,
    },
    buttonContainer: {
      textAlign: "right",
    },
    ...formFieldStyles,
    ...spacingUtils,
    ...modalBasic,
  });

const AddGroup = ({
  open,
  selectedGroup,
  closeModalAndRefresh,
  classes,
  setModalErrorSnackMessage,
}: IGroupProps) => {
  //Local States
  const [groupName, setGroupName] = useState<string>("");
  const [groupEnabled, setGroupEnabled] = useState<boolean>(false);
  const [saving, isSaving] = useState<boolean>(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [loadingGroup, isLoadingGroup] = useState<boolean>(false);
  const [validGroup, setValidGroup] = useState<boolean>(false);

  //Effects
  useEffect(() => {
    if (selectedGroup !== null) {
      isLoadingGroup(true);
    } else {
      setGroupName("");
      setSelectedUsers([]);
    }
  }, [selectedGroup]);

  useEffect(() => {
    setValidGroup(groupName.trim() !== "");
  }, [groupName, selectedUsers]);

  useEffect(() => {
    if (saving) {
      const saveRecord = () => {
        if (selectedGroup !== null) {
          api
            .invoke("PUT", `/api/v1/group?name=${encodeURI(groupName)}`, {
              group: groupName,
              members: selectedUsers,
              status: groupEnabled ? "enabled" : "disabled",
            })
            .then((res) => {
              isSaving(false);
              closeModalAndRefresh();
            })
            .catch((err: ErrorResponseHandler) => {
              isSaving(false);
              setModalErrorSnackMessage(err);
            });
        } else {
          api
            .invoke("POST", "/api/v1/groups", {
              group: groupName,
              members: selectedUsers,
            })
            .then((res) => {
              isSaving(false);
              closeModalAndRefresh();
            })
            .catch((err: ErrorResponseHandler) => {
              isSaving(false);
              setModalErrorSnackMessage(err);
            });
        }
      };
      saveRecord();
    }
  }, [
    saving,
    groupName,
    selectedUsers,
    groupEnabled,
    selectedGroup,
    closeModalAndRefresh,
    setModalErrorSnackMessage,
  ]);

  useEffect(() => {
    if (selectedGroup && loadingGroup) {
      const fetchGroupInfo = () => {
        api
          .invoke("GET", `/api/v1/group?name=${encodeURI(selectedGroup)}`)
          .then((res: MainGroupProps) => {
            setGroupEnabled(res.status === "enabled");
            setGroupName(res.name);
            setSelectedUsers(res.members);
          })
          .catch((err: ErrorResponseHandler) => {
            setModalErrorSnackMessage(err);
            isLoadingGroup(false);
          });
      };
      fetchGroupInfo();
    }
  }, [loadingGroup, selectedGroup, setModalErrorSnackMessage]);

  //Fetch Actions
  const setSaving = (event: React.FormEvent) => {
    event.preventDefault();

    isSaving(true);
  };

  const resetForm = () => {
    if (selectedGroup === null) {
      setGroupName("");
    }

    setSelectedUsers([]);
  };

  return (
    <ModalWrapper
      modalOpen={open}
      onClose={closeModalAndRefresh}
      title={selectedGroup !== null ? `Edit Group` : "Create Group"}
    >
      {selectedGroup !== null && (
        <div className={classes.floatingEnabled}>
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
        </div>
      )}
      <form noValidate autoComplete="off" onSubmit={setSaving}>
        <Grid container>
          <Grid item xs={12} className={classes.formScrollable}>
            {selectedGroup === null ? (
              <Grid item xs={12} className={classes.formFieldRow}>
                <InputBoxWrapper
                  id="group-name"
                  name="group-name"
                  label="Group Name"
                  value={groupName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setGroupName(e.target.value);
                  }}
                />
              </Grid>
            ) : (
              <React.Fragment>
                <PredefinedList label={"Group Name"} content={selectedGroup} />
              </React.Fragment>
            )}
            <Grid item xs={12}>
              <UsersSelectors
                classes={classes}
                selectedUsers={selectedUsers}
                setSelectedUsers={setSelectedUsers}
                editMode={selectedGroup !== null}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} className={classes.buttonContainer}>
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
        </Grid>
      </form>
    </ModalWrapper>
  );
};

const mapDispatchToProps = {
  setModalErrorSnackMessage,
};

const connector = connect(null, mapDispatchToProps);

export default withStyles(styles)(connector(AddGroup));
