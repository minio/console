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
import { Button } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import { BucketObject, BucketObjectsList } from "./types";
import api from "../../../../../../common/api";
import React, { useEffect, useState } from "react";
import TableWrapper from "../../../../Common/TableWrapper/TableWrapper";
import { MinTablePaginationActions } from "../../../../../../common/MinTablePaginationActions";
import { CreateIcon } from "../../.././../../../icons";
import { niceBytes } from "../../../../../../common/utils";
import Moment from "react-moment";
import DeleteObject from "./DeleteObject";
import {
  actionsTray,
  containerForHeader,
  searchField,
} from "../../../../Common/FormComponents/common/styleLibrary";
import PageHeader from "../../../../Common/PageHeader/PageHeader";
import storage from "local-storage-fallback";

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

    xhr.onload = function(e) {
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
    } = this.state;
    const displayParsedDate = (date: string) => {
      return <Moment>{date}</Moment>;
    };

    const confirmDeleteObject = (object: string) => {
      this.setState({ deleteOpen: true, selectedObject: object });
    };

    const downloadObject = (object: string) => {
      this.download(selectedBucket, object);
    };

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
