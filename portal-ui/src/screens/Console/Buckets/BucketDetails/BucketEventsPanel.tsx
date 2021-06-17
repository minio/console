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
import { connect } from "react-redux";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { Button, TextField } from "@material-ui/core";
import get from "lodash/get";
import Grid from "@material-ui/core/Grid";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import { CreateIcon } from "../../../../icons";
import { BucketEvent, BucketEventList } from "../types";
import { setErrorSnackMessage } from "../../../../actions";
import { AppState } from "../../../../store";
import {
  actionsTray,
  searchField,
} from "../../Common/FormComponents/common/styleLibrary";
import TableWrapper from "../../Common/TableWrapper/TableWrapper";
import api from "../../../../common/api";
import DeleteEvent from "./DeleteEvent";
import AddEvent from "./AddEvent";

const styles = (theme: Theme) =>
  createStyles({
    ...searchField,
    ...actionsTray,
    actionsTray: {
      ...actionsTray.actionsTray,
      padding: "15px 0 0",
    },
  });

interface IBucketEventsProps {
  classes: any;
  match: any;
  setErrorSnackMessage: typeof setErrorSnackMessage;
}

const BucketEventsPanel = ({
  classes,
  match,
  setErrorSnackMessage,
}: IBucketEventsProps) => {
  const [addEventScreenOpen, setAddEventScreenOpen] = useState<boolean>(false);
  const [loadingEvents, setLoadingEvents] = useState<boolean>(true);
  const [records, setRecords] = useState<BucketEvent[]>([]);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<BucketEvent | null>(null);
  const [filter, setFilter] = useState<string>("");

  const bucketName = match.params["bucketName"];

  useEffect(() => {
    if (loadingEvents) {
      api
        .invoke("GET", `/api/v1/buckets/${bucketName}/events`)
        .then((res: BucketEventList) => {
          const events = get(res, "events", []);
          setLoadingEvents(false);
          setRecords(events || []);
        })
        .catch((err: any) => {
          setLoadingEvents(false);
          setErrorSnackMessage(err);
        });
    }
  }, [loadingEvents, setErrorSnackMessage, bucketName]);

  const eventsDisplay = (events: string[]) => {
    return <Fragment>{events.join(", ")}</Fragment>;
  };

  const confirmDeleteEvent = (evnt: BucketEvent) => {
    setDeleteOpen(true);
    setSelectedEvent(evnt);
  };

  const closeAddEventAndRefresh = () => {
    setAddEventScreenOpen(false);
    setLoadingEvents(true);
  };

  const closeDeleteModalAndRefresh = (refresh: boolean) => {
    setDeleteOpen(false);
    if (refresh) {
      setLoadingEvents(true);
    }
  };

  const tableActions = [{ type: "delete", onClick: confirmDeleteEvent }];

  const filteredRecords = records.filter((item: BucketEvent) => {
    if (item.arn.toLowerCase().includes(filter.toLowerCase())) {
      return true;
    }
    return false;
  });

  return (
    <Fragment>
      {deleteOpen && (
        <DeleteEvent
          deleteOpen={deleteOpen}
          selectedBucket={bucketName}
          bucketEvent={selectedEvent}
          closeDeleteModalAndRefresh={closeDeleteModalAndRefresh}
        />
      )}
      {addEventScreenOpen && (
        <AddEvent
          open={addEventScreenOpen}
          selectedBucket={bucketName}
          closeModalAndRefresh={closeAddEventAndRefresh}
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
              setAddEventScreenOpen(true);
            }}
          >
            Subscribe to Event
          </Button>
        </Grid>
        <Grid item xs={12}>
          <br />
        </Grid>
        <Grid item xs={12}>
          <TableWrapper
            itemActions={tableActions}
            columns={[
              { label: "SQS", elementKey: "arn" },
              {
                label: "Events",
                elementKey: "events",
                renderFunction: eventsDisplay,
              },
              { label: "Prefix", elementKey: "prefix" },
              { label: "Suffix", elementKey: "suffix" },
            ]}
            isLoading={loadingEvents}
            records={filteredRecords}
            entityName="Events"
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

export default withStyles(styles)(connector(BucketEventsPanel));
