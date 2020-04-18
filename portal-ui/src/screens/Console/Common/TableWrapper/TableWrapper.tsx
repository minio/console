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
  Checkbox
} from "@material-ui/core";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { TablePaginationActionsProps } from "@material-ui/core/TablePagination/TablePaginationActions";
import TableActionButton from "./TableActionButton";

interface ItemActions {
  type: string;
  onClick(valueToSend: any): any;
}

interface IColumns {
  label: string;
  elementKey: string;
  sortable?: boolean;
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
  paginatorConfig?: IPaginatorConfig;
}

const borderColor = "#eaeaea";

const rowText = {
  fontWeight: 400,
  fontSize: 14,
  borderColor: borderColor
};

const checkBoxBasic = {
  width: 16,
  height: 16,
  borderRadius: 3
};

const styles = (theme: Theme) =>
  createStyles({
    dialogContainer: {
      padding: "12px 26px 22px"
    },
    paper: {
      display: "flex",
      overflow: "auto",
      flexDirection: "column",
      padding: "19px 38px"
    },
    minTableHeader: {
      color: "#393939",
      "& tr": {
        "& th": {
          fontWeight: 700,
          fontSize: 14,
          paddingBottom: 15,
          borderColor: borderColor
        }
      }
    },
    rowUnselected: {
      ...rowText
    },
    rowSelected: {
      ...rowText,
      color: "#201763"
    },
    paginatorContainer: {
      display: "flex",
      justifyContent: "flex-end",
      padding: "5px 38px"
    },
    checkBoxHeader: {
      "&.MuiTableCell-paddingCheckbox": {
        paddingBottom: 9
      }
    },
    actionsContainer: {
      width: 120,
      borderColor: borderColor
    },
    paginatorComponent: {
      borderBottom: 0
    },
    unCheckedIcon: { ...checkBoxBasic, border: "1px solid #d0d0d0" },
    checkedIcon: {
      ...checkBoxBasic,
      border: "1px solid #201763",
      backgroundColor: "#201763"
    },
    checkBoxRow: {
      borderColor: borderColor
    }
  });

const titleColumnsMap = (columns: IColumns[]) => {
  const columnsList = columns.map((column: IColumns, index: number) => {
    return (
      <TableCell key={`tbCT-${column.elementKey}-${index}`}>
        {column.label}
      </TableCell>
    );
  });

  return columnsList;
};

const rowColumnsMap = (
  columns: IColumns[],
  itemData: any,
  classes: any,
  isSelected: boolean
) => {
  const rowElements = columns.map((column: IColumns, index: number) => {
    const itemElement = get(itemData, column.elementKey, null);
    return (
      <TableCell
        key={`tbRE-${column.elementKey}-${index}`}
        className={isSelected ? classes.rowSelected : classes.rowUnselected}
      >
        {itemElement}
      </TableCell>
    );
  });

  return rowElements;
};

const elementActions = (
  actions: ItemActions[],
  valueToSend: any,
  selected: boolean
) => {
  const actionsElements = actions.map((action: ItemActions, index: number) => {
    return (
      <TableActionButton
        type={action.type}
        onClick={action.onClick}
        valueToSend={valueToSend}
        selected={selected}
        key={`actions-${action.type}-${index.toString()}`}
      />
    );
  });

  return actionsElements;
};

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
  paginatorConfig
}: TableWrapperProps) => {
  return (
    <Grid item xs={12}>
      <Paper className={classes.paper}>
        {isLoading && <LinearProgress />}
        {records && records.length > 0 ? (
          <Table size="small" stickyHeader={stickyHeader}>
            <TableHead className={classes.minTableHeader}>
              <TableRow>
                {onSelect && selectedItems && (
                  <TableCell
                    padding="checkbox"
                    align="center"
                    className={classes.checkBoxHeader}
                  >
                    Select
                  </TableCell>
                )}
                {titleColumnsMap(columns)}
                {itemActions && itemActions.length > 0 && (
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
                  ? selectedItems.includes(record[idField])
                  : false;
                return (
                  <TableRow key={`tb-${entityName}-${index.toString()}`}>
                    {onSelect && selectedItems && (
                      <TableCell
                        padding="checkbox"
                        align="center"
                        className={classes.checkBoxRow}
                      >
                        <Checkbox
                          value={record[idField]}
                          color="primary"
                          inputProps={{ "aria-label": "secondary checkbox" }}
                          checked={isSelected}
                          onChange={onSelect}
                          checkedIcon={<span className={classes.checkedIcon} />}
                          icon={<span className={classes.unCheckedIcon} />}
                        />
                      </TableCell>
                    )}
                    {rowColumnsMap(columns, record, classes, isSelected)}
                    {itemActions && itemActions.length > 0 && (
                      <TableCell
                        align="right"
                        className={classes.actionsContainer}
                      >
                        {elementActions(itemActions, record, isSelected)}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div>{`There are no ${entityName} yet.`}</div>
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
