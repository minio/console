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

export const groupPageStyles = {
  pageContainer: {
    padding: "20px 35px 0"//page spacing.
  },
  sectionBox: {
    border: "#EEF1F4 1px solid",
    padding: "33px",
    borderRadius: "4px"
  },
  pageBox: {
    border: "#EEF1F4 2px solid",
    padding: "43px"
  },
  backLink: {
    display: "flex",
    fontSize: ".8rem",
    alignItems: "center",
    color: "#2781B0"
  },
  backIcon: {
    fontSize: ".8rem",
    marginRight: "1em"
  },
  buttonBar: {
    marginTop: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "end",
    padding: "1rem 0 1rem 0",
    "& button": {
      marginLeft: "1rem"
    }
  },
  filterField: {
    "& .MuiSvgIcon-root": {
      height: ".6em",
      width: ".6em"
    },
    "& .MuiInput-root": {
      border: "1px solid #EEF1F4",
      paddingLeft: ".5rem",
      fontSize: ".8em",
      height: "2.5rem",
      borderRadius: "4px",
      "&::before": {
        borderBottom: "0"
      },
      "&::after": {
        borderBottom: "0"
      },
      "&:hover": {
        border: "1px solid #000"
      },
      "&:focus": {
        border: "2px solid red"
      },
      "&:hover:not(disabled):not(focused):not(error):before": {
        border: "0"
      }
    }
  },
  fieldContainer: {
    marginBottom: "1rem"
  },
  multiSelectorPaper: {
    padding: "1.5rem"
  },

  multiSelectTable: {
    padding: 0,
    "& .ReactVirtualized__Table__Grid:focus-visible": {
      outline: 0
    },
    "& .ReactVirtualized__Table__headerRow": {
      border: "0px solid #EEF1F4 "
    },
    "& .rowLine": {
      border: "1px solid #EEF1F4 !important"
    }
  }
};