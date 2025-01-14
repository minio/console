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
import { Box, BucketsIcon, HelpBox, MenuDivider, MenuSectionHeader } from "mds";
import { AppState, useAppDispatch } from "../../../../store";
import { Bucket } from "../../../../api/consoleApi";
import { api } from "../../../../api";
import {
  setBucketLoadListing,
  setErrorSnackMessage,
} from "../../../../systemSlice";
import { errorToHandler } from "../../../../api/errors";
import BucketListItem from "./BucketListItem";
import VirtualizedList from "../../Common/VirtualizedList/VirtualizedList";
import get from "lodash/get";
import { useTheme } from "styled-components";
import BucketFiltering from "./BucketFiltering";
import { useSelector } from "react-redux";

const ListBuckets = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const filterBuckets = useSelector(
    (state: AppState) => state.system.filterBucketList,
  );
  const loadingBuckets = useSelector(
    (state: AppState) => state.system.loadBucketsListing,
  );

  const [records, setRecords] = useState<Bucket[]>([]);

  useEffect(() => {
    if (loadingBuckets) {
      const fetchRecords = () => {
        dispatch(setBucketLoadListing(true));
        api.buckets.listBuckets().then((res) => {
          if (res.data) {
            dispatch(setBucketLoadListing(false));
            setRecords(res.data.buckets || []);
          } else if (res.error) {
            dispatch(setBucketLoadListing(false));
            dispatch(setErrorSnackMessage(errorToHandler(res.error)));
          }
        });
      };
      fetchRecords();
    }
  }, [loadingBuckets, dispatch]);

  const filteredRecords = records.filter((b: Bucket) => {
    if (filterBuckets === "") {
      return true;
    } else {
      return b.name.indexOf(filterBuckets) >= 0;
    }
  });

  const renderItemLine = (index: number) => {
    const bucket = filteredRecords[index] || null;
    if (bucket) {
      return <BucketListItem bucket={bucket} />;
    }
    return null;
  };

  return (
    <Fragment>
      {!loadingBuckets && records.length !== 0 && (
        <Fragment>
          <Box
            sx={{
              display: "block",
              "& .menuHeader": {
                marginTop: 10,
              },
              "& .labelContainer": {
                textAlign: "left",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                flexGrow: 1,
                width: 150,
              },
            }}
          >
            <BucketFiltering />
            <MenuSectionHeader label={"Buckets"} />
            {filteredRecords.length > 0 && (
              <Box
                sx={{
                  display: "block",
                  height: "calc(100vh - 380px)",
                  "& .bucketsListing": {
                    "&::-webkit-scrollbar": {
                      width: 5,
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: get(theme, "bulletColor", "#2781B0"),
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                      backgroundColor: "#fff",
                    },
                  },
                }}
              >
                <VirtualizedList
                  rowRenderFunction={renderItemLine}
                  totalItems={filteredRecords.length}
                  defaultHeight={35}
                />
              </Box>
            )}
            {filteredRecords.length === 0 && filterBuckets !== "" && (
              <Box
                sx={{
                  "& .helpbox-container": {
                    backgroundColor: "transparent",
                    color: get(theme, "menu.vertical.textColor", "#FFF"),
                    border: 0,
                  },
                }}
              >
                <HelpBox
                  iconComponent={<BucketsIcon />}
                  title={"No Results"}
                  help={
                    <Box sx={{ textAlign: "center" }}>
                      No buckets match the filtering condition
                    </Box>
                  }
                />
              </Box>
            )}
          </Box>
          <MenuDivider />
        </Fragment>
      )}
    </Fragment>
  );
};

export default ListBuckets;
