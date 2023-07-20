import React, { Fragment, useEffect, useRef, useState } from "react";
import { Button, DownloadIcon } from "mds";
import useApi from "../../Common/Hooks/useApi";
import {
  setErrorSnackMessage,
  setServerNeedsRestart,
} from "../../../../systemSlice";
import TooltipWrapper from "../../Common/TooltipWrapper/TooltipWrapper";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppState } from "../../../../store";

const ImportConfigButton = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const needsRestart = useSelector(
    (state: AppState) => state.system.serverNeedsRestart,
  );

  const [refreshPage, setRefreshPage] = useState<boolean | undefined>(
    undefined,
  );
  const fileUpload = useRef<HTMLInputElement>(null);

  const [isReqLoading, invokeApi] = useApi(
    (res: any) => {
      //base64 encoded information so decode before downloading.
      dispatch(setServerNeedsRestart(true)); //import should refreshPage as per mc.
      setRefreshPage(true);
    },
    (err) => {
      dispatch(setErrorSnackMessage(err));
    },
  );

  useEffect(() => {
    if (!needsRestart && refreshPage) {
      navigate(0); // refresh the page.
    }
  }, [needsRestart, refreshPage, navigate]);

  const handleUploadButton = (e: any) => {
    if (
      e === null ||
      e === undefined ||
      e.target.files === null ||
      e.target.files === undefined
    ) {
      return;
    }
    e.preventDefault();
    const [fileToUpload] = e.target.files;

    const formData = new FormData();
    const blobFile = new Blob([fileToUpload], { type: fileToUpload.type });

    formData.append("file", blobFile, fileToUpload.name);
    // @ts-ignore
    invokeApi("POST", `api/v1/configs/import`, formData);

    e.target.value = "";
  };

  return (
    <Fragment>
      <input
        type="file"
        onChange={handleUploadButton}
        style={{ display: "none" }}
        ref={fileUpload}
      />
      <TooltipWrapper tooltip="The file must be valid and  should have valid config values">
        <Button
          id={"import-config"}
          onClick={() => {
            if (fileUpload && fileUpload.current) {
              fileUpload.current.click();
            }
          }}
          icon={<DownloadIcon />}
          label={"Import"}
          variant={"regular"}
          disabled={isReqLoading}
        />
      </TooltipWrapper>
    </Fragment>
  );
};

export default ImportConfigButton;
