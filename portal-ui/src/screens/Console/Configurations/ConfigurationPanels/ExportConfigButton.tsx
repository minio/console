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
