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

import React, { Fragment, useEffect, useState } from "react";

import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Box, Grid } from "@mui/material";
import {
  buttonsStyles,
  containerForHeader,
  formFieldStyles,
  hrClass,
  modalBasic,
  pageContentStyles,
  searchField,
} from "../Common/FormComponents/common/styleLibrary";
import { RefreshIcon, TrashIcon } from "../../../icons";
import InputBoxWrapper from "../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import { Button } from "mds";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorResponseHandler } from "../../../common/types";
import { useAppDispatch } from "../../../store";
import {
  setErrorSnackMessage,
  setServerNeedsRestart,
} from "../../../systemSlice";
import useApi from "../Common/Hooks/useApi";
import api from "../../../common/api";
import PageLayout from "../Common/Layout/PageLayout";
import PageHeader from "../Common/PageHeader/PageHeader";
import BackLink from "../../../common/BackLink";
import ScreenTitle from "../Common/ScreenTitle/ScreenTitle";
import DeleteIDPConfigurationModal from "./DeleteIDPConfigurationModal";
import FormSwitchWrapper from "../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";

type IDPConfigurationDetailsProps = {
  classes?: any;
  formFields: object;
  endpoint: string;
  backLink: string;
  header: string;
  idpType: string;
  icon: React.ReactNode;
};

const styles = (theme: Theme) =>
  createStyles({
    ...formFieldStyles,
    formFieldRow: {
      ...formFieldStyles.formFieldRow,
    },
    ...modalBasic,
    pageContainer: {
      height: "100%",
    },
    screenTitle: {
      border: 0,
      paddingTop: 0,
    },
    ...pageContentStyles,
    ...searchField,
    capitalize: {
      textTransform: "capitalize",
    },
    ...hrClass,
    ...buttonsStyles,
    ...containerForHeader(theme.spacing(4)),
  });

const IDPConfigurationDetails = ({
  classes,
  formFields,
  endpoint,
  backLink,
  header,
  idpType,
  icon,
}: IDPConfigurationDetailsProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const configurationName = params.idpName;

  const [loading, setLoading] = useState<boolean>(true);
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [fields, setFields] = useState<any>({});
  const [originalFields, setOriginalFields] = useState<any>({});
  const [record, setRecord] = useState<any>({});
  const [editMode, setEditMode] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);

  const onSuccess = (res: any) => {
    dispatch(setServerNeedsRestart(res.restart === true));
  };

  const onError = (err: ErrorResponseHandler) =>
    dispatch(setErrorSnackMessage(err));

  const [loadingSave, invokeApi] = useApi(onSuccess, onError);

  const onEnabledSuccess = (res: any) => {
    setIsEnabled(!isEnabled);
    dispatch(setServerNeedsRestart(res.restart === true));
  };

  const onEnabledError = (err: ErrorResponseHandler) => {
    dispatch(setErrorSnackMessage(err));
  };

  const [loadingEnabledSave, invokeEnabledApi] = useApi(
    onEnabledSuccess,
    onEnabledError
  );

  const toggleEditMode = () => {
    if (editMode) {
      parseFields(record);
    }
    setEditMode(!editMode);
  };

  const parseFields = (record: any) => {
    let fields: any = {};
    if (record.info) {
      record.info.forEach((item: any) => {
        if (item.key === "enable") {
          setIsEnabled(item.value === "on");
        }
        fields[item.key] = item.value;
      });
    }
    setFields(fields);
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
    setLoading(true);
  }, []);

  useEffect(() => {
    const loadRecord = () => {
      api
        .invoke("GET", `${endpoint}${configurationName}`)
        .then((result: any) => {
          if (result) {
            setRecord(result);
            parseFields(result);
            parseOriginalFields(result);
          }
          setLoading(false);
        })
        .catch((err: ErrorResponseHandler) => {
          dispatch(setErrorSnackMessage(err));
          setLoading(false);
        });
    };
    if (loading) {
      loadRecord();
    }
  }, [dispatch, loading, configurationName, endpoint]);

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
    event.preventDefault();
    let input = "";
    for (const key of Object.keys(formFields)) {
      if (fields[key] || fields[key] !== originalFields[key]) {
        input += `${key}=${fields[key]} `;
      }
    }
    invokeApi("PUT", `${endpoint}${configurationName}`, { input });
    setEditMode(false);
  };

  const closeDeleteModalAndRefresh = async (refresh: boolean) => {
    setDeleteOpen(false);

    if (refresh) {
      navigate(backLink);
    }
  };

  const toggleConfiguration = (value: boolean) => {
    const input = `enable=${value ? "on" : "off"}`;
    invokeEnabledApi("PUT", `${endpoint}${configurationName}`, { input });
  };

  return (
    <Grid item xs={12}>
      {deleteOpen && configurationName && (
        <DeleteIDPConfigurationModal
          deleteOpen={deleteOpen}
          idp={configurationName}
          idpType={idpType}
          closeDeleteModalAndRefresh={closeDeleteModalAndRefresh}
        />
      )}
      <PageHeader
        label={<BackLink to={backLink} label={header} />}
        actions={
          <FormSwitchWrapper
            label={""}
            indicatorLabels={["Enabled", "Disabled"]}
            checked={isEnabled}
            value={"is-configuration-enabled"}
            id={"is-configuration-enabled"}
            name={"is-configuration-enabled"}
            onChange={(e) => toggleConfiguration(e.target.checked)}
            description=""
            disabled={loadingEnabledSave}
          />
        }
      />
      <PageLayout className={classes.pageContainer}>
        <Grid item xs={12}>
          <ScreenTitle
            classes={{
              screenTitle: classes.screenTitle,
            }}
            icon={icon}
            title={configurationName === "_" ? "Default" : configurationName}
            actions={
              <Fragment>
                {configurationName !== "_" && (
                  <Button
                    id={"delete-idp-config"}
                    onClick={() => {
                      setDeleteOpen(true);
                    }}
                    label={"Delete Configuration"}
                    icon={<TrashIcon />}
                    variant={"secondary"}
                  />
                )}
                <Button
                  id={"refresh-idp-config"}
                  onClick={() => setLoading(true)}
                  label={"Refresh"}
                  icon={<RefreshIcon />}
                />
              </Fragment>
            }
          />
        </Grid>
        <form
          noValidate
          autoComplete="off"
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            saveRecord(e);
          }}
        >
          <Grid container item spacing="20" sx={{ marginTop: 1 }}>
            <Grid xs={12} item className={classes.fieldBox}>
              {Object.entries(formFields).map(([key, value]) => (
                <Grid item xs={12} className={classes.formFieldRow} key={key}>
                  <InputBoxWrapper
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
                </Grid>
              ))}
              <Grid item xs={12} textAlign={"right"}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    marginTop: "20px",
                    gap: "15px",
                  }}
                >
                  <Button
                    id={"edit"}
                    type="button"
                    variant={editMode ? "regular" : "callAction"}
                    onClick={toggleEditMode}
                    label={editMode ? "Cancel" : "Edit"}
                  />
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
                      id={"save-key"}
                      type="submit"
                      variant="callAction"
                      color="primary"
                      disabled={loading || loadingSave || !validSave()}
                      label={"Save"}
                    />
                  )}
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </PageLayout>
    </Grid>
  );
};

export default withStyles(styles)(IDPConfigurationDetails);
