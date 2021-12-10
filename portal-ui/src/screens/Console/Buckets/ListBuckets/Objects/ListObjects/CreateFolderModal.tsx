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

import React, { useEffect, useState } from "react";
import ModalWrapper from "../../../../Common/ModalWrapper/ModalWrapper";
import { Button, Grid } from "@mui/material";
import InputBoxWrapper from "../../../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import {
  formFieldStyles,
  modalStyleUtils,
} from "../../../../Common/FormComponents/common/styleLibrary";
import { connect } from "react-redux";
import { setFileModeEnabled } from "../../../../ObjectBrowser/actions";
import history from "../../../../../../history";
import { decodeFileName, encodeFileName } from "../../../../../../common/utils";
import { setModalErrorSnackMessage } from "../../../../../../actions";
import { BucketObject } from "./types";

interface ICreateFolder {
  classes: any;
  modalOpen: boolean;
  bucketName: string;
  folderName: string;
  setFileModeEnabled: typeof setFileModeEnabled;
  setModalErrorSnackMessage: typeof setModalErrorSnackMessage;
  onClose: () => any;
  existingFiles: BucketObject[];
}

const styles = (theme: Theme) =>
  createStyles({
    ...modalStyleUtils,
    ...formFieldStyles,
  });

const CreateFolderModal = ({
  modalOpen,
  folderName,
  bucketName,
  onClose,
  setFileModeEnabled,
  setModalErrorSnackMessage,
  classes,
  existingFiles,
}: ICreateFolder) => {
  const [pathUrl, setPathUrl] = useState("");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  const currentPath = `${bucketName}/${decodeFileName(folderName)}`;

  const resetForm = () => {
    setPathUrl("");
  };

  const createProcess = () => {
    let folderPath = "";
    if (folderName !== "") {
      const decodedFolderName = decodeFileName(folderName);
      folderPath = decodedFolderName.endsWith("/")
        ? decodedFolderName
        : `${decodedFolderName}/`;
    }
    const sharesName = (record: BucketObject) =>
      record.name === folderPath + pathUrl;
    if (existingFiles.findIndex(sharesName) !== -1) {
      setModalErrorSnackMessage({
        errorMessage: "Folder cannot have the same name as an existing file",
        detailedError: "",
      });
      return;
    }
    const newPath = `/buckets/${bucketName}/browse/${encodeFileName(
      `${folderPath}${pathUrl}`
    )}/`;
    history.push(newPath);
    setFileModeEnabled(false);
    onClose();
  };

  useEffect(() => {
    let valid = true;
    if (pathUrl.trim().length === 0) {
      valid = false;
    }
    setIsFormValid(valid);
  }, [pathUrl]);

  return (
    <React.Fragment>
      <ModalWrapper
        modalOpen={modalOpen}
        title="Choose or create a new path"
        onClose={onClose}
      >
        <Grid container>
          <Grid item xs={12} className={classes.formFieldRow}>
            Current Path: {currentPath}
          </Grid>
          <Grid item xs={12} className={classes.formFieldRow}>
            <InputBoxWrapper
              value={pathUrl}
              label={"New Folder Path"}
              id={"folderPath"}
              name={"folderPath"}
              placeholder={"Enter the new Folder Path"}
              onChange={(e) => {
                setPathUrl(e.target.value);
              }}
              required
            />
          </Grid>
          <Grid item xs={12} className={classes.modalButtonBar}>
            <Button
              type="button"
              color="primary"
              variant="outlined"
              onClick={resetForm}
            >
              Clear
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!isFormValid}
              onClick={createProcess}
            >
              Create
            </Button>
          </Grid>
        </Grid>
      </ModalWrapper>
    </React.Fragment>
  );
};

const mapDispatchToProps = {
  setFileModeEnabled,
  setModalErrorSnackMessage,
};

const connector = connect(null, mapDispatchToProps);

export default connector(withStyles(styles)(CreateFolderModal));
