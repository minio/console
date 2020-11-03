// This file is part of MinIO Console Server
// Copyright (c) 2020 MinIO, Inc.
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
import ModalWrapper from "../../../../Common/ModalWrapper/ModalWrapper";
import { Button, Grid, LinearProgress } from "@material-ui/core";
import InputBoxWrapper from "../../../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { modalBasic } from "../../../../Common/FormComponents/common/styleLibrary";
import { connect } from "react-redux";
import { createFolder } from "../../../../ObjectBrowser/actions";

interface ICreateFolder {
  classes: any;
  modalOpen: boolean;
  folderName: string;
  createFolder: (newFolder: string) => any;
  onClose: () => any;
}

const styles = (theme: Theme) =>
  createStyles({
    buttonContainer: {
      textAlign: "right",
    },
    pathLabel: {
      marginTop: 0,
      marginBottom: 32,
    },
    ...modalBasic,
  });

const CreateFolderModal = ({
  modalOpen,
  folderName,
  onClose,
  createFolder,
  classes,
}: ICreateFolder) => {
  const [pathUrl, setPathUrl] = useState("");

  const resetForm = () => {
    setPathUrl("");
  };

  const createProcess = () => {
    createFolder(pathUrl);
    onClose();
  };

  const folderTruncated = folderName.split("/").slice(2).join("/");

  return (
    <React.Fragment>
      <ModalWrapper modalOpen={modalOpen} title="Add Folder" onClose={onClose}>
        <Grid container>
          <h3 className={classes.pathLabel}>
            Current Path: {folderTruncated}/
          </h3>
          <Grid item xs={12}>
            <InputBoxWrapper
              value={pathUrl}
              label={"Folder Path"}
              id={"folderPath"}
              name={"folderPath"}
              placeholder={"Enter Folder Path"}
              onChange={(e) => {
                setPathUrl(e.target.value);
              }}
            />
          </Grid>
          <Grid item xs={12} className={classes.buttonContainer}>
            <button
              type="button"
              color="primary"
              className={classes.clearButton}
              onClick={resetForm}
            >
              Clear
            </button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={pathUrl.trim() === ""}
              onClick={createProcess}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </ModalWrapper>
    </React.Fragment>
  );
};

const mapDispatchToProps = {
  createFolder,
};

const connector = connect(null, mapDispatchToProps);

export default connector(withStyles(styles)(CreateFolderModal));
