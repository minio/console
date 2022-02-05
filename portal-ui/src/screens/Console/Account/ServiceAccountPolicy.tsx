// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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
import { Button } from "@mui/material";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import Grid from "@mui/material/Grid";
import {
  formFieldStyles,
  modalStyleUtils,
  spacingUtils,
} from "../Common/FormComponents/common/styleLibrary";
import { setModalErrorSnackMessage } from "../../../actions";
import { ErrorResponseHandler } from "../../../common/types";
import api from "../../../common/api";
import ModalWrapper from "../Common/ModalWrapper/ModalWrapper";
import { ChangeAccessPolicyIcon } from "../../../icons";
import CodeMirrorWrapper from "../Common/FormComponents/CodeMirrorWrapper/CodeMirrorWrapper";

const styles = (theme: Theme) =>
  createStyles({
    codeMirrorContainer: {
      marginBottom: 20,
      "& label": {
        marginBottom: ".5rem",
      },
      "& label + div": {
        display: "none",
      },
    },
    ...formFieldStyles,
    ...modalStyleUtils,
    ...spacingUtils,
  });
createStyles({
  ...modalStyleUtils,
  ...spacingUtils,
});

interface IServiceAccountPolicyProps {
  classes: any;
  open: boolean;
  selectedAccessKey: string | null;
  closeModalAndRefresh: () => void;
  setModalErrorSnackMessage: typeof setModalErrorSnackMessage;
}

const ServiceAccountPolicy = ({
  classes,
  open,
  selectedAccessKey,
  closeModalAndRefresh,
  setModalErrorSnackMessage,
}: IServiceAccountPolicyProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [policyDefinition, setPolicyDefinition] = useState<string>("");
  useEffect(() => {
    if (loading) {
      api
        .invoke("GET", `/api/v1/service-accounts/${selectedAccessKey}/policy`)
        .then((res) => {
          setLoading(false);
          setPolicyDefinition(res);
        })
        .catch((err: ErrorResponseHandler) => {
          setLoading(false);
          setModalErrorSnackMessage(err);
        });
    }
  }, [loading, setLoading, setModalErrorSnackMessage, selectedAccessKey]);

  return (
    <ModalWrapper
      title="Service Account Policy"
      modalOpen={open}
      onClose={() => {
        closeModalAndRefresh();
      }}
      titleIcon={<ChangeAccessPolicyIcon />}
    >
      <Grid container>
        <Grid item xs={12} className={classes.codeMirrorContainer}>
          <CodeMirrorWrapper
            label={`Service Account Policy`}
            value={policyDefinition}
            onBeforeChange={(editor, data, value) => {
              setPolicyDefinition(value);
            }}
            editorHeight={"350px"}
            readOnly={true}
          />
        </Grid>
        <Grid item xs={12} className={classes.modalButtonBar}>
          <Button
            type="button"
            variant="outlined"
            color="primary"
            onClick={() => {
              closeModalAndRefresh();
            }}
            disabled={loading}
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    </ModalWrapper>
  );
};

const connector = connect(null, {
  setModalErrorSnackMessage,
});

export default withStyles(styles)(connector(ServiceAccountPolicy));
