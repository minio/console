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
import { useNavigate } from "react-router-dom";
import { Button } from "mds";
import ModalWrapper from "../../../../Common/ModalWrapper/ModalWrapper";
import { Grid } from "@mui/material";
import InputBoxWrapper from "../../../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import {
  formFieldStyles,
  modalStyleUtils,
} from "../../../../Common/FormComponents/common/styleLibrary";
import { connect, useSelector } from "react-redux";
import { encodeURLString } from "../../../../../../common/utils";

import { BucketObjectItem } from "./types";
import { CreateNewPathIcon } from "../../../../../../icons";
import { AppState, useAppDispatch } from "../../../../../../store";
import { setModalErrorSnackMessage } from "../../../../../../systemSlice";

interface ICreatePath {
  classes: any;
  modalOpen: boolean;
  bucketName: string;
  folderName: string;
  onClose: () => any;
  simplePath: string | null;
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
  classes,
  simplePath,
}: ICreatePath) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [pathUrl, setPathUrl] = useState("");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [currentPath, setCurrentPath] = useState(bucketName);

  const records = useSelector((state: AppState) => state.objectBrowser.records);

  useEffect(() => {
    if (simplePath) {
      const newPath = `${bucketName}${
        !bucketName.endsWith("/") && !simplePath.startsWith("/") ? "/" : ""
      }${simplePath}`;

      setCurrentPath(newPath);
    }
  }, [simplePath, bucketName]);

  const resetForm = () => {
    setPathUrl("");
  };

  const createProcess = () => {
    let folderPath = "/";

    if (simplePath) {
      folderPath = simplePath.endsWith("/") ? simplePath : `${simplePath}/`;
    }

    const sharesName = (record: BucketObjectItem) =>
      record.name === folderPath + pathUrl;

    if (records.findIndex(sharesName) !== -1) {
      dispatch(
        setModalErrorSnackMessage({
          errorMessage: "Folder cannot have the same name as an existing file",
          detailedError: "",
        })
      );
      return;
    }

    const cleanPathURL = pathUrl
      .split("/")
      .filter((splitItem) => splitItem.trim() !== "")
      .join("/");

    const newPath = `/buckets/${bucketName}/browse/${encodeURLString(
      `${folderPath}${cleanPathURL}/`
    )}`;
    navigate(newPath);
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
              id={"clear"}
              type="button"
              color="primary"
              variant="regular"
              onClick={resetForm}
              label={"Clear"}
            />
            <Button
              id={"create"}
              type="submit"
              variant="callAction"
              disabled={!isFormValid}
              onClick={createProcess}
              label={"Create"}
            />
          </Grid>
        </Grid>
      </ModalWrapper>
    </React.Fragment>
  );
};

const mapStateToProps = ({ objectBrowser }: AppState) => ({
  simplePath: objectBrowser.simplePath,
});

const connector = connect(mapStateToProps);

export default connector(withStyles(styles)(CreatePathModal));
