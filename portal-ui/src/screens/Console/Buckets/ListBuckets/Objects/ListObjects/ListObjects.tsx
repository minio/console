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

import React, { useState, useEffect } from "react";
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
import storage from "local-storage-fallback";
import { isNullOrUndefined } from "util";
import { Button, Input } from "@material-ui/core";
import * as reactMoment from "react-moment";
import { CreateIcon } from "../../../../../../icons";
import Snackbar from "@material-ui/core/Snackbar";
import BrowserBreadcrumbs from "../../../../ObjectBrowser/BrowserBreadcrumbs";
import get from "lodash/get";
import { withRouter } from "react-router-dom";
import { addRoute, setAllRoutes } from "../../../../ObjectBrowser/actions";
import { connect } from "react-redux";
import { ObjectBrowserState, Route } from "../../../../ObjectBrowser/reducers";
import CreateFolderModal from "./CreateFolderModal";
import UploadFile from "../../../../../../icons/UploadFile";

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
    errorBlock: {
      color: "red",
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
  addRoute: (param1: string, param2: string) => any;
  setAllRoutes: (path: string) => any;
  routesList: Route[];
}

interface ObjectBrowserReducer {
  objectBrowser: ObjectBrowserState;
}

const ListObjects = ({
  classes,
  match,
  addRoute,
  setAllRoutes,
  routesList,
}: IListObjectsProps) => {
  const [records, setRecords] = useState<BucketObject[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [createFolderOpen, setCreateFolderOpen] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string>("");
  const [selectedObject, setSelectedObject] = useState<string>("");
  const [selectedBucket, setSelectedBucket] = useState<string>("");
  const [filterObjects, setFilterObjects] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackBarMessage, setSnackbarMessage] = useState<string>("");

  useEffect(() => {
    const bucketName = match.params["bucket"];
    const internalPaths = match.params[0];

    let extraPath = "";
    if (internalPaths) {
      extraPath = `?prefix=${internalPaths}/`;
    }

    api
      .invoke("GET", `/api/v1/buckets/${bucketName}/objects${extraPath}`)
      .then((res: BucketObjectsList) => {
        setLoading(false);
        setSelectedBucket(bucketName);
        setRecords(res.objects || []);
        setTotalRecords(!res.objects ? 0 : res.total);
        setError("");
        // TODO:
        // if we get 0 results, and page > 0 , go down 1 page
      })
      .catch((err: any) => {
        setLoading(false);
        setError(err);
      });
  }, [loading, match]);

  useEffect(() => {
    const url = get(match, "url", "/object-browser");
    if (url !== routesList[routesList.length - 1].route) {
      setAllRoutes(url);
    }
  }, [match, routesList, setAllRoutes]);

  const closeDeleteModalAndRefresh = (refresh: boolean) => {
    setDeleteOpen(false);

    if (refresh) {
      setLoading(true);
    }
  };

  const closeAddFolderModal = () => {
    setCreateFolderOpen(false);
  };

  const showSnackBarMessage = (text: string) => {
    setSnackbarMessage(text);
    setOpenSnackbar(true);
  };

  const closeSnackBar = () => {
    setSnackbarMessage("");
    setOpenSnackbar(false);
  };

  const upload = (e: any, bucketName: string, path: string) => {
    if (isNullOrUndefined(e) || isNullOrUndefined(e.target)) {
      return;
    }
    const token: string = storage.getItem("token")!;
    e.preventDefault();
    let file = e.target.files[0];
    const fileName = file.name;

    const objectName = `${path}${fileName}`;
    let uploadUrl = `/api/v1/buckets/${bucketName}/objects/upload?prefix=${objectName}`;
    let xhr = new XMLHttpRequest();

    xhr.open("POST", uploadUrl, true);

    xhr.withCredentials = false;
    xhr.onload = function (event) {
      // TODO: handle status
      if (xhr.status === 401 || xhr.status === 403) {
        showSnackBarMessage("An error occurred while uploading the file.");
      }
      if (xhr.status === 500) {
        showSnackBarMessage("An error occurred while uploading the file.");
      }
      if (xhr.status === 200) {
        showSnackBarMessage("Object uploaded successfully.");
        setLoading(true);
      }
    };

    xhr.upload.addEventListener("error", (event) => {
      // TODO: handle error
      showSnackBarMessage("An error occurred while uploading the file.");
    });

    xhr.upload.addEventListener("progress", (event) => {
      // TODO: handle progress with event.loaded, event.total
    });

    xhr.onerror = () => {
      showSnackBarMessage("An error occurred while uploading the file.");
    };

    const formData = new FormData();
    const blobFile = new Blob([file]);

    formData.append("upfile", blobFile);
    xhr.send(formData);
    e.target.value = null;
  };

  const download = (bucketName: string, objectName: string) => {
    const anchor = document.createElement("a");
    document.body.appendChild(anchor);
    const token: string = storage.getItem("token")!;
    const xhr = new XMLHttpRequest();

    xhr.open(
      "GET",
      `/api/v1/buckets/${bucketName}/objects/download?prefix=${objectName}`,
      true
    );
    xhr.responseType = "blob";

    xhr.onload = function (e) {
      if (this.status === 200) {
        const blob = new Blob([this.response], {
          type: "octet/stream",
        });
        const blobUrl = window.URL.createObjectURL(blob);

        anchor.href = blobUrl;
        anchor.download = objectName;

        anchor.click();
        window.URL.revokeObjectURL(blobUrl);
        anchor.remove();
      }
    };
    xhr.send();
  };

  const displayParsedDate = (date: string) => {
    return <reactMoment.default>{date}</reactMoment.default>;
  };

  const confirmDeleteObject = (object: string) => {
    setDeleteOpen(true);
    setSelectedObject(object);
  };

  const downloadObject = (object: string) => {
    download(selectedBucket, object);
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

      addRoute(newPath, idElementClean[lastIndex]);
      return;
    }

    // Element is a file. we open details here
    // TODO: Add details open function here.
    //console.log("object", idElementClean);
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

    let file = e.target.files[0];
    showSnackBarMessage(`Uploading: ${file.name}`);
    upload(e, selectedBucket, path);
  };

  const snackBarAction = (
    <Button
      color="secondary"
      size="small"
      onClick={() => {
        closeSnackBar();
      }}
    >
      Dismiss
    </Button>
  );

  const tableActions = [
    { type: "view", onClick: openPath, sendOnlyId: true },
    { type: "download", onClick: downloadObject, sendOnlyId: true },
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
      <Snackbar
        open={openSnackbar}
        message={snackBarMessage}
        action={snackBarAction}
      />
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
                },
                {
                  label: "Size",
                  elementKey: "size",
                  renderFunction: niceBytes,
                  width: 60,
                  contentTextAlign: "right",
                },
              ]}
              isLoading={loading}
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
});

const mapDispatchToProps = {
  addRoute,
  setAllRoutes,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default withRouter(connector(withStyles(styles)(ListObjects)));
