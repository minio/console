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

import React, { Fragment, useState, useEffect } from "react";
import { connect } from "react-redux";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { Button, TextField } from "@material-ui/core";
import get from "lodash/get";
import * as reactMoment from "react-moment";
import Grid from "@material-ui/core/Grid";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import { LifeCycleItem } from "../types";
import { CreateIcon } from "../../../../icons";
import {
  actionsTray,
  searchField,
} from "../../Common/FormComponents/common/styleLibrary";
import { setErrorSnackMessage } from "../../../../actions";
import api from "../../../../common/api";
import EditLifecycleConfiguration from "./EditLifecycleConfiguration";
import AddLifecycleModal from "./AddLifecycleModal";
import TableWrapper from "../../Common/TableWrapper/TableWrapper";
import { AppState } from "../../../../store";

const styles = (theme: Theme) =>
  createStyles({
    ...searchField,
    ...actionsTray,
    actionsTray: {
      ...actionsTray.actionsTray,
      padding: "15px 0 0",
    },
  });

interface IBucketLifecyclePanelProps {
  classes: any;
  match: any;
  setErrorSnackMessage: typeof setErrorSnackMessage;
}

const BucketLifecyclePanel = ({
  classes,
  match,
  setErrorSnackMessage,
}: IBucketLifecyclePanelProps) => {
  const [loadingLifecycle, setLoadingLifecycle] = useState<boolean>(true);
  const [lifecycleRecords, setLifecycleRecords] = useState<LifeCycleItem[]>([]);
  const [addLifecycleOpen, setAddLifecycleOpen] = useState<boolean>(false);
  const [editLifecycleOpen, setEditLifecycleOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");

  const bucketName = match.params["bucketName"];

  useEffect(() => {
    if (loadingLifecycle) {
      api
        .invoke("GET", `/api/v1/buckets/${bucketName}/lifecycle`)
        .then((res: any) => {
          const records = get(res, "lifecycle", []);

          setLifecycleRecords(records || []);
          setLoadingLifecycle(false);
        })
        .catch((err) => {
          console.error(err);
          setLoadingLifecycle(false);
        });
    }
  }, [loadingLifecycle, setLoadingLifecycle, bucketName]);

  const closeEditLCAndRefresh = (refresh: boolean) => {
    setEditLifecycleOpen(false);
    if (refresh) {
      setLoadingLifecycle(true);
    }
  };

  const closeAddLCAndRefresh = (refresh: boolean) => {
    setAddLifecycleOpen(false);
    if (refresh) {
      setLoadingLifecycle(true);
    }
  };

  const expirationRender = (expiration: any) => {
    if (expiration.days) {
      return `${expiration.days} day${expiration.days > 1 ? "s" : ""}`;
    }

    if (expiration.date === "0001-01-01T00:00:00Z") {
      return "";
    }

    return <reactMoment.default>{expiration.date}</reactMoment.default>;
  };

  const transitionRender = (transition: any) => {
    if (transition.days) {
      return `${transition.days} day${transition.days > 1 ? "s" : ""}`;
    }

    if (transition.date === "0001-01-01T00:00:00Z") {
      return "";
    }

    return <reactMoment.default>{transition.date}</reactMoment.default>;
  };

  const renderStorageClass = (objectST: any) => {
    const stClass = get(objectST, "transition.storage_class", "");

    return stClass;
  };

  const lifecycleColumns = [
    { label: "ID", elementKey: "id" },
    {
      label: "Prefix",
      elementKey: "prefix",
    },
    {
      label: "Status",
      elementKey: "status",
    },
    {
      label: "Expiration",
      elementKey: "expiration",
      renderFunction: expirationRender,
    },
    {
      label: "Transition",
      elementKey: "transition",
      renderFunction: transitionRender,
    },
    {
      label: "Storage Class",
      elementKey: "storage_class",
      renderFunction: renderStorageClass,
      renderFullObject: true,
    },
  ];

  const filteredRecords = lifecycleRecords.filter((item: LifeCycleItem) => {
    if (item.id.toLocaleLowerCase().includes(filter.toLowerCase())) {
      return true;
    }
    return false;
  });

  return (
    <Fragment>
      {editLifecycleOpen && (
        <EditLifecycleConfiguration
          open={editLifecycleOpen}
          closeModalAndRefresh={closeEditLCAndRefresh}
          selectedBucket={bucketName}
          lifecycle={{
            id: "",
          }}
        />
      )}
      {addLifecycleOpen && (
        <AddLifecycleModal
          open={addLifecycleOpen}
          bucketName={bucketName}
          closeModalAndRefresh={closeAddLCAndRefresh}
        />
      )}
      <Grid container>
        <Grid item xs={12} className={classes.actionsTray}>
          <TextField
            placeholder="Filter"
            className={classes.searchField}
            id="search-resource"
            label=""
            onChange={(event) => {
              setFilter(event.target.value);
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
          <Button
            variant="contained"
            color="primary"
            startIcon={<CreateIcon />}
            size="medium"
            onClick={() => {
              setAddLifecycleOpen(true);
            }}
          >
            Add Lifecycle Rule
          </Button>
        </Grid>
        <Grid item xs={12}>
          <br />
        </Grid>
        <Grid item xs={12}>
          <TableWrapper
            itemActions={[]}
            columns={lifecycleColumns}
            isLoading={loadingLifecycle}
            records={filteredRecords}
            entityName="Lifecycle"
            customEmptyMessage="There are no Lifecycle rules yet"
            idField="id"
          />
        </Grid>
      </Grid>
    </Fragment>
  );
};

const mapState = (state: AppState) => ({
  session: state.console.session,
});

const connector = connect(mapState, {
  setErrorSnackMessage,
});

export default withStyles(styles)(connector(BucketLifecyclePanel));
