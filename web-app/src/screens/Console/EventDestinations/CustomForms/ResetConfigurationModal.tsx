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

import React, { Fragment, useEffect, useState } from "react";
import { api } from "api";
import { errorToHandler } from "api/errors";
import ConfirmDialog from "../../Common/ModalWrapper/ConfirmDialog";

import { ConfirmDeleteIcon, ProgressBar } from "mds";
import { setErrorSnackMessage } from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";

interface IResetConfiguration {
  configurationName: string;
  closeResetModalAndRefresh: (reloadConfiguration: boolean) => void;
  resetOpen: boolean;
}

const ResetConfigurationModal = ({
  configurationName,
  closeResetModalAndRefresh,
  resetOpen,
}: IResetConfiguration) => {
  const dispatch = useAppDispatch();
  const [resetLoading, setResetLoading] = useState<boolean>(false);

  useEffect(() => {
    if (resetLoading) {
      api.configs
        .resetConfig(configurationName)
        .then(() => {
          setResetLoading(false);
          closeResetModalAndRefresh(true);
        })
        .catch((err) => {
          setResetLoading(false);
          dispatch(setErrorSnackMessage(errorToHandler(err.error)));
        });
    }
  }, [closeResetModalAndRefresh, configurationName, resetLoading, dispatch]);

  const resetConfiguration = () => {
    setResetLoading(true);
  };

  return (
    <ConfirmDialog
      title={`Restore Defaults`}
      confirmText={"Yes, Reset Configuration"}
      isOpen={resetOpen}
      titleIcon={<ConfirmDeleteIcon />}
      isLoading={resetLoading}
      onConfirm={resetConfiguration}
      onClose={() => {
        closeResetModalAndRefresh(false);
      }}
      confirmationContent={
        <Fragment>
          {resetLoading && <ProgressBar />}
          <Fragment>
            Are you sure you want to restore these configurations to default
            values?
            <br />
            <b
              style={{
                maxWidth: "200px",
                whiteSpace: "normal",
                wordWrap: "break-word",
              }}
            >
              Please note that this may cause your system to not be accessible
            </b>
          </Fragment>
        </Fragment>
      }
    />
  );
};

export default ResetConfigurationModal;
