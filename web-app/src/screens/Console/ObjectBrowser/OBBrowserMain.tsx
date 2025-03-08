// This file is part of MinIO Console Server
// Copyright (c) 2025 MinIO, Inc.
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
import {
  ActionLink,
  BucketsIcon,
  Grid,
  HelpBox,
  PageLayout,
  ProgressBar,
} from "mds";
import { SecureComponent } from "../../../common/SecureComponent";
import {
  CONSOLE_UI_RESOURCE,
  IAM_SCOPES,
  permissionTooltipHelper,
} from "../../../common/SecureComponent/permissions";
import hasPermission from "../../../common/SecureComponent/accessControl";
import { setErrorSnackMessage, setHelpName } from "../../../systemSlice";
import { useAppDispatch } from "../../../store";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";
import { api } from "../../../api";
import { errorToHandler } from "../../../api/errors";
import HelpMenu from "../HelpMenu";
import { setAddBucketOpen } from "../Buckets/ListBuckets/AddBucket/addBucketsSlice";

const OBBrowserMain = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (loading) {
      const fetchRecords = () => {
        setLoading(true);
        api.buckets
          .listBuckets()
          .then((res) => {
            if (res.data) {
              setLoading(false);

              const data = res.data.buckets || [];

              if (data.length >= 1) {
                navigate(`/browser/${data[0].name}`);
              }
            }
          })
          .catch((err) => {
            setLoading(false);
            dispatch(setErrorSnackMessage(errorToHandler(err)));
          });
      };
      fetchRecords();
    }
  }, [loading, dispatch, navigate]);

  const canListBuckets = hasPermission("*", [
    IAM_SCOPES.S3_LIST_BUCKET,
    IAM_SCOPES.S3_ALL_LIST_BUCKET,
  ]);

  useEffect(() => {
    dispatch(setHelpName("object_browser"));
  }, [dispatch]);

  return (
    <Fragment>
      <PageHeaderWrapper label={"Object Browser"} actions={<HelpMenu />} />
      <PageLayout>
        {loading && <ProgressBar />}
        {!loading && (
          <Grid
            item
            xs={12}
            sx={{
              marginTop: 25,
              height: "calc(100vh - 211px)",
              "&.isEmbedded": {
                height: "calc(100vh - 128px)",
              },
            }}
          >
            <Grid
              container
              sx={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
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
                            [
                              IAM_SCOPES.S3_LIST_BUCKET,
                              IAM_SCOPES.S3_ALL_LIST_BUCKET,
                            ],
                            "view the buckets on this server",
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
                        <ActionLink
                          onClick={() => {
                            dispatch(setAddBucketOpen(true));
                          }}
                        >
                          Create a Bucket.
                        </ActionLink>
                      </SecureComponent>
                    </Fragment>
                  }
                />
              </Grid>
            </Grid>
          </Grid>
        )}
      </PageLayout>
    </Fragment>
  );
};

export default OBBrowserMain;
