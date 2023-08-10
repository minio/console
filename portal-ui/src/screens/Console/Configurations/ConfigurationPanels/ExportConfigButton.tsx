// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
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

import React from "react";
import { Button, UploadIcon } from "mds";
import useApi from "../../Common/Hooks/useApi";
import { performDownload } from "../../../../common/utils";
import { DateTime } from "luxon";
import { setErrorSnackMessage } from "../../../../systemSlice";
import { useDispatch } from "react-redux";
import TooltipWrapper from "../../Common/TooltipWrapper/TooltipWrapper";

const ExportConfigButton = () => {
  const dispatch = useDispatch();
  const [isReqLoading, invokeApi] = useApi(
    (res: any) => {
      //base64 encoded information so decode before downloading.
      performDownload(
        new Blob([window.atob(res.value)]),
        `minio-server-config-${DateTime.now().toFormat(
          "LL-dd-yyyy-HH-mm-ss",
        )}.conf`,
      );
    },
    (err) => {
      dispatch(setErrorSnackMessage(err));
    },
  );

  return (
    <TooltipWrapper tooltip="Warning! The resulting file will contain server configuration information in plain text">
      <Button
        id={"export-config"}
        onClick={() => {
          invokeApi("GET", `api/v1/configs/export`);
        }}
        icon={<UploadIcon />}
        label={"Export"}
        variant={"regular"}
        disabled={isReqLoading}
      />
    </TooltipWrapper>
  );
};

export default ExportConfigButton;
