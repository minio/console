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

// This object contains variables that will be used across form components.

export const fieldBasic = {
  inputLabel: {
    fontWeight: 600,
    marginRight: 10,
    fontSize: 15,
    color: "#000",
    textAlign: "left" as const,
    overflow: "hidden",
    "& span": {
      display: "flex",
      alignItems: "center",
    },
    display: "flex",
  },
  fieldLabelError: {
    paddingBottom: 22,
  },
  fieldContainer: {
    marginBottom: 20,
    position: "relative" as const,
  },
  tooltipContainer: {
    marginLeft: 5,
    display: "flex",
    alignItems: "center",
  },
};

export const modalBasic = {
  formScrollable: {
    maxHeight: "calc(100vh - 300px)" as const,
    overflowY: "auto" as const,
    marginBottom: 25,
  },
  formSlider: {
    marginLeft: 0,
  },
  clearButton: {
    border: "0",
    backgroundColor: "transparent",
    color: "#393939",
    fontWeight: 600,
    fontSize: 14,
    marginRight: 10,
    outline: "0",
    padding: "16px 25px 16px 25px",
    cursor: "pointer",
  },
  floatingEnabled: {
    position: "absolute" as const,
    right: 58,
    zIndex: 1000,
    marginTop: -38,
  },
  configureString: {
    border: "#EAEAEA 1px solid",
    borderRadius: 4,
    padding: "24px 50px",
    overflowY: "auto" as const,
    height: 170,
  },
};

export const tooltipHelper = {
  tooltip: {
    fontSize: 18,
  },
};

const checkBoxBasic = {
  width: 14,
  height: 14,
  borderRadius: 2,
};

export const checkboxIcons = {
  unCheckedIcon: { ...checkBoxBasic, border: "1px solid #c3c3c3" },
  checkedIcon: {
    ...checkBoxBasic,
    border: "1px solid #081C42",
    backgroundColor: "#081C42",
  },
};

const radioBasic = {
  width: 12,
  height: 12,
  borderRadius: "100%",
};

export const radioIcons = {
  radioUnselectedIcon: { ...radioBasic, border: "1px solid #000" },
  radioSelectedIcon: {
    ...radioBasic,
    border: "1px solid #000",
    backgroundColor: "#000",
  },
};

export const containerForHeader = (bottomSpacing: any) => ({
  container: {
    padding: "110px 33px 30px",
    paddingBottom: bottomSpacing,
    "& h6": {
      color: "#777777",
      fontSize: 14,
    },
    "& p": {
      "& span:not(*[class*='smallUnit'])": {
        fontSize: 16,
      },
    },
  },
});

export const actionsTray = {
  actionsTray: {
    display: "flex",
    justifyContent: "space-between",
    "& button": {
      flexGrow: 0,
      marginLeft: 15,
    },
  },
};

export const searchField = {
  searchField: {
    flexGrow: 1,
    height: 40,
    background: "#FFFFFF",
    borderRadius: 5,
    border: "#EAEDEE 1px solid",
    display: "flex",
    justifyContent: "center",
    padding: "0 16px",
    "& input": {
      fontSize: 14,
      color: "#000",
      "&::placeholder": {
        color: "#393939",
        opacity: 1,
      },
    },
  },
};

export const predefinedList = {
  predefinedTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: "#000",
    margin: "10px 0",
  },
  predefinedList: {
    backgroundColor: "#eaeaea",
    padding: "12px 10px",
    color: "#393939",
    fontSize: 12,
    fontWeight: 600,
    minHeight: 41,
  },
};

export const objectBrowserCommon = {
  obTitleSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    color: "#000",
    fontWeight: 600,
    height: 40,
    lineHeight: "40px",
  },
  breadcrumbs: {
    fontSize: 10,
    color: "#000",
    marginTop: 2,
    "& a": {
      textDecoration: "none",
      color: "#000",
      "&:hover": {
        textDecoration: "underline",
      },
    },
  },
};
