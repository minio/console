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
    maxWidth: 840,
  },
  tooltipContainer: {
    marginLeft: 5,
    display: "flex",
    alignItems: "center",
  },
  switchContainer: {
    display: "flex",
    maxWidth: 840,
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
    maxWidth: 840,
  },
};

export const tooltipHelper = {
  tooltip: {
    fontSize: 16,
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
  label: {
    color: "#393939",
    fontWeight: 600,
    fontSize: 13,
    alignSelf: "center" as const,
    whiteSpace: "nowrap" as const,
    "&:not(:first-of-type)": {
      marginLeft: 10,
    },
  },
  timeContainers: {
    height: 40,
  },
  actionsTray: {
    display: "flex" as const,
    justifyContent: "space-between" as const,
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
    "& label, & label.MuiInputLabel-shrink": {
      fontSize: 10,
      transform: "translate(5px, 2px)",
      transformOrigin: "top left",
    },
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
  prefinedContainer: {
    maxWidth: 840,
    width: "100%",
  },
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
  smallLabel: {
    color: "#9C9C9C",
    fontSize: 15,
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
  innerSettingsButtonContainer: {
    maxWidth: 840,
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

export const typesSelection = {
  iconContainer: {
    display: "flex" as const,
    flexDirection: "row" as const,
    maxWidth: 455,
    justifyContent: "space-between" as const,
    flexWrap: "wrap" as const,
    width: "100%",
  },
  nonIconContainer: {
    marginBottom: 16,
    width: 455,
    marginTop: 15,
    "& button": {
      marginRight: 16,
    },
  },
  pickTitle: {
    fontWeight: 600,
    color: "#393939",
    fontSize: 14,
    marginBottom: 16,
  },
  centerElements: {
    display: "flex" as const,
    flexDirection: "column" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  logoButton: {
    height: "80px",
  },
  lambdaNotif: {
    backgroundColor: "#fff",
    border: "#393939 1px solid",
    borderRadius: 5,
    width: 101,
    height: 91,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    cursor: "pointer",
    "& img": {
      maxWidth: 71,
      maxHeight: 71,
    },
  },
};

export const logsCommon = {
  logsSubContainer: {
    height: "calc(100vh - 230px)",
    padding: "15px 0",
  },
};

export const widgetCommon = {
  singleValueContainer: {
    position: "relative" as const,
    flexGrow: 1,
    width: "100%",
    height: "100%",
    border: "#EAEAEA 1px solid",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  titleContainer: {
    color: "#393939",
    fontWeight: 600,
    height: 15,
    textAlign: "center" as const,
    fontSize: 10,
  },
  contentContainer: {
    flexGrow: 2,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    display: "flex" as const,
    position: "absolute" as const,
    width: "100%",
    height: "calc(100% - 15px)",
  },
  contentContainerWithLabel: {
    height: "calc(100% - 25px)",
  },
  legendBlock: {
    position: "absolute" as const,
    bottom: 5,
    display: "flex" as const,
    width: "100%",
    height: 15,
    flexWrap: "wrap" as const,
    overflowY: "auto" as const,
  },
  singleLegendContainer: {
    display: "flex",
    alignItems: "center",
    padding: "0 10px",
    maxWidth: "100%",
  },
  colorContainer: {
    width: 8,
    height: 8,
    minWidth: 8,
    borderRadius: "100%",
    marginRight: 5,
  },
  legendLabel: {
    fontSize: "80%",
    color: "#393939",
    whiteSpace: "nowrap" as const,
    overflow: "hidden" as const,
    textOverflow: "ellipsis" as const,
  },
};

export const tooltipCommon = {
  customTooltip: {
    backgroundColor: "rgba(255, 255, 255, 0.90)",
    border: "#eaeaea 1px solid",
    borderRadius: 3,
    padding: "5px 10px",
    maxHeight: 300,
    overflowY: "auto" as const,
  },
  labelContainer: {
    display: "flex" as const,
    alignItems: "center" as const,
  },
  labelColor: {
    width: 6,
    height: 6,
    display: "block" as const,
    borderRadius: "100%",
    marginRight: 5,
  },
  itemValue: {
    fontSize: "75%",
    color: "#393939",
  },
  valueContainer: {
    fontWeight: 600,
  },
  timeStampTitle: {
    fontSize: "80%",
    color: "#9c9c9c",
    textAlign: "center" as const,
    marginBottom: 6,
  },
};

export const snackBarCommon = {
  snackBar: {
    backgroundColor: "#081F44",
    fontWeight: 400,
    fontFamily: "Lato, sans-serif",
    fontSize: 14,
    padding: "0px 20px 0px 20px;",
    boxShadow: "none" as const,
    "&.MuiPaper-root.MuiSnackbarContent-root": {
      borderRadius: "0px 0px 5px 5px",
    },
    "& div": {
      textAlign: "center" as const,
      padding: "6px 30px",
      width: "100%",
      overflowX: "hidden",
      textOverflow: "ellipsis",
    },
  },
  errorSnackBar: {
    backgroundColor: "#C72C48",
    color: "#fff",
  },
  snackBarExternal: {
    top: "-17px",
    position: "absolute" as const,
    minWidth: "348px",
    whiteSpace: "nowrap" as const,
    height: "33px",
  },
  snackDiv: {
    top: "17px",
    left: "50%",
    position: "absolute" as const,
  },
  snackBarModal: {
    top: 0,
    position: "absolute" as const,
    minWidth: "348px",
    whiteSpace: "nowrap" as const,
    height: "33px",
    maxWidth: "calc(100% - 140px)",
  },
};

export const wizardCommon = {
  multiContainer: {
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "flex-start" as const,
  },
  sizeFactorContainer: {
    marginLeft: 8,
    alignSelf: "flex-start" as const,
  },
  headerElement: {
    position: "sticky" as const,
    top: 0,
    paddingTop: 5,
    marginBottom: 10,
    zIndex: 500,
    backgroundColor: "#fff",
  },
  tableTitle: {
    fontWeight: 700,
    width: "30%",
  },
  poolError: {
    color: "#dc1f2e",
    fontSize: "0.75rem",
    paddingLeft: 120,
  },
  error: {
    color: "#dc1f2e",
    fontSize: "0.75rem",
  },
  h3Section: {
    marginTop: 0,
  },
  descriptionText: {
    fontSize: 13,
    color: "#777777",
  },
  container: {
    padding: "77px 0 0 0",
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
};

export const buttonsStyles = {
  anchorButton: {
    textDecoration: "underline" as const,
    textTransform: "unset" as const,
    fontWeight: "normal" as const,
    padding: 0,
    lineHeight: "unset" as const,
    height: "unset" as const,
    width: "unset" as const,
    textAlign: "left" as const,
    border: 0,
    minWidth: "unset" as const,
  },
};

export const hrClass = {
  hrClass: {
    borderTop: 0,
    borderLeft: 0,
    borderRight: 0,
    borderColor: "#999999",
    backgroundColor: "transparent" as const,
  },
};

export const tenantDetailsStyles = {
  buttonContainer: {
    textAlign: "right" as const,
  },
  multiContainer: {
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "flex-start" as const,
  },
  sizeFactorContainer: {
    marginLeft: 8,
  },
  containerHeader: {
    display: "flex" as const,
    justifyContent: "space-between" as const,
  },
  paperContainer: {
    padding: "15px 15px 15px 50px",
  },
  infoGrid: {
    display: "grid" as const,
    gridTemplateColumns: "auto auto auto auto",
    gridGap: 8,
    "& div": {
      display: "flex" as const,
      alignItems: "center" as const,
    },
    "& div:nth-child(odd)": {
      justifyContent: "flex-end" as const,
      fontWeight: 700,
    },
    "& div:nth-child(2n)": {
      paddingRight: 35,
    },
  },
  masterActions: {
    width: "25%",
    minWidth: "120px",
    "& div": {
      margin: "5px 0px",
    },
  },
  updateButton: {
    backgroundColor: "transparent" as const,
    border: 0,
    padding: "0 6px",
    cursor: "pointer" as const,
    "&:focus, &:active": {
      outline: "none",
    },
    "& svg": {
      height: 12,
    },
  },
  poolLabel: {
    color: "#666666",
  },
  titleCol: {
    fontWeight: 700,
  },
  breadcrumLink: {
    textDecoration: "none",
    color: "black",
  },
  healthCol: {
    fontWeight: 700,
    paddingRight: "10px",
  },
  ...modalBasic,
  ...actionsTray,
  ...buttonsStyles,
  ...searchField,
  ...hrClass,
  actionsTray: {
    ...actionsTray.actionsTray,
    padding: "15px 0 0",
  },
};

export const inputFieldStyles = {
  root: {
    borderRadius: 0,
    "&::before": {
      borderColor: "#9c9c9c",
    },
  },
  disabled: {
    "&.MuiInput-underline::before": {
      borderColor: "#eaeaea",
      borderBottomStyle: "solid" as const,
    },
  },
  input: {
    padding: "15px 30px 10px 5px",
    color: "#393939",
    fontSize: 13,
    fontWeight: 600,
    "&:placeholder": {
      color: "#393939",
      opacity: 1,
    },
  },
  error: {
    color: "#b53b4b",
  },
};

export const inlineCheckboxes = {
  inlineCheckboxes: {
    display: "flex",
    justifyContent: "flex-start",
  },
};
