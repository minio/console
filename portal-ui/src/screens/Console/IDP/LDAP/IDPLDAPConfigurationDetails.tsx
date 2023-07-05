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
  EditIcon,
  FormLayout,
  Grid,
  InputBox,
  Loader,
  PageLayout,
  RefreshIcon,
} from "mds";
import { useAppDispatch } from "../../../../store";
import {
  setErrorSnackMessage,
  setHelpName,
  setServerNeedsRestart,
  setSnackBarMessage,
} from "../../../../systemSlice";
import ScreenTitle from "../../Common/ScreenTitle/ScreenTitle";
import FormSwitchWrapper from "../../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import LabelValuePair from "../../Common/UsageBarWrapper/LabelValuePair";
import PageHeaderWrapper from "../../Common/PageHeaderWrapper/PageHeaderWrapper";
import { ldapFormFields, ldapHelpBoxContents } from "../utils";
import AddIDPConfigurationHelpBox from "../AddIDPConfigurationHelpbox";
import LDAPEntitiesQuery from "./LDAPEntitiesQuery";
import ResetConfigurationModal from "../../EventDestinations/CustomForms/ResetConfigurationModal";
import { TabPanel } from "../../../shared/tabs";
import TabSelector from "../../Common/TabSelector/TabSelector";
import HelpMenu from "../../HelpMenu";
import { api } from "api";
import { ConfigurationKV } from "api/consoleApi";
import { errorToHandler } from "api/errors";

const enabledConfigLDAP = [
  "server_addr",
  "lookup_bind_dn",
  "lookup_bind_password",
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
  const [record, setRecord] = useState<ConfigurationKV[] | undefined>(
    undefined
  );
  const [editMode, setEditMode] = useState<boolean>(false);
  const [resetOpen, setResetOpen] = useState<boolean>(false);
  const [curTab, setCurTab] = useState<number>(0);

  const toggleEditMode = () => {
    if (editMode && record) {
      parseFields(record);
    }
    setEditMode(!editMode);
  };

  const parseFields = (record: ConfigurationKV[]) => {
    let fields: any = {};
    if (record && record.length > 0) {
      const enabled = record.find((item: any) => item.key === "enable");

      let totalCoincidences = 0;

      record.forEach((item: any) => {
        fields[item.key] = item.value;

        if (
          enabledConfigLDAP.includes(item.key) &&
          item.value &&
          item.value !== "" &&
          item.value !== "off"
        ) {
          totalCoincidences++;
        }
      });

      const hasConfig = totalCoincidences === enabledConfigLDAP.length;

      if ((!enabled || enabled.value === "on") && hasConfig) {
        setIsEnabled(true);
      } else {
        setIsEnabled(false);
      }

      setHasConfiguration(hasConfig);
    }
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
          <Box className={"inputItem"}>
            <FormSwitchWrapper
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
          </Box>
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
        <TabSelector
          selectedTab={curTab}
          onChange={(newValue: number) => {
            setCurTab(newValue);
            setEditMode(false);
          }}
          tabOptions={[
            { label: "Configuration" },
            {
              label: "Entities",
              disabled: !hasConfiguration || !isEnabled,
            },
          ]}
        />
        <TabPanel index={0} value={curTab}>
          <ScreenTitle
            title={editMode ? "Edit Configuration" : ""}
            actions={
              !editMode ? (
                <Fragment>
                  <Button
                    id={"edit"}
                    type="button"
                    variant={"callAction"}
                    icon={<EditIcon />}
                    onClick={toggleEditMode}
                    label={"Edit Configuration"}
                    disabled={loading}
                  />
                  {hasConfiguration && (
                    <Button
                      id={"is-configuration-enabled"}
                      onClick={() => toggleConfiguration(!isEnabled)}
                      label={isEnabled ? "Disable LDAP" : "Enable LDAP"}
                      variant={isEnabled ? "secondary" : "regular"}
                    />
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
              sx={{ display: "flex", justifyContent: "center", marginTop: 10 }}
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
                        helpText={"Learn more about LDAP Configurations"}
                        contents={ldapHelpBoxContents}
                        docLink={
                          "https://min.io/docs/minio/linux/operations/external-iam.html?ref=con#minio-external-iam-ad-ldap"
                        }
                        docText={"Learn more about LDAP Configurations"}
                      />
                    }
                  >
                    {Object.entries(formFields).map(([key, value]) =>
                      renderFormField(key, value)
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
                      {editMode && (
                        <Button
                          id={"clear"}
                          type="button"
                          variant="secondary"
                          onClick={() => setResetOpen(true)}
                          label={"Reset Configuration"}
                        />
                      )}
                      {editMode && (
                        <Button
                          id={"cancel"}
                          type="button"
                          variant="regular"
                          onClick={toggleEditMode}
                          label={"Cancel"}
                        />
                      )}
                      {editMode && (
                        <Button
                          id={"save-key"}
                          type="submit"
                          variant="callAction"
                          color="primary"
                          disabled={loading || !validSave()}
                          label={"Save"}
                          onClick={saveRecord}
                        />
                      )}
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
                    <LabelValuePair
                      label={"LDAP Enabled"}
                      value={isEnabled ? "Yes" : "No"}
                    />
                    {hasConfiguration && (
                      <Fragment>
                        {Object.entries(formFields).map(([key, value]) => (
                          <LabelValuePair
                            key={key}
                            label={value.label}
                            value={fields[key] ? fields[key] : ""}
                          />
                        ))}
                      </Fragment>
                    )}
                  </Box>
                </Fragment>
              )}
            </Fragment>
          )}
        </TabPanel>
        <TabPanel index={1} value={curTab}>
          {hasConfiguration && (
            <Box>
              <LDAPEntitiesQuery />
            </Box>
          )}
        </TabPanel>
      </PageLayout>
    </Grid>
  );
};

export default IDPLDAPConfigurationDetails;
