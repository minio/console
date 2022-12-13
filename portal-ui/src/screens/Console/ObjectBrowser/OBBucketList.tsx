// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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

import React, { Fragment, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Theme } from "@mui/material/styles";
import { Button } from "mds";
import createStyles from "@mui/styles/createStyles";
import { LinearProgress } from "@mui/material";
import Grid from "@mui/material/Grid";
import { Bucket, BucketList } from "../Buckets/types";
import { BucketsIcon } from "../../../icons";
import {
  actionsTray,
  containerForHeader,
  searchField,
} from "../Common/FormComponents/common/styleLibrary";
import { ErrorResponseHandler } from "../../../common/types";
import api from "../../../common/api";
import PageHeader from "../Common/PageHeader/PageHeader";

import HelpBox from "../../../common/HelpBox";
import RefreshIcon from "../../../icons/RefreshIcon";
import { SecureComponent } from "../../../common/SecureComponent";
import {
  CONSOLE_UI_RESOURCE,
  IAM_PAGES,
  IAM_SCOPES,
  permissionTooltipHelper,
} from "../../../common/SecureComponent/permissions";
import PageLayout from "../Common/Layout/PageLayout";
import SearchBox from "../Common/SearchBox";
import hasPermission from "../../../common/SecureComponent/accessControl";
import { setErrorSnackMessage } from "../../../systemSlice";
import { useAppDispatch } from "../../../store";
import { useSelector } from "react-redux";
import { selFeatures } from "../consoleSlice";
import AutoColorIcon from "../Common/Components/AutoColorIcon";
import TooltipWrapper from "../Common/TooltipWrapper/TooltipWrapper";
import AButton from "../Common/AButton/AButton";
import { setLoadingObjects } from "../ObjectBrowser/objectBrowserSlice";
import makeStyles from "@mui/styles/makeStyles";
import TableWrapper from "../Common/TableWrapper/TableWrapper";
import { niceBytesInt } from "../../../common/utils";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    bulkSelect: {
      marginLeft: 8,
      "&:hover": {
        backgroundColor: theme.palette.primary.main,
      },
      "&.MuiButton-contained": {
        backgroundColor: theme.palette.primary.main,
      },
    },
    bucketList: {
      marginTop: 25,
      height: "calc(100vh - 211px)",
      "&.isEmbedded": {
        height: "calc(100vh - 128px)",
      },
    },
    searchField: {
      ...searchField.searchField,
      minWidth: 380,
      "@media (max-width: 900px)": {
        minWidth: 220,
      },
    },
    ...actionsTray,
    ...containerForHeader(theme.spacing(4)),
  })
);

const OBListBuckets = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const classes = useStyles();

  const [records, setRecords] = useState<Bucket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterBuckets, setFilterBuckets] = useState<string>("");

  const features = useSelector(selFeatures);
  const obOnly = !!features?.includes("object-browser-only");

  useEffect(() => {
    if (loading) {
      const fetchRecords = () => {
        setLoading(true);
        api
          .invoke("GET", `/api/v1/buckets`)
          .then((res: BucketList) => {
            setLoading(false);
            setRecords(res.buckets || []);
            dispatch(setLoadingObjects(true));
          })
          .catch((err: ErrorResponseHandler) => {
            setLoading(false);
            dispatch(setErrorSnackMessage(err));
          });
      };
      fetchRecords();
    }
  }, [loading, dispatch]);

  const filteredRecords = records.filter((b: Bucket) => {
    if (filterBuckets === "") {
      return true;
    } else {
      return b.name.indexOf(filterBuckets) >= 0;
    }
  });

  const hasBuckets = records.length > 0;

  const canListBuckets = hasPermission("*", [IAM_SCOPES.S3_LIST_BUCKET]);

  const tableActions = [
    {
      type: "view",
      onClick: (bucket: Bucket) => {
        navigate(`${IAM_PAGES.OBJECT_BROWSER_VIEW}/${bucket.name}`);
      },
    },
  ];

  return (
    <Fragment>
      {!obOnly && <PageHeader label={"Object Browser"} />}
      <PageLayout>
        <Grid item xs={12} className={classes.actionsTray} display="flex">
          {obOnly && (
            <Grid item xs>
              <AutoColorIcon marginRight={15} marginTop={10} />
            </Grid>
          )}
          {hasBuckets && (
            <SearchBox
              onChange={setFilterBuckets}
              placeholder="Filter Buckets"
              overrideClass={classes.searchField}
              value={filterBuckets}
            />
          )}

          <Grid
            item
            xs={12}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"flex-end"}
            sx={{
              "& button": {
                marginLeft: "8px",
              },
            }}
          >
            <TooltipWrapper tooltip={"Refresh"}>
              <Button
                id={"refresh-buckets"}
                onClick={() => {
                  setLoading(true);
                }}
                icon={<RefreshIcon />}
                variant={"regular"}
              />
            </TooltipWrapper>
          </Grid>
        </Grid>

        {loading && <LinearProgress />}
        {!loading && (
          <Grid
            item
            xs={12}
            className={`${classes.bucketList} ${obOnly ? "isEmbedded" : ""}`}
          >
            {filteredRecords.length !== 0 && (
              <TableWrapper
                isLoading={loading}
                records={filteredRecords}
                entityName={"Buckets"}
                idField={"name"}
                columns={[
                  { label: "Name", elementKey: "name" },
                  {
                    label: "Objects",
                    elementKey: "objects",
                    renderFunction: (size: number) => size || 0,
                  },
                  {
                    label: "Size",
                    elementKey: "size",
                    renderFunction: (size: number) => niceBytesInt(size || 0),
                  },
                  {
                    label: "Access",
                    renderFullObject: true,
                    renderFunction: (bucket: Bucket) => {
                      let access = [];
                      if (bucket.rw_access?.read) {
                        access.push("R");
                      }
                      if (bucket.rw_access?.write) {
                        access.push("W");
                      }
                      return <span>{access.join("/")}</span>;
                    },
                  },
                ]}
                itemActions={tableActions}
              />
            )}
            {filteredRecords.length === 0 && filterBuckets !== "" && (
              <Grid
                container
                justifyContent={"center"}
                alignContent={"center"}
                alignItems={"center"}
              >
                <Grid item xs={8}>
                  <HelpBox
                    iconComponent={<BucketsIcon />}
                    title={"No Results"}
                    help={
                      <Fragment>
                        No buckets match the filtering condition
                      </Fragment>
                    }
                  />
                </Grid>
              </Grid>
            )}
            {!hasBuckets && (
              <Grid
                container
                justifyContent={"center"}
                alignContent={"center"}
                alignItems={"center"}
              >
                <Grid item xs={8}>
                  <HelpBox
                    iconComponent={<BucketsIcon />}
                    title={"Buckets"}
                    help={
                      <Fragment>
                        MinIO uses buckets to organize objects. A bucket is
                        similar to a folder or directory in a filesystem, where
                        each bucket can hold an arbitrary number of objects.
                        <br />
                        {canListBuckets ? (
                          ""
                        ) : (
                          <Fragment>
                            <br />
                            {permissionTooltipHelper(
                              [IAM_SCOPES.S3_LIST_BUCKET],
                              "view the buckets on this server"
                            )}
                            <br />
                          </Fragment>
                        )}
                        <SecureComponent
                          scopes={[IAM_SCOPES.S3_CREATE_BUCKET]}
                          resource={CONSOLE_UI_RESOURCE}
                        >
                          <br />
                          To get started,&nbsp;
                          <AButton
                            onClick={() => {
                              navigate(IAM_PAGES.ADD_BUCKETS);
                            }}
                          >
                            Create a Bucket.
                          </AButton>
                        </SecureComponent>
                      </Fragment>
                    }
                  />
                </Grid>
              </Grid>
            )}
          </Grid>
        )}
      </PageLayout>
    </Fragment>
  );
};

export default OBListBuckets;
