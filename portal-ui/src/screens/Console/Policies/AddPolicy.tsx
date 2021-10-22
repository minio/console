// This file is part of MinIO Kubernetes Cloud
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
import Grid from "@mui/material/Grid";
import { Button, LinearProgress } from "@mui/material";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import api from "../../../common/api";
import { Policy } from "./types";
import { setModalErrorSnackMessage } from "../../../actions";
import {
  fieldBasic,
  modalBasic,
} from "../Common/FormComponents/common/styleLibrary";
import { ErrorResponseHandler } from "../../../common/types";
import ModalWrapper from "../Common/ModalWrapper/ModalWrapper";
import InputBoxWrapper from "../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import CodeMirrorWrapper from "../Common/FormComponents/CodeMirrorWrapper/CodeMirrorWrapper";

const styles = (theme: Theme) =>
  createStyles({
    jsonPolicyEditor: {
      minHeight: 400,
      width: "100%",
    },
    buttonContainer: {
      textAlign: "right",
    },
    ...modalBasic,
    ...fieldBasic,
  });

interface IAddPolicyProps {
  classes: any;
  open: boolean;
  closeModalAndRefresh: (refresh: boolean) => void;
  policyEdit: Policy;
  setModalErrorSnackMessage: typeof setModalErrorSnackMessage;
}

const AddPolicy = ({
  classes,
  open,
  closeModalAndRefresh,
  policyEdit,
  setModalErrorSnackMessage,
}: IAddPolicyProps) => {
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [policyName, setPolicyName] = useState<string>("");
  const [policyDefinition, setPolicyDefinition] = useState<string>("");

  const addRecord = (event: React.FormEvent) => {
    event.preventDefault();
    if (addLoading) {
      return;
    }
    setAddLoading(true);
    api
      .invoke("POST", "/api/v1/policies", {
        name: policyName,
        policy: policyDefinition,
      })
      .then((res) => {
        setAddLoading(false);

        closeModalAndRefresh(true);
      })
      .catch((err: ErrorResponseHandler) => {
        setAddLoading(false);
        setModalErrorSnackMessage(err);
      });
  };

  useEffect(() => {
    if (policyEdit) {
      setPolicyName(policyEdit.name);
      setPolicyDefinition(
        policyEdit ? JSON.stringify(JSON.parse(policyEdit.policy), null, 4) : ""
      );
    }
  }, [policyEdit]);

  const resetForm = () => {
    setPolicyName("");
    setPolicyDefinition("");
  };

  const validSave = policyName.trim() !== "";

  return (
    <ModalWrapper
      modalOpen={open}
      onClose={() => {
        closeModalAndRefresh(false);
      }}
      title={`${policyEdit ? "Info" : "Create"} Policy`}
    >
      <form
        noValidate
        autoComplete="off"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          addRecord(e);
        }}
      >
        <Grid container>
          <Grid item xs={12} className={classes.formScrollable}>
            <Grid item xs={12}>
              <InputBoxWrapper
                id="policy-name"
                name="policy-name"
                label="Policy Name"
                placeholder="Enter Policy Name"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPolicyName(e.target.value);
                }}
                value={policyName}
                disabled={!!policyEdit}
              />
            </Grid>
            <Grid item xs={12}>
              <br />
            </Grid>
            <CodeMirrorWrapper
              label={`${policyEdit ? "Edit" : "Write"} Policy`}
              value={policyDefinition}
              onBeforeChange={(editor, data, value) => {
                setPolicyDefinition(value);
              }}
            />
          </Grid>
          <Grid item xs={12} className={classes.buttonContainer}>
            {!policyEdit && (
              <button
                type="button"
                color="primary"
                className={classes.clearButton}
                onClick={() => {
                  resetForm();
                }}
              >
                Clear
              </button>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={addLoading || !validSave}
            >
              Save
            </Button>
          </Grid>
          {addLoading && (
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

export default withStyles(styles)(connector(AddPolicy));
