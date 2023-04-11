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
import Grid from "@mui/material/Grid";
import createStyles from "@mui/styles/createStyles";
import { Button, EditIcon } from "mds";
import makeStyles from "@mui/styles/makeStyles";
import { Theme } from "@mui/material/styles";
import {
  containerForHeader,
  formFieldStyles,
  modalStyleUtils,
  spacingUtils,
} from "../Common/FormComponents/common/styleLibrary";
import { IFileInfo } from "../Buckets/ListBuckets/Objects/ObjectDetails/types";
import { useAppDispatch } from "../../../store";
import ModalWrapper from "../Common/ModalWrapper/ModalWrapper";
import InputBoxWrapper from "../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import FormSwitchWrapper from "../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import { downloadObject } from "./utils";

interface IRenameLongFilename {
  open: boolean;
  bucketName: string;
  internalPaths: string;
  currentItem: string;
  actualInfo: IFileInfo;
  closeModal: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    ...modalStyleUtils,
    ...formFieldStyles,
    ...spacingUtils,
    ...containerForHeader,
  })
);

const RenameLongFileName = ({
  open,
  closeModal,
  currentItem,
  internalPaths,
  actualInfo,
  bucketName,
}: IRenameLongFilename) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const [newFileName, setNewFileName] = useState<string>(currentItem);
  const [acceptLongName, setAcceptLongName] = useState<boolean>(false);

  const doDownload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    downloadObject(dispatch, bucketName, internalPaths, actualInfo);
    closeModal();
  };

  return (
    <ModalWrapper
      title={`Rename Download`}
      modalOpen={open}
      onClose={closeModal}
      titleIcon={<EditIcon />}
    >
      <div>
        The file you are trying to download has a long name.
        <br />
        This can cause issues on Windows Systems by trimming the file name after
        download.
        <br />
        <br /> We recommend to rename the file download
      </div>
      <form
        noValidate
        autoComplete="off"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          doDownload(e);
        }}
      >
        <Grid container>
          <Grid item xs={12} className={classes.modalFormScrollable}>
            <Grid item xs={12} className={classes.formFieldRow}>
              <InputBoxWrapper
                id="download-filename"
                name="download-filename"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setNewFileName(event.target.value);
                }}
                label=""
                type={"text"}
                value={newFileName}
                error={
                  newFileName.length > 200 && !acceptLongName
                    ? "Filename should be less than 200 characters long."
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12} className={classes.formFieldRow}>
              <FormSwitchWrapper
                value="acceptLongName"
                id="acceptLongName"
                name="acceptLongName"
                checked={acceptLongName}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setAcceptLongName(event.target.checked);
                  if (event.target.checked) {
                    setNewFileName(currentItem);
                  }
                }}
                label={"Use Original Name"}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} className={classes.modalButtonBar}>
            <Button
              id={"download-file"}
              type="submit"
              variant="callAction"
              color="primary"
              disabled={newFileName.length > 200 && !acceptLongName}
              label={"Download File"}
            />
          </Grid>
        </Grid>
      </form>
    </ModalWrapper>
  );
};

export default RenameLongFileName;
