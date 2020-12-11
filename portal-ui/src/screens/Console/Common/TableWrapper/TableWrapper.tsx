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
import React from "react";
import get from "lodash/get";
import isString from "lodash/isString";
import {
  LinearProgress,
  Paper,
  Grid,
  Checkbox,
  Typography,
} from "@material-ui/core";
import { Table, Column, AutoSizer } from "react-virtualized";
import { createStyles, withStyles } from "@material-ui/core/styles";
import TableActionButton from "./TableActionButton";
import history from "../../../../history";
import {
  checkboxIcons,
  radioIcons,
} from "../FormComponents/common/styleLibrary";

//Interfaces for table Items

interface ItemActions {
  type: string;
  onClick?(valueToSend: any): any;
  to?: string;
  sendOnlyId?: boolean;
}

interface IColumns {
  label: string;
  elementKey: string;
  renderFunction?: (input: any) => any;
  renderFullObject?: boolean;
  globalClass?: any;
  rowClass?: any;
  width?: number;
  headerTextAlign?: string;
  contentTextAlign?: string;
}

interface TableWrapperProps {
  itemActions?: ItemActions[] | null;
  columns: IColumns[];
  onSelect?: (e: React.ChangeEvent<HTMLInputElement>) => any;
  idField: string;
  isLoading: boolean;
  records: any[];
  classes: any;
  entityName: string;
  selectedItems?: string[];
  radioSelection?: boolean;
  customEmptyMessage?: string;
  customPaperHeight?: string;
  noBackground?: boolean;
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
      padding: "19px 38px",
      boxShadow: "none",
      border: "#EAEDEE 1px solid",
      borderRadius: 3,
      minHeight: 200,
      overflowY: "scroll",

      "&::-webkit-scrollbar": {
        width: 3,
        height: 3,
      },
    },
    noBackground: {
      backgroundColor: "transparent",
      border: 0,
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
      },
      ".ReactVirtualized__Table__headerRow": {
        fontWeight: 700,
        fontSize: 14,
        borderColor: "#39393980",
        textTransform: "initial",
      },
      ".optionsAlignment": {
        textAlign: "center",
      },
      ".text-center": {
        textAlign: "center",
      },
      ".text-right": {
        textAlign: "right",
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
    : get(rowData, column.elementKey, null); // If the element is just a string, we render it as it is
  const renderConst = column.renderFullObject ? rowData : itemElement;

  const renderElement = column.renderFunction
    ? column.renderFunction(renderConst)
    : renderConst; // If render function is set, we send the value to the function.

  return (
    <React.Fragment>
      <span className={isSelected ? "selected" : ""}>{renderElement}</span>
    </React.Fragment>
  );
};

// Function to calculate common column width for elements with no with size
const calculateColumnRest = (
  columns: IColumns[],
  containerWidth: number,
  actionsWidth: number,
  hasSelect: boolean,
  hasActions: boolean
) => {
  let initialValue = containerWidth;

  if (hasSelect) {
    initialValue -= selectWidth;
  }

  if (hasActions) {
    initialValue -= actionsWidth;
  }

  let freeSpacing = columns.reduce((total, currValue) => {
    return currValue.width ? total - currValue.width : total;
  }, initialValue);

  return freeSpacing / columns.filter((el) => !el.width).length;
};

// Function that renders Columns in table
const generateColumnsMap = (
  columns: IColumns[],
  containerWidth: number,
  actionsWidth: number,
  hasSelect: boolean,
  hasActions: boolean,
  selectedItems: string[],
  idField: string
) => {
  const commonRestWidth = calculateColumnRest(
    columns,
    containerWidth,
    actionsWidth,
    hasSelect,
    hasActions
  );
  return columns.map((column: IColumns, index: number) => {
    return (
      <Column
        key={`col-tb-${index.toString()}`}
        dataKey={column.elementKey}
        headerClassName={`titleHeader ${
          column.headerTextAlign ? `text-${column.headerTextAlign}` : ""
        }`}
        headerRenderer={() => <React.Fragment>{column.label}</React.Fragment>}
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

    return (
      <TableActionButton
        type={action.type}
        onClick={action.onClick}
        to={action.to}
        valueToSend={valueToSend}
        selected={selected}
        key={`actions-${action.type}-${index.toString()}`}
        idField={idField}
        sendOnlyId={!!action.sendOnlyId}
      />
    );
  });
};

// Function to calculate the options column width according elements inside
const calculateOptionsSize = (containerWidth: number, totalOptions: number) => {
  const minContainerSize = 80;
  const sizeOptions = totalOptions * 45;

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
  entityName,
  selectedItems,
  idField,
  classes,
  radioSelection = false,
  customEmptyMessage = "",
  customPaperHeight = "",
  noBackground = false,
}: TableWrapperProps) => {
  const findView = itemActions
    ? itemActions.find((el) => el.type === "view")
    : null;

  const clickAction = (rowItem: any) => {
    if (findView) {
      const valueClick = findView.sendOnlyId ? rowItem[idField] : rowItem;
      if (findView.to) {
        history.push(`${findView.to}/${valueClick}`);
        return;
      }

      if (findView.onClick) {
        findView.onClick(valueClick);
      }
    }
  };

  return (
    <Grid item xs={12}>
      <Paper
        className={`${classes.paper} ${
          noBackground ? classes.noBackground : ""
        } ${
          customPaperHeight !== ""
            ? customPaperHeight
            : classes.defaultPaperHeight
        }`}
      >
        {isLoading && (
          <Grid container className={classes.loadingBox}>
            <Grid item xs={12} style={{ textAlign: "center" }}>
              <Typography component="h3">Loading...</Typography>
            </Grid>
            <Grid item xs={12}>
              <LinearProgress />
            </Grid>
          </Grid>
        )}
        {records && !isLoading && records.length > 0 ? (
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
                  ref="Table"
                  disableHeader={false}
                  headerClassName={"headerItem"}
                  headerHeight={40}
                  height={height}
                  noRowsRenderer={() => (
                    <React.Fragment>
                      {customEmptyMessage !== ""
                        ? customEmptyMessage
                        : `There are no ${entityName} yet.`}
                    </React.Fragment>
                  )}
                  overscanRowCount={10}
                  rowHeight={40}
                  width={width}
                  rowCount={records.length}
                  rowGetter={({ index }) => records[index]}
                  onRowClick={({ rowData }) => {
                    clickAction(rowData);
                  }}
                  rowClassName={`rowLine ${findView ? "canClick" : ""}`}
                >
                  {hasSelect && (
                    <Column
                      headerRenderer={() => (
                        <React.Fragment>Select</React.Fragment>
                      )}
                      dataKey={idField}
                      width={selectWidth}
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
                    idField
                  )}
                  {hasOptions && (
                    <Column
                      headerRenderer={() => (
                        <React.Fragment>Options</React.Fragment>
                      )}
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
        ) : (
          <React.Fragment>
            {!isLoading && (
              <div>
                {customEmptyMessage !== ""
                  ? customEmptyMessage
                  : `There are no ${entityName} yet.`}
              </div>
            )}
          </React.Fragment>
        )}
      </Paper>
    </Grid>
  );
};

export default withStyles(styles)(TableWrapper);
