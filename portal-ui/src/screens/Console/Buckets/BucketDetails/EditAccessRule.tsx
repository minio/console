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

import React, { useState } from "react";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import { Grid } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { AddAccessRuleIcon, Button } from "mds";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import {
  modalStyleUtils,
  spacingUtils,
} from "../../Common/FormComponents/common/styleLibrary";

import api from "../../../../common/api";
import { ErrorResponseHandler } from "../../../../common/types";
import SelectWrapper from "../../Common/FormComponents/SelectWrapper/SelectWrapper";
import { setErrorSnackMessage } from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";

interface IEditAccessRule {
  classes: any;
  modalOpen: boolean;
  onClose: () => any;
  bucket: string;
  toEdit: string;
  initial: string;
}

const styles = (theme: Theme) =>
  createStyles({
    ...modalStyleUtils,
    ...spacingUtils,
  });

const EditAccessRule = ({
  modalOpen,
  onClose,
  classes,
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
    api
      .invoke("PUT", `/api/v1/bucket/${bucket}/access-rules`, {
        prefix: toEdit,
        access: selectedAccess,
      })
      .then((res: any) => {
        onClose();
      })
      .catch((err: ErrorResponseHandler) => {
        dispatch(setErrorSnackMessage(err));
        onClose();
      });
  };

  return (
    <React.Fragment>
      <ModalWrapper
        modalOpen={modalOpen}
        title={`Edit Anonymous Access Rule for ${`${bucket}/${toEdit || ""}`}`}
        onClose={onClose}
        titleIcon={<AddAccessRuleIcon />}
      >
        <Grid container>
          <Grid item xs={12} className={classes.spacerTop}>
            <SelectWrapper
              id="access"
              name="Access"
              onChange={(e) => {
                setSelectedAccess(e.target.value);
              }}
              label="Access"
              value={selectedAccess}
              options={accessOptions}
              disabled={false}
            />
          </Grid>
          <Grid item xs={12} className={classes.modalButtonBar}>
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
        </Grid>
      </ModalWrapper>
    </React.Fragment>
  );
};

export default withStyles(styles)(EditAccessRule);
