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

import React, { useState } from "react";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import { Button, Grid } from "@mui/material";
import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { modalBasic } from "../../Common/FormComponents/common/styleLibrary";
import { connect } from "react-redux";
import api from "../../../../common/api";
import { ErrorResponseHandler } from "../../../../common/types";
import { setErrorSnackMessage } from "../../../../actions";
import { AppState } from "../../../../store";
import SelectWrapper from "../../Common/FormComponents/SelectWrapper/SelectWrapper";

const mapState = (state: AppState) => ({
  session: state.console.session,
});

const connector = connect(mapState, { setErrorSnackMessage });

interface IAddAccessRule {
  classes: any;
  modalOpen: boolean;
  onClose: () => any;
  bucket: string;
}

const styles = (theme: Theme) =>
  createStyles({
    buttonContainer: {
      textAlign: "right",
    },
    pathLabel: {
      marginTop: 0,
      marginBottom: 32,
    },
    ...modalBasic,
  });

const AddAccessRule = ({
  modalOpen,
  onClose,
  classes,
  bucket,
}: IAddAccessRule) => {
  const [prefix, setPrefix] = useState("");
  const [selectedAccess, setSelectedAccess] = useState<any>("readonly");

  const accessOptions = [
    { label: "readonly", value: "readonly" },
    { label: "writeonly", value: "writeonly" },
    { label: "readwrite", value: "readwrite" },
  ];

  const resetForm = () => {
    setPrefix("");
    setSelectedAccess("readonly");
  };

  const createProcess = () => {
    api
      .invoke("PUT", `/api/v1/bucket/${bucket}/access-rules`, {
        prefix: prefix,
        access: selectedAccess,
      })
      .then((res: any) => {
        onClose();
      })
      .catch((err: ErrorResponseHandler) => {
        setErrorSnackMessage(err);
        onClose();
      });
  };

  return (
    <React.Fragment>
      <ModalWrapper
        modalOpen={modalOpen}
        title="Add Access Rule"
        onClose={onClose}
      >
        <Grid container>
          <Grid item xs={12}>
            <InputBoxWrapper
              value={prefix}
              label={"Prefix"}
              id={"prefix"}
              name={"prefix"}
              placeholder={"Enter Prefix"}
              onChange={(e) => {
                setPrefix(e.target.value);
              }}
            />
            <SelectWrapper
              id="access"
              name="Access"
              onChange={(e) => {
                setSelectedAccess(e.target.value);
              }}
              label="Access"
              value={selectedAccess}
              options={accessOptions}
              disabled={false}
            />
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
              disabled={prefix.trim() === ""}
              onClick={createProcess}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </ModalWrapper>
    </React.Fragment>
  );
};

export default withStyles(styles)(connector(AddAccessRule));
