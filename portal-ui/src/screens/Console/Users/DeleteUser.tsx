// This file is part of MinIO Kubernetes Cloud
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

import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    LinearProgress
} from "@material-ui/core";
import api from "../../../common/api";
import { User, UsersList } from "./types";
import Typography from "@material-ui/core/Typography";

const styles = (theme: Theme) =>
    createStyles({
        errorBlock: {
            color: "red"
        }
    });

interface IDeleteUserProps {
    classes: any;
    closeDeleteModalAndRefresh: (refresh: boolean) => void;
    deleteOpen: boolean;
    selectedUser: User | null;
}

interface IDeleteUserState {
    deleteLoading: boolean;
    deleteError: string;
}

class DeleteUser extends React.Component<
    IDeleteUserProps,
    IDeleteUserState
    > {
    state: IDeleteUserState = {
        deleteLoading: false,
        deleteError: ""
    };

    removeRecord() {
        const { deleteLoading } = this.state;
        const { selectedUser } = this.props;
        if (deleteLoading) {
            return;
        }
        if (selectedUser == null) {
            return;
        }
        this.setState({ deleteLoading: true }, () => {
            api
                .invoke("DELETE", `/api/v1/users/${selectedUser.id}`, {
                    id: selectedUser.id
                })
                .then((res: UsersList) => {
                    this.setState(
                        {
                            deleteLoading: false,
                            deleteError: ""
                        },
                        () => {
                            this.props.closeDeleteModalAndRefresh(true);
                        }
                    );
                })
                .catch(err => {
                    this.setState({
                        deleteLoading: false,
                        deleteError: err
                    });
                });
        });
    }

    render() {
        const { classes, deleteOpen, selectedUser } = this.props;
        const { deleteLoading, deleteError } = this.state;

        if (selectedUser === null) {
            return <div />;
        }

        return (
            <Dialog
                open={deleteOpen}
                onClose={() => {
                    this.setState({ deleteError: "" }, () => {
                        this.props.closeDeleteModalAndRefresh(false);
                    });
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Delete User</DialogTitle>
                <DialogContent>
                    {deleteLoading && <LinearProgress />}
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete user{" "}<b>{selectedUser.name}</b>?
                        {deleteError !== "" && (
                            <React.Fragment>
                                <br />
                                <Typography
                                    component="p"
                                    variant="body1"
                                    className={classes.errorBlock}
                                >
                                    {deleteError}
                                </Typography>
                            </React.Fragment>
                        )}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            this.setState({ deleteError: "" }, () => {
                                this.props.closeDeleteModalAndRefresh(false);
                            });
                        }}
                        color="primary"
                        disabled={deleteLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            this.removeRecord();
                        }}
                        color="secondary"
                        autoFocus
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(styles)(DeleteUser);
