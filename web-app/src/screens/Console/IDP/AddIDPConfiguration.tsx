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

import React, { useEffect, useState } from "react";
import {
  BackLink,
  Button,
  FormLayout,
  Grid,
  InputBox,
  PageLayout,
  SectionTitle,
  Switch,
} from "mds";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../store";
import { modalStyleUtils } from "../Common/FormComponents/common/styleLibrary";
import {
  setErrorSnackMessage,
  setHelpName,
  setServerNeedsRestart,
} from "../../../systemSlice";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";
import HelpMenu from "../HelpMenu";
import { api } from "api";
import { ApiError, HttpResponse, SetIDPResponse } from "api/consoleApi";
import { errorToHandler } from "api/errors";

type AddIDPConfigurationProps = {
  classes?: any;
  icon: React.ReactNode;
  helpBox: React.ReactNode;
  header: string;
  title: string;
  backLink: string;
  formFields: object;
};

const AddIDPConfiguration = ({
  icon,
  helpBox,
  header,
  backLink,
  title,
  formFields,
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
  const [loadingCreate, setLoadingCreate] = useState<boolean>(false);

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
    setLoadingCreate(true);
    event.preventDefault();
    const name = fields["name"];
    let input = "";
    for (const key of Object.keys(formFields)) {
      if (fields[key]) {
        input += `${key}=${fields[key]} `;
      }
    }

    api.idp
      .createConfiguration("openid", { name, input })
      .then((res: HttpResponse<SetIDPResponse, ApiError>) => {
        navigate(backLink);
        dispatch(setServerNeedsRestart(res.data.restart === true));
      })
      .catch((res: HttpResponse<SetIDPResponse, ApiError>) => {
        dispatch(setErrorSnackMessage(errorToHandler(res.error)));
      })
      .finally(() => setLoadingCreate(false));
  };

  const renderFormField = (key: string, value: any) => {
    switch (value.type) {
      case "toggle":
        return (
          <Switch
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
          <InputBox
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

  useEffect(() => {
    dispatch(setHelpName("add_idp_config"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid item xs={12}>
      <PageHeaderWrapper
        label={<BackLink onClick={() => navigate(backLink)} label={header} />}
        actions={<HelpMenu />}
      />
      <PageLayout>
        <FormLayout helpBox={helpBox}>
          <SectionTitle icon={icon}>{title}</SectionTitle>
          <form
            noValidate
            autoComplete="off"
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              addRecord(e);
            }}
          >
            <Grid container>
              <Grid xs={12} item>
                {Object.entries(extraFormFields).map(([key, value]) =>
                  renderFormField(key, value),
                )}
                <Grid item xs={12} sx={modalStyleUtils.modalButtonBar}>
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
                    disabled={loadingCreate || !validSave()}
                    label={"Save"}
                  />
                </Grid>
              </Grid>
            </Grid>
          </form>
        </FormLayout>
      </PageLayout>
    </Grid>
  );
};

export default AddIDPConfiguration;
