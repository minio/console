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

import React from "react";
import get from "lodash/get";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { NewServiceAccount } from "./types";
import { Button } from "@mui/material";
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import Grid from "@mui/material/Grid";
import CredentialItem from "./CredentialItem";
import WarnIcon from "../../../../icons/WarnIcon";
import { DownloadIcon, ServiceAccountCredentialsIcon } from "../../../../icons";

const styles = (theme: Theme) =>
  createStyles({
    warningBlock: {
      color: "red",
      fontSize: ".85rem",
      margin: ".5rem 0 .5rem 0",
      display: "flex",
      alignItems: "center",
      "& svg ": {
        marginRight: ".3rem",
        height: 16,
        width: 16,
      },
    },
    credentialTitle: {
      padding: ".8rem 0 0 0",
      fontWeight: 600,
      fontSize: ".9rem",
    },
    buttonContainer: {
      textAlign: "right",
      marginTop: "1rem",
    },
    credentialsPanel: {
      overflowY: "auto",
      maxHeight: 350,
    },
    promptTitle: {
      display: "flex",
      alignItems: "center",
    },
    buttonSpacer: {
      marginRight: ".9rem",
    },
    promptIcon: {
      marginRight: ".1rem",
      display: "flex",
      alignItems: "center",
      height: "2rem",
      width: "2rem",
    },
  });

interface ICredentialsPromptProps {
  classes: any;
  newServiceAccount: NewServiceAccount | null;
  open: boolean;
  entity: string;
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
  entity,
}: ICredentialsPromptProps) => {
  if (!newServiceAccount) {
    return null;
  }
  const consoleCreds = get(newServiceAccount, "console", null);
  const idp = get(newServiceAccount, "idp", false);

  return (
    <ModalWrapper
      modalOpen={open}
      onClose={() => {
        closeModal();
      }}
      title={
        <div className={classes.promptTitle}>
          <div>New {entity} Created</div>
        </div>
      }
      titleIcon={<ServiceAccountCredentialsIcon />}
    >
      <Grid container>
        <Grid item xs={12} className={classes.formScrollable}>
          A new {entity} has been created with the following details:
          {!idp && consoleCreds && (
            <React.Fragment>
              <Grid item xs={12} className={classes.credentialsPanel}>
                <div className={classes.credentialTitle}>
                  Console Credentials
                </div>
                {Array.isArray(consoleCreds) &&
                  consoleCreds.map((credentialsPair, index) => {
                    return (
                      <>
                        <CredentialItem
                          label="Access Key"
                          value={credentialsPair.accessKey}
                        />
                        <CredentialItem
                          label="Secret Key"
                          value={credentialsPair.secretKey}
                        />
                      </>
                    );
                  })}
                {!Array.isArray(consoleCreds) && (
                  <>
                    <CredentialItem
                      label="Access Key"
                      value={consoleCreds.accessKey}
                    />
                    <CredentialItem
                      label="Secret Key"
                      value={consoleCreds.secretKey}
                    />
                  </>
                )}
              </Grid>
            </React.Fragment>
          )}
          {idp ? (
            <div className={classes.warningBlock}>
              Please Login via the configured external identity provider.
            </div>
          ) : (
            <div className={classes.warningBlock}>
              <WarnIcon />
              <span>
                Write these down, as this is the only time the secret will be
                displayed.
              </span>
            </div>
          )}
        </Grid>
        <Grid item xs={12} className={classes.buttonContainer}>
          <Button
            id={"done-button"}
            variant="outlined"
            className={classes.buttonSpacer}
            onClick={() => {
              closeModal();
            }}
            color="primary"
          >
            Done
          </Button>

          {!idp && (
            <Button
              id={"download-button"}
              onClick={() => {
                let consoleExtras = {};

                if (consoleCreds) {
                  if (!Array.isArray(consoleCreds)) {
                    consoleExtras = {
                      console: [
                        {
                          url: consoleCreds.url,
                          access_key: consoleCreds.accessKey,
                          secret_key: consoleCreds.secretKey,
                          api: "s3v4",
                          path: "auto",
                        },
                      ],
                    };
                  } else {
                    const cCreds = consoleCreds.map((itemMap) => {
                      return {
                        url: itemMap.url,
                        access_key: itemMap.accessKey,
                        secret_key: itemMap.secretKey,
                        api: "s3v4",
                        path: "auto",
                      };
                    });

                    consoleExtras = {
                      console: [...cCreds],
                    };
                  }
                }

                download(
                  "credentials.json",
                  JSON.stringify({
                    ...consoleExtras,
                  })
                );
              }}
              endIcon={<DownloadIcon />}
              variant="contained"
              color="primary"
            >
              Download
            </Button>
          )}
        </Grid>
      </Grid>
    </ModalWrapper>
  );
};

export default withStyles(styles)(CredentialsPrompt);
