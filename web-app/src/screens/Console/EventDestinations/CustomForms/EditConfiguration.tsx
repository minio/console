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

import React, { Fragment, useCallback, useEffect, useState } from "react";
import get from "lodash/get";
import { Box, Button, Grid, Loader } from "mds";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { api } from "api";
import { Configuration, ConfigurationKV } from "api/consoleApi";
import { errorToHandler } from "api/errors";
import {
  fieldsConfigurations,
  overrideFields,
  removeEmptyFields,
} from "../../Configurations/utils";
import {
  IConfigurationElement,
  IElementValue,
  IOverrideEnv,
  KVField,
} from "../../Configurations/types";
import {
  configurationIsLoading,
  setErrorSnackMessage,
  setHelpName,
  setServerNeedsRestart,
  setSnackBarMessage,
} from "../../../../systemSlice";
import { AppState, useAppDispatch } from "../../../../store";
import WebhookSettings from "../WebhookSettings/WebhookSettings";
import ConfTargetGeneric from "../ConfTargetGeneric";
import ResetConfigurationModal from "./ResetConfigurationModal";

interface IAddNotificationEndpointProps {
  selectedConfiguration: IConfigurationElement;
  className?: string;
}

const EditConfiguration = ({
  selectedConfiguration,
  className = "",
}: IAddNotificationEndpointProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname = "" } = useLocation();

  let selConfigTab = pathname.substring(pathname.lastIndexOf("/") + 1);
  selConfigTab = selConfigTab === "settings" ? "region" : selConfigTab;

  //Local States
  const [valuesObj, setValueObj] = useState<IElementValue[]>([]);
  const [saving, setSaving] = useState<boolean>(false);
  const [configValues, setConfigValues] = useState<IElementValue[]>([]);
  const [configSubsysList, setConfigSubsysList] = useState<Configuration[]>([]);
  const [resetConfigurationOpen, setResetConfigurationOpen] =
    useState<boolean>(false);
  const [overrideEnvs, setOverrideEnvs] = useState<IOverrideEnv>({});

  const loadingConfig = useSelector(
    (state: AppState) => state.system.loadingConfigurations,
  );

  useEffect(() => {
    dispatch(configurationIsLoading(true));
  }, [selConfigTab, dispatch]);

  useEffect(() => {
    if (loadingConfig) {
      const configId = get(selectedConfiguration, "configuration_id", false);

      if (configId) {
        api.configs
          .configInfo(configId)
          .then((res) => {
            setConfigSubsysList(res.data);
            let values: ConfigurationKV[] = get(res.data[0], "key_values", []);

            const fieldsConfig: KVField[] = fieldsConfigurations[configId];

            const keyVals: IElementValue[] = fieldsConfig.map((field) => {
              const includedValue = values.find(
                (element: ConfigurationKV) => element.key === field.name,
              );
              const customValue = includedValue?.value || "";

              return {
                key: field.name,
                value: field.customValueProcess
                  ? field.customValueProcess(customValue)
                  : customValue,
                env_override: includedValue?.env_override,
              };
            });

            setConfigValues(keyVals);
            setOverrideEnvs(overrideFields(keyVals));
            dispatch(configurationIsLoading(false));
          })
          .catch((err) => {
            dispatch(configurationIsLoading(false));
            dispatch(setErrorSnackMessage(errorToHandler(err.error)));
          });

        return;
      }
      dispatch(configurationIsLoading(false));
    }
  }, [loadingConfig, selectedConfiguration, dispatch]);

  useEffect(() => {
    if (saving) {
      const payload = {
        key_values: removeEmptyFields(valuesObj),
      };
      api.configs
        .setConfig(selectedConfiguration.configuration_id, payload)
        .then((res) => {
          setSaving(false);
          dispatch(setServerNeedsRestart(res.data.restart || false));
          dispatch(configurationIsLoading(true));
          if (!res.data.restart) {
            dispatch(setSnackBarMessage("Configuration saved successfully"));
          }
        })
        .catch((err) => {
          setSaving(false);
          dispatch(setErrorSnackMessage(errorToHandler(err.error)));
        });
    }
  }, [saving, dispatch, selectedConfiguration, valuesObj, navigate]);

  //Fetch Actions
  const submitForm = (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
  };

  const onValueChange = useCallback(
    (newValue: IElementValue[]) => {
      setValueObj(newValue);
    },
    [setValueObj],
  );

  const continueReset = (restart: boolean) => {
    setResetConfigurationOpen(false);
    dispatch(setServerNeedsRestart(restart));
    if (restart) {
      dispatch(configurationIsLoading(true));
    }
  };

  const resetConfigurationMOpen = () => {
    setResetConfigurationOpen(true);
  };

  return (
    <Fragment>
      <div
        onMouseMove={() => {
          dispatch(
            setHelpName(
              `settings_${selectedConfiguration.configuration_label}`,
            ),
          );
        }}
      >
        {resetConfigurationOpen && (
          <ResetConfigurationModal
            configurationName={selectedConfiguration.configuration_id}
            closeResetModalAndRefresh={continueReset}
            resetOpen={resetConfigurationOpen}
          />
        )}
        {loadingConfig ? (
          <Grid item xs={12} sx={{ textAlign: "center", paddingTop: "15px" }}>
            <Loader />
          </Grid>
        ) : (
          <Box
            sx={{
              padding: "15px",
              height: "100%",
            }}
          >
            {selectedConfiguration.configuration_id === "logger_webhook" ||
            selectedConfiguration.configuration_id === "audit_webhook" ? (
              <WebhookSettings
                WebhookSettingslist={configSubsysList}
                setResetConfigurationOpen={resetConfigurationMOpen}
                type={selectedConfiguration.configuration_id}
              />
            ) : (
              <Fragment>
                <form
                  noValidate
                  onSubmit={submitForm}
                  className={className}
                  style={{
                    height: "100%",
                    display: "flex",
                    flexFlow: "column",
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr",
                      gap: "10px",
                    }}
                  >
                    <ConfTargetGeneric
                      fields={
                        fieldsConfigurations[
                          selectedConfiguration.configuration_id
                        ]
                      }
                      onChange={onValueChange}
                      defaultVals={configValues}
                      overrideEnv={overrideEnvs}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sx={{
                      paddingTop: "15px ",
                      textAlign: "right" as const,
                      maxHeight: "60px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      type={"button"}
                      id={"restore-defaults"}
                      variant="secondary"
                      onClick={resetConfigurationMOpen}
                      label={"Restore Defaults"}
                    />
                    &nbsp; &nbsp;
                    <Button
                      id={"save"}
                      type="submit"
                      variant="callAction"
                      disabled={saving}
                      label={"Save"}
                    />
                  </Grid>
                </form>
              </Fragment>
            )}
          </Box>
        )}
      </div>
    </Fragment>
  );
};

export default EditConfiguration;
