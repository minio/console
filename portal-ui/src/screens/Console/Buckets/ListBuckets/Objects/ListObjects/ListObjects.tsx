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

import React, { useEffect, useRef, useState } from "react";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import { BucketObject, BucketObjectsList } from "./types";
import api from "../../../../../../common/api";
import TableWrapper from "../../../../Common/TableWrapper/TableWrapper";
import { niceBytes } from "../../../../../../common/utils";
import DeleteObject from "./DeleteObject";

import {
  actionsTray,
  containerForHeader,
  objectBrowserCommon,
  searchField,
} from "../../../../Common/FormComponents/common/styleLibrary";
import PageHeader from "../../../../Common/PageHeader/PageHeader";
import { Button, Input, Typography } from "@material-ui/core";
import * as reactMoment from "react-moment";
import { CreateIcon } from "../../../../../../icons";
import BrowserBreadcrumbs from "../../../../ObjectBrowser/BrowserBreadcrumbs";
import get from "lodash/get";
import { withRouter } from "react-router-dom";
import {
  addRoute,
  setAllRoutes,
  setLastAsFile,
  fileIsBeingPrepared,
  fileDownloadStarted,
} from "../../../../ObjectBrowser/actions";
import { connect } from "react-redux";
import {
  ObjectBrowserReducer,
  Route,
} from "../../../../ObjectBrowser/reducers";
import CreateFolderModal from "./CreateFolderModal";
import UploadFile from "../../../../../../icons/UploadFile";
import { download } from "../utils";
import {
  setLoadingProgress,
  setSnackBarMessage,
  setErrorSnackMessage,
} from "../../../../../../actions";

const commonIcon = {
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center center",
  width: 16,
  minWidth: 16,
  height: 40,
  marginRight: 10,
};

const styles = (theme: Theme) =>
  createStyles({
    seeMore: {
      marginTop: theme.spacing(3),
    },
    paper: {
      display: "flex",
      overflow: "auto",
      flexDirection: "column",
    },

    addSideBar: {
      width: "320px",
      padding: "20px",
    },
    tableToolbar: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(0),
    },
    minTableHeader: {
      color: "#393939",
      "& tr": {
        "& th": {
          fontWeight: "bold",
        },
      },
    },
    fileName: {
      display: "flex",
      alignItems: "center",
    },
    fileNameText: {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    iconFolder: {
      backgroundImage: "url(/images/ob_folder_clear.svg)",
      ...commonIcon,
    },
    iconFile: {
      backgroundImage: "url(/images/ob_file_clear.svg)",
      ...commonIcon,
    },
    buttonsContainer: {
      "& .MuiButtonBase-root": {
        marginLeft: 10,
      },
    },
    browsePaper: {
      height: "calc(100vh - 280px)",
    },
    "@global": {
      ".rowLine:hover  .iconFileElm": {
        backgroundImage: "url(/images/ob_file_filled.svg)",
      },
      ".rowLine:hover  .iconFolderElm": {
        backgroundImage: "url(/images/ob_folder_filled.svg)",
      },
    },
    ...actionsTray,
    ...searchField,
    ...objectBrowserCommon,
    ...containerForHeader(theme.spacing(4)),
  });

interface IListObjectsProps {
  classes: any;
  match: any;
  addRoute: (param1: string, param2: string, param3: string) => any;
  setAllRoutes: (path: string) => any;
  routesList: Route[];
  downloadingFiles: string[];
  setLastAsFile: () => any;
  setLoadingProgress: typeof setLoadingProgress;
  setSnackBarMessage: typeof setSnackBarMessage;
  setErrorSnackMessage: typeof setErrorSnackMessage;
  fileIsBeingPrepared: typeof fileIsBeingPrepared;
  fileDownloadStarted: typeof fileDownloadStarted;
}

function useInterval(callback: any, delay: number) {
  const savedCallback = useRef<Function | null>(null);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (savedCallback !== undefined && savedCallback.current) {
        savedCallback.current();
      }
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const defLoading = <Typography component="h3">Loading...</Typography>;

const ListObjects = ({
  classes,
  match,
  addRoute,
  setAllRoutes,
  routesList,
  downloadingFiles,
  setLastAsFile,
  setLoadingProgress,
  setSnackBarMessage,
  setErrorSnackMessage,
  fileIsBeingPrepared,
  fileDownloadStarted,
}: IListObjectsProps) => {
  const [records, setRecords] = useState<BucketObject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [createFolderOpen, setCreateFolderOpen] = useState<boolean>(false);
  const [selectedObject, setSelectedObject] = useState<string>("");
  const [selectedBucket, setSelectedBucket] = useState<string>("");
  const [filterObjects, setFilterObjects] = useState<string>("");
  const [loadingPromise, setLoadingPromise] = useState<Promise<any> | null>(
    null
  );
  const [loadingStartTime, setLoadingStartTime] = useState<number>(0);
  const [loadingMessage, setLoadingMessage] = useState<React.ReactNode>(
    defLoading
  );

  const updateMessage = () => {
    let timeDelta = Date.now() - loadingStartTime;

    if (timeDelta / 1000 >= 6) {
      setLoadingMessage(
        <React.Fragment>
          <Typography component="h3">
            This operation is taking longer than expected... (
            {Math.ceil(timeDelta / 1000)}s)
          </Typography>
        </React.Fragment>
      );
    } else if (timeDelta / 1000 >= 3) {
      setLoadingMessage(
        <Typography component="h3">
          This operation is taking longer than expected...
        </Typography>
      );
    }
  };

  useInterval(() => {
    // Your custom logic here
    if (loading) {
      updateMessage();
    }
  }, 1000);

  useEffect(() => {
    const bucketName = match.params["bucket"];
    const internalPaths = match.params[0];

    const verifyIfIsFile = () => {
      const bucketName = match.params["bucket"];
      const internalPaths = match.params[0];

      api
        .invoke(
          "GET",
          `/api/v1/buckets/${bucketName}/objects?prefix=${internalPaths}`
        )
        .then((res: BucketObjectsList) => {
          //It is a file since it has elements in the object, setting file flag and waiting for component mount
          if (res.objects !== null) {
            setLastAsFile();
          } else {
            // It is a folder, we remove loader
            setLoading(false);
          }
        })
        .catch((err: any) => {
          setLoading(false);
          setErrorSnackMessage(err);
        });
    };

    if (loading) {
      let extraPath = "";
      if (internalPaths) {
        extraPath = `?prefix=${internalPaths}/`;
      }

      let currentTimestamp = Date.now() + 0;
      setLoadingStartTime(currentTimestamp);
      setLoadingMessage(defLoading);

      let p = api
        .invoke("GET", `/api/v1/buckets/${bucketName}/objects${extraPath}`)
        .then((res: BucketObjectsList) => {
          setSelectedBucket(bucketName);

          const records: BucketObject[] = res.objects || [];
          const folders: BucketObject[] = [];
          const files: BucketObject[] = [];

          records.forEach((record) => {
            // this is a folder
            if (record.name.endsWith("/")) {
              folders.push(record);
            } else {
              // this is a file
              files.push(record);
            }
          });

          const recordsInElement = [...folders, ...files];

          setRecords(recordsInElement);
          // In case no objects were retrieved, We check if item is a file
          if (!res.objects && extraPath !== "") {
            verifyIfIsFile();
            return;
          }
          setLoading(false);
        })
        .catch((err: any) => {
          setLoading(false);
          setErrorSnackMessage(err);
        });
      setLoadingPromise(p);
    }
  }, [loading, match, setLastAsFile, setErrorSnackMessage]);

  useEffect(() => {
    const url = get(match, "url", "/object-browser");
    if (url !== routesList[routesList.length - 1].route) {
      setAllRoutes(url);
    }
  }, [match, routesList, setAllRoutes]);

  useEffect(() => {
    setLoading(true);
  }, [routesList, setLoading]);

  const closeDeleteModalAndRefresh = (refresh: boolean) => {
    setDeleteOpen(false);

    if (refresh) {
      setSnackBarMessage(`Object '${selectedObject}' deleted successfully.`);
      setLoading(true);
    }
  };

  const closeAddFolderModal = () => {
    setCreateFolderOpen(false);
  };

  const upload = (e: any, bucketName: string, path: string) => {
    if (
      e === null ||
      e === undefined ||
      e.target === null ||
      e.target === undefined
    ) {
      return;
    }
    e.preventDefault();
    let files = e.target.files;
    let uploadUrl = `/api/v1/buckets/${bucketName}/objects/upload`;
    if (path !== "") {
      uploadUrl = `${uploadUrl}?prefix=${path}`;
    }
    let xhr = new XMLHttpRequest();
    const areMultipleFiles = files.length > 1 ? true : false;
    const errorMessage = `An error occurred while uploading the file${
      areMultipleFiles ? "s" : ""
    }.`;
    const okMessage = `Object${
      areMultipleFiles ? "s" : ``
    } uploaded successfully.`;

    xhr.open("POST", uploadUrl, true);

    xhr.withCredentials = false;
    xhr.onload = function (event) {
      if (
        xhr.status === 401 ||
        xhr.status === 403 ||
        xhr.status === 400 ||
        xhr.status === 500
      ) {
        setSnackBarMessage(errorMessage);
      }
      if (xhr.status === 200) {
        setSnackBarMessage(okMessage);
      }
    };

    xhr.upload.addEventListener("error", (event) => {
      setSnackBarMessage(errorMessage);
    });

    xhr.upload.addEventListener("progress", (event) => {
      setLoadingProgress(Math.floor((event.loaded * 100) / event.total));
    });

    xhr.onerror = () => {
      setSnackBarMessage(errorMessage);
    };
    xhr.onloadend = () => {
      setLoading(true);
      setLoadingProgress(100);
    };

    const formData = new FormData();

    for (let file of files) {
      const fileName = file.name;
      const blobFile = new Blob([file]);
      formData.append(fileName, blobFile);
    }

    xhr.send(formData);
    e.target.value = null;
  };

  const displayParsedDate = (object: BucketObject) => {
    if (object.name.endsWith("/")) {
      return "";
    }
    return <reactMoment.default>{object.last_modified}</reactMoment.default>;
  };

  const displayNiceBytes = (object: BucketObject) => {
    if (object.name.endsWith("/")) {
      return "";
    }
    return niceBytes(String(object.size));
  };

  const confirmDeleteObject = (object: string) => {
    setDeleteOpen(true);
    setSelectedObject(object);
  };

  const removeDownloadAnimation = (path: string) => {
    fileDownloadStarted(path);
  };

  const downloadObject = (object: BucketObject) => {
    fileIsBeingPrepared(`${selectedBucket}/${object.name}`);
    if (object.size > 104857600) {
      // If file is bigger than 100MB we show a notification
      setSnackBarMessage(
        "Download process started, it may take a few moments to complete"
      );
    }

    download(
      selectedBucket,
      object.name,
      object.version_id,
      removeDownloadAnimation
    );
  };

  const openPath = (idElement: string) => {
    const currentPath = get(match, "url", "/object-browser");

    // Element is a folder, we redirect to it
    if (idElement.endsWith("/")) {
      const idElementClean = idElement
        .substr(0, idElement.length - 1)
        .split("/");
      const lastIndex = idElementClean.length - 1;
      const newPath = `${currentPath}/${idElementClean[lastIndex]}`;

      addRoute(newPath, idElementClean[lastIndex], "path");
      return;
    }
    // Element is a file. we open details here
    const pathInArray = idElement.split("/");
    const fileName = pathInArray[pathInArray.length - 1];
    const newPath = `${currentPath}/${fileName}`;

    addRoute(newPath, fileName, "file");
    return;
  };

  const uploadObject = (e: any): void => {
    // Handle of deeper routes.
    const currentPath = routesList[routesList.length - 1].route;
    const splitPaths = currentPath
      .split("/")
      .filter((item) => item.trim() !== "");

    let path = "";

    if (splitPaths.length > 2) {
      path = `${splitPaths.slice(2).join("/")}/`;
    }

    upload(e, selectedBucket, path);
  };

  const tableActions = [
    { type: "view", onClick: openPath, sendOnlyId: true },
    {
      type: "download",
      onClick: downloadObject,
      showLoaderFunction: (item: string) =>
        downloadingFiles.includes(`${match.params["bucket"]}/${item}`),
    },
    { type: "delete", onClick: confirmDeleteObject, sendOnlyId: true },
  ];

  const displayName = (element: string) => {
    let elementString = element;
    let icon = `${classes.iconFile} iconFileElm`;
    // Element is a folder
    if (element.endsWith("/")) {
      icon = `${classes.iconFolder} iconFolderElm`;
      elementString = element.substr(0, element.length - 1);
    }

    const splitItem = elementString.split("/");

    return (
      <div className={classes.fileName}>
        <div className={icon} />
        <span className={classes.fileNameText}>
          {splitItem[splitItem.length - 1]}
        </span>
      </div>
    );
  };

  const filteredRecords = records.filter((b: BucketObject) => {
    if (filterObjects === "") {
      return true;
    } else {
      if (b.name.indexOf(filterObjects) >= 0) {
        return true;
      } else {
        return false;
      }
    }
  });

  return (
    <React.Fragment>
      {deleteOpen && (
        <DeleteObject
          deleteOpen={deleteOpen}
          selectedBucket={selectedBucket}
          selectedObject={selectedObject}
          closeDeleteModalAndRefresh={closeDeleteModalAndRefresh}
        />
      )}
      {createFolderOpen && (
        <CreateFolderModal
          modalOpen={createFolderOpen}
          folderName={routesList[routesList.length - 1].route}
          onClose={closeAddFolderModal}
        />
      )}
      <PageHeader label="Object Browser" />
      <Grid container>
        <Grid item xs={12} className={classes.container}>
          <Grid item xs={12} className={classes.obTitleSection}>
            <div>
              <BrowserBreadcrumbs />
            </div>
            <div className={classes.buttonsContainer}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<CreateIcon />}
                component="label"
                onClick={() => {
                  setCreateFolderOpen(true);
                }}
              >
                Create Folder
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<UploadFile />}
                component="label"
              >
                File
                <Input
                  type="file"
                  inputProps={{ multiple: true }}
                  onChange={(e) => uploadObject(e)}
                  id="file-input"
                  style={{ display: "none" }}
                />
              </Button>
            </div>
          </Grid>
          <Grid item xs={12} className={classes.actionsTray}>
            <TextField
              placeholder="Search Objects"
              className={classes.searchField}
              id="search-resource"
              label=""
              onChange={(val) => {
                setFilterObjects(val.target.value);
              }}
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <br />
          </Grid>
          <Grid item xs={12}>
            <TableWrapper
              itemActions={tableActions}
              columns={[
                {
                  label: "Name",
                  elementKey: "name",
                  renderFunction: displayName,
                },
                {
                  label: "Last Modified",
                  elementKey: "last_modified",
                  renderFunction: displayParsedDate,
                  renderFullObject: true,
                },
                {
                  label: "Size",
                  elementKey: "size",
                  renderFunction: displayNiceBytes,
                  renderFullObject: true,
                  width: 60,
                  contentTextAlign: "right",
                },
              ]}
              isLoading={loading}
              loadingMessage={loadingMessage}
              entityName="Objects"
              idField="name"
              records={filteredRecords}
              customPaperHeight={classes.browsePaper}
            />
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const mapStateToProps = ({ objectBrowser }: ObjectBrowserReducer) => ({
  routesList: get(objectBrowser, "routesList", []),
  downloadingFiles: get(objectBrowser, "downloadingFiles", []),
});

const mapDispatchToProps = {
  addRoute,
  setAllRoutes,
  setLastAsFile,
  setLoadingProgress,
  setSnackBarMessage,
  setErrorSnackMessage,
  fileIsBeingPrepared,
  fileDownloadStarted,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default withRouter(connector(withStyles(styles)(ListObjects)));
