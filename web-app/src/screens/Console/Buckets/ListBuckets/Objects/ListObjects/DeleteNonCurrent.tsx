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

import { ConfirmDeleteIcon, Switch, Grid, InputBox } from "mds";
import ConfirmDialog from "../../../../Common/ModalWrapper/ConfirmDialog";
import { setErrorSnackMessage } from "../../../../../../systemSlice";
import { AppState, useAppDispatch } from "../../../../../../store";
import { hasPermission } from "../../../../../../common/SecureComponent";
import { IAM_SCOPES } from "../../../../../../common/SecureComponent/permissions";
import { useSelector } from "react-redux";
import { api } from "api";
import { errorToHandler } from "api/errors";

interface IDeleteNonCurrentProps {
  closeDeleteModalAndRefresh: (refresh: boolean) => void;
  deleteOpen: boolean;
  selectedObject: string;
  selectedBucket: string;
}

const DeleteNonCurrentVersions = ({
  closeDeleteModalAndRefresh,
  deleteOpen,
  selectedBucket,
  selectedObject,
}: IDeleteNonCurrentProps) => {
  const dispatch = useAppDispatch();
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [typeConfirm, setTypeConfirm] = useState<string>("");
  const [bypassGovernance, setBypassGovernance] = useState<boolean>(false);

  const retentionConfig = useSelector(
    (state: AppState) => state.objectBrowser.retentionConfig,
  );

  const canBypass =
    hasPermission(
      [selectedBucket],
      [IAM_SCOPES.S3_BYPASS_GOVERNANCE_RETENTION],
    ) && retentionConfig?.mode === "governance";

  useEffect(() => {
    if (deleteLoading) {
      api.buckets
        .deleteObject(selectedBucket, {
          prefix: selectedObject,
          non_current_versions: true,
          bypass: bypassGovernance,
        })
        .then(() => {
          closeDeleteModalAndRefresh(true);
        })
        .catch((err) => {
          dispatch(setErrorSnackMessage(errorToHandler(err.error)));
          setDeleteLoading(false);
        });
    }
  }, [
    deleteLoading,
    closeDeleteModalAndRefresh,
    dispatch,
    selectedObject,
    selectedBucket,
    bypassGovernance,
  ]);

  if (!selectedObject) {
    return null;
  }
  const onConfirmDelete = () => {
    setDeleteLoading(true);
  };

  return (
    <ConfirmDialog
      title={`Delete Non-Current versions`}
      confirmText={"Delete"}
      isOpen={deleteOpen}
      titleIcon={<ConfirmDeleteIcon />}
      isLoading={deleteLoading}
      onConfirm={onConfirmDelete}
      onClose={() => closeDeleteModalAndRefresh(false)}
      confirmButtonProps={{
        disabled: typeConfirm !== "YES, PROCEED" || deleteLoading,
      }}
      confirmationContent={
        <Fragment>
          Are you sure you want to delete all the non-current versions for:{" "}
          <b>{selectedObject}</b>? <br />
          {canBypass && (
            <Fragment>
              <div
                style={{
                  marginTop: 10,
                }}
              >
                <Switch
                  label={"Bypass Governance Mode"}
                  indicatorLabels={["Yes", "No"]}
                  checked={bypassGovernance}
                  value={"bypass_governance"}
                  id="bypass_governance"
                  name="bypass_governance"
                  onChange={(e) => {
                    setBypassGovernance(!bypassGovernance);
                  }}
                  description=""
                />
              </div>
            </Fragment>
          )}
          <br />
          To continue please type <b>YES, PROCEED</b> in the box.
          <br />
          <br />
          <Grid item xs={12}>
            <InputBox
              id="type-confirm"
              name="retype-tenant"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setTypeConfirm(event.target.value);
              }}
              label=""
              value={typeConfirm}
            />
          </Grid>
        </Fragment>
      }
    />
  );
};

export default DeleteNonCurrentVersions;
