// This file is part of MinIO Console Server
// Copyright (c) 2020 MinIO, Inc.
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
import { Button } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import ModalWrapper from "../Common/ModalWrapper/ModalWrapper";
import Grid from "@material-ui/core/Grid";

const styles = (theme: Theme) =>
  createStyles({
    errorBlock: {
      color: "red",
    },
    buttonContainer: {
      textAlign: "right",
    },
  });

interface ICredentialsPromptProps {
  classes: any;
  newServiceAccount: NewServiceAccount | null;
  open: boolean;
  closeModal: () => void;
}

const download = (filename: string, text: string) => {
  let element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

const CredentialsPrompt = ({
  classes,
  newServiceAccount,
  open,
  closeModal,
}: ICredentialsPromptProps) => {
  if (!newServiceAccount) {
    return null;
  }

  return (
    <ModalWrapper
      modalOpen={open}
      onClose={() => {
        closeModal();
      }}
      title="New Service Account Created"
    >
      <React.Fragment>
        <Grid container>
          <Grid item xs={12} className={classes.formScrollable}>
            A new service account has been created with the following details:
            <ul>
              <li>
                <b>Access Key:</b> {newServiceAccount.accessKey}
              </li>
              <li>
                <b>Secret Key:</b> {newServiceAccount.secretKey}
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
          </Grid>
          <Grid item xs={12} className={classes.buttonContainer}>
            <Button
              onClick={() => {
                download(
                  "credentials.json",
                  JSON.stringify({
                    access_key: newServiceAccount.accessKey,
                    secret_key: newServiceAccount.secretKey,
                  })
                );
              }}
              color="primary"
            >
              Download
            </Button>
            <Button
              onClick={() => {
                closeModal();
              }}
              color="secondary"
              autoFocus
            >
              Done
            </Button>
          </Grid>
        </Grid>
      </React.Fragment>
    </ModalWrapper>
  );
};

export default withStyles(styles)(CredentialsPrompt);
