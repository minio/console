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
import { connect, useSelector } from "react-redux";
import {
  Button,
  CreateNewPathIcon,
  InputBox,
  Grid,
  FormLayout,
  Box,
} from "mds";
import ModalWrapper from "../../../../Common/ModalWrapper/ModalWrapper";
import { modalStyleUtils } from "../../../../Common/FormComponents/common/styleLibrary";
import { BucketObjectItem } from "./types";
import { AppState, useAppDispatch } from "../../../../../../store";
import { setModalErrorSnackMessage } from "../../../../../../systemSlice";

interface ICreatePath {
  modalOpen: boolean;
  bucketName: string;
  folderName: string;
  onClose: () => any;
  simplePath: string | null;
  limitedSubPath?: boolean;
}

const CreatePathModal = ({
  modalOpen,
  folderName,
  bucketName,
  onClose,
  simplePath,
  limitedSubPath,
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
        }),
      );
      return;
    }

    const cleanPathURL = pathUrl
      .split("/")
      .filter((splitItem) => splitItem.trim() !== "")
      .join("/");

    if (folderPath.slice(0, 1) === "/") {
      folderPath = folderPath.slice(1); //trim '/'
    }

    const newPath = `/browser/${encodeURIComponent(bucketName)}/${encodeURIComponent(
      `${folderPath}${cleanPathURL}/`,
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
        <FormLayout withBorders={false} containerPadding={false}>
          <Box className={"inputItem"} sx={{ display: "flex", gap: 8 }}>
            <strong>Current Path:</strong> <br />
            <Box
              sx={{
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
                fontSize: 14,
                textAlign: "left",
              }}
              dir={"rtl"}
            >
              {currentPath}
            </Box>
          </Box>
          <InputBox
            value={pathUrl}
            label={"New Folder Path"}
            id={"folderPath"}
            name={"folderPath"}
            placeholder={"Enter the new Folder Path"}
            onChange={inputChange}
            onKeyPress={keyPressed}
            required
            tooltip={
              (limitedSubPath &&
                "You may only have write access on a limited set of subpaths within this path. Please carefully review your User permissions to understand the paths to which you may write.") ||
              ""
            }
          />
          <Grid item xs={12} sx={modalStyleUtils.modalButtonBar}>
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
        </FormLayout>
      </ModalWrapper>
    </React.Fragment>
  );
};

const mapStateToProps = ({ objectBrowser }: AppState) => ({
  simplePath: objectBrowser.simplePath,
});

const connector = connect(mapStateToProps);

export default connector(CreatePathModal);
