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

import React, { Fragment, useCallback, useEffect, useState } from "react";
import {
  BackLink,
  Box,
  breakPoints,
  Button,
  ConsoleIcon,
  EditIcon,
  FormLayout,
  Grid,
  HelpBox,
  InputBox,
  PageLayout,
  RefreshIcon,
  ScreenTitle,
  Switch,
  Tooltip,
  TrashIcon,
  ValuePair,
  WarnIcon,
} from "mds";
import { useNavigate, useParams } from "react-router-dom";
import { modalStyleUtils } from "../Common/FormComponents/common/styleLibrary";
import { useAppDispatch } from "../../../store";
import {
  setErrorSnackMessage,
  setHelpName,
  setServerNeedsRestart,
} from "../../../systemSlice";
import DeleteIDPConfigurationModal from "./DeleteIDPConfigurationModal";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";
import HelpMenu from "../HelpMenu";
import { api } from "api";
import {
  ApiError,
  HttpResponse,
  IdpServerConfiguration,
  SetIDPResponse,
} from "api/consoleApi";
import { errorToHandler } from "api/errors";

type IDPConfigurationDetailsProps = {
  formFields: object;
  endpoint: string;
  backLink: string;
  header: string;
  idpType: string;
  helpBox: React.ReactNode;
  icon: React.ReactNode;
};

const IDPConfigurationDetails = ({
  formFields,
  endpoint,
  backLink,
  header,
  idpType,
  icon,
  helpBox,
}: IDPConfigurationDetailsProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const configurationName = params.idpName;

  const [loadingDetails, setLoadingDetails] = useState<boolean>(true);
  const [loadingSave, setLoadingSave] = useState<boolean>(false);
  const [loadingEnabledSave, setLoadingEnabledSave] = useState<boolean>(false);
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [fields, setFields] = useState<any>({});
  const [overrideFields, setOverrideFields] = useState<any>({});
  const [originalFields, setOriginalFields] = useState<any>({});
  const [record, setRecord] = useState<any>({});
  const [editMode, setEditMode] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [envOverride, setEnvOverride] = useState<boolean>(false);

  const parseFields = useCallback(
    (record: any) => {
      let fields: any = {};
      let overrideFields: any = {};
      let totEnv = 0;

      if (record.info) {
        record.info.forEach((item: any) => {
          if (item.key === "enable") {
            setIsEnabled(item.value === "on");
          }

          if (item.isEnv) {
            overrideFields[item.key] =
              `MINIO_IDENTITY_OPENID_${item.key.toUpperCase()}${
                configurationName !== "_" ? `_${configurationName}` : ""
              }`;
            totEnv++;
          }

          fields[item.key] = item.value;
        });

        if (totEnv > 0) {
          setEnvOverride(true);
        }
      }
      setFields(fields);
      setOverrideFields(overrideFields);
    },
    [configurationName],
  );

  const toggleEditMode = () => {
    if (editMode) {
      parseFields(record);
    }
    setEditMode(!editMode);
  };

  const parseOriginalFields = (record: any) => {
    let fields: any = {};
    if (record.info) {
      record.info.forEach((item: any) => {
        fields[item.key] = item.value;
      });
    }
    setOriginalFields(fields);
  };

  useEffect(() => {
    const loadRecord = () => {
      api.idp
        .getConfiguration(configurationName || "", "openid")
        .then((res: HttpResponse<IdpServerConfiguration, ApiError>) => {
          if (res.data) {
            setRecord(res.data);
            parseFields(res.data);
            parseOriginalFields(res.data);
          }
        })
        .catch((res: HttpResponse<IdpServerConfiguration, ApiError>) => {
          dispatch(setErrorSnackMessage(errorToHandler(res.error)));
        })
        .finally(() => setLoadingDetails(false));
    };

    if (loadingDetails) {
      loadRecord();
    }
  }, [dispatch, loadingDetails, configurationName, endpoint, parseFields]);

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

  const resetForm = () => {
    setFields({});
  };

  const saveRecord = (event: React.FormEvent) => {
    setLoadingSave(true);
    event.preventDefault();
    let input = "";
    for (const key of Object.keys(formFields)) {
      if (fields[key] || fields[key] !== originalFields[key]) {
        input += `${key}=${fields[key]} `;
      }
    }

    api.idp
      .updateConfiguration(configurationName || "", "openid", { input })
      .then((res: HttpResponse<SetIDPResponse, ApiError>) => {
        if (res.data) {
          dispatch(setServerNeedsRestart(res.data.restart === true));
          setEditMode(false);
        }
      })
      .catch(async (res: HttpResponse<SetIDPResponse, ApiError>) => {
        dispatch(setErrorSnackMessage(errorToHandler(res.error)));
      })
      .finally(() => setLoadingSave(false));
  };

  const closeDeleteModalAndRefresh = async (refresh: boolean) => {
    setDeleteOpen(false);

    if (refresh) {
      navigate(backLink);
    }
  };

  const toggleConfiguration = (value: boolean) => {
    setLoadingEnabledSave(true);
    const input = `enable=${value ? "on" : "off"}`;

    api.idp
      .updateConfiguration(configurationName || "", "openid", { input: input })
      .then((res: HttpResponse<SetIDPResponse, ApiError>) => {
        if (res.data) {
          setIsEnabled(!isEnabled);
          dispatch(setServerNeedsRestart(res.data.restart === true));
        }
      })
      .catch((res: HttpResponse<SetIDPResponse, ApiError>) => {
        dispatch(setErrorSnackMessage(errorToHandler(res.error)));
      })
      .finally(() => setLoadingEnabledSave(false));
  };

  const renderFormField = (key: string, value: any) => {
    switch (value.type) {
      case "toggle":
        return (
          <Switch
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

  const renderEditForm = () => {
    return (
      <FormLayout helpBox={helpBox}>
        <form
          noValidate
          autoComplete="off"
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            saveRecord(e);
          }}
        >
          <Grid container>
            {editMode ? (
              <Grid item xs={12} sx={{ marginBottom: 15 }}>
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
                      Client Secret must be re-entered to change OpenID
                      configurations
                    </Box>
                  }
                  iconComponent={<WarnIcon />}
                  help={null}
                />
              </Grid>
            ) : null}
            <Grid xs={12} item>
              {Object.entries(formFields).map(([key, value]) =>
                renderFormField(key, value),
              )}
              <Grid item xs={12} sx={modalStyleUtils.modalButtonBar}>
                {editMode && (
                  <Button
                    id={"clear"}
                    type="button"
                    variant="regular"
                    onClick={resetForm}
                    label={"Clear"}
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
                    disabled={loadingDetails || loadingSave || !validSave()}
                    label={"Save"}
                  />
                )}
              </Grid>
            </Grid>
          </Grid>
        </form>
      </FormLayout>
    );
  };
  const renderViewForm = () => {
    return (
      <Box
        withBorders
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gridAutoFlow: "dense",
          gap: 3,
          padding: "15px",
          [`@media (min-width: ${breakPoints.sm}px)`]: {
            gridTemplateColumns: "2fr 1fr",
            gridAutoFlow: "row",
          },
        }}
      >
        {Object.entries(formFields).map(([key, value]) => {
          if (!value.editOnly) {
            let label: React.ReactNode = value.label;
            let val: React.ReactNode = fields[key] ? fields[key] : "";

            if (value.type === "toggle" && fields[key]) {
              if (val !== "on") {
                val = "Off";
              } else {
                val = "On";
              }
            }

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
                  <span className={"muted"}>{val}</span>
                </i>
              );
            }
            return <ValuePair key={key} label={label} value={val} />;
          }
          return null;
        })}
      </Box>
    );
  };

  useEffect(() => {
    dispatch(setHelpName("idp_config"));
  }, [dispatch]);

  return (
    <Fragment>
      {deleteOpen && configurationName && (
        <DeleteIDPConfigurationModal
          deleteOpen={deleteOpen}
          idp={configurationName}
          idpType={idpType}
          closeDeleteModalAndRefresh={closeDeleteModalAndRefresh}
        />
      )}
      <Grid item xs={12}>
        <PageHeaderWrapper
          label={<BackLink onClick={() => navigate(backLink)} label={header} />}
          actions={<HelpMenu />}
        />
        <PageLayout>
          <ScreenTitle
            icon={icon}
            title={
              configurationName === "_" ? "Default" : configurationName || ""
            }
            subTitle={null}
            actions={
              <Fragment>
                {configurationName !== "_" && (
                  <Tooltip
                    tooltip={
                      envOverride
                        ? "This configuration cannot be deleted using this module as this was set using OpenID environment variables."
                        : ""
                    }
                  >
                    <Button
                      id={"delete-idp-config"}
                      onClick={() => {
                        setDeleteOpen(true);
                      }}
                      label={"Delete Configuration"}
                      icon={<TrashIcon />}
                      variant={"secondary"}
                      disabled={envOverride}
                    />
                  </Tooltip>
                )}
                {!editMode && (
                  <Tooltip
                    tooltip={
                      envOverride
                        ? "Configuration cannot be edited in this module as OpenID environment variables are set for this MinIO instance."
                        : ""
                    }
                  >
                    <Button
                      id={"edit"}
                      type="button"
                      variant={"callAction"}
                      icon={<EditIcon />}
                      onClick={toggleEditMode}
                      label={"Edit"}
                      disabled={envOverride}
                    />
                  </Tooltip>
                )}
                <Tooltip
                  tooltip={
                    envOverride
                      ? "Configuration cannot be disabled / enabled in this module as OpenID environment variables are set for this MinIO instance."
                      : ""
                  }
                >
                  <Button
                    id={"is-configuration-enabled"}
                    onClick={() => toggleConfiguration(!isEnabled)}
                    label={isEnabled ? "Disable" : "Enable"}
                    disabled={loadingEnabledSave || envOverride}
                  />
                </Tooltip>
                <Button
                  id={"refresh-idp-config"}
                  onClick={() => setLoadingDetails(true)}
                  label={"Refresh"}
                  icon={<RefreshIcon />}
                />
              </Fragment>
            }
            sx={{
              marginBottom: 15,
            }}
          />
          {editMode ? renderEditForm() : renderViewForm()}
        </PageLayout>
      </Grid>
    </Fragment>
  );
};

export default IDPConfigurationDetails;
