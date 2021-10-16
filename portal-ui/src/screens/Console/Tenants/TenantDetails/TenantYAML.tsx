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
import api from "../../../../common/api";
import { setModalErrorSnackMessage } from "../../../../actions";
import {
  fieldBasic,
  modalBasic,
} from "../../Common/FormComponents/common/styleLibrary";
import { ErrorResponseHandler } from "../../../../common/types";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import CodeMirrorWrapper from "../../Common/FormComponents/CodeMirrorWrapper/CodeMirrorWrapper";

const styles = (theme: Theme) =>
  createStyles({
    jsonPolicyEditor: {
      minHeight: 400,
      width: "100%",
    },
    buttonContainer: {
      textAlign: "right",
    },
    errorState: {
      color: "#b53b4b",
      fontSize: 14,
      fontWeight: "bold",
    },
    ...modalBasic,
    ...fieldBasic,
  });

interface ITenantYAML {
  yaml: string;
}

interface ITenantYAMLProps {
  classes: any;
  open: boolean;
  closeModalAndRefresh: (refresh: boolean) => void;
  tenant: string;
  namespace: string;
  setModalErrorSnackMessage: typeof setModalErrorSnackMessage;
}

const TenantYAML = ({
  classes,
  open,
  closeModalAndRefresh,
  tenant,
  namespace,
  setModalErrorSnackMessage,
}: ITenantYAMLProps) => {
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [tenantYaml, setTenantYaml] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const updateTenant = (event: React.FormEvent) => {
    event.preventDefault();
    if (addLoading) {
      return;
    }
    setAddLoading(true);
    setErrorMessage("");
    api
      .invoke("PUT", `/api/v1/namespaces/${namespace}/tenants/${tenant}/yaml`, {
        yaml: tenantYaml,
      })
      .then((res) => {
        setAddLoading(false);
        closeModalAndRefresh(true);
        setErrorMessage("");
      })
      .catch((err: ErrorResponseHandler) => {
        setAddLoading(false);
        setErrorMessage(err.errorMessage);
      });
  };

  // check the permissions for creating bucket
  useEffect(() => {
    api
      .invoke("GET", `/api/v1/namespaces/${namespace}/tenants/${tenant}/yaml`)
      .then((res: ITenantYAML) => {
        setLoading(false);
        setTenantYaml(res.yaml);
      })
      .catch((err: ErrorResponseHandler) => {
        setLoading(false);
        setModalErrorSnackMessage(err);
      });
  }, [tenant, namespace, setModalErrorSnackMessage]);

  useEffect(() => {}, []);

  const validSave = tenantYaml.trim() !== "";

  return (
    <ModalWrapper
      modalOpen={open}
      onClose={() => {
        closeModalAndRefresh(false);
      }}
      title={`YAML`}
    >
      {loading && <LinearProgress />}
      {errorMessage !== "" && (
        <div className={classes.errorState}>{errorMessage}</div>
      )}
      {!loading && (
        <form
          noValidate
          autoComplete="off"
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            updateTenant(e);
          }}
        >
          <Grid container>
            <Grid item xs={12} className={classes.formScrollable}>
              <Grid item xs={12}>
                <br />
              </Grid>
              <CodeMirrorWrapper
                label={`Tenant Specification`}
                value={tenantYaml}
                mode={"yaml"}
                onBeforeChange={(editor, data, value) => {
                  setTenantYaml(value);
                }}
              />
            </Grid>
            <Grid item xs={12} className={classes.buttonContainer}>
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
      )}
    </ModalWrapper>
  );
};

const mapDispatchToProps = {
  setModalErrorSnackMessage,
};

const connector = connect(null, mapDispatchToProps);

export default withStyles(styles)(connector(TenantYAML));
