// This file is part of MinIO Console Server
// Copyright (c) 2023 MinIO, Inc.
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

import React, { Fragment, useEffect, useState } from "react";
import { Button, Grid } from "mds";
import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import { Webhook } from "@mui/icons-material";
import { formFieldStyles } from "../../Common/FormComponents/common/styleLibrary";
import CallToActionIcon from "@mui/icons-material/CallToAction";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import api from "../../../../common/api";
import {
  configurationIsLoading,
  setErrorSnackMessage,
  setServerNeedsRestart,
  setSnackBarMessage,
} from "../../../../systemSlice";
import { ErrorResponseHandler } from "../../../../common/types";
import { useAppDispatch } from "../../../../store";
import { LinearProgress } from "@mui/material";
import { IConfigurationSys } from "../../Configurations/types";
import FormSwitchWrapper from "../../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";

interface IEndpointModal {
  open: boolean;
  type: string;
  endpointInfo: IConfigurationSys;
  onCloseEndpoint: () => void;
}

const EditEndpointModal = ({
  open,
  type,
  endpointInfo,
  onCloseEndpoint,
}: IEndpointModal) => {
  const [name, setName] = useState<string>("");
  const [endpoint, setEndpoint] = useState<string>("");
  const [authToken, setAuthToken] = useState<string>("");
  const [endpointState, setEndpointState] = useState<string>("on");
  const [saving, setSaving] = useState<boolean>(false);
  const [invalidInputs, setInvalidInput] = useState<string[]>([]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (endpointInfo) {
      const endpointLocate = endpointInfo.key_values.find(
        (key) => key.key === "endpoint"
      );
      const tokenLocate = endpointInfo.key_values.find(
        (key) => key.key === "auth_token"
      );
      const enable = endpointInfo.key_values.find(
        (key) => key.key === "enable"
      );

      let invalidInputs: string[] = [];

      if (endpointLocate) {
        const endpointValue = endpointLocate.value;

        if (endpointValue === "") {
          invalidInputs.push("endpoint");
        } else {
          setEndpoint(endpointValue);
        }
      }

      if (tokenLocate) {
        const tokenValue = tokenLocate.value;

        if (tokenValue === "") {
          invalidInputs.push("auth-token");
        } else {
          setAuthToken(tokenValue);
        }
      }

      if (enable) {
        if (enable.value === "off") {
          setEndpointState(enable.value);
        }
      }

      setName(endpointInfo.name || "");
      setInvalidInput(invalidInputs);
    }
  }, [endpointInfo]);

  const updateWebhook = () => {
    if (saving) {
      return;
    }

    if (invalidInputs.length !== 0) {
      return;
    }

    if (!endpoint || endpoint.trim() === "") {
      setInvalidInput([...invalidInputs, "endpoint"]);

      return;
    }

    setSaving(true);

    const payload = {
      key_values: [
        {
          key: "endpoint",
          value: endpoint,
        },
        {
          key: "auth_token",
          value: authToken,
        },
        {
          key: "enable",
          value: endpointState,
        },
      ],
    };

    api
      .invoke("PUT", `/api/v1/configs/${name}`, payload)
      .then((res) => {
        setSaving(false);
        dispatch(setServerNeedsRestart(res.restart));
        if (!res.restart) {
          dispatch(setSnackBarMessage("Configuration saved successfully"));
        }

        onCloseEndpoint();
        dispatch(configurationIsLoading(true));
      })
      .catch((err: ErrorResponseHandler) => {
        setSaving(false);
        dispatch(setErrorSnackMessage(err));
      });
  };

  const validateInput = (name: string, valid: boolean) => {
    if (invalidInputs.includes(name) && valid) {
      setInvalidInput(invalidInputs.filter((item) => item !== name));
      return;
    }

    if (!valid && !invalidInputs.includes(name)) {
      setInvalidInput([...invalidInputs, name]);
    }
  };

  const defaultWH = !name.includes(":");

  let title = "Edit Webhook";
  let icon = <Webhook />;

  switch (type) {
    case "logger_webhook":
      title = `Edit ${defaultWH ? " the Default " : ""}Logger Webhook`;
      icon = <CallToActionIcon />;
      break;
    case "audit_webhook":
      title = `Edit ${defaultWH ? " the Default " : ""}Audit Webhook`;
      icon = <PendingActionsIcon />;
      break;
  }

  return (
    <Fragment>
      <ModalWrapper
        modalOpen={open}
        title={`${title}${defaultWH ? "" : ` - ${name}`}`}
        onClose={onCloseEndpoint}
        titleIcon={icon}
      >
        <Grid item xs={12} sx={{ ...formFieldStyles.formFieldRow }}>
          <FormSwitchWrapper
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const value = e.target.checked ? "on" : "off";
              setEndpointState(value);
            }}
            id={"endpoint_enabled"}
            name={"endpoint_enabled"}
            label={"Enabled"}
            value={"switch_on"}
            checked={endpointState === "on"}
          />
        </Grid>
        <Grid item xs={12} sx={{ ...formFieldStyles.formFieldRow }}>
          <InputBoxWrapper
            id="endpoint"
            name="endpoint"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setEndpoint(event.target.value);
              validateInput("endpoint", event.target.validity.valid);
            }}
            error={
              invalidInputs.includes("endpoint") ? "Invalid Endpoint set" : ""
            }
            label="Endpoint"
            value={endpoint}
            pattern={
              "^(https?):\\/\\/([a-zA-Z0-9\\-.]+)(:[0-9]+)?(\\/[a-zA-Z0-9\\-.\\/]*)?$"
            }
            required
          />
        </Grid>
        <Grid item xs={12} sx={{ ...formFieldStyles.formFieldRow }}>
          <InputBoxWrapper
            id="auth-token"
            name="auth-token"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setAuthToken(event.target.value);
            }}
            label="Auth Token"
            value={authToken}
          />
        </Grid>
        {saving && (
          <Grid
            item
            xs={12}
            sx={{
              marginBottom: 10,
            }}
          >
            <LinearProgress />
          </Grid>
        )}
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            id={"reset"}
            type="button"
            variant="regular"
            disabled={saving}
            onClick={onCloseEndpoint}
            label={"Cancel"}
            sx={{
              marginRight: 10,
            }}
          />
          <Button
            id={"save-lifecycle"}
            type="submit"
            variant="callAction"
            color="primary"
            disabled={saving || invalidInputs.length !== 0}
            label={"Update"}
            onClick={updateWebhook}
          />
        </Grid>
      </ModalWrapper>
    </Fragment>
  );
};

export default EditEndpointModal;
