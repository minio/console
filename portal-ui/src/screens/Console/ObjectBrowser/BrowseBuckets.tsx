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
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import get from "lodash/get";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import { Button } from "@material-ui/core";
import { CreateIcon } from "../../../icons";
import { niceBytes } from "../../../common/utils";
import { Bucket, BucketList } from "../Buckets/types";
import {
  actionsTray,
  objectBrowserCommon,
  searchField,
} from "../Common/FormComponents/common/styleLibrary";
import { addRoute, resetRoutesList } from "./actions";
import BrowserBreadcrumbs from "./BrowserBreadcrumbs";
import TableWrapper from "../Common/TableWrapper/TableWrapper";
import AddBucket from "../Buckets/ListBuckets/AddBucket";
import api from "../../../common/api";

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
    usedSpaceCol: {
      width: 150,
      textAlign: "right",
    },
    subTitleLabel: {
      alignItems: "center",
      display: "flex",
    },
    bucketName: {
      display: "flex",
      alignItems: "center",
    },
    iconBucket: {
      backgroundImage: "url(/images/ob_bucket_clear.svg)",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center center",
      width: 16,
      height: 40,
      marginRight: 10,
    },
    "@global": {
      ".rowLine:hover  .iconBucketElm": {
        backgroundImage: "url(/images/ob_bucket_filled.svg)",
      },
    },
    browsePaper: {
      height: "calc(100vh - 280px)",
    },
    ...actionsTray,
    ...searchField,
    ...objectBrowserCommon,
  });

interface IBrowseBucketsProps {
  classes: any;
  addRoute: (path: string, label: string, type: string) => any;
  resetRoutesList: (doVar: boolean) => any;
  match: any;
}

const BrowseBuckets = ({
  classes,
  match,
  addRoute,
  resetRoutesList,
}: IBrowseBucketsProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [records, setRecords] = useState<Bucket[]>([]);
  const [addScreenOpen, setAddScreenOpen] = useState<boolean>(false);
  const [filterBuckets, setFilterBuckets] = useState<string>("");

  useEffect(() => {
    resetRoutesList(true);
  }, [match]);

  useEffect(() => {
    if (loading) {
      api
        .invoke("GET", `/api/v1/buckets`)
        .then((res: BucketList) => {
          setLoading(false);
          setRecords(res.buckets || []);
          setError("");
        })
        .catch((err: any) => {
          setLoading(false);
          setError(err);
        });
    }
  }, [loading]);

  const closeAddModalAndRefresh = (refresh: boolean) => {
    setAddScreenOpen(false);

    if (refresh) {
      setLoading(true);
    }
  };

  const filteredRecords = records.filter((b: Bucket) => {
    if (filterBuckets === "") {
      return true;
    }
    return b.name.indexOf(filterBuckets) >= 0;
  });

  const handleViewChange = (idElement: string) => {
    const currentPath = get(match, "url", "/object-browser");
    const newPath = `${currentPath}/${idElement}`;

    addRoute(newPath, idElement, "path");
  };

  const renderBucket = (bucketName: string) => {
    return (
      <div className={classes.bucketName}>
        <div className={`${classes.iconBucket} iconBucketElm`} />
        <span>{bucketName}</span>
      </div>
    );
  };

  return (
    <React.Fragment>
      {addScreenOpen && (
        <AddBucket
          open={addScreenOpen}
          closeModalAndRefresh={closeAddModalAndRefresh}
        />
      )}
      <Grid container>
        <Grid item xs={12} className={classes.obTitleSection}>
          <div>
            <BrowserBreadcrumbs />
          </div>
          <div>
            <Button
              variant="contained"
              color="primary"
              startIcon={<CreateIcon />}
              onClick={() => {
                setAddScreenOpen(true);
              }}
            >
              Create Bucket
            </Button>
          </div>
        </Grid>
        <Grid item xs={12} className={classes.actionsTray}>
          <TextField
            placeholder="Search Buckets"
            className={classes.searchField}
            id="search-resource"
            label=""
            onChange={(val) => {
              setFilterBuckets(val.target.value);
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
          {error !== "" && <span className={classes.errorBlock}>{error}</span>}
          <TableWrapper
            itemActions={[
              {
                type: "view",
                sendOnlyId: true,
                onClick: handleViewChange,
              },
            ]}
            columns={[
              {
                label: "Name",
                elementKey: "name",
                renderFunction: renderBucket,
              },
              {
                label: "Used Space",
                elementKey: "size",
                renderFunction: niceBytes,
                globalClass: classes.usedSpaceCol,
                rowClass: classes.usedSpaceCol,
                width: 100,
                contentTextAlign: "right",
                headerTextAlign: "right",
              },
            ]}
            isLoading={loading}
            records={filteredRecords}
            entityName="Buckets"
            idField="name"
            customPaperHeight={classes.browsePaper}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const mapDispatchToProps = {
  addRoute,
  resetRoutesList,
};

const connector = connect(null, mapDispatchToProps);

export default withRouter(connector(withStyles(styles)(BrowseBuckets)));
