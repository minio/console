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
import { AddAccessRuleIcon, Button, FormLayout, Grid, Select } from "mds";
import { api } from "api";
import { errorToHandler } from "api/errors";
import { modalStyleUtils } from "../../Common/FormComponents/common/styleLibrary";
import { setErrorSnackMessage } from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";

interface IEditAccessRule {
  modalOpen: boolean;
  onClose: () => any;
  bucket: string;
  toEdit: string;
  initial: string;
}

const EditAccessRule = ({
  modalOpen,
  onClose,
  bucket,
  toEdit,
  initial,
}: IEditAccessRule) => {
  const dispatch = useAppDispatch();
  const [selectedAccess, setSelectedAccess] = useState<any>(initial);

  const accessOptions = [
    { label: "readonly", value: "readonly" },
    { label: "writeonly", value: "writeonly" },
    { label: "readwrite", value: "readwrite" },
  ];

  const resetForm = () => {
    setSelectedAccess(initial);
  };

  const createProcess = () => {
    api.bucket
      .setAccessRuleWithBucket(bucket, {
        prefix: toEdit,
        access: selectedAccess,
      })
      .then(() => {
        onClose();
      })
      .catch((err) => {
        dispatch(setErrorSnackMessage(errorToHandler(err.error)));
        onClose();
      });
  };

  return (
    <Fragment>
      <ModalWrapper
        modalOpen={modalOpen}
        title={`Edit Anonymous Access Rule for ${`${bucket}/${toEdit || ""}`}`}
        onClose={onClose}
        titleIcon={<AddAccessRuleIcon />}
      >
        <FormLayout containerPadding={false} withBorders={false}>
          <Select
            id="access"
            name="Access"
            onChange={(value) => {
              setSelectedAccess(value);
            }}
            label="Access"
            value={selectedAccess}
            options={accessOptions}
            disabled={false}
          />
        </FormLayout>
        <Grid item xs={12} sx={modalStyleUtils.modalButtonBar}>
          <Button
            id={"clear"}
            type="button"
            variant="regular"
            onClick={resetForm}
            label={"Clear"}
          />
          <Button
            id={"save"}
            type="submit"
            variant="callAction"
            onClick={createProcess}
            label={"Save"}
          />
        </Grid>
      </ModalWrapper>
    </Fragment>
  );
};

export default EditAccessRule;
