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

import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import { UnControlled as CodeMirror } from "react-codemirror2";
import Typography from "@material-ui/core/Typography";
import { Button, LinearProgress } from "@material-ui/core";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { modalBasic } from "../Common/FormComponents/common/styleLibrary";
import ModalWrapper from "../Common/ModalWrapper/ModalWrapper";
import api from "../../../common/api";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import { NewServiceAccount } from "./types";

require("codemirror/mode/javascript/javascript");

const styles = (theme: Theme) =>
  createStyles({
    errorBlock: {
      color: "red",
    },
    jsonPolicyEditor: {
      minHeight: 400,
      width: "100%",
    },
    codeMirror: {
      fontSize: 14,
    },
    buttonContainer: {
      textAlign: "right",
    },
    ...modalBasic,
  });

interface IAddServiceAccountProps {
  classes: any;
  open: boolean;
  closeModalAndRefresh: (res: NewServiceAccount | null) => void;
}

const AddServiceAccount = ({
  classes,
  open,
  closeModalAndRefresh,
}: IAddServiceAccountProps) => {
  const [addSending, setAddSending] = useState(false);
  const [addError, setAddError] = useState("");
  const [policyDefinition, setPolicyDefinition] = useState("");

  useEffect(() => {
    if (addSending) {
      api
        .invoke("POST", "/api/v1/service-accounts", {
          policy: policyDefinition,
        })
        .then((res) => {
          setAddSending(false);
          setAddError("");
          closeModalAndRefresh(res);
        })
        .catch((err) => {
          setAddSending(false);
          setAddError(err);
        });
    }
  }, [
    addSending,
    setAddSending,
    setAddError,
    policyDefinition,
    closeModalAndRefresh,
  ]);

  const addServiceAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setAddSending(true);
  };

  return (
    <ModalWrapper
      modalOpen={open}
      onClose={() => {
        closeModalAndRefresh(null);
      }}
      title={`Create Service Account`}
    >
      <form
        noValidate
        autoComplete="off"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          addServiceAccount(e);
        }}
      >
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
            <Grid item xs={12}>
              <CodeMirror
                className={classes.codeMirror}
                options={{
                  mode: "javascript",
                  lineNumbers: true,
                }}
                onChange={(editor, data, value) => {
                  setPolicyDefinition(value);
                }}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} className={classes.buttonContainer}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={addSending}
            >
              Create
            </Button>
          </Grid>
          {addSending && (
            <Grid item xs={12}>
              <LinearProgress />
            </Grid>
          )}
        </Grid>
      </form>
    </ModalWrapper>
  );
};

export default withStyles(styles)(AddServiceAccount);
