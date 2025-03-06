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
import {
  Button,
  ConsoleIcon,
  FormLayout,
  Grid,
  InputBox,
  PendingItemsIcon,
  ProgressBar,
  ReadBox,
  Switch,
  Tooltip,
  WebhookIcon,
} from "mds";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import { modalStyleUtils } from "../../Common/FormComponents/common/styleLibrary";
import {
  configurationIsLoading,
  setErrorSnackMessage,
  setServerNeedsRestart,
  setSnackBarMessage,
} from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";

import { IConfigurationSys } from "../../Configurations/types";
import { overrideFields } from "../../Configurations/utils";
import { api } from "api";
import { errorToHandler } from "api/errors";

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
        (key) => key.key === "endpoint",
      );
      const tokenLocate = endpointInfo.key_values.find(
        (key) => key.key === "auth_token",
      );
      const enable = endpointInfo.key_values.find(
        (key) => key.key === "enable",
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

    api.configs
      .setConfig(name, payload)
      .then((res) => {
        setSaving(false);
        dispatch(setServerNeedsRestart(res.data.restart || false));
        if (!res.data.restart) {
          dispatch(setSnackBarMessage("Configuration saved successfully"));
        }

        onCloseEndpoint();
        dispatch(configurationIsLoading(true));
      })
      .catch((err) => {
        setSaving(false);
        dispatch(setErrorSnackMessage(errorToHandler(err.error)));
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
  const hasOverride = endpointInfo.key_values.filter(
    (itm) => !!itm.env_override,
  );

  const overrideValues = overrideFields(hasOverride);

  let title = "Edit Webhook";
  let icon = <WebhookIcon />;

  switch (type) {
    case "logger_webhook":
      title = `Edit ${defaultWH ? " the Default " : ""}Logger Webhook`;
      icon = <ConsoleIcon />;
      break;
    case "audit_webhook":
      title = `Edit ${defaultWH ? " the Default " : ""}Audit Webhook`;
      icon = <PendingItemsIcon />;
      break;
  }

  if (hasOverride.length > 0) {
    title = "View env variable Webhook";
  }

  return (
    <Fragment>
      <ModalWrapper
        modalOpen={open}
        title={`${title}${defaultWH ? "" : ` - ${name}`}`}
        onClose={onCloseEndpoint}
        titleIcon={icon}
      >
        <FormLayout withBorders={false} containerPadding={false}>
          {hasOverride.length > 0 ? (
            <Fragment>
              <ReadBox
                label={"Enabled"}
                sx={{ width: "100%" }}
                actionButton={
                  <Grid
                    item
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      paddingRight: "10px",
                    }}
                  >
                    <Tooltip
                      tooltip={
                        overrideValues.enable
                          ? `This value is set from the ${
                              overrideValues.enable?.overrideEnv || "N/A"
                            } environment variable`
                          : ""
                      }
                      placement={"left"}
                    >
                      <ConsoleIcon style={{ width: 20 }} />
                    </Tooltip>
                  </Grid>
                }
              >
                {overrideValues.enable?.value || "-"}
              </ReadBox>
              <ReadBox
                label={"Endpoint"}
                sx={{ width: "100%" }}
                actionButton={
                  <Grid
                    item
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      paddingRight: "10px",
                    }}
                  >
                    <Tooltip
                      tooltip={
                        overrideValues.enable
                          ? `This value is set from the ${
                              overrideValues.endpoint?.overrideEnv || "N/A"
                            } environment variable`
                          : ""
                      }
                      placement={"left"}
                    >
                      <ConsoleIcon style={{ width: 20 }} />
                    </Tooltip>
                  </Grid>
                }
              >
                {overrideValues.endpoint?.value || "-"}
              </ReadBox>
              <ReadBox
                label={"Auth Token"}
                sx={{ width: "100%" }}
                actionButton={
                  <Grid
                    item
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      paddingRight: "10px",
                    }}
                  >
                    <Tooltip
                      tooltip={
                        overrideValues.enable
                          ? `This value is set from the ${
                              overrideValues.auth_token?.overrideEnv || "N/A"
                            } environment variable`
                          : ""
                      }
                      placement={"left"}
                    >
                      <ConsoleIcon style={{ width: 20 }} />
                    </Tooltip>
                  </Grid>
                }
              >
                {overrideValues.auth_token?.value || "-"}
              </ReadBox>
            </Fragment>
          ) : (
            <Fragment>
              <Switch
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
              <InputBox
                id="endpoint"
                name="endpoint"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setEndpoint(event.target.value);
                  validateInput("endpoint", event.target.validity.valid);
                }}
                error={
                  invalidInputs.includes("endpoint")
                    ? "Invalid Endpoint set"
                    : ""
                }
                label="Endpoint"
                value={endpoint}
                pattern={
                  "^(https?):\\/\\/([a-zA-Z0-9\\-.]+)(:[0-9]+)?(\\/[a-zA-Z0-9_\\-.\\/]*)?$"
                }
                required
              />
              <InputBox
                id="auth-token"
                name="auth-token"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setAuthToken(event.target.value);
                }}
                label="Auth Token"
                value={authToken}
              />
              {saving && (
                <Grid
                  item
                  xs={12}
                  sx={{
                    marginBottom: 10,
                  }}
                >
                  <ProgressBar />
                </Grid>
              )}
              <Grid item sx={modalStyleUtils.modalButtonBar}>
                <Button
                  id={"reset"}
                  type="button"
                  variant="regular"
                  disabled={saving}
                  onClick={onCloseEndpoint}
                  label={"Cancel"}
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
            </Fragment>
          )}
        </FormLayout>
      </ModalWrapper>
    </Fragment>
  );
};

export default EditEndpointModal;
