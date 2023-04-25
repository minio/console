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

import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, PageLayout, SearchIcon } from "mds";
import { Theme } from "@mui/material/styles";
import { Grid } from "@mui/material";
import { DateTime } from "luxon";
import get from "lodash/get";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import {
  advancedFilterToggleStyles,
  containerForHeader,
  tableStyles,
} from "../../Common/FormComponents/common/styleLibrary";
import { IReqInfoSearchResults, ISearchResponse } from "./types";
import { niceBytes, nsToSeconds } from "../../../../common/utils";
import { ErrorResponseHandler } from "../../../../common/types";
import api from "../../../../common/api";
import TableWrapper from "../../Common/TableWrapper/TableWrapper";
import FilterInputWrapper from "../../Common/FormComponents/FilterInputWrapper/FilterInputWrapper";
import LogSearchFullModal from "./LogSearchFullModal";
import { LogSearchColumnLabels } from "./utils";
import DateRangeSelector from "../../Common/FormComponents/DateRangeSelector/DateRangeSelector";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  CONSOLE_UI_RESOURCE,
  IAM_SCOPES,
} from "../../../../common/SecureComponent/permissions";
import { SecureComponent } from "../../../../common/SecureComponent";
import MissingIntegration from "../../Common/MissingIntegration/MissingIntegration";
import { setErrorSnackMessage } from "../../../../systemSlice";
import { selFeatures } from "../../consoleSlice";
import { useAppDispatch } from "../../../../store";
import PageHeaderWrapper from "../../Common/PageHeaderWrapper/PageHeaderWrapper";

interface ILogSearchProps {
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    blockCollapsed: {
      display: "none",
      overflowY: "hidden",
    },
    filterOpen: {
      display: "block",
      marginBottom: 12,
    },
    endLineAction: {
      marginBottom: 15,
      padding: "0 15px 0 15px",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
    },
    filtersContainer: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    innerContainer: {
      backgroundColor: "#fff",
    },
    noticeLabel: {
      marginLeft: 15,
      marginBottom: 15,
      fontSize: 12,
      color: "#9C9C9C",
    },

    tableFOpen: {
      height: "calc(100vh - 520px)",
    },
    tableFClosed: {
      height: "calc(100vh - 320px)",
    },
    ...tableStyles,
    ...advancedFilterToggleStyles,

    searchOptions: {
      display: "flex",
      padding: 15,
      "@media (max-width: 900px)": {
        flexFlow: "column",
      },
    },
    formBox: {
      border: "1px solid #EAEAEA",
      marginBottom: 15,
    },
    dateRangePicker: {
      "& div": {
        marginBottom: 0,
      },
    },
    advancedButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
    },

    ...containerForHeader,
  });

const LogsSearchMain = ({ classes }: ILogSearchProps) => {
  const dispatch = useAppDispatch();
  const features = useSelector(selFeatures);

  const [loading, setLoading] = useState<boolean>(true);
  const [timeStart, setTimeStart] = useState<DateTime | null>(null);
  const [timeEnd, setTimeEnd] = useState<DateTime | null>(null);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [records, setRecords] = useState<IReqInfoSearchResults[]>([]);
  const [bucket, setBucket] = useState<string>("");
  const [apiName, setApiName] = useState<string>("");
  const [accessKey, setAccessKey] = useState<string>("");
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
    "access_key",
    "bucket",
    "object",
    "remote_host",
    "request_id",
    "user_agent",
    "response_status",
  ]);
  const [nextPage, setNextPage] = useState<number>(0);
  const [alreadyFetching, setAlreadyFetching] = useState<boolean>(false);
  const [logSearchExtrasOpen, setLogSearchExtrasOpen] =
    useState<boolean>(false);
  const [selectedItem, setSelectedItem] =
    useState<IReqInfoSearchResults | null>(null);

  let recordsResp: any = null;
  const logSearchEnabled = features && features.includes("log-search");

  const fetchRecords = useCallback(() => {
    if (!alreadyFetching && logSearchEnabled) {
      setAlreadyFetching(true);
      let queryParams = `${bucket !== "" ? `&fp=bucket:${bucket}` : ""}${
        object !== "" ? `&fp=object:${object}` : ""
      }${apiName !== "" ? `&fp=api_name:${apiName}` : ""}${
        accessKey !== "" ? `&fp=access_key:${accessKey}` : ""
      }${requestID !== "" ? `&fp=request_id:${requestID}` : ""}${
        userAgent !== "" ? `&fp=user_agent:${userAgent}` : ""
      }${responseStatus !== "" ? `&fp=response_status:${responseStatus}` : ""}`;

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
          }${timeStart !== null ? `&timeStart=${timeStart.toISO()}` : ""}${
            timeEnd !== null ? `&timeEnd=${timeEnd.toISO()}` : ""
          }`
        )
        .then((res: ISearchResponse) => {
          const fetchedResults = res.results || [];

          setLoading(false);
          setAlreadyFetching(false);
          setRecords(fetchedResults);
          setNextPage(nextPage + 1);

          if (recordsResp !== null) {
            recordsResp();
          }
        })
        .catch((err: ErrorResponseHandler) => {
          setLoading(false);
          setAlreadyFetching(false);
          dispatch(setErrorSnackMessage(err));
        });
    } else {
      setLoading(false);
      setAlreadyFetching(false);
    }
  }, [
    alreadyFetching,
    logSearchEnabled,
    bucket,
    object,
    apiName,
    accessKey,
    requestID,
    userAgent,
    responseStatus,
    nextPage,
    sortOrder,
    timeStart,
    timeEnd,
    recordsResp,
    dispatch,
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

  const openExtraInformation = (item: IReqInfoSearchResults) => {
    setSelectedItem(item);
    setLogSearchExtrasOpen(true);
  };

  const closeViewExtraInformation = () => {
    setSelectedItem(null);
    setLogSearchExtrasOpen(false);
  };

  return (
    <Fragment>
      {logSearchExtrasOpen && selectedItem !== null && (
        <LogSearchFullModal
          logSearchElement={selectedItem}
          modalOpen={logSearchExtrasOpen}
          onClose={closeViewExtraInformation}
        />
      )}

      <PageHeaderWrapper label="Audit Logs" />
      <PageLayout>
        {!logSearchEnabled ? (
          <MissingIntegration
            entity={"Audit Logs"}
            iconComponent={<SearchIcon />}
            documentationLink="https://github.com/minio/operator/tree/master/logsearchapi"
          />
        ) : (
          <Fragment>
            {" "}
            <Grid item xs={12} className={classes.formBox}>
              <Grid item xs={12} className={`${classes.searchOptions}`}>
                <div className={classes.dateRangePicker}>
                  <DateRangeSelector
                    setTimeEnd={(time) => setTimeEnd(time)}
                    setTimeStart={(time) => setTimeStart(time)}
                    timeEnd={timeEnd}
                    timeStart={timeStart}
                  />
                </div>

                <Grid item className={classes.advancedButton}>
                  <button
                    onClick={() => {
                      setFilterOpen(!filterOpen);
                    }}
                    className={classes.advancedConfiguration}
                  >
                    {filterOpen ? "Hide" : "Show"} advanced Filters{" "}
                    <span
                      className={
                        filterOpen
                          ? classes.advancedOpen
                          : classes.advancedClosed
                      }
                    >
                      <ArrowForwardIosIcon />
                    </span>
                  </button>
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                className={`${classes.blockCollapsed} ${
                  filterOpen ? classes.filterOpen : ""
                }`}
              >
                <div className={classes.innerContainer}>
                  <div className={classes.noticeLabel}>
                    Enable your preferred options to get filtered records.
                    <br />
                    You can use '*' to match any character, '.' to signify a
                    single character or '\' to scape an special character (E.g.
                    mybucket-*)
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
                      onChange={setAccessKey}
                      value={accessKey}
                      label={"Access Key"}
                      id="access_key"
                      name="access_key"
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
              </Grid>
              <Grid item xs={12} className={classes.endLineAction}>
                <Button
                  id={"get-information"}
                  type="button"
                  variant="callAction"
                  onClick={triggerLoad}
                  label={"Get Information"}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} className={classes.tableBlock}>
              <SecureComponent
                scopes={[IAM_SCOPES.ADMIN_HEALTH_INFO]}
                resource={CONSOLE_UI_RESOURCE}
                errorProps={{ disabled: true }}
              >
                <TableWrapper
                  columns={[
                    {
                      label: LogSearchColumnLabels.time,
                      elementKey: "time",
                      enableSort: true,
                    },
                    {
                      label: LogSearchColumnLabels.api_name,
                      elementKey: "api_name",
                    },
                    {
                      label: LogSearchColumnLabels.access_key,
                      elementKey: "access_key",
                    },
                    {
                      label: LogSearchColumnLabels.bucket,
                      elementKey: "bucket",
                    },
                    {
                      label: LogSearchColumnLabels.object,
                      elementKey: "object",
                    },
                    {
                      label: LogSearchColumnLabels.remote_host,
                      elementKey: "remote_host",
                    },
                    {
                      label: LogSearchColumnLabels.request_id,
                      elementKey: "request_id",
                    },
                    {
                      label: LogSearchColumnLabels.user_agent,
                      elementKey: "user_agent",
                    },
                    {
                      label: LogSearchColumnLabels.response_status,
                      elementKey: "response_status",
                      renderFunction: (element) => (
                        <Fragment>
                          <span>
                            {element.response_status_code} (
                            {element.response_status})
                          </span>
                        </Fragment>
                      ),
                      renderFullObject: true,
                    },
                    {
                      label: LogSearchColumnLabels.request_content_length,
                      elementKey: "request_content_length",
                      renderFunction: niceBytes,
                    },
                    {
                      label: LogSearchColumnLabels.response_content_length,
                      elementKey: "response_content_length",
                      renderFunction: niceBytes,
                    },
                    {
                      label: LogSearchColumnLabels.time_to_response_ns,
                      elementKey: "time_to_response_ns",
                      renderFunction: nsToSeconds,
                      contentTextAlign: "right",
                    },
                  ]}
                  isLoading={loading}
                  records={records}
                  entityName="Logs"
                  customEmptyMessage={
                    "There is no information with this criteria"
                  }
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
                  itemActions={[
                    {
                      type: "view",
                      onClick: openExtraInformation,
                    },
                  ]}
                  textSelectable
                />
              </SecureComponent>
            </Grid>
          </Fragment>
        )}
      </PageLayout>
    </Fragment>
  );
};

export default withStyles(styles)(LogsSearchMain);
