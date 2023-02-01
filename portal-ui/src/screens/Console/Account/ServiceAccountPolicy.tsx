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

import { Button, ChangeAccessPolicyIcon } from "mds";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import Grid from "@mui/material/Grid";
import {
  formFieldStyles,
  modalStyleUtils,
  spacingUtils,
} from "../Common/FormComponents/common/styleLibrary";

import { ErrorResponseHandler } from "../../../common/types";
import api from "../../../common/api";
import ModalWrapper from "../Common/ModalWrapper/ModalWrapper";
import CodeMirrorWrapper from "../Common/FormComponents/CodeMirrorWrapper/CodeMirrorWrapper";
import { encodeURLString } from "../../../common/utils";
import { setModalErrorSnackMessage } from "../../../systemSlice";
import { useAppDispatch } from "../../../store";

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
}

const ServiceAccountPolicy = ({
  classes,
  open,
  selectedAccessKey,
  closeModalAndRefresh,
}: IServiceAccountPolicyProps) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(true);
  const [policyDefinition, setPolicyDefinition] = useState<string>("");
  useEffect(() => {
    if (loading) {
      api
        .invoke(
          "GET",
          `/api/v1/service-accounts/${encodeURLString(
            selectedAccessKey
          )}/policy`
        )
        .then((res) => {
          setLoading(false);
          setPolicyDefinition(res);
        })
        .catch((err: ErrorResponseHandler) => {
          setLoading(false);
          dispatch(setModalErrorSnackMessage(err));
        });
    }
  }, [loading, setLoading, dispatch, selectedAccessKey]);

  const setPolicy = (event: React.FormEvent, newPolicy: string) => {
    event.preventDefault();
    api
      .invoke(
        "PUT",
        `/api/v1/service-accounts/${encodeURLString(selectedAccessKey)}/policy`,
        {
          policy: newPolicy,
        }
      )
      .then((res) => {
        closeModalAndRefresh();
      })
      .catch((err: ErrorResponseHandler) => {
        dispatch(setModalErrorSnackMessage(err));
      });
  };

  return (
    <ModalWrapper
      title="Access Key Policy"
      modalOpen={open}
      onClose={() => {
        closeModalAndRefresh();
      }}
      titleIcon={<ChangeAccessPolicyIcon />}
    >
      <form
        noValidate
        autoComplete="off"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          setPolicy(e, policyDefinition);
        }}
      >
        <Grid container>
          <Grid item xs={12} className={classes.codeMirrorContainer}>
            <CodeMirrorWrapper
              label={`Access Key Policy`}
              value={policyDefinition}
              onBeforeChange={(editor, data, value) => {
                setPolicyDefinition(value);
              }}
              editorHeight={"350px"}
            />
          </Grid>
          <Grid item xs={12} className={classes.modalButtonBar}>
            <Button
              id={"cancel-sa-policy"}
              type="button"
              variant="regular"
              onClick={() => {
                closeModalAndRefresh();
              }}
              disabled={loading}
              label={"Cancel"}
            />
            <Button
              id={"save-sa-policy"}
              type="submit"
              variant="callAction"
              color="primary"
              disabled={loading}
              label={"Set"}
            />
          </Grid>
        </Grid>
      </form>
    </ModalWrapper>
  );
};

export default withStyles(styles)(ServiceAccountPolicy);
