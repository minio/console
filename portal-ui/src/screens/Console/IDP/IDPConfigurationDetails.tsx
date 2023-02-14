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
  containerForHeader,
  formFieldStyles,
  modalBasic,
  pageContentStyles,
  searchField,
} from "../Common/FormComponents/common/styleLibrary";
import { BackLink, Button, EditIcon, RefreshIcon, TrashIcon } from "mds";
import InputBoxWrapper from "../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
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
import ScreenTitle from "../Common/ScreenTitle/ScreenTitle";
import DeleteIDPConfigurationModal from "./DeleteIDPConfigurationModal";
import FormSwitchWrapper from "../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import LabelValuePair from "../Common/UsageBarWrapper/LabelValuePair";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";

type IDPConfigurationDetailsProps = {
  classes?: any;
  formFields: object;
  endpoint: string;
  backLink: string;
  header: string;
  idpType: string;
  helpBox: React.ReactNode;
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
    ...pageContentStyles,
    ...searchField,

    ...containerForHeader,
  });

const IDPConfigurationDetails = ({
  classes,
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

  const renderFormField = (key: string, value: any) => {
    switch (value.type) {
      case "toggle":
        return (
          <FormSwitchWrapper
            indicatorLabels={["Enabled", "Disabled"]}
            checked={fields[key] === "on" ? true : false}
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
        );
    }
  };

  const renderEditForm = () => {
    return (
      <Box
        sx={{
          display: "grid",
          padding: "25px",
          gap: "25px",
          gridTemplateColumns: {
            md: "2fr 1.2fr",
            xs: "1fr",
          },
          border: "1px solid #eaeaea",
        }}
      >
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
                  {renderFormField(key, value)}
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
                      disabled={loading || loadingSave || !validSave()}
                      label={"Save"}
                    />
                  )}
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </form>
        {helpBox}
      </Box>
    );
  };
  const renderViewForm = () => {
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "2fr 1fr" },
          gridAutoFlow: { xs: "dense", sm: "row" },
          gap: 3,
          padding: "15px",
          border: "1px solid #eaeaea",
        }}
      >
        {Object.entries(formFields).map(([key, value]) => (
          <LabelValuePair
            key={key}
            label={value.label}
            value={fields[key] ? fields[key] : ""}
          />
        ))}
      </Box>
    );
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
      <PageHeaderWrapper
        label={<BackLink onClick={() => navigate(backLink)} label={header} />}
      />
      <PageLayout className={classes.pageContainer}>
        <Box>
          <ScreenTitle
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
                {!editMode && (
                  <Button
                    id={"edit"}
                    type="button"
                    variant={"callAction"}
                    icon={<EditIcon />}
                    onClick={toggleEditMode}
                    label={"Edit"}
                  />
                )}
                <Button
                  id={"is-configuration-enabled"}
                  onClick={() => toggleConfiguration(!isEnabled)}
                  label={isEnabled ? "Disable" : "Enable"}
                  disabled={loadingEnabledSave}
                />
                <Button
                  id={"refresh-idp-config"}
                  onClick={() => setLoading(true)}
                  label={"Refresh"}
                  icon={<RefreshIcon />}
                />
              </Fragment>
            }
          />

          {editMode ? renderEditForm() : renderViewForm()}
        </Box>
      </PageLayout>
    </Grid>
  );
};

export default withStyles(styles)(IDPConfigurationDetails);
