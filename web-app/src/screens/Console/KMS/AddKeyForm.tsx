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
import {
  AddAccessRuleIcon,
  Button,
  FormLayout,
  PageLayout,
  Grid,
  InputBox,
} from "mds";
import { ErrorResponseHandler } from "../../../common/types";
import { modalStyleUtils } from "../Common/FormComponents/common/styleLibrary";
import useApi from "../Common/Hooks/useApi";
import KMSHelpBox from "./KMSHelpbox";

interface IAddKeyFormProps {
  onSuccess: () => void;
  onError: (err: ErrorResponseHandler) => void;
}

const AddKeyForm = ({ onSuccess, onError }: IAddKeyFormProps) => {
  const [loading, invokeApi] = useApi(onSuccess, onError);
  const [keyName, setKeyName] = useState<string>("");

  const addRecord = (event: React.FormEvent) => {
    event.preventDefault();
    invokeApi("POST", "/api/v1/kms/keys/", { key: keyName });
  };

  const resetForm = () => {
    setKeyName("");
  };

  const validateKeyName = (keyName: string) => {
    if (keyName.indexOf(" ") !== -1) {
      return "Key name cannot contain spaces";
    } else return "";
  };

  const validSave = keyName.trim() !== "" && keyName.indexOf(" ") === -1;

  return (
    <PageLayout>
      <FormLayout
        title={"Create Key"}
        icon={<AddAccessRuleIcon />}
        helpBox={
          <KMSHelpBox
            helpText={"Encryption Key"}
            contents={[
              "Create a new cryptographic key in the Key Management Service server connected to MINIO.",
            ]}
          />
        }
      >
        <form
          noValidate
          autoComplete="off"
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            addRecord(e);
          }}
        >
          <Grid container>
            <Grid item xs={12}>
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
            </Grid>
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
                disabled={loading || !validSave}
                label={"Save"}
              />
            </Grid>
          </Grid>
        </form>
      </FormLayout>
    </PageLayout>
  );
};

export default AddKeyForm;
