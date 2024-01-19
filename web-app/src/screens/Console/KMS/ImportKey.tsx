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
import {
  AddAccessRuleIcon,
  BackLink,
  Button,
  CodeEditor,
  FormLayout,
  Grid,
  InputBox,
  PageLayout,
} from "mds";
import { useNavigate } from "react-router-dom";
import { IAM_PAGES } from "../../../common/SecureComponent/permissions";
import { setErrorSnackMessage, setHelpName } from "../../../systemSlice";
import { useAppDispatch } from "../../../store";
import { modalStyleUtils } from "../Common/FormComponents/common/styleLibrary";
import KMSHelpBox from "./KMSHelpbox";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";
import HelpMenu from "../HelpMenu";
import { api } from "api";
import { ApiError, HttpResponse } from "api/consoleApi";
import { errorToHandler } from "api/errors";

export const emptyContent = '{\n    "bytes": ""\n}';

const ImportKey = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [loadingImport, setLoadingImport] = useState<boolean>(false);
  const [keyName, setKeyName] = useState<string>("");
  const [keyContent, setKeyContent] = useState<string>(emptyContent);

  const importRecord = (event: React.FormEvent) => {
    setLoadingImport(true);
    event.preventDefault();
    let data = JSON.parse(keyContent);

    api.kms
      .kmsImportKey(keyName, data)
      .then((_) => {
        navigate(`${IAM_PAGES.KMS_KEYS}`);
      })
      .catch(async (res: HttpResponse<void, ApiError>) => {
        const err = (await res.json()) as ApiError;
        dispatch(setErrorSnackMessage(errorToHandler(err)));
      })
      .finally(() => setLoadingImport(false));
  };

  const resetForm = () => {
    setKeyName("");
    setKeyContent("");
  };

  const validateKeyName = (keyName: string) => {
    if (keyName.indexOf(" ") !== -1) {
      return "Key name cannot contain spaces";
    } else return "";
  };

  const validSave = keyName.trim() !== "" && keyName.indexOf(" ") === -1;

  useEffect(() => {
    dispatch(setHelpName("import_key"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <Grid item xs={12}>
        <PageHeaderWrapper
          label={
            <BackLink
              onClick={() => navigate(IAM_PAGES.KMS_KEYS)}
              label={"Keys"}
            />
          }
          actions={<HelpMenu />}
        />
        <PageLayout>
          <FormLayout
            title={"Import Key"}
            icon={<AddAccessRuleIcon />}
            helpBox={
              <KMSHelpBox
                helpText={"Encryption Key"}
                contents={[
                  "Import a cryptographic key in the Key Management Service server connected to MINIO.",
                ]}
              />
            }
          >
            <form
              noValidate
              autoComplete="off"
              onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                importRecord(e);
              }}
            >
              <InputBox
                id="key-name"
                name="key-name"
                label="Key Name"
                autoFocus={true}
                value={keyName}
                error={validateKeyName(keyName)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setKeyName(e.target.value);
                }}
              />
              <CodeEditor
                label={"Set key Content"}
                value={keyContent}
                onChange={(value) => {
                  setKeyContent(value);
                }}
                editorHeight={"350px"}
              />
              <Grid item xs={12} sx={modalStyleUtils.modalButtonBar}>
                <Button
                  id={"clear"}
                  type="button"
                  variant="regular"
                  onClick={resetForm}
                  label={"Clear"}
                />

                <Button
                  id={"import-key"}
                  type="submit"
                  variant="callAction"
                  color="primary"
                  disabled={loadingImport || !validSave}
                  label={"Import"}
                />
              </Grid>
            </form>
          </FormLayout>
        </PageLayout>
      </Grid>
    </Fragment>
  );
};

export default ImportKey;
