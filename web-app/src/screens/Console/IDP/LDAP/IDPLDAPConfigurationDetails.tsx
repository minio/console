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
  Box,
  Button,
  ConsoleIcon,
  EditIcon,
  FormLayout,
  Grid,
  HelpBox,
  InputBox,
  Loader,
  PageLayout,
  RefreshIcon,
  Switch,
  Tabs,
  Tooltip,
  ValuePair,
  WarnIcon,
  ScreenTitle,
} from "mds";
import { api } from "api";
import { ConfigurationKV } from "api/consoleApi";
import { errorToHandler } from "api/errors";
import { useAppDispatch } from "../../../../store";
import {
  setErrorSnackMessage,
  setHelpName,
  setServerNeedsRestart,
  setSnackBarMessage,
} from "../../../../systemSlice";
import { ldapFormFields, ldapHelpBoxContents } from "../utils";
import PageHeaderWrapper from "../../Common/PageHeaderWrapper/PageHeaderWrapper";
import AddIDPConfigurationHelpBox from "../AddIDPConfigurationHelpbox";
import LDAPEntitiesQuery from "./LDAPEntitiesQuery";
import ResetConfigurationModal from "../../EventDestinations/CustomForms/ResetConfigurationModal";
import HelpMenu from "../../HelpMenu";

const enabledConfigLDAP = [
  "server_addr",
  "lookup_bind_dn",
  "user_dn_search_base_dn",
  "user_dn_search_filter",
];

const IDPLDAPConfigurationDetails = () => {
  const dispatch = useAppDispatch();

  const formFields = ldapFormFields;

  const [loading, setLoading] = useState<boolean>(true);
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [hasConfiguration, setHasConfiguration] = useState<boolean>(false);
  const [fields, setFields] = useState<any>({});
  const [overrideFields, setOverrideFields] = useState<any>({});
  const [record, setRecord] = useState<ConfigurationKV[] | undefined>(
    undefined,
  );
  const [editMode, setEditMode] = useState<boolean>(false);
  const [resetOpen, setResetOpen] = useState<boolean>(false);
  const [curTab, setCurTab] = useState<string>("configuration");
  const [envOverride, setEnvOverride] = useState<boolean>(false);

  const toggleEditMode = () => {
    if (editMode && record) {
      parseFields(record);
    }
    setEditMode(!editMode);
  };

  const parseFields = (record: ConfigurationKV[]) => {
    let fields: any = {};
    let ovrFlds: any = {};
    if (record && record.length > 0) {
      const enabled = record.find((item: any) => item.key === "enable");

      let totalCoincidences = 0;
      let totalOverride = 0;

      record.forEach((item: any) => {
        if (item.env_override) {
          fields[item.key] = item.env_override.value;
          ovrFlds[item.key] = item.env_override.name;
        } else {
          fields[item.key] = item.value;
        }

        if (
          enabledConfigLDAP.includes(item.key) &&
          ((item.value && item.value !== "" && item.value !== "off") ||
            (item.env_override &&
              item.env_override.value !== "" &&
              item.env_override.value !== "off"))
        ) {
          totalCoincidences++;
        }

        if (enabledConfigLDAP.includes(item.key) && item.env_override) {
          totalOverride++;
        }
      });

      const hasConfig = totalCoincidences !== 0;

      if (hasConfig && ((enabled && enabled.value !== "off") || !enabled)) {
        setIsEnabled(true);
      } else {
        setIsEnabled(false);
      }

      if (totalOverride !== 0) {
        setEnvOverride(true);
      }

      setHasConfiguration(hasConfig);
    }
    setOverrideFields(ovrFlds);
    setFields(fields);
  };

  useEffect(() => {
    const loadRecord = () => {
      api.configs
        .configInfo("identity_ldap")
        .then((res) => {
          if (res.data.length > 0) {
            setRecord(res.data[0].key_values);
            parseFields(res.data[0].key_values || []);
          }
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          dispatch(setErrorSnackMessage(errorToHandler(err.error)));
        });
    };

    if (loading) {
      loadRecord();
    }
  }, [dispatch, loading]);

  const validSave = () => {
    for (const [key, value] of Object.entries(formFields)) {
      if (
        value.required &&
        !(
          fields[key] !== undefined &&
          fields[key] !== null &&
          fields[key] !== ""
        )
      ) {
        return false;
      }
    }
    return true;
  };

  const saveRecord = () => {
    const keyVals = Object.keys(formFields).map((key) => {
      return {
        key,
        value: fields[key],
      };
    });

    api.configs
      .setConfig("identity_ldap", {
        key_values: keyVals,
      })
      .then((res) => {
        setEditMode(false);
        setRecord(keyVals);
        parseFields(keyVals);
        dispatch(setServerNeedsRestart(res.data.restart || false));
        setFields({ ...fields, lookup_bind_password: "" });

        if (!res.data.restart) {
          dispatch(setSnackBarMessage("Configuration saved successfully"));
        }
      })
      .catch((err) => {
        dispatch(setErrorSnackMessage(errorToHandler(err.error)));
      });
  };

  const closeDeleteModalAndRefresh = async (refresh: boolean) => {
    setResetOpen(false);

    if (refresh) {
      dispatch(setServerNeedsRestart(refresh));
      setRecord(undefined);
      setFields({});
      setIsEnabled(false);
      setHasConfiguration(false);
      setEditMode(false);
    }
  };

  const toggleConfiguration = (value: boolean) => {
    const payload = {
      key_values: [
        {
          key: "enable",
          value: value ? "on" : "off",
        },
      ],
    };

    api.configs
      .setConfig("identity_ldap", payload)
      .then((res) => {
        setIsEnabled(!isEnabled);
        dispatch(setServerNeedsRestart(res.data.restart || false));
        if (!res.data.restart) {
          dispatch(setSnackBarMessage("Configuration saved successfully"));
        }
      })
      .catch((err) => {
        dispatch(setErrorSnackMessage(errorToHandler(err.error)));
      });
  };

  const renderFormField = (key: string, value: any) => {
    switch (value.type) {
      case "toggle":
        return (
          <Switch
            key={key}
            indicatorLabels={["Enabled", "Disabled"]}
            checked={fields[key] === "on"}
            value={"is-field-enabled"}
            id={"is-field-enabled"}
            name={"is-field-enabled"}
            label={value.label}
            tooltip={value.tooltip}
            onChange={(e) =>
              setFields({ ...fields, [key]: e.target.checked ? "on" : "off" })
            }
            description=""
            disabled={!editMode}
          />
        );
      default:
        return (
          <InputBox
            key={key}
            id={key}
            required={value.required}
            name={key}
            label={value.label}
            tooltip={value.tooltip}
            error={value.hasError(fields[key], editMode)}
            value={fields[key] ? fields[key] : ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFields({ ...fields, [key]: e.target.value })
            }
            placeholder={value.placeholder}
            disabled={!editMode}
            type={value.type}
          />
        );
    }
  };

  useEffect(() => {
    dispatch(setHelpName("LDAP"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid item xs={12}>
      {resetOpen && (
        <ResetConfigurationModal
          configurationName={"identity_ldap"}
          closeResetModalAndRefresh={closeDeleteModalAndRefresh}
          resetOpen={resetOpen}
        />
      )}
      <PageHeaderWrapper label={"LDAP"} actions={<HelpMenu />} />
      <PageLayout variant={"constrained"}>
        <Tabs
          horizontal
          options={[
            {
              tabConfig: { id: "configuration", label: "Configuration" },
              content: (
                <Fragment>
                  <ScreenTitle
                    icon={null}
                    title={editMode ? "Edit Configuration" : ""}
                    actions={
                      !editMode ? (
                        <Fragment>
                          <Tooltip
                            tooltip={
                              envOverride
                                ? "Configuration cannot be edited in this module as LDAP environment variables are set for this MinIO instance."
                                : ""
                            }
                          >
                            <Button
                              id={"edit"}
                              type="button"
                              variant={"callAction"}
                              icon={<EditIcon />}
                              onClick={toggleEditMode}
                              label={"Edit Configuration"}
                              disabled={loading || envOverride}
                            />
                          </Tooltip>
                          {hasConfiguration && (
                            <Tooltip
                              tooltip={
                                envOverride
                                  ? "Configuration cannot be disabled / enabled in this module as LDAP environment variables are set for this MinIO instance."
                                  : ""
                              }
                            >
                              <Button
                                id={"is-configuration-enabled"}
                                onClick={() => toggleConfiguration(!isEnabled)}
                                label={
                                  isEnabled ? "Disable LDAP" : "Enable LDAP"
                                }
                                variant={isEnabled ? "secondary" : "regular"}
                                disabled={envOverride}
                              />
                            </Tooltip>
                          )}
                          <Button
                            id={"refresh-idp-config"}
                            onClick={() => setLoading(true)}
                            label={"Refresh"}
                            icon={<RefreshIcon />}
                          />
                        </Fragment>
                      ) : null
                    }
                  />
                  <br />
                  {loading ? (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: 10,
                      }}
                    >
                      <Loader />
                    </Box>
                  ) : (
                    <Fragment>
                      {editMode ? (
                        <Fragment>
                          <FormLayout
                            helpBox={
                              <AddIDPConfigurationHelpBox
                                helpText={
                                  "Learn more about LDAP Configurations"
                                }
                                contents={ldapHelpBoxContents}
                                docLink={
                                  "https://min.io/docs/minio/linux/operations/external-iam.html?ref=con#minio-external-iam-ad-ldap"
                                }
                                docText={"Learn more about LDAP Configurations"}
                              />
                            }
                          >
                            {editMode && hasConfiguration ? (
                              <Box sx={{ marginBottom: 15 }}>
                                <HelpBox
                                  title={
                                    <Box
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        flexGrow: 1,
                                      }}
                                    >
                                      Lookup Bind Password must be re-entered to
                                      change LDAP configurations
                                    </Box>
                                  }
                                  iconComponent={<WarnIcon />}
                                  help={null}
                                />
                              </Box>
                            ) : null}
                            {Object.entries(formFields).map(([key, value]) =>
                              renderFormField(key, value),
                            )}
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-end",
                                marginTop: "20px",
                                gap: "15px",
                              }}
                            >
                              {editMode && hasConfiguration && (
                                <Button
                                  id={"clear"}
                                  type="button"
                                  variant="secondary"
                                  onClick={() => setResetOpen(true)}
                                  label={"Reset Configuration"}
                                />
                              )}
                              <Button
                                id={"cancel"}
                                type="button"
                                variant="regular"
                                onClick={toggleEditMode}
                                label={"Cancel"}
                              />
                              <Button
                                id={"save-key"}
                                type="submit"
                                variant="callAction"
                                color="primary"
                                disabled={loading || !validSave()}
                                label={"Save"}
                                onClick={saveRecord}
                              />
                            </Box>
                          </FormLayout>
                        </Fragment>
                      ) : (
                        <Fragment>
                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns: "1fr",
                              gridAutoFlow: "dense",
                              gap: 3,
                              padding: "15px",
                              border: "1px solid #eaeaea",
                              [`@media (min-width: 576px)`]: {
                                gridTemplateColumns: "2fr 1fr",
                                gridAutoFlow: "row",
                              },
                            }}
                          >
                            <ValuePair
                              label={"LDAP Enabled"}
                              value={isEnabled ? "Yes" : "No"}
                            />
                            {hasConfiguration && (
                              <Fragment>
                                {Object.entries(formFields).map(
                                  ([key, value]) => {
                                    if (!value.editOnly) {
                                      let label: React.ReactNode = value.label;
                                      let val: React.ReactNode = fields[key]
                                        ? fields[key]
                                        : "";

                                      if (overrideFields[key]) {
                                        label = (
                                          <Box
                                            sx={{
                                              display: "flex",
                                              alignItems: "center",
                                              gap: 5,
                                              "& .min-icon": {
                                                height: 20,
                                                width: 20,
                                              },
                                              "& span": {
                                                height: 20,
                                                display: "flex",
                                                alignItems: "center",
                                              },
                                            }}
                                          >
                                            <span>{value.label}</span>
                                            <Tooltip
                                              tooltip={`This value is set from the ${overrideFields[key]} environment variable`}
                                              placement={"right"}
                                            >
                                              <span className={"muted"}>
                                                <ConsoleIcon />
                                              </span>
                                            </Tooltip>
                                          </Box>
                                        );

                                        val = (
                                          <i>
                                            <span className={"muted"}>
                                              {val}
                                            </span>
                                          </i>
                                        );
                                      }
                                      return (
                                        <ValuePair
                                          key={key}
                                          label={label}
                                          value={val}
                                        />
                                      );
                                    }
                                    return null;
                                  },
                                )}
                              </Fragment>
                            )}
                          </Box>
                        </Fragment>
                      )}
                    </Fragment>
                  )}
                </Fragment>
              ),
            },
            {
              tabConfig: {
                id: "entities",
                label: "Entities",
                disabled: !hasConfiguration || !isEnabled,
              },
              content: (
                <Fragment>
                  {hasConfiguration && (
                    <Box>
                      <LDAPEntitiesQuery />
                    </Box>
                  )}
                </Fragment>
              ),
            },
          ]}
          currentTabOrPath={curTab}
          onTabClick={(newTab) => {
            setCurTab(newTab);
            setEditMode(false);
          }}
        />
      </PageLayout>
    </Grid>
  );
};

export default IDPLDAPConfigurationDetails;
