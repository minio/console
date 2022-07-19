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

import React, { Fragment, useState } from "react";
import { Box, Button } from "@mui/material";
import { OnlineRegistrationIcon } from "../../../icons";
import { FormTitle } from "./utils";
import InputBoxWrapper from "../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import GetApiKeyModal from "./GetApiKeyModal";

interface IApiKeyRegister {
  classes: any;
  apiKey: string;
  setApiKey: (v: string) => void;
  onRegister: () => void;
  loading: boolean;
}

const ApiKeyRegister = ({
  classes,
  apiKey,
  setApiKey,
  loading,
  onRegister,
}: IApiKeyRegister) => {
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  return (
    <Fragment>
      <Box
        sx={{
          "& .title-text": {
            marginLeft: "27px",
            fontWeight: 600,
          },
        }}
      >
        <FormTitle
          icon={<OnlineRegistrationIcon />}
          title={`API key activation of MinIO Subscription Network License`}
        />
      </Box>

      <Box
        sx={{
          flex: "1",
          paddingTop: "30px",
        }}
      >
        <InputBoxWrapper
          className={classes.spacerBottom}
          classes={{
            inputLabel: classes.sizedLabel,
          }}
          id="api-key"
          name="api-key"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setApiKey(event.target.value)
          }
          label="API Key"
          value={apiKey}
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="outlined"
            className={classes.spacerRight}
            disabled={loading}
            onClick={() => setShowApiKeyModal(true)}
          >
            Get from SUBNET
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || apiKey.trim().length === 0}
            onClick={() => onRegister()}
          >
            Register
          </Button>
          <GetApiKeyModal
            open={showApiKeyModal}
            closeModal={() => setShowApiKeyModal(false)}
            onSet={setApiKey}
          />
        </Box>
      </Box>
    </Fragment>
  );
};

export default ApiKeyRegister;
