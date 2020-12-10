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
    fontFamily: "Lato, sans-serif",
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
  "input:disabled ~ &": {
    border: "1px solid #9C9C9C",
  },
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
    padding: "110px 33px 0",
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
      fontSize: 12,
      fontWeight: 700,
      color: "#000",
      "&::placeholder": {
        color: "#393939",
        opacity: 1,
      },
    },
    "&:hover": {
      borderColor: "#000",
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
  innerContent: {
    width: "100%",
    overflowX: "auto" as const,
    whiteSpace: "nowrap" as const,
    scrollbarWidth: "none" as const,
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  innerContentMultiline: {
    width: "100%",
    maxHeight: 100,
    overflowY: "auto" as const,
    scrollbarWidth: "none" as const,
    "&::-webkit-scrollbar": {
      display: "none",
    },
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

export const selectorsCommon = {
  multiSelectTable: {
    height: 200,
  },
};

export const settingsCommon = {
  customTitle: {
    fontSize: 18,
    color: "#000",
    fontWeight: 600,
    padding: "12px 0",
    borderBottom: "#eaedee 1px solid",
    marginBottom: 10,
    margin: "15px 38px 27px",
  },
  settingsFormContainer: {
    height: "calc(100vh - 421px)",
    padding: "15px 38px",
    overflowY: "auto" as const,
    scrollbarWidth: "none" as const,
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  settingsButtonContainer: {
    borderTop: "1px solid #EAEAEA",
    padding: "15px 38px",
    textAlign: "right" as const,
  },
  settingsOptionsContainer: {
    height: "calc(100vh - 244px)",
    backgroundColor: "#fff",
    border: "#EAEDEE 1px solid",
    borderRadius: 3,
    marginTop: 15,
  },
  backButton: {
    cursor: "pointer",
    fontSize: 10,
    fontWeight: 600,
    color: "#000",
    backgroundColor: "transparent",
    border: 0,
    padding: 0,
    display: "flex",
    alignItems: "center",
    "&:active, &:focus": {
      outline: 0,
    },
    "& svg": {
      width: 10,
      marginRight: 4,
    },
  },
  backContainer: {
    margin: "20px 38px 0",
  },
};
