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

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button, LinearProgress, SelectChangeEvent } from "@mui/material";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import Grid from "@mui/material/Grid";
import { modalBasic } from "../../Common/FormComponents/common/styleLibrary";
import { setModalErrorSnackMessage } from "../../../../actions";
import { ErrorResponseHandler } from "../../../../common/types";
import api from "../../../../common/api";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import SelectWrapper from "../../Common/FormComponents/SelectWrapper/SelectWrapper";

const styles = (theme: Theme) =>
  createStyles({
    ...modalBasic,
  });

interface ISetAccessPolicyProps {
  classes: any;
  open: boolean;
  bucketName: string;
  actualPolicy: string;
  closeModalAndRefresh: () => void;
  setModalErrorSnackMessage: typeof setModalErrorSnackMessage;
}

const SetAccessPolicy = ({
  classes,
  open,
  bucketName,
  actualPolicy,
  closeModalAndRefresh,
  setModalErrorSnackMessage,
}: ISetAccessPolicyProps) => {
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [accessPolicy, setAccessPolicy] = useState<string>("");
  const addRecord = (event: React.FormEvent) => {
    event.preventDefault();
    if (addLoading) {
      return;
    }
    setAddLoading(true);
    api
      .invoke("PUT", `/api/v1/buckets/${bucketName}/set-policy`, {
        access: accessPolicy,
      })
      .then((res) => {
        setAddLoading(false);
        closeModalAndRefresh();
      })
      .catch((err: ErrorResponseHandler) => {
        setAddLoading(false);
        setModalErrorSnackMessage(err);
      });
  };

  useEffect(() => {
    setAccessPolicy(actualPolicy);
  }, [setAccessPolicy, actualPolicy]);

  return (
    <ModalWrapper
      title="Change Access Policy"
      modalOpen={open}
      onClose={() => {
        closeModalAndRefresh();
      }}
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
              <SelectWrapper
                value={accessPolicy}
                label="Access Policy"
                id="select-access-policy"
                name="select-access-policy"
                onChange={(e: SelectChangeEvent<string>) => {
                  setAccessPolicy(e.target.value as string);
                }}
                options={[
                  { value: "PRIVATE", label: "Private" },
                  { value: "PUBLIC", label: "Public" },
                ]}
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={addLoading}
            >
              Set
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

const connector = connect(null, {
  setModalErrorSnackMessage,
});

export default withStyles(styles)(connector(SetAccessPolicy));
