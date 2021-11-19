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
import React, { Fragment, useState } from "react";
import get from "lodash/get";
import isString from "lodash/isString";
import {
  Checkbox,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Popover,
  Typography,
} from "@mui/material";
import { AutoSizer, Column, InfiniteLoader, Table } from "react-virtualized";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import CircularProgress from "@mui/material/CircularProgress";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import TableActionButton from "./TableActionButton";
import history from "../../../../history";
import {
  checkboxIcons,
  radioIcons,
} from "../FormComponents/common/styleLibrary";
import CheckboxWrapper from "../FormComponents/CheckboxWrapper/CheckboxWrapper";

//Interfaces for table Items

export interface ItemActions {
  label?: string;
  type: string | any;
  to?: string;
  sendOnlyId?: boolean;
  disableButtonFunction?: (itemValue: any) => boolean;
  showLoaderFunction?: (itemValue: any) => boolean;

  onClick?(valueToSend: any): any;
}

interface IColumns {
  label: string;
  elementKey?: string;
  renderFunction?: (input: any) => any;
  renderFullObject?: boolean;
  globalClass?: any;
  rowClass?: any;
  width?: number;
  headerTextAlign?: string;
  contentTextAlign?: string;
  enableSort?: boolean;
}

interface IInfiniteScrollConfig {
  loadMoreRecords: (indexElements: {
    startIndex: number;
    stopIndex: number;
  }) => Promise<any>;
  recordsCount: number;
}

interface ISortConfig {
  triggerSort: (val: any) => any;
  currentSort: string;
  currentDirection: "ASC" | "DESC" | undefined;
}

interface TableWrapperProps {
  itemActions?: ItemActions[] | null;
  columns: IColumns[];
  onSelect?: (e: React.ChangeEvent<HTMLInputElement>) => any;
  idField: string;
  isLoading: boolean;
  loadingMessage?: React.ReactNode;
  records: any[];
  classes: any;
  entityName: string;
  selectedItems?: string[];
  radioSelection?: boolean;
  customEmptyMessage?: string;
  customPaperHeight?: string;
  noBackground?: boolean;
  columnsSelector?: boolean;
  textSelectable?: boolean;
  columnsShown?: string[];
  onColumnChange?: (column: string, state: boolean) => any;
  autoScrollToBottom?: boolean;
  infiniteScrollConfig?: IInfiniteScrollConfig;
  sortConfig?: ISortConfig;
  disabled?: boolean;
}

const borderColor = "#9c9c9c80";

const rowText = {
  fontWeight: 400,
  fontSize: 14,
  borderColor: borderColor,
  borderWidth: "0.5px",
  height: 40,
  transitionDuration: "0.3s",
  padding: "initial",
  paddingRight: 6,
  paddingLeft: 6,
};

const styles = () =>
  createStyles({
    dialogContainer: {
      padding: "12px 26px 22px",
    },
    paper: {
      display: "flex",
      overflow: "auto",
      flexDirection: "column",
      padding: "8px 16px",
      boxShadow: "none",
      border: "#EAEDEE 1px solid",
      borderRadius: 3,
      minHeight: 200,
      overflowY: "scroll",
      position: "relative",
      "&::-webkit-scrollbar": {
        width: 3,
        height: 3,
      },
    },
    noBackground: {
      backgroundColor: "transparent",
      border: 0,
    },
    disabled: {
      backgroundColor: "#fbfafa",
      color: "#cccccc",
    },
    defaultPaperHeight: {
      height: "calc(100vh - 205px)",
    },
    allTableSettings: {
      "& .MuiTableCell-sizeSmall:last-child": {
        paddingRight: "initial",
      },
      "& .MuiTableCell-body.MuiTableCell-sizeSmall:last-child": {
        paddingRight: 6,
      },
    },
    minTableHeader: {
      color: "#393939",
      "& tr": {
        "& th": {
          fontWeight: 700,
          fontSize: 14,
          borderColor: "#39393980",
          borderWidth: "0.5px",
          padding: "6px 0 10px",
        },
      },
    },
    rowUnselected: {
      ...rowText,
      color: "#393939",
    },
    rowSelected: {
      ...rowText,
      color: "#081C42",
      fontWeight: 600,
    },
    paginatorContainer: {
      display: "flex",
      justifyContent: "flex-end",
      padding: "5px 38px",
    },
    checkBoxHeader: {
      width: 50,
      textAlign: "left",
      paddingRight: 10,
      "&.MuiTableCell-paddingCheckbox": {
        paddingBottom: 4,
        paddingLeft: 0,
      },
    },
    actionsContainer: {
      width: 150,
      borderColor: borderColor,
    },
    paginatorComponent: {
      borderBottom: 0,
    },
    checkBoxRow: {
      borderColor: borderColor,
      padding: "0 10px 0 0",
    },
    loadingBox: {
      paddingTop: "100px",
      paddingBottom: "100px",
    },
    overlayColumnSelection: {
      position: "absolute",
      right: 0,
      top: 0,
    },
    popoverContent: {
      maxHeight: 250,
      overflowY: "auto",
      padding: "0 10px 10px",
    },
    shownColumnsLabel: {
      color: "#9c9c9c",
      fontSize: 12,
      padding: 10,
      borderBottom: "#eaeaea 1px solid",
      width: "100%",
    },
    "@global": {
      ".rowLine": {
        borderBottom: `1px solid ${borderColor}`,
        height: 40,
        color: "#393939",
        fontSize: 14,
        transitionDuration: 0.3,
        "&:focus": {
          outline: "initial",
        },
        "&:hover:not(.ReactVirtualized__Table__headerRow)": {
          userSelect: "none",
          backgroundColor: "#ececec",
          fontWeight: 600,
          "&.canClick": {
            cursor: "pointer",
          },
          "&.canSelectText": {
            userSelect: "text",
          },
        },
        "& .selected": {
          color: "#081C42",
          fontWeight: 600,
        },
      },
      ".headerItem": {
        userSelect: "none",
        fontWeight: 700,
        fontSize: 14,
        fontStyle: "initial",
        display: "flex",
        alignItems: "center",
        outline: "none",
      },
      ".ReactVirtualized__Table__headerRow": {
        fontWeight: 700,
        fontSize: 14,
        borderColor: "#39393980",
        textTransform: "initial",
      },
      ".optionsAlignment": {
        textAlign: "center",
        "& .min-icon": {
          width: 16,
          height: 16,
        },
      },
      ".text-center": {
        textAlign: "center",
      },
      ".text-right": {
        textAlign: "right",
      },
      ".progress-enabled": {
        paddingTop: 3,
        display: "inline-block",
        margin: "0 10px",
        position: "relative",
        width: 18,
        height: 18,
      },
      ".progress-enabled > .MuiCircularProgress-root": {
        position: "absolute",
        left: 0,
        top: 3,
      },
    },
    ...checkboxIcons,
    ...radioIcons,
  });

const selectWidth = 45;

// Function to render elements in table
const subRenderFunction = (
  rowData: any,
  column: IColumns,
  isSelected: boolean
) => {
  const itemElement = isString(rowData)
    ? rowData
    : get(rowData, column.elementKey!, null); // If the element is just a string, we render it as it is
  const renderConst = column.renderFullObject ? rowData : itemElement;

  const renderElement = column.renderFunction
    ? column.renderFunction(renderConst)
    : renderConst; // If render function is set, we send the value to the function.

  return (
    <Fragment>
      <span className={isSelected ? "selected" : ""}>{renderElement}</span>
    </Fragment>
  );
};

// Function to calculate common column width for elements with no with size
const calculateColumnRest = (
  columns: IColumns[],
  containerWidth: number,
  actionsWidth: number,
  hasSelect: boolean,
  hasActions: boolean,
  columnsSelector: boolean,
  columnsShown: string[]
) => {
  let colsItems = [...columns];

  if (columnsSelector) {
    colsItems = columns.filter((column) =>
      columnsShown.includes(column.elementKey!)
    );
  }

  let initialValue = containerWidth;

  if (hasSelect) {
    initialValue -= selectWidth;
  }

  if (hasActions) {
    initialValue -= actionsWidth;
  }

  let freeSpacing = colsItems.reduce((total, currValue) => {
    return currValue.width ? total - currValue.width : total;
  }, initialValue);

  return freeSpacing / colsItems.filter((el) => !el.width).length;
};

// Function that renders Columns in table
const generateColumnsMap = (
  columns: IColumns[],
  containerWidth: number,
  actionsWidth: number,
  hasSelect: boolean,
  hasActions: boolean,
  selectedItems: string[],
  idField: string,
  columnsSelector: boolean,
  columnsShown: string[],
  sortColumn: string,
  sortDirection: "ASC" | "DESC" | undefined
) => {
  const commonRestWidth = calculateColumnRest(
    columns,
    containerWidth,
    actionsWidth,
    hasSelect,
    hasActions,
    columnsSelector,
    columnsShown
  );
  return columns.map((column: IColumns, index: number) => {
    if (columnsSelector && !columnsShown.includes(column.elementKey!)) {
      return null;
    }

    const disableSort = column.enableSort ? !column.enableSort : true;

    return (
      <Column
        key={`col-tb-${index.toString()}`}
        dataKey={column.elementKey!}
        headerClassName={`titleHeader ${
          column.headerTextAlign ? `text-${column.headerTextAlign}` : ""
        }`}
        headerRenderer={() => (
          <Fragment>
            {sortColumn === column.elementKey && (
              <Fragment>
                {sortDirection === "ASC" ? (
                  <ArrowDropUpIcon />
                ) : (
                  <ArrowDropDownIcon />
                )}
              </Fragment>
            )}
            {column.label}
          </Fragment>
        )}
        className={
          column.contentTextAlign ? `text-${column.contentTextAlign}` : ""
        }
        cellRenderer={({ rowData }) => {
          const isSelected = selectedItems
            ? selectedItems.includes(
                isString(rowData) ? rowData : rowData[idField]
              )
            : false;
          return subRenderFunction(rowData, column, isSelected);
        }}
        width={column.width || commonRestWidth}
        disableSort={disableSort}
        defaultSortDirection={"ASC"}
      />
    );
  });
};

// Function to render the action buttons
const elementActions = (
  actions: ItemActions[],
  valueToSend: any,
  selected: boolean,
  idField: string
) => {
  return actions.map((action: ItemActions, index: number) => {
    if (action.type === "view") {
      return null;
    }

    const vlSend =
      typeof valueToSend === "string" ? valueToSend : valueToSend[idField];

    let disabled = false;

    if (action.disableButtonFunction) {
      if (action.disableButtonFunction(vlSend)) {
        disabled = true;
      }
    }

    if (action.showLoaderFunction) {
      if (action.showLoaderFunction(vlSend)) {
        return (
          <div className={"progress-enabled"}>
            <CircularProgress
              color="primary"
              size={18}
              variant="indeterminate"
              key={`actions-loader-${action.type}-${index.toString()}`}
            />
          </div>
        );
      }
    }

    return (
      <TableActionButton
        label={action.label}
        type={action.type}
        onClick={action.onClick}
        to={action.to}
        valueToSend={valueToSend}
        selected={selected}
        key={`actions-${action.type}-${index.toString()}`}
        idField={idField}
        sendOnlyId={!!action.sendOnlyId}
        disabled={disabled}
      />
    );
  });
};

// Function to calculate the options column width according elements inside
const calculateOptionsSize = (containerWidth: number, totalOptions: number) => {
  const minContainerSize = 80;
  const sizeOptions = totalOptions * 45 + 15;

  if (sizeOptions < minContainerSize) {
    return minContainerSize;
  }

  if (sizeOptions > containerWidth) {
    return containerWidth;
  }

  return sizeOptions;
};

// Main function to render the Table Wrapper
const TableWrapper = ({
  itemActions,
  columns,
  onSelect,
  records,
  isLoading,
  loadingMessage = <Typography component="h3">Loading...</Typography>,
  entityName,
  selectedItems,
  idField,
  classes,
  radioSelection = false,
  customEmptyMessage = "",
  customPaperHeight = "",
  noBackground = false,
  columnsSelector = false,
  textSelectable = false,
  columnsShown = [],
  onColumnChange = (column: string, state: boolean) => {},
  infiniteScrollConfig,
  sortConfig,
  autoScrollToBottom = false,
  disabled = false,
}: TableWrapperProps) => {
  const [columnSelectorOpen, setColumnSelectorOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<any>(null);

  const findView = itemActions
    ? itemActions.find((el) => el.type === "view")
    : null;

  const clickAction = (rowItem: any) => {
    if (findView) {
      const valueClick = findView.sendOnlyId ? rowItem[idField] : rowItem;

      let disabled = false;

      if (findView.disableButtonFunction) {
        if (findView.disableButtonFunction(valueClick)) {
          disabled = true;
        }
      }

      if (findView.to && !disabled) {
        history.push(`${findView.to}/${valueClick}`);
        return;
      }

      if (findView.onClick && !disabled) {
        findView.onClick(valueClick);
      }
    }
  };

  const openColumnsSelector = (event: { currentTarget: any }) => {
    setColumnSelectorOpen(!columnSelectorOpen);
    setAnchorEl(event.currentTarget);
  };

  const closeColumnSelector = () => {
    setColumnSelectorOpen(false);
    setAnchorEl(null);
  };

  const columnsSelection = (columns: IColumns[]) => {
    return (
      <Fragment>
        <IconButton
          aria-describedby={"columnsSelector"}
          color="primary"
          onClick={openColumnsSelector}
          size="large"
        >
          <ViewColumnIcon fontSize="inherit" />
        </IconButton>
        <Popover
          anchorEl={anchorEl}
          id={"columnsSelector"}
          open={columnSelectorOpen}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          onClose={closeColumnSelector}
        >
          <div className={classes.shownColumnsLabel}>Shown Columns</div>
          <div className={classes.popoverContent}>
            {columns.map((column: IColumns) => {
              return (
                <CheckboxWrapper
                  key={`tableColumns-${column.label}`}
                  label={column.label}
                  checked={columnsShown.includes(column.elementKey!)}
                  onChange={(e) => {
                    onColumnChange(column.elementKey!, e.target.checked);
                  }}
                  id={`chbox-${column.label}`}
                  name={`chbox-${column.label}`}
                  value={column.label}
                />
              );
            })}
          </div>
        </Popover>
      </Fragment>
    );
  };

  return (
    <Grid item xs={12}>
      <Paper
        className={`${classes.paper} ${noBackground ? classes.noBackground : ""}
        ${disabled ? classes.disabled : ""} 
        ${
          customPaperHeight !== ""
            ? customPaperHeight
            : classes.defaultPaperHeight
        }`}
      >
        {isLoading && (
          <Grid container className={classes.loadingBox}>
            <Grid item xs={12} style={{ textAlign: "center" }}>
              {loadingMessage}
            </Grid>
            <Grid item xs={12}>
              <LinearProgress />
            </Grid>
          </Grid>
        )}
        {columnsSelector && !isLoading && records.length > 0 && (
          <div className={classes.overlayColumnSelection}>
            {columnsSelection(columns)}
          </div>
        )}
        {records && !isLoading && records.length > 0 ? (
          <InfiniteLoader
            isRowLoaded={({ index }) => !!records[index]}
            loadMoreRows={
              infiniteScrollConfig
                ? infiniteScrollConfig.loadMoreRecords
                : () => new Promise(() => true)
            }
            rowCount={
              infiniteScrollConfig
                ? infiniteScrollConfig.recordsCount
                : records.length
            }
          >
            {({ onRowsRendered, registerChild }) => (
              <AutoSizer>
                {({ width, height }: any) => {
                  const optionsWidth = calculateOptionsSize(
                    width,
                    itemActions
                      ? itemActions.filter((el) => el.type !== "view").length
                      : 0
                  );
                  const hasSelect: boolean = !!(onSelect && selectedItems);
                  const hasOptions: boolean = !!(
                    (itemActions && itemActions.length > 1) ||
                    (itemActions &&
                      itemActions.length === 1 &&
                      itemActions[0].type !== "view")
                  );
                  return (
                    <Table
                      ref={registerChild}
                      disableHeader={false}
                      headerClassName={"headerItem"}
                      headerHeight={40}
                      height={height}
                      noRowsRenderer={() => (
                        <Fragment>
                          {customEmptyMessage !== ""
                            ? customEmptyMessage
                            : `There are no ${entityName} yet.`}
                        </Fragment>
                      )}
                      overscanRowCount={10}
                      rowHeight={40}
                      width={width}
                      rowCount={records.length}
                      rowGetter={({ index }) => records[index]}
                      onRowClick={({ rowData }) => {
                        clickAction(rowData);
                      }}
                      rowClassName={`rowLine ${findView ? "canClick" : ""} ${
                        !findView && textSelectable ? "canSelectText" : ""
                      }`}
                      onRowsRendered={onRowsRendered}
                      sort={sortConfig ? sortConfig.triggerSort : undefined}
                      sortBy={sortConfig ? sortConfig.currentSort : undefined}
                      sortDirection={
                        sortConfig ? sortConfig.currentDirection : undefined
                      }
                      scrollToIndex={
                        autoScrollToBottom ? records.length - 1 : -1
                      }
                    >
                      {hasSelect && (
                        <Column
                          headerRenderer={() => <Fragment>Select</Fragment>}
                          dataKey={`select-${idField}`}
                          width={selectWidth}
                          disableSort
                          cellRenderer={({ rowData }) => {
                            const isSelected = selectedItems
                              ? selectedItems.includes(
                                  isString(rowData) ? rowData : rowData[idField]
                                )
                              : false;

                            return (
                              <Checkbox
                                value={
                                  isString(rowData) ? rowData : rowData[idField]
                                }
                                color="primary"
                                inputProps={{
                                  "aria-label": "secondary checkbox",
                                }}
                                checked={isSelected}
                                onChange={onSelect}
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                checkedIcon={
                                  <span
                                    className={
                                      radioSelection
                                        ? classes.radioSelectedIcon
                                        : classes.checkedIcon
                                    }
                                  />
                                }
                                icon={
                                  <span
                                    className={
                                      radioSelection
                                        ? classes.radioUnselectedIcon
                                        : classes.unCheckedIcon
                                    }
                                  />
                                }
                              />
                            );
                          }}
                        />
                      )}
                      {generateColumnsMap(
                        columns,
                        width,
                        optionsWidth,
                        hasSelect,
                        hasOptions,
                        selectedItems || [],
                        idField,
                        columnsSelector,
                        columnsShown,
                        sortConfig ? sortConfig.currentSort : "",
                        sortConfig ? sortConfig.currentDirection : undefined
                      )}
                      {hasOptions && (
                        <Column
                          headerRenderer={() => <Fragment>Options</Fragment>}
                          dataKey={idField}
                          width={optionsWidth}
                          headerClassName="optionsAlignment"
                          className="optionsAlignment"
                          cellRenderer={({ rowData }) => {
                            const isSelected = selectedItems
                              ? selectedItems.includes(
                                  isString(rowData) ? rowData : rowData[idField]
                                )
                              : false;
                            return elementActions(
                              itemActions || [],
                              rowData,
                              isSelected,
                              idField
                            );
                          }}
                        />
                      )}
                    </Table>
                  );
                }}
              </AutoSizer>
            )}
          </InfiniteLoader>
        ) : (
          <Fragment>
            {!isLoading && (
              <div>
                {customEmptyMessage !== ""
                  ? customEmptyMessage
                  : `There are no ${entityName} yet.`}
              </div>
            )}
          </Fragment>
        )}
      </Paper>
    </Grid>
  );
};

export default withStyles(styles)(TableWrapper);
