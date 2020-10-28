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
  TablePagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Checkbox,
  Typography,
} from "@material-ui/core";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { TablePaginationActionsProps } from "@material-ui/core/TablePagination/TablePaginationActions";
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
  sortable?: boolean;
  renderFunction?: (input: any) => any;
  renderFullObject?: boolean;
  globalClass?: any;
  rowClass?: any;
}

interface IPaginatorConfig {
  rowsPerPageOptions: number[];
  colSpan: number;
  count: number;
  rowsPerPage: number;
  page: number;
  SelectProps: any;
  onChangePage: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    page: number
  ) => void;
  onChangeRowsPerPage?: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  >;
  ActionsComponent?: React.ElementType<TablePaginationActionsProps>;
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
  stickyHeader?: boolean;
  radioSelection?: boolean;
  customEmptyMessage?: string;
  paginatorConfig?: IPaginatorConfig;
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

const styles = (theme: Theme) =>
  createStyles({
    dialogContainer: {
      padding: "12px 26px 22px",
    },
    paper: {
      display: "flex",
      overflow: "auto",
      flexDirection: "column",
      padding: "19px 38px",
      minHeight: "200px",
      boxShadow: "none",
      border: "#EAEDEE 1px solid",
      borderRadius: 3,
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
    rowElement: {
      userSelect: "none",

      "&:hover": {
        backgroundColor: "#ececec",

        "& td": {
          fontWeight: 600,
        },
      },
    },
    rowClickable: {
      cursor: "pointer",
    },
    ...checkboxIcons,
    ...radioIcons,
  });

// Function that renders Title Columns
const titleColumnsMap = (columns: IColumns[]) => {
  return columns.map((column: IColumns, index: number) => {
    return (
      <TableCell
        key={`tbCT-${column.elementKey}-${index}`}
        className={column.globalClass}
      >
        {column.label}
      </TableCell>
    );
  });
};

// Function that renders Rows
const rowColumnsMap = (
  columns: IColumns[],
  itemData: any,
  classes: any,
  isSelected: boolean
) => {
  return columns.map((column: IColumns, index: number) => {
    const itemElement = isString(itemData)
      ? itemData
      : get(itemData, column.elementKey, null); // If the element is just a string, we render it as it is
    const renderConst = column.renderFullObject ? itemData : itemElement;

    const renderElement = column.renderFunction
      ? column.renderFunction(renderConst)
      : renderConst; // If render function is set, we send the value to the function.
    return (
      <TableCell
        key={`tbRE-${column.elementKey}-${index}`}
        className={`${column.rowClass} ${
          isSelected ? classes.rowSelected : classes.rowUnselected
        }`}
      >
        {renderElement}
      </TableCell>
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
  stickyHeader = false,
  radioSelection = false,
  customEmptyMessage = "",
  paginatorConfig,
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
      <Paper className={classes.paper}>
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
          <Table
            size="small"
            stickyHeader={stickyHeader}
            className={classes.allTableSettings}
          >
            <TableHead className={classes.minTableHeader}>
              <TableRow>
                {onSelect && selectedItems && (
                  <TableCell align="center" className={classes.checkBoxHeader}>
                    Select
                  </TableCell>
                )}
                {titleColumnsMap(columns)}
                {((itemActions && itemActions.length > 1) ||
                  (itemActions &&
                    itemActions.length === 1 &&
                    itemActions[0].type !== "view")) && (
                  <TableCell
                    align="center"
                    className={classes.actionsContainer}
                  >
                    Actions
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((record: any, index: number) => {
                const isSelected = selectedItems
                  ? selectedItems.includes(
                      isString(record) ? record : record[idField]
                    )
                  : false;

                return (
                  <TableRow
                    key={`tb-${entityName}-${index.toString()}`}
                    className={`${findView ? classes.rowClickable : ""} ${
                      classes.rowElement
                    } rowElementRaw`}
                    onClick={() => {
                      clickAction(record);
                    }}
                  >
                    {onSelect && selectedItems && (
                      <TableCell align="center" className={classes.checkBoxRow}>
                        <Checkbox
                          value={isString(record) ? record : record[idField]}
                          color="primary"
                          inputProps={{ "aria-label": "secondary checkbox" }}
                          checked={isSelected}
                          onChange={onSelect}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
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
                      </TableCell>
                    )}
                    {rowColumnsMap(columns, record, classes, isSelected)}
                    {((itemActions && itemActions.length > 1) ||
                      (itemActions &&
                        itemActions.length === 1 &&
                        itemActions[0].type !== "view")) && (
                      <TableCell
                        align="center"
                        className={classes.actionsContainer}
                      >
                        {elementActions(
                          itemActions,
                          record,
                          isSelected,
                          idField
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
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
      {paginatorConfig && (
        <Grid item xs={12} className={classes.paginatorContainer}>
          <Table>
            <TableBody>
              <TableRow>
                <TablePagination
                  {...paginatorConfig}
                  className={classes.paginatorComponent}
                />
              </TableRow>
            </TableBody>
          </Table>
        </Grid>
      )}
    </Grid>
  );
};

export default withStyles(styles)(TableWrapper);
