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

import React, { Fragment, useState } from "react";
import { Box, Button, FormLayout, ModalBox, Switch } from "mds";
import { BucketVersioningResponse } from "api/consoleApi";
import { api } from "api";
import { errorToHandler } from "api/errors";
import { setErrorSnackMessage } from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";
import CSVMultiSelector from "../../Common/FormComponents/CSVMultiSelector/CSVMultiSelector";
import { modalStyleUtils } from "../../Common/FormComponents/common/styleLibrary";

interface IVersioningEventProps {
  closeVersioningModalAndRefresh: (refresh: boolean) => void;
  modalOpen: boolean;
  selectedBucket: string;
  versioningInfo: BucketVersioningResponse | undefined;
  objectLockingEnabled: boolean;
}

const parseExcludedPrefixes = (
  bucketVersioning: BucketVersioningResponse | undefined,
) => {
  const excludedPrefixes = bucketVersioning?.excludedPrefixes;

  if (excludedPrefixes) {
    return excludedPrefixes.map((item) => item.prefix).join(",");
  }

  return "";
};

const EnableVersioningModal = ({
  closeVersioningModalAndRefresh,
  modalOpen,
  selectedBucket,
  versioningInfo = {},
  objectLockingEnabled,
}: IVersioningEventProps) => {
  const dispatch = useAppDispatch();

  const [versioningLoading, setVersioningLoading] = useState<boolean>(false);
  const [versionState, setVersionState] = useState<boolean>(
    versioningInfo?.status === "Enabled",
  );
  const [excludeFolders, setExcludeFolders] = useState<boolean>(
    !!versioningInfo?.excludeFolders,
  );
  const [excludedPrefixes, setExcludedPrefixes] = useState<string>(
    parseExcludedPrefixes(versioningInfo),
  );

  const enableVersioning = () => {
    if (versioningLoading) {
      return;
    }
    setVersioningLoading(true);

    api.buckets
      .setBucketVersioning(selectedBucket, {
        enabled: versionState,
        excludeFolders: versionState ? excludeFolders : false,
        excludePrefixes: versionState
          ? excludedPrefixes.split(",").filter((item) => item.trim() !== "")
          : [],
      })
      .then(() => {
        setVersioningLoading(false);
        closeVersioningModalAndRefresh(true);
      })
      .catch((err) => {
        setVersioningLoading(false);
        dispatch(setErrorSnackMessage(errorToHandler(err.error)));
      });
  };

  const resetForm = () => {
    setExcludedPrefixes("");
    setExcludeFolders(false);
    setVersionState(false);
  };

  return (
    <ModalBox
      onClose={() => closeVersioningModalAndRefresh(false)}
      open={modalOpen}
      title={`Versioning on Bucket`}
    >
      <FormLayout withBorders={false} containerPadding={false}>
        <Switch
          id={"activateVersioning"}
          label={"Versioning Status"}
          checked={versionState}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setVersionState(e.target.checked);
          }}
          indicatorLabels={["Enabled", "Disabled"]}
        />
        {versionState && !objectLockingEnabled && (
          <Fragment>
            <Switch
              id={"excludeFolders"}
              label={"Exclude Folders"}
              checked={excludeFolders}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setExcludeFolders(e.target.checked);
              }}
              indicatorLabels={["Enabled", "Disabled"]}
            />
            <CSVMultiSelector
              elements={excludedPrefixes}
              label={"Excluded Prefixes"}
              name={"excludedPrefixes"}
              onChange={(value: string | string[]) => {
                let valCh = "";

                if (Array.isArray(value)) {
                  valCh = value.join(",");
                } else {
                  valCh = value;
                }
                setExcludedPrefixes(valCh);
              }}
              withBorder={true}
            />
          </Fragment>
        )}
        <Box sx={modalStyleUtils.modalButtonBar}>
          <Button
            id={"clear"}
            type="button"
            variant="regular"
            color="primary"
            onClick={resetForm}
            label={"Clear"}
          />
          <Button
            type="submit"
            variant="callAction"
            onClick={enableVersioning}
            id="saveTag"
            label={"Save"}
          />
        </Box>
      </FormLayout>
    </ModalBox>
  );
};

export default EnableVersioningModal;
