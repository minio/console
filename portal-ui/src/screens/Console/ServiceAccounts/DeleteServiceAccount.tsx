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
import { ServiceAccount, ServiceAccountsList } from "./types";
import Typography from "@material-ui/core/Typography";

const styles = (theme: Theme) =>
    createStyles({
        errorBlock: {
            color: "red"
        },
        wrapText: {
            maxWidth: "200px",
            whiteSpace: "normal",
            wordWrap: "break-word"
        }
    });

interface IDeleteServiceAccountProps {
    classes: any;
    closeDeleteModalAndRefresh: (refresh: boolean) => void;
    deleteOpen: boolean;
    selectedServiceAccount: ServiceAccount | null;
}

interface IDeleteServiceAccountState {
    deleteLoading: boolean;
    deleteError: string;
}

class DeleteServiceAccount extends React.Component<
    IDeleteServiceAccountProps,
    IDeleteServiceAccountState
    > {
    state: IDeleteServiceAccountState = {
        deleteLoading: false,
        deleteError: ""
    };

    removeRecord() {
        const { deleteLoading } = this.state;
        const { selectedServiceAccount } = this.props;
        if (deleteLoading) {
            return;
        }
        if (selectedServiceAccount == null) {
            return;
        }
        this.setState({ deleteLoading: true }, () => {
            api
                .invoke("DELETE", `/api/v1/service_accounts/${selectedServiceAccount.id}`, {
                    id: selectedServiceAccount.id
                })
                .then((res: ServiceAccountsList) => {
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
        const { classes, deleteOpen, selectedServiceAccount } = this.props;
        const { deleteLoading, deleteError } = this.state;

        if (selectedServiceAccount === null) {
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
                <DialogTitle id="alert-dialog-title">Delete ServiceAccount</DialogTitle>
                <DialogContent>
                    {deleteLoading && <LinearProgress />}
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete service account{" "}
                        <b className={classes.wrapText}>{selectedServiceAccount.name}</b>?
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

export default withStyles(styles)(DeleteServiceAccount);
