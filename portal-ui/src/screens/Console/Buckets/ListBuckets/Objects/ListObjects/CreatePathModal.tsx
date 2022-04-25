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
import history from "../../../../../../history";
import { decodeFileName, encodeFileName } from "../../../../../../common/utils";
import { setModalErrorSnackMessage } from "../../../../../../actions";
import { BucketObjectItem } from "./types";
import { CreateNewPathIcon } from "../../../../../../icons";
import { AppState } from "../../../../../../store";

interface ICreatePath {
  classes: any;
  modalOpen: boolean;
  bucketName: string;
  folderName: string;
  onClose: () => any;
  existingFiles: BucketObjectItem[];
  detailsOpen: boolean;
  selectedInternalPaths: string | null;
  setModalErrorSnackMessage: typeof setModalErrorSnackMessage;
}

const styles = (theme: Theme) =>
  createStyles({
    ...modalStyleUtils,
    ...formFieldStyles,
  });

const CreatePathModal = ({
  modalOpen,
  folderName,
  bucketName,
  onClose,
  setModalErrorSnackMessage,
  classes,
  existingFiles,
  detailsOpen,
  selectedInternalPaths,
}: ICreatePath) => {
  const [pathUrl, setPathUrl] = useState("");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  let currentPath = `${bucketName}/${decodeFileName(folderName)}`;

  if (selectedInternalPaths && detailsOpen) {
    const decodedPathFileName = decodeFileName(selectedInternalPaths).split(
      "/"
    );

    if (decodedPathFileName) {
      decodedPathFileName.pop();
      const joinFileName = decodedPathFileName.join("/");
      const joinPaths = `${joinFileName}${
        joinFileName.endsWith("/") ? "" : "/"
      }`;
      currentPath = `${bucketName}/${joinPaths}`;
    }
  }

  const resetForm = () => {
    setPathUrl("");
  };

  const createProcess = () => {
    let folderPath = "";

    if (selectedInternalPaths && detailsOpen) {
      const decodedPathFileName = decodeFileName(selectedInternalPaths).split(
        "/"
      );

      if (decodedPathFileName) {
        decodedPathFileName.pop();
        const joinFileName = decodedPathFileName.join("/");
        folderPath = `${joinFileName}${joinFileName.endsWith("/") ? "" : "/"}`;
      }
    } else {
      if (folderName !== "") {
        const decodedFolderName = decodeFileName(folderName);
        folderPath = decodedFolderName.endsWith("/")
          ? decodedFolderName
          : `${decodedFolderName}/`;
      }
    }

    const sharesName = (record: BucketObjectItem) =>
      record.name === folderPath + pathUrl;

    if (existingFiles.findIndex(sharesName) !== -1) {
      setModalErrorSnackMessage({
        errorMessage: "Folder cannot have the same name as an existing file",
        detailedError: "",
      });
      return;
    }
    const newPath = `/buckets/${bucketName}/browse/${encodeFileName(
      `${folderPath}${pathUrl}/`
    )}`;
    history.push(newPath);
    onClose();
  };

  useEffect(() => {
    let valid = true;
    if (pathUrl.trim().length === 0) {
      valid = false;
    }
    setIsFormValid(valid);
  }, [pathUrl]);

  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPathUrl(e.target.value);
  };

  const keyPressed = (e: any) => {
    if (e.code === "Enter" && pathUrl !== "") {
      createProcess();
    }
  };

  return (
    <React.Fragment>
      <ModalWrapper
        modalOpen={modalOpen}
        title="Choose or create a new path"
        onClose={onClose}
        titleIcon={<CreateNewPathIcon />}
      >
        <Grid container>
          <Grid item xs={12} className={classes.formFieldRow}>
            <strong>Current Path:</strong> <br />
            <div
              style={{
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
                fontSize: 14,
                textAlign: "left",
              }}
              dir={"rtl"}
            >
              {currentPath}
            </div>
          </Grid>
          <Grid item xs={12} className={classes.formFieldRow}>
            <InputBoxWrapper
              value={pathUrl}
              label={"New Folder Path"}
              id={"folderPath"}
              name={"folderPath"}
              placeholder={"Enter the new Folder Path"}
              onChange={inputChange}
              onKeyPress={keyPressed}
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

const mapStateToProps = ({ objectBrowser }: AppState) => ({
  detailsOpen: objectBrowser.objectDetailsOpen,
  selectedInternalPaths: objectBrowser.selectedInternalPaths,
});

const mapDispatchToProps = {
  setModalErrorSnackMessage,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(withStyles(styles)(CreatePathModal));
