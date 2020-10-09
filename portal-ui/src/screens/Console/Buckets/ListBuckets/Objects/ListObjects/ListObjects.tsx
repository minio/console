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

import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import { BucketObject, BucketObjectsList } from "./types";
import api from "../../../../../../common/api";
import React from "react";
import TableWrapper from "../../../../Common/TableWrapper/TableWrapper";
import { niceBytes } from "../../../../../../common/utils";
import DeleteObject from "./DeleteObject";

import {
  actionsTray,
  containerForHeader,
  searchField,
} from "../../../../Common/FormComponents/common/styleLibrary";
import PageHeader from "../../../../Common/PageHeader/PageHeader";
import storage from "local-storage-fallback";
import { isNullOrUndefined } from "util";
import { Button, Input } from "@material-ui/core";
import * as reactMoment from "react-moment";
import { CreateIcon } from "../../../../../../icons";
import Snackbar from "@material-ui/core/Snackbar";

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
    ...actionsTray,
    ...searchField,
    ...containerForHeader(theme.spacing(4)),
  });

interface IListObjectsProps {
  classes: any;
  match: any;
}

interface IListObjectsState {
  records: BucketObject[];
  totalRecords: number;
  loading: boolean;
  error: string;
  deleteOpen: boolean;
  deleteError: string;
  selectedObject: string;
  selectedBucket: string;
  filterObjects: string;
  openSnackbar: boolean;
  snackBarMessage: string;
}

class ListObjects extends React.Component<
  IListObjectsProps,
  IListObjectsState
> {
  state: IListObjectsState = {
    records: [],
    totalRecords: 0,
    loading: false,
    error: "",
    deleteOpen: false,
    deleteError: "",
    selectedObject: "",
    selectedBucket: "",
    filterObjects: "",
    openSnackbar: false,
    snackBarMessage: "",
  };

  fetchRecords = () => {
    this.setState({ loading: true }, () => {
      const { match } = this.props;
      const bucketName = match.params["bucket"];
      api
        .invoke("GET", `/api/v1/buckets/${bucketName}/objects`)
        .then((res: BucketObjectsList) => {
          this.setState({
            loading: false,
            selectedBucket: bucketName,
            records: res.objects || [],
            totalRecords: !res.objects ? 0 : res.total,
            error: "",
          });
          // TODO:
          // if we get 0 results, and page > 0 , go down 1 page
        })
        .catch((err: any) => {
          this.setState({ loading: false, error: err });
        });
    });
  };

  componentDidMount(): void {
    this.fetchRecords();
  }

  closeDeleteModalAndRefresh(refresh: boolean) {
    this.setState({ deleteOpen: false }, () => {
      if (refresh) {
        this.fetchRecords();
      }
    });
  }

  showSnackBarMessage(text: string) {
    this.setState({ openSnackbar: true, snackBarMessage: text });
  }

  closeSnackBar() {
    this.setState({ openSnackbar: false, snackBarMessage: `` });
  }

  upload(e: any, bucketName: string, path: string) {
    let listObjects = this;
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
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);

    xhr.withCredentials = false;
    xhr.onload = function (event) {
      // TODO: handle status
      if (xhr.status == 401 || xhr.status == 403) {
        listObjects.showSnackBarMessage(
          "An error occurred while uploading the file."
        );
      }
      if (xhr.status == 500) {
        listObjects.showSnackBarMessage(
          "An error occurred while uploading the file."
        );
      }
      if (xhr.status == 200) {
        listObjects.showSnackBarMessage("Object uploaded successfully.");
        listObjects.fetchRecords();
      }
    };

    xhr.upload.addEventListener("error", (event) => {
      // TODO: handle error
      this.showSnackBarMessage("An error occurred while uploading the file.");
    });

    xhr.upload.addEventListener("progress", (event) => {
      // TODO: handle progress with event.loaded, event.total
    });

    xhr.onerror = () => {
      listObjects.showSnackBarMessage(
        "An error occurred while uploading the file."
      );
    };

    var formData = new FormData();
    var blobFile = new Blob([file]);

    formData.append("upfile", blobFile);
    xhr.send(formData);
    e.target.value = null;
  }

  download(bucketName: string, objectName: string) {
    var anchor = document.createElement("a");
    document.body.appendChild(anchor);
    const token: string = storage.getItem("token")!;
    var xhr = new XMLHttpRequest();

    xhr.open(
      "GET",
      `/api/v1/buckets/${bucketName}/objects/download?prefix=${objectName}`,
      true
    );
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.responseType = "blob";

    xhr.onload = function (e) {
      if (this.status == 200) {
        var blob = new Blob([this.response], {
          type: "octet/stream",
        });
        var blobUrl = window.URL.createObjectURL(blob);

        anchor.href = blobUrl;
        anchor.download = objectName;

        anchor.click();
        window.URL.revokeObjectURL(blobUrl);
        anchor.remove();
      }
    };
    xhr.send();
  }

  bucketFilter(): void {}

  render() {
    const { classes } = this.props;
    const {
      records,
      loading,
      selectedObject,
      selectedBucket,
      deleteOpen,
      filterObjects,
      snackBarMessage,
      openSnackbar,
    } = this.state;
    const displayParsedDate = (date: string) => {
      return <reactMoment.default>{date}</reactMoment.default>;
    };

    const confirmDeleteObject = (object: string) => {
      this.setState({ deleteOpen: true, selectedObject: object });
    };

    const downloadObject = (object: string) => {
      this.download(selectedBucket, object);
    };

    const uploadObject = (e: any): void => {
      // TODO: handle deeper paths/folders
      let file = e.target.files[0];
      this.showSnackBarMessage(`Uploading: ${file.name}`);
      this.upload(e, selectedBucket, "");
    };

    const snackBarAction = (
      <Button
        color="secondary"
        size="small"
        onClick={() => {
          this.closeSnackBar();
        }}
      >
        Dismiss
      </Button>
    );

    const tableActions = [
      { type: "download", onClick: downloadObject, sendOnlyId: true },
      { type: "delete", onClick: confirmDeleteObject, sendOnlyId: true },
    ];

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
            closeDeleteModalAndRefresh={(refresh: boolean) => {
              this.closeDeleteModalAndRefresh(refresh);
            }}
          />
        )}
        <Snackbar
          open={openSnackbar}
          message={snackBarMessage}
          action={snackBarAction}
        />
        <PageHeader label="Objects" />
        <Grid container>
          <Grid item xs={12} className={classes.container}>
            <Grid item xs={12} className={classes.actionsTray}>
              <TextField
                placeholder="Search Objects"
                className={classes.searchField}
                id="search-resource"
                label=""
                onChange={(val) => {
                  this.setState({
                    filterObjects: val.target.value,
                  });
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

              <>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CreateIcon />}
                  component="label"
                >
                  Upload Object
                  <Input
                    type="file"
                    onChange={(e) => uploadObject(e)}
                    id="file-input"
                    style={{ display: "none" }}
                  />
                </Button>
              </>
            </Grid>
            <Grid item xs={12}>
              <br />
            </Grid>
            <Grid item xs={12}>
              <TableWrapper
                itemActions={tableActions}
                columns={[
                  { label: "Name", elementKey: "name" },
                  {
                    label: "Last Modified",
                    elementKey: "last_modified",
                    renderFunction: displayParsedDate,
                  },
                  {
                    label: "Size",
                    elementKey: "size",
                    renderFunction: niceBytes,
                  },
                ]}
                isLoading={loading}
                entityName="Objects"
                idField="name"
                records={filteredRecords}
              />
            </Grid>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(ListObjects);
