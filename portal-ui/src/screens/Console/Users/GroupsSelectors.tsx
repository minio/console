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

import React, { useCallback, useEffect, useState, Fragment } from "react";
import get from "lodash/get";

import { Box, DataTable, Grid, ProgressBar } from "mds";
import { stringSort } from "../../../utils/sortFunctions";
import { GroupsList } from "../Groups/types";
import { ErrorResponseHandler } from "../../../common/types";
import { setModalErrorSnackMessage } from "../../../systemSlice";
import { useAppDispatch } from "../../../store";
import api from "../../../common/api";
import SearchBox from "../Common/SearchBox";

interface IGroupsProps {
  selectedGroups: string[];
  setSelectedGroups: any;
}

const GroupsSelectors = ({
  selectedGroups,
  setSelectedGroups,
}: IGroupsProps) => {
  const dispatch = useAppDispatch();
  // Local State
  const [records, setRecords] = useState<any[]>([]);
  const [loading, isLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");

  const fetchGroups = useCallback(() => {
    api
      .invoke("GET", `/api/v1/groups`)
      .then((res: GroupsList) => {
        let groups = get(res, "groups", []);

        if (!groups) {
          groups = [];
        }
        setRecords(groups.sort(stringSort));
        isLoading(false);
      })
      .catch((err: ErrorResponseHandler) => {
        dispatch(setModalErrorSnackMessage(err));
        isLoading(false);
      });
  }, [dispatch]);

  //Effects
  useEffect(() => {
    isLoading(true);
  }, []);

  useEffect(() => {
    if (loading) {
      fetchGroups();
    }
  }, [loading, fetchGroups]);

  const selGroups = !selectedGroups ? [] : selectedGroups;

  const selectionChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetD = e.target;
    const value = targetD.value;
    const checked = targetD.checked;

    let elements: string[] = [...selGroups]; // We clone the selectedGroups array

    if (checked) {
      // If the user has checked this field we need to push this to selectedGroupsList
      elements.push(value);
    } else {
      // User has unchecked this field, we need to remove it from the list
      elements = elements.filter((element) => element !== value);
    }
    setSelectedGroups(elements);

    return elements;
  };

  const filteredRecords = records.filter((elementItem) =>
    elementItem.includes(filter),
  );

  return (
    <Grid item xs={12} className={"inputItem"}>
      {loading && <ProgressBar />}
      {records !== null && records.length > 0 ? (
        <Fragment>
          <Grid item xs={12} className={"inputItem"}>
            <SearchBox
              placeholder="Start typing to search for Groups"
              onChange={setFilter}
              value={filter}
              label={"Assign Groups"}
            />
          </Grid>
          <DataTable
            columns={[{ label: "Group" }]}
            onSelect={selectionChanged}
            selectedItems={selGroups}
            isLoading={loading}
            records={filteredRecords}
            entityName="Groups"
            idField=""
            customPaperHeight={"200px"}
          />
        </Fragment>
      ) : (
        <Box
          sx={{
            textAlign: "center",
            padding: "10px 0",
          }}
        >
          No Groups Available
        </Box>
      )}
    </Grid>
  );
};

export default GroupsSelectors;
