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

import React, { useState, useEffect, Fragment } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import get from "lodash/get";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import { IconButton, Tooltip } from "@material-ui/core";
import { BucketsIcon, CreateIcon } from "../../../icons";
import { niceBytes } from "../../../common/utils";
import { Bucket, BucketList, HasPermissionResponse } from "../Buckets/types";
import {
  actionsTray,
  objectBrowserCommon,
  searchField,
} from "../Common/FormComponents/common/styleLibrary";
import { addRoute, resetRoutesList } from "./actions";
import { setErrorSnackMessage } from "../../../actions";
import { ErrorResponseHandler } from "../../../common/types";
import BrowserBreadcrumbs from "./BrowserBreadcrumbs";
import TableWrapper from "../Common/TableWrapper/TableWrapper";
import AddBucket from "../Buckets/ListBuckets/AddBucket";
import api from "../../../common/api";
import RefreshIcon from "@material-ui/icons/Refresh";
import ScreenTitle from "../Common/ScreenTitle/ScreenTitle";

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
  displayErrorMessage: typeof setErrorSnackMessage;
  match: any;
}

const BrowseBuckets = ({
  classes,
  match,
  addRoute,
  resetRoutesList,
  displayErrorMessage,
}: IBrowseBucketsProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [records, setRecords] = useState<Bucket[]>([]);
  const [addScreenOpen, setAddScreenOpen] = useState<boolean>(false);
  const [filterBuckets, setFilterBuckets] = useState<string>("");
  const [loadingPerms, setLoadingPerms] = useState<boolean>(true);
  const [canCreateBucket, setCanCreateBucket] = useState<boolean>(false);

  // check the permissions for creating bucket
  useEffect(() => {
    if (loadingPerms) {
      api
        .invoke("POST", `/api/v1/has-permission`, {
          actions: [
            {
              id: "createBucket",
              action: "s3:CreateBucket",
            },
          ],
        })
        .then((res: HasPermissionResponse) => {
          const canCreate = res.permissions
            .filter((s) => s.id === "createBucket")
            .pop();
          if (canCreate && canCreate.can) {
            setCanCreateBucket(true);
          } else {
            setCanCreateBucket(false);
          }

          setLoadingPerms(false);
          // setRecords(res.buckets || []);
        })
        .catch((err: ErrorResponseHandler) => {
          setLoadingPerms(false);
          setErrorSnackMessage(err);
        });
    }
  }, [loadingPerms]);

  useEffect(() => {
    resetRoutesList(true);
  }, [match, resetRoutesList]);

  useEffect(() => {
    if (loading) {
      api
        .invoke("GET", `/api/v1/buckets`)
        .then((res: BucketList) => {
          setLoading(false);
          setRecords(res.buckets || []);
        })
        .catch((err: ErrorResponseHandler) => {
          setLoading(false);
          displayErrorMessage(err);
        });
    }
  }, [loading, displayErrorMessage]);

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
    <Fragment>
      {addScreenOpen && (
        <AddBucket
          open={addScreenOpen}
          closeModalAndRefresh={closeAddModalAndRefresh}
        />
      )}
      <Grid container>
        <Grid item xs={12}>
          <ScreenTitle
            icon={
              <Fragment>
                <BucketsIcon width={40} />
              </Fragment>
            }
            title={"All Buckets"}
            subTitle={
              <Fragment>
                <BrowserBreadcrumbs title={false} />
              </Fragment>
            }
            actions={
              <Fragment>
                {canCreateBucket && (
                  <Fragment>
                    <Tooltip title={"Create Bucket"}>
                      <IconButton
                        color="primary"
                        aria-label="Create Bucket"
                        component="span"
                        onClick={() => {
                          setAddScreenOpen(true);
                        }}
                      >
                        <CreateIcon />
                      </IconButton>
                    </Tooltip>
                  </Fragment>
                )}
                <Tooltip title={"Refresh List"}>
                  <IconButton
                    color="primary"
                    aria-label="Refresh List"
                    component="span"
                    onClick={() => {
                      setLoading(true);
                    }}
                  >
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Fragment>
            }
          />
        </Grid>
        <Grid item xs={12} className={classes.actionsTray}>
          <TextField
            placeholder="Filter Buckets"
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
    </Fragment>
  );
};

const mapDispatchToProps = {
  addRoute,
  resetRoutesList,
  displayErrorMessage: setErrorSnackMessage,
};

const connector = connect(null, mapDispatchToProps);

export default withRouter(connector(withStyles(styles)(BrowseBuckets)));
