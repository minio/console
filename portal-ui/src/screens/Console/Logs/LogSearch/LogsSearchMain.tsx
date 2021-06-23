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

import React, { Fragment, useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import get from "lodash/get";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { Button, Grid } from "@material-ui/core";
import { ArrowDropUp } from "@material-ui/icons";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import {
  actionsTray,
  containerForHeader,
  logsCommon,
  searchField,
} from "../../Common/FormComponents/common/styleLibrary";
import { IReqInfoSearchResults, ISearchResponse } from "./types";
import { niceBytes, nsToSeconds } from "../../../../common/utils";
import { setErrorSnackMessage } from "../../../../actions";
import api from "../../../../common/api";
import TableWrapper from "../../Common/TableWrapper/TableWrapper";
import FilterInputWrapper from "../../Common/FormComponents/FilterInputWrapper/FilterInputWrapper";
import DateTimePickerWrapper from "../../Common/FormComponents/DateTimePickerWrapper/DateTimePickerWrapper";

interface ILogSearchProps {
  classes: any;
  setErrorSnackMessage: typeof setErrorSnackMessage;
}

const styles = (theme: Theme) =>
  createStyles({
    inputBar: {
      flexGrow: 1,
      marginLeft: 15,
    },
    advancedLabel: {
      display: "flex",
      alignItems: "center",
      color: "#091C42",
      border: 0,
      backgroundColor: "transparent",
      cursor: "pointer",
      "&:focus, &:active": {
        outline: "none",
      },
    },
    advancedLabelContainer: {
      marginTop: 10,
    },
    getInformationContainer: {
      textAlign: "right",
    },
    orderButton: {
      width: 93,
    },
    recordsLabel: {
      alignSelf: "center",
      marginLeft: 15,
    },
    blockCollapsed: {
      height: 0,
      overflowY: "hidden",
      transitionDuration: "0.3s",
    },
    filterOpen: {
      height: 200,
      marginBottom: 12,
    },
    endLineAction: {
      marginBottom: 15,
    },
    filtersContainer: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    innerContainer: {
      backgroundColor: "#fff",
      border: "#EAEDEE 1px solid",
      borderRadius: 3,
      padding: 10,
      marginBottom: 15,
    },
    noticeLabel: {
      marginLeft: 15,
      marginBottom: 15,
      fontSize: 12,
      color: "#9C9C9C",
    },

    tableFOpen: {
      height: "calc(100vh - 561px)",
    },
    tableFClosed: {
      height: "calc(100vh - 349px)",
    },
    "@global": {
      ".overrideMargin": {
        marginLeft: 0,
      },
    },
    ...searchField,
    ...actionsTray,
    ...logsCommon,
    ...containerForHeader(theme.spacing(4)),
  });

const LogsSearchMain = ({ classes, setErrorSnackMessage }: ILogSearchProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [timeStart, setTimeStart] = useState<any>(null);
  const [timeEnd, setTimeEnd] = useState<any>(null);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [records, setRecords] = useState<IReqInfoSearchResults[]>([]);
  const [bucket, setBucket] = useState<string>("");
  const [apiName, setApiName] = useState<string>("");
  const [userAgent, setUserAgent] = useState<string>("");
  const [object, setObject] = useState<string>("");
  const [requestID, setRequestID] = useState<string>("");
  const [responseStatus, setResponseStatus] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC" | undefined>(
    "DESC"
  );
  const [columnsShown, setColumnsShown] = useState<string[]>([
    "time",
    "api_name",
    "bucket",
    "object",
    "remote_host",
    "request_id",
    "user_agent",
    "response_status",
  ]);
  const [nextPage, setNextPage] = useState<number>(0);
  const [alreadyFetching, setAlreadyFetching] = useState<boolean>(false);

  let recordsResp: any = null;

  const fetchRecords = useCallback(() => {
    if (!alreadyFetching) {
      setAlreadyFetching(true);
      let queryParams = `${bucket !== "" ? `&fp=bucket:${bucket}` : ""}${
        object !== "" ? `&fp=object:${object}` : ""
      }${apiName !== "" ? `&fp=api_name:${apiName}` : ""}${
        requestID !== "" ? `&fp=request_id:${requestID}` : ""
      }${userAgent !== "" ? `&fp=user_agent:${userAgent}` : ""}${
        responseStatus !== "" ? `&fp=response_status:${responseStatus}` : ""
      }`;

      queryParams = queryParams.trim();

      if (queryParams.endsWith(",")) {
        queryParams = queryParams.slice(0, -1);
      }

      api
        .invoke(
          "GET",
          `/api/v1/logs/search?q=reqinfo${
            queryParams !== "" ? `${queryParams}` : ""
          }&pageSize=100&pageNo=${nextPage}&order=${
            sortOrder === "DESC" ? "timeDesc" : "timeAsc"
          }${
            timeStart !== null ? `&timeStart=${timeStart.toISOString()}` : ""
          }${timeEnd !== null ? `&timeEnd=${timeEnd.toISOString()}` : ""}`
        )
        .then((res: ISearchResponse) => {
          const fetchedResults = res.results || [];
          const newResultSet = [...records, ...fetchedResults];

          setLoading(false);
          setAlreadyFetching(false);
          setRecords(newResultSet);
          setNextPage(nextPage + 1);

          if (recordsResp !== null) {
            recordsResp();
          }
        })
        .catch((err: any) => {
          setLoading(false);
          setAlreadyFetching(false);
          setErrorSnackMessage(err);
        });
    }
  }, [
    bucket,
    object,
    apiName,
    requestID,
    userAgent,
    responseStatus,
    nextPage,
    sortOrder,
    timeStart,
    timeEnd,
    alreadyFetching,
    records,
    recordsResp,
    setErrorSnackMessage,
  ]);

  useEffect(() => {
    if (loading) {
      setRecords([]);
      fetchRecords();
    }
  }, [loading, sortOrder, fetchRecords]);

  const triggerLoad = () => {
    setNextPage(0);
    setLoading(true);
  };

  const selectColumn = (colName: string, active: boolean) => {
    let newArray = [...columnsShown];

    if (!active) {
      newArray = columnsShown.filter((element) => element !== colName);
    } else {
      if (!newArray.includes(colName)) {
        newArray.push(colName);
      }
    }
    setColumnsShown(newArray);
  };

  const sortChange = (sortData: any) => {
    const newSortDirection = get(sortData, "sortDirection", "DESC");
    setSortOrder(newSortDirection);
    setNextPage(0);
    setLoading(true);
  };

  const loadMoreRecords = (_: { startIndex: number; stopIndex: number }) => {
    fetchRecords();
    return new Promise((resolve) => {
      recordsResp = resolve;
    });
  };

  return (
    <Fragment>
      <Grid container className={classes.logsSubContainer}>
        <Grid
          item
          xs={12}
          className={`${classes.actionsTray} ${classes.timeContainers}`}
        >
          <span className={classes.label}>Start Time</span>
          <DateTimePickerWrapper
            value={timeStart}
            onChange={setTimeStart}
            forSearchBlock
            id="stTime"
          />
          <span className={classes.label}>End Time</span>
          <DateTimePickerWrapper
            value={timeEnd}
            onChange={setTimeEnd}
            forSearchBlock
            id="endTime"
          />
        </Grid>
        <Grid item xs={12} className={`${classes.advancedLabelContainer}`}>
          <div
            className={`${classes.blockCollapsed} ${
              filterOpen ? classes.filterOpen : ""
            }`}
          >
            <div className={classes.innerContainer}>
              <div className={classes.noticeLabel}>
                Enable your preferred options to get filtered records.
                <br />
                You can use '*' to match any character, '.' to signify a single
                character or '\' to scape an special character (E.g. mybucket-*)
              </div>
              <div className={classes.filtersContainer}>
                <FilterInputWrapper
                  onChange={setBucket}
                  value={bucket}
                  label={"Bucket"}
                  id="bucket"
                  name="bucket"
                />
                <FilterInputWrapper
                  onChange={setApiName}
                  value={apiName}
                  label={"API Name"}
                  id="api_name"
                  name="api_name"
                />
                <FilterInputWrapper
                  onChange={setUserAgent}
                  value={userAgent}
                  label={"User Agent"}
                  id="user_agent"
                  name="user_agent"
                />
              </div>
              <div className={classes.filtersContainer}>
                <FilterInputWrapper
                  onChange={setObject}
                  value={object}
                  label={"Object"}
                  id="object"
                  name="object"
                />
                <FilterInputWrapper
                  onChange={setRequestID}
                  value={requestID}
                  label={"Request ID"}
                  id="request_id"
                  name="request_id"
                />
                <FilterInputWrapper
                  onChange={setResponseStatus}
                  value={responseStatus}
                  label={"Response Status"}
                  id="response_status"
                  name="response_status"
                />
              </div>
            </div>
          </div>
        </Grid>
        <Grid
          item
          xs={12}
          className={`${classes.actionsTray} ${classes.endLineAction}`}
        >
          <div>
            <button
              type="button"
              className={`${classes.advancedLabel} overrideMargin`}
              onClick={() => {
                setFilterOpen(!filterOpen);
              }}
            >
              Advanced Filters{" "}
              {filterOpen ? <ArrowDropUp /> : <ArrowDropDownIcon />}
            </button>
          </div>
          <Button
            type="button"
            variant="contained"
            color="primary"
            onClick={triggerLoad}
          >
            Get Information
          </Button>
        </Grid>
        <Grid item xs={12}>
          <TableWrapper
            columns={[
              { label: "Timestamp", elementKey: "time", enableSort: true },
              { label: "API Name", elementKey: "api_name" },
              { label: "Bucket", elementKey: "bucket" },
              { label: "Object", elementKey: "object" },
              { label: "Remote Host", elementKey: "remote_host" },
              { label: "Request ID", elementKey: "request_id" },
              { label: "User Agent", elementKey: "user_agent" },
              {
                label: "Response Status",
                elementKey: "response_status",
                renderFunction: (element) => (
                  <Fragment>
                    <span>
                      {element.response_status_code} ({element.response_status})
                    </span>
                  </Fragment>
                ),
                renderFullObject: true,
              },
              {
                label: "Request Content Length",
                elementKey: "request_content_length",
                renderFunction: niceBytes,
              },
              {
                label: "Response Content Length",
                elementKey: "response_content_length",
                renderFunction: niceBytes,
              },
              {
                label: "Time to Response NS",
                elementKey: "time_to_response_ns",
                renderFunction: nsToSeconds,
                contentTextAlign: "right",
              },
            ]}
            isLoading={loading}
            records={records}
            entityName="Logs"
            customEmptyMessage={"There is no information with this criteria"}
            idField="request_id"
            columnsSelector
            columnsShown={columnsShown}
            onColumnChange={selectColumn}
            customPaperHeight={
              filterOpen ? classes.tableFOpen : classes.tableFClosed
            }
            sortConfig={{
              currentSort: "time",
              currentDirection: sortOrder,
              triggerSort: sortChange,
            }}
            infiniteScrollConfig={{
              recordsCount: 1000000,
              loadMoreRecords: loadMoreRecords,
            }}
            textSelectable
          />
        </Grid>
      </Grid>
    </Fragment>
  );
};

const mapDispatchToProps = {
  setErrorSnackMessage,
};

const connector = connect(null, mapDispatchToProps);

export default withStyles(styles)(connector(LogsSearchMain));
