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

import React, { useState, useEffect } from "react";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import {Button, Dialog, DialogContent, DialogTitle, LinearProgress, TextField} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import api from "../../../common/api";
import UsersSelectors from "./UsersSelectors";

interface IGroupProps {
    open: boolean;
    selectedGroup: any;
    closeModalAndRefresh: any;
    classes: any;
}

const styles = (theme: Theme) =>
    createStyles({
        errorBlock: {
            color: "red"
        },
        strongText: {
            fontWeight: 700,
        },
        keyName: {
            marginLeft: 5
        }
    });

const AddGroup = ({
      open,
      selectedGroup,
      closeModalAndRefresh,
      classes,
  }: IGroupProps) => {
    const [groupName, setGroupName] = useState<string>("");
    const [userList, setUserList] = useState<any[]>([]);
    const [usersSelected, setUsersSelected] = useState<string[]>([]);
    const [saving, isSaving] = useState<boolean>(false);
    const [addError, setError] = useState<string>("");
    const [userListLoading, setUserListLoading] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);

    useEffect(() => {
        if(selectedGroup) {
            setGroupName(selectedGroup);
        }
    }, [selectedGroup]);

    useEffect(() => {
        if(saving) {
            saveRecord();
        }
    }, [saving]);

    const setSaving = (event: React.FormEvent) => {
        event.preventDefault();

        isSaving(true);
    }

    const saveRecord = () => {
        if (selectedGroup !== null) {
            api
                .invoke("PUT", `/api/v1/groups/${selectedGroup.name}`, {
                    group: groupName,
                    members: usersSelected,
                })
                .then(res => {
                    isSaving(false);
                    setError("");
                    closeModalAndRefresh();
                })
                .catch(err => {
                    isSaving(false);
                    setError(err);
                });
        } else {
            api.invoke("POST", "/api/v1/groups", {
                    group: groupName,
                    members: usersSelected,
                })
                .then(res => {
                    isSaving(false);
                    setError("");
                    closeModalAndRefresh();
                })
                .catch(err => {
                    isSaving(false);
                    setError(err);
                });
        }
    }

    return (<Dialog
        open={open}
        onClose={closeModalAndRefresh}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">
            {selectedGroup !== null ? 'Edit Group' : 'Add Group'}
        </DialogTitle>
        <DialogContent>
            <form
                noValidate
                autoComplete="off"
                onSubmit={setSaving}
            >
                <Grid container>
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

                    {selectedGroup !== null ? (
                        <React.Fragment>
                            <span className={classes.strongText}>Group Name:</span>
                            <span className={classes.keyName}>{` ${groupName}`}</span>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <Grid item xs={12}>
                                <TextField
                                    id="standard-basic"
                                    fullWidth
                                    label="Name"
                                    value={groupName}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setGroupName(e.target.value);
                                    }}
                                />
                            </Grid>
                        </React.Fragment>
                    )}
                    <Grid item xs={12}>
                        <br />
                    </Grid>
                    <Grid item xs={12}>
                        <UsersSelectors
                            records={userList}
                            selectedUsers={selectedUsers}
                            setSelectedUsers={setSelectedUsers}
                            loading={userListLoading}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={saving}
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
        </DialogContent>
    </Dialog>);
};

export default withStyles(styles)(AddGroup);
