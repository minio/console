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

import React, { useState } from "react";

import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Box, Grid } from "@mui/material";
import {
  formFieldStyles,
  modalBasic,
} from "../Common/FormComponents/common/styleLibrary";
import InputBoxWrapper from "../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import { Button, PageHeader } from "mds";
import { useNavigate } from "react-router-dom";
import { ErrorResponseHandler } from "../../../common/types";
import { useAppDispatch } from "../../../store";
import {
  setErrorSnackMessage,
  setServerNeedsRestart,
} from "../../../systemSlice";
import useApi from "../Common/Hooks/useApi";
import BackLink from "../../../common/BackLink";
import PageLayout from "../Common/Layout/PageLayout";
import SectionTitle from "../Common/SectionTitle";
import FormSwitchWrapper from "../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";

type AddIDPConfigurationProps = {
  classes?: any;
  icon: React.ReactNode;
  helpBox: React.ReactNode;
  header: string;
  title: string;
  backLink: string;
  formFields: object;
  endpoint: string;
};

const styles = (theme: Theme) =>
  createStyles({
    ...formFieldStyles,
    ...modalBasic,
  });

const AddIDPConfiguration = ({
  classes,
  icon,
  helpBox,
  header,
  backLink,
  title,
  formFields,
  endpoint,
}: AddIDPConfigurationProps) => {
  const extraFormFields = {
    name: {
      required: true,
      hasError: (s: string, editMode: boolean) => {
        return !s && editMode ? "Config Name is required" : "";
      },
      label: "Name",
      tooltip: "Name for identity provider configuration",
      placeholder: "Name",
      type: "text",
    },
    ...formFields,
  };

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [fields, setFields] = useState<any>({});

  const onSuccess = (res: any) => {
    navigate(backLink);
    dispatch(setServerNeedsRestart(res.restart === true));
  };

  const onError = (err: ErrorResponseHandler) =>
    dispatch(setErrorSnackMessage(err));

  const [loading, invokeApi] = useApi(onSuccess, onError);

  const validSave = () => {
    for (const [key, value] of Object.entries(extraFormFields)) {
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

  const addRecord = (event: React.FormEvent) => {
    event.preventDefault();
    const name = fields["name"];
    let input = "";
    for (const key of Object.keys(formFields)) {
      if (fields[key]) {
        input += `${key}=${fields[key]} `;
      }
    }
    invokeApi("POST", endpoint, { name, input });
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
            error={value.hasError(fields[key], true)}
            value={fields[key] ? fields[key] : ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFields({ ...fields, [key]: e.target.value })
            }
            placeholder={value.placeholder}
            type={value.type}
          />
        );
    }
  };

  return (
    <Grid item xs={12}>
      <PageHeader label={<BackLink to={backLink} label={header} />} />
      <PageLayout>
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
          <Box>
            <SectionTitle icon={icon}>{title}</SectionTitle>
            <form
              noValidate
              autoComplete="off"
              onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                addRecord(e);
              }}
            >
              <Grid container item spacing="20" sx={{ marginTop: 1 }}>
                <Grid xs={12} item>
                  {Object.entries(extraFormFields).map(([key, value]) => (
                    <Grid
                      item
                      xs={12}
                      className={classes.formFieldRow}
                      key={key}
                    >
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
                      <Button
                        id={"clear"}
                        type="button"
                        variant="regular"
                        onClick={resetForm}
                        label={"Clear"}
                      />

                      <Button
                        id={"save-key"}
                        type="submit"
                        variant="callAction"
                        color="primary"
                        disabled={loading || !validSave()}
                        label={"Save"}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </form>
          </Box>
          {helpBox}
        </Box>
      </PageLayout>
    </Grid>
  );
};

export default withStyles(styles)(AddIDPConfiguration);
