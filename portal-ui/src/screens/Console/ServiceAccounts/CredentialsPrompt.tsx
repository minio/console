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

import React from "react";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { NewServiceAccount } from "./types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

const styles = (theme: Theme) =>
  createStyles({
    errorBlock: {
      color: "red"
    }
  });

interface ICredentialsPromptProps {
  classes: any;
  newServiceAccount: NewServiceAccount | null;
  open: boolean;
  closeModal: () => void;
}

interface ICredentialsPromptState {}

class CredentialsPrompt extends React.Component<
  ICredentialsPromptProps,
  ICredentialsPromptState
> {
  state: ICredentialsPromptState = {};

    download(filename:string, text:string) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

  render() {
    const { classes, open, newServiceAccount } = this.props;

    if (newServiceAccount === null) {
      return <div />;
    }

    return (
      <Dialog
        open={open}
        onClose={() => {
          this.props.closeModal();
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">New Service Account</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            A new service account has been created with the following details:
            <ul>
              <li>
                <b>Access Key:</b>{" "}
                {newServiceAccount.service_account.access_key}
              </li>
              <li>
                <b>Secret Key:</b> {newServiceAccount.secret_key}
              </li>
            </ul>
            <Typography
              component="p"
              variant="body1"
              className={classes.errorBlock}
            >
              Write these down, as this is the only time the secret will be
              displayed.
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              this.download("credentials.json",JSON.stringify({
                  access_key: newServiceAccount.service_account.access_key,
                  secret_key: newServiceAccount.secret_key,
              }))
            }}
            color="primary"
          >
            Download
          </Button>
          <Button
            onClick={() => {
              this.props.closeModal();
            }}
            color="secondary"
            autoFocus
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(CredentialsPrompt);
