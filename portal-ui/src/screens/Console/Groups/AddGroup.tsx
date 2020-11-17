// This file is part of MinIO Console Server
// Copyright (c) 2019 MinIO, Inc.
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
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { Button, LinearProgress } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {
  modalBasic,
  predefinedList,
} from "../Common/FormComponents/common/styleLibrary";
import api from "../../../common/api";
import UsersSelectors from "./UsersSelectors";
import ModalWrapper from "../Common/ModalWrapper/ModalWrapper";
import InputBoxWrapper from "../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import FormSwitchWrapper from "../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";

interface IGroupProps {
  open: boolean;
  selectedGroup: any;
  closeModalAndRefresh: any;
  classes: any;
}

interface MainGroupProps {
  members: string[];
  name: string;
  status: string;
}

const styles = (theme: Theme) =>
  createStyles({
    errorBlock: {
      color: "red",
    },
    strongText: {
      fontWeight: 700,
    },
    keyName: {
      marginLeft: 5,
    },
    buttonContainer: {
      textAlign: "right",
    },
    ...modalBasic,
    ...predefinedList,
  });

const AddGroup = ({
  open,
  selectedGroup,
  closeModalAndRefresh,
  classes,
}: IGroupProps) => {
  //Local States
  const [groupName, setGroupName] = useState<string>("");
  const [groupEnabled, setGroupEnabled] = useState<boolean>(false);
  const [saving, isSaving] = useState<boolean>(false);
  const [addError, setError] = useState<string>("");
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
            .invoke("PUT", `/api/v1/groups/${groupName}`, {
              group: groupName,
              members: selectedUsers,
              status: groupEnabled ? "enabled" : "disabled",
            })
            .then((res) => {
              isSaving(false);
              setError("");
              closeModalAndRefresh();
            })
            .catch((err) => {
              isSaving(false);
              setError(err);
            });
        } else {
          api
            .invoke("POST", "/api/v1/groups", {
              group: groupName,
              members: selectedUsers,
            })
            .then((res) => {
              isSaving(false);
              setError("");
              closeModalAndRefresh();
            })
            .catch((err) => {
              isSaving(false);
              setError(err);
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
  ]);

  useEffect(() => {
    if (selectedGroup && loadingGroup) {
      const fetchGroupInfo = () => {
        api
          .invoke("GET", `/api/v1/groups/${selectedGroup}`)
          .then((res: MainGroupProps) => {
            setGroupEnabled(res.status === "enabled");
            setGroupName(res.name);
            setSelectedUsers(res.members);
          })
          .catch((err) => {
            setError(err);
            isLoadingGroup(false);
          });
      };
      fetchGroupInfo();
    }
  }, [loadingGroup, selectedGroup]);

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
            {addError !== "" && (
              <Grid item xs={12}>
                <Typography
                  component="p"
                  variant="body1"
                  className={classes.errorBlock}
                >
                  {addError}
                </Typography>
              </Grid>
            )}

            {selectedGroup === null ? (
              <React.Fragment>
                <Grid item xs={12}>
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
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Grid item xs={12} className={classes.predefinedTitle}>
                  Group Name
                </Grid>
                <Grid item xs={12} className={classes.predefinedList}>
                  {selectedGroup}
                </Grid>
              </React.Fragment>
            )}
            <Grid item xs={12}>
              <UsersSelectors
                selectedUsers={selectedUsers}
                setSelectedUsers={setSelectedUsers}
                editMode={selectedGroup !== null}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} className={classes.buttonContainer}>
            <button
              type="button"
              color="primary"
              className={classes.clearButton}
              onClick={resetForm}
            >
              Clear
            </button>
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

export default withStyles(styles)(AddGroup);
