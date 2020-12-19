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

import React, { Fragment, useState, useEffect } from "react";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import {
  Button,
  FormControl,
  Grid,
  InputBase,
  MenuItem,
  Select,
} from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import ScheduleIcon from "@material-ui/icons/Schedule";
import TextField from "@material-ui/core/TextField";
import { ArrowDropUp } from "@material-ui/icons";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import MomentUtils from "@date-io/moment";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import TableWrapper from "../../Common/TableWrapper/TableWrapper";
import PageHeader from "../../Common/PageHeader/PageHeader";
import ErrorBlock from "../../../shared/ErrorBlock";
import {
  actionsTray,
  containerForHeader,
  searchField,
} from "../../Common/FormComponents/common/styleLibrary";
import FormSwitchWrapper from "../../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import { IReqInfoSearchResults } from "./types";
import EnableInputWrapper from "../../Common/FormComponents/EnableInputWrapper/EnableInputWrapper";

interface ILogSearchProps {
  classes: any;
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
      overFlowY: "auto",
    },
    noticeLabel: {
      marginLeft: 15,
      marginBottom: 15,
      fontSize: 12,
      color: "#9C9C9C",
    },
    label: {
      color: "#393939",
      fontWeight: 600,
      fontSize: 13,
      alignSelf: "center",
      whiteSpace: "nowrap",
      "&:not(:first-of-type)": {
        marginLeft: 10,
      },
    },
    recordsSelector: {
      width: 150,
    },
    orderAlign: {
      alignItems: "center",
    },
    dateSelectorOverride: {
      width: 250,
      height: 40,
      border: "#EAEDEE 1px solid",
      marginLeft: 15,
      backgroundColor: "#fff",
      padding: "0 16px",
      borderRadius: 5,
      "&.MuiInput-underline:hover:not(.Mui-disabled):before": {
        borderBottom: 0,
      },
      "&:hover": {
        borderColor: "#000",
        "&:before, &:after": {
          borderColor: "transparent",
          borderBottom: 0,
        },
      },
      "&:before, &:after": {
        borderColor: "transparent",
        borderBottom: 0,
      },
      "& input": {
        fontSize: 12,
        fontWeight: 600,
        color: "#393939",
      },
    },
    "@global": {
      ".overrideMargin": {
        marginLeft: 0,
      },
    },
    ...searchField,
    ...actionsTray,
    ...containerForHeader(theme.spacing(4)),
  });

const SelectStyled = withStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 250,
      lineHeight: "50px",
      "label + &": {
        marginTop: theme.spacing(3),
      },
      "& .MuiSelect-select:focus": {
        backgroundColor: "transparent",
      },
    },
    input: {
      height: 50,
      fontSize: 13,
      lineHeight: "50px",
      width: 250,
    },
  })
)(InputBase);

export const LogsSearchMain = ({ classes }: ILogSearchProps) => {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [logSearchAPI, setLogSearchAPI] = useState<string>("reqInfo");
  const [timeStart, setTimeStart] = useState<any>(new Date());
  const [orderASC, setOrderASC] = useState<boolean>(true);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [recordsPerPage, setRecordsPerPage] = useState<string>("10");
  const [records, setRecords] = useState<IReqInfoSearchResults[]>([]);
  const [bucket, setBucket] = useState<string>("");
  const [apiName, setApiName] = useState<string>("");
  const [userAgent, setUserAgent] = useState<string>("");
  const [object, setObject] = useState<string>("");
  const [requestID, setRequestID] = useState<string>("");
  const [responseStatus, setResponseStatus] = useState<string>("");
  const [columnsShown, setColumnsShown] = useState<string[]>([
    "id",
    "api_name",
    "bucket",
    "object",
    "remote_host",
    "request_id",
    "user_agent",
    "response_status",
  ]);

  useEffect(() => {
    if (loading) {
      setRecords([]);
      // TODO: Add request query here & remove placeholders

      if (logSearchAPI === "reqInfo") {
        setRecords([
          {
            id: "2020-12-15T19:40:41.760375Z",
            api_name: "WebUpload",
            bucket: "lol2",
            object:
              "ns-1-warp-job-continious-load-put-02-62pqt-1604607189825924838.log",
            time_to_response_ns: 339943575,
            remote_host: "192.168.86.28",
            request_id: "1650FB2DDFEFE503",
            user_agent:
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
            response_status: "OK",
            response_status_code: 200,
            request_content_length: 14,
            response_content_length: null,
          },
          {
            id: "0001-01-01T00:00:00Z",
            api_name: "",
            bucket: "",
            object: "",
            time_to_response_ns: 0,
            remote_host: "",
            request_id: "",
            user_agent: "",
            response_status: "",
            response_status_code: 0,
            request_content_length: null,
            response_content_length: null,
          },
          {
            id: "0001-01-01T00:00:00Z",
            api_name: "",
            bucket: "",
            object: "",
            time_to_response_ns: 0,
            remote_host: "",
            request_id: "",
            user_agent: "",
            response_status: "",
            response_status_code: 0,
            request_content_length: null,
            response_content_length: null,
          },
          {
            id: "0001-01-01T00:00:00Z",
            api_name: "",
            bucket: "",
            object: "",
            time_to_response_ns: 0,
            remote_host: "",
            request_id: "",
            user_agent: "",
            response_status: "",
            response_status_code: 0,
            request_content_length: null,
            response_content_length: null,
          },
          {
            id: "0001-01-01T00:00:00Z",
            api_name: "",
            bucket: "lol2",
            object:
              "ns-1-warp-job-continious-load-put-02-62pqt-1604607189825924838.log",
            time_to_response_ns: 0,
            remote_host: "",
            request_id: "",
            user_agent: "",
            response_status: "",
            response_status_code: 0,
            request_content_length: null,
            response_content_length: null,
          },
          {
            id: "0001-01-01T00:00:00Z",
            api_name: "",
            bucket: "lol2",
            object:
              "ns-1-warp-job-continious-load-put-04-2rpbx-1604609316160016205.log",
            time_to_response_ns: 0,
            remote_host: "",
            request_id: "",
            user_agent: "",
            response_status: "",
            response_status_code: 0,
            request_content_length: null,
            response_content_length: null,
          },
          {
            id: "0001-01-01T00:00:00Z",
            api_name: "",
            bucket: "lol2",
            object:
              "ns-1-warp-job-continious-load-get-02-69795-1604612830698702347.log",
            time_to_response_ns: 0,
            remote_host: "",
            request_id: "",
            user_agent: "",
            response_status: "",
            response_status_code: 0,
            request_content_length: null,
            response_content_length: null,
          },
          {
            id: "0001-01-01T00:00:00Z",
            api_name: "",
            bucket: "lol2",
            object:
              "ns-1-warp-job-continious-load-put-04-2rpbx-1604607997129349154.log",
            time_to_response_ns: 0,
            remote_host: "",
            request_id: "",
            user_agent: "",
            response_status: "",
            response_status_code: 0,
            request_content_length: null,
            response_content_length: null,
          },
          {
            id: "0001-01-01T00:00:00Z",
            api_name: "",
            bucket: "lol2",
            object:
              "ns-1-warp-job-continious-load-get-02-69795-1604613354888346479.log",
            time_to_response_ns: 0,
            remote_host: "",
            request_id: "",
            user_agent: "",
            response_status: "",
            response_status_code: 0,
            request_content_length: null,
            response_content_length: null,
          },
          {
            id: "0001-01-01T00:00:00Z",
            api_name: "",
            bucket: "lol2",
            object:
              "ns-1-warp-job-continious-load-mixed-02-h7qfc-1604606118043565179.log",
            time_to_response_ns: 0,
            remote_host: "",
            request_id: "",
            user_agent: "",
            response_status: "",
            response_status_code: 0,
            request_content_length: null,
            response_content_length: null,
          },
        ]);
      }
      setLoading(false);
    }
  }, [loading, logSearchAPI]);

  const triggerLoad = () => {
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

  return (
    <Fragment>
      <PageHeader label="Audit Log Search" />
      <Grid container>
        <Grid item xs={12} className={classes.container}>
          {error !== "" && (
            <Grid item xs={12}>
              <ErrorBlock errorMessage={error} />
            </Grid>
          )}

          <Grid item xs={12} className={classes.actionsTray}>
            <span className={classes.label}>Query Type</span>
            <FormControl variant="outlined">
              <Select
                id="query-type"
                name="query-type"
                value={logSearchAPI}
                onChange={(e) => {
                  setLogSearchAPI(e.target.value as string);
                }}
                className={`${classes.searchField}  ${classes.inputBar}`}
                input={<SelectStyled />}
              >
                <MenuItem value={"reqInfo"}>ReqInfo</MenuItem>
                <MenuItem value={"raw"}>RAW</MenuItem>
              </Select>
            </FormControl>
            <span className={classes.label}>Time Start</span>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DateTimePicker
                value={timeStart}
                onChange={setTimeStart}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ScheduleIcon />
                    </InputAdornment>
                  ),
                  className: classes.dateSelectorOverride,
                }}
                label=""
                ampm={false}
                variant={"inline"}
              />
            </MuiPickersUtilsProvider>

            <span className={classes.label}>Records per Page</span>
            <TextField
              placeholder="Records Per Page"
              type="number"
              id="records-per-page"
              onChange={(val) => {
                setRecordsPerPage(val.target.value);
              }}
              InputProps={{ disableUnderline: true }}
              inputProps={{
                min: 10,
                max: 1000,
              }}
              value={recordsPerPage}
              className={`${classes.searchField} ${classes.inputBar} ${classes.recordsSelector}`}
            />
            <FormSwitchWrapper
              value={"formSwitch"}
              checked={orderASC}
              name="order_wrapper"
              id="order_wrapper"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setOrderASC(event.target.checked);
              }}
              indicatorLabels={["ASC", "DESC"]}
              containerClass={classes.orderAlign}
              switchOnly
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
                  You can use '*' to match any character, '.' to signify a
                  single character or '\' to scape an special character (E.g.
                  mybucket-*)
                </div>
                <div className={classes.filtersContainer}>
                  <EnableInputWrapper
                    onChange={setBucket}
                    value={bucket}
                    label={"Bucket"}
                    id="bucket"
                    name="bucket"
                  />
                  <EnableInputWrapper
                    onChange={setApiName}
                    value={apiName}
                    label={"API Name"}
                    id="api_name"
                    name="api_name"
                  />
                  <EnableInputWrapper
                    onChange={setUserAgent}
                    value={userAgent}
                    label={"User Agent"}
                    id="user_agent"
                    name="user_agent"
                  />
                </div>
                <div className={classes.filtersContainer}>
                  <EnableInputWrapper
                    onChange={setObject}
                    value={object}
                    label={"Object"}
                    id="object"
                    name="object"
                  />
                  <EnableInputWrapper
                    onChange={setRequestID}
                    value={requestID}
                    label={"Request ID"}
                    id="request_id"
                    name="request_id"
                  />
                  <EnableInputWrapper
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
              {logSearchAPI === "reqInfo" && (
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
              )}
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
                { label: "Timestamp", elementKey: "id" },
                { label: "API Name", elementKey: "api_name" },
                { label: "Bucket", elementKey: "bucket" },
                { label: "Object", elementKey: "object" },
                {
                  label: "Time to Response NS",
                  elementKey: "time_to_response_ns",
                },
                { label: "Remote Host", elementKey: "remote_host" },
                { label: "Request ID", elementKey: "request_id" },
                { label: "User Agent", elementKey: "user_agent" },
                {
                  label: "Response Status",
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
                  label: "Request Content Length",
                  elementKey: "request_content_length",
                },
                {
                  label: "Response Content Length",
                  elementKey: "response_content_length",
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
            />
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default withStyles(styles)(LogsSearchMain);
