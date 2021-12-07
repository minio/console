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

const inputLabelBase = {
  fontWeight: 600,
  marginRight: 10,
  fontSize: 14,
  color: "#07193E",
  textAlign: "left" as const,
  overflow: "hidden",
  "& span": {
    display: "flex",
    alignItems: "center",
  },
  display: "flex",
};

export const fieldBasic = {
  inputLabel: {
    ...inputLabelBase,
    minWidth: 160,
  },
  noMinWidthLabel: {
    ...inputLabelBase,
  },
  fieldLabelError: {
    paddingBottom: 22,
  },
  fieldContainer: {
    marginBottom: 20,
    position: "relative" as const,
    display: "flex" as const,
  },
  tooltipContainer: {
    marginLeft: 5,
    display: "flex",
    alignItems: "center",
    "& .min-icon": {
      width: 13,
    },
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
    backgroundColor: "#FBFAFA",
  },
  moduleDescription: {
    color: "#848484",
    fontSize: 12,
    fontStyle: "italic" as string,
  },
};

export const tooltipHelper = {
  tooltip: {
    "& .min-icon": {
      width: 13,
    },
  },
};

const checkBoxBasic = {
  width: 16,
  height: 16,
  borderRadius: 2,
};

export const checkboxIcons = {
  unCheckedIcon: {
    ...checkBoxBasic,
    border: "1px solid #c3c3c3",
    boxShadow: "inset 0px 1px 3px rgba(0,0,0,0.1)",
  },
  checkedIcon: {
    ...checkBoxBasic,
    border: "1px solid #FFFFFF",
    backgroundColor: "#4CCB92",
    boxShadow: "inset 0px 1px 3px rgba(0,0,0,0.1)",
    width: 14,
    height: 14,
    marginLeft: 1,
    "&:before": {
      content: "''",
      display: "block",
      marginLeft: -2,
      marginTop: -2,
      width: 16,
      height: 16,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      borderRadius: 2,
      border: "1px solid #ccc",
    },
  },
};

const radioBasic = {
  width: 16,
  height: 16,
  borderRadius: "100%",
  "input:disabled ~ &": {
    border: "1px solid #E5E5E5",
  },
  padding: 1,
};

export const radioIcons = {
  radioUnselectedIcon: { ...radioBasic, border: "2px solid #E5E5E5" },
  radioSelectedIcon: {
    ...radioBasic,
    border: "2px solid #E5E5E5",
    backgroundColor: "#072C4F",
  },
};

export const containerForHeader = (bottomSpacing: any) => ({
  container: {
    position: "relative" as const,
    maxWidth: 1180,
    padding: "20px 35px 0",
    "& h6": {
      color: "#777777",
      fontSize: 30,
    },
    "& p": {
      "& span:not(*[class*='smallUnit'])": {
        fontSize: 16,
      },
    },
  },
  sectionTitle: {
    margin: 0,
    marginBottom: ".8rem",
    fontSize: "1.3rem",
  },
  topSpacer: {
    height: "8px",
  },
  boxy: {
    border: "#E5E5E5 1px solid",
    borderRadius: 2,
    padding: 40,
    backgroundColor: "#fff",
  },
});

export const actionsTray = {
  filterTitle: {
    color: "#848484",
    fontSize: 13,
    alignSelf: "center" as const,
    whiteSpace: "nowrap" as const,
    "&:not(:first-of-type)": {
      marginLeft: 10,
    },
  },
  label: {
    color: "#07193E",
    fontSize: 13,
    alignSelf: "center" as const,
    whiteSpace: "nowrap" as const,
    "&:not(:first-of-type)": {
      marginLeft: 10,
    },
  },
  timeContainers: {
    display: "flex" as const,
    "& button": {
      flexGrow: 0,
      marginLeft: 15,
    },
    height: 40,
    maxWidth: 1185,
    marginBottom: 15,
    justifyContent: "flex-start" as const,
    "& > *": {
      marginRight: 15,
    },
  },
  actionsTray: {
    display: "flex" as const,
    justifyContent: "space-between" as const,
    marginBottom: "1rem",
    alignItems: "center",
    "& button": {
      flexGrow: 0,
      marginLeft: 8,
    },
  },
  filterContainer: {
    backgroundColor: "#fff",
    border: "#EEF1F4 2px solid",
    borderRadius: 2,
    display: "flex",
    alignItems: "center",
    padding: "0 12px",
  },
  divisorLine: {
    borderRight: "#EEF1F4 1px solid",
    height: 20,
    margin: "0 15px",
  },
};

export const searchField = {
  searchField: {
    flexGrow: 1,
    height: 38,
    background: "#FFFFFF",
    borderRadius: 3,
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
        color: "#a6a5a5",
        opacity: 1,
      },
    },
    "&:hover": {
      borderColor: "#000",
    },
    "& .min-icon": {
      width: 16,
      height: 16,
    },
    "&:focus-within": {
      borderColor: "rgba(0, 0, 0, 0.87)",
    },
  },
};

export const predefinedList = {
  prefinedContainer: {
    display: "flex",
    width: "100%",
    alignItems: "center" as const,
    margin: "15px 0 0",
  },
  predefinedTitle: {
    color: "rgba(0, 0, 0, 0.87)",
    display: "flex" as const,
    overflow: "hidden" as const,
    fontSize: 14,
    maxWidth: 160,
    textAlign: "left" as const,
    marginRight: 10,
    flexGrow: 0,
    fontWeight: "normal" as const,
  },
  predefinedList: {
    backgroundColor: "#fbfafa",
    border: "#e5e5e5 1px solid",
    padding: "12px 10px",
    color: "#696969",
    fontSize: 12,
    fontWeight: 600,
    minHeight: 41,
    borderRadius: 4,
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
    padding: 38,
    overflowY: "auto" as const,
    scrollbarWidth: "none" as const,
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  settingsButtonContainer: {
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
  mainCont: {
    paddingLeft: 50,
    paddingRight: 50,
  },
  mainTitle: {
    fontSize: 18,
    color: "#000",
    fontWeight: 600,
    marginBottom: 10,
    marginTop: 10,
  },
};

export const typesSelection = {
  iconContainer: {
    display: "flex" as const,
    flexDirection: "row" as const,
    maxWidth: 1180,
    justifyContent: "start" as const,
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
    background:
      "linear-gradient(90deg, rgba(249,249,250,1) 0%, rgba(250,250,251,1) 68%, rgba(254,254,254,1) 100%)",
    border: "#E5E5E5 1px solid",
    borderRadius: 5,
    width: 250,
    height: 80,
    display: "flex",
    alignItems: "center",
    justifyContent: "start",
    marginBottom: 16,
    marginRight: 8,
    cursor: "pointer",
    padding: 0,
    overflow: "hidden",
  },
  lambdaNotifIcon: {
    backgroundColor: "#FEFEFE",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 80,
    height: 80,

    "& img": {
      maxWidth: 46,
      maxHeight: 46,
    },
  },
  lambdaNotifTitle: {
    color: "#07193E",
    fontSize: 16,
    fontFamily: "Lato,sans-serif",
    paddingLeft: 18,
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
    height: 200,
    maxWidth: 1185,
    border: "#eef1f4 2px solid",
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "100%",
    padding: 16,
  },
  titleContainer: {
    color: "#404143",
    fontSize: 14,
    textTransform: "uppercase" as const,
    fontWeight: 800,
    borderBottom: "#eef1f4 1px solid",
    paddingBottom: 14,
    marginBottom: 5,
    display: "flex" as const,
    justifyContent: "space-between" as const,
  },
  contentContainer: {
    justifyContent: "center" as const,
    alignItems: "center" as const,
    display: "flex" as const,
    width: "100%",
    height: 140,
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
    marginRight: 5,
  },
  legendLabel: {
    fontSize: "80%",
    color: "#393939",
    whiteSpace: "nowrap" as const,
    overflow: "hidden" as const,
    textOverflow: "ellipsis" as const,
  },
  zoomChartCont: {
    position: "relative" as const,
    height: 340,
    width: "100%",
  },
  zoomChartIcon: {
    backgroundColor: "transparent",
    border: 0,
    padding: 0,
    cursor: "pointer",
    "& svg": {
      color: "#D0D0D0",
      height: 16,
    },
    "&:hover": {
      "& svg": {
        color: "#404143",
      },
    },
  },
};

export const widgetContainerCommon = {
  widgetPanelDelimiter: {
    padding: 10,
  },
  dashboardRow: {
    display: "flex" as const,
    flexDirection: "row" as const,
    justifyContent: "flex-start" as const,
    flexWrap: "wrap" as const,
    maxWidth: 1180,
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
    top: -1,
    height: 33,
    position: "fixed" as const,
    minWidth: 348,
    whiteSpace: "nowrap" as const,
    left: 0,
    width: "100%",
    justifyContent: "center" as const,
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
    width: "100%",
    justifyContent: "center",
    left: 0,
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
    margin: 0,
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
  paperWrapper: {
    padding: 12,
    border: 0,
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
    borderRadius: 3,
    "&::before": {
      borderColor: "#9c9c9c",
    },
    "& fieldset": {
      borderColor: "#e5e5e5",
    },
    "&:hover fieldset": {
      borderColor: "#07193E",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#07193E",
      borderWidth: 1,
    },
    "&.Mui-error + p": {
      marginLeft: 3,
    },
  },
  disabled: {
    "&.MuiOutlinedInput-root::before": {
      borderColor: "#e5e5e5",
      borderBottomStyle: "solid" as const,
      borderRadius: 3,
    },
  },
  input: {
    height: 38,
    padding: "0 35px 0 15px",
    color: "#07193E",
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

const commonStateIcon = {
  marginRight: 10,
  lineHeight: 1,
  display: "inline-flex",
  marginTop: 6,
};

export const commonDashboardInfocard = {
  cardIconContainer: {
    display: "flex" as const,
    position: "relative" as const,
    alignItems: "center" as const,
  },
  stateContainer: {
    display: "flex" as const,
    flexWrap: "wrap" as const,
    justifyContent: "flex-start" as const,
  },
  infoValue: {
    fontWeight: 500,
    color: "#07193E",
    fontSize: 16,
    margin: "8px 40px 5px 0",
    display: "inline-flex" as const,
    "& strong": {
      marginRight: 4,
    },
    "& .min-icon": {
      width: 20,
      height: 20,
    },
    alignItems: "center" as const,
  },
  redState: {
    color: "#F55B5B",
    ...commonStateIcon,
  },
  greenState: {
    color: "#9FF281",
    ...commonStateIcon,
  },
  yellowState: {
    color: "#F7A25A",
    ...commonStateIcon,
  },
  greyState: {
    color: "grey",
    ...commonStateIcon,
  },
  healthStatusIcon: {
    position: "absolute" as const,
    fontSize: 8,
    left: 18,
    height: 10,
    bottom: 2,
    marginRight: 10,
    "& .min-icon": {
      width: 5,
      height: 5,
    },
  },
  innerState: {
    fontSize: 8,
    display: "flex" as const,
    alignItems: "center" as const,
    marginTop: -3,
    "& .min-icon": {
      marginTop: 5,
      width: 10,
      height: 10,
    },
  },
  cardContainer: {
    borderRadius: 10,
    boxShadow: "0 0 15px #00000029",
    maxWidth: 1185,
    marginBottom: 30,
  },
  cardHeader: {
    "& .MuiCardHeader-title": {
      fontWeight: "bolder" as const,
    },
  },
  cardNumber: {
    color: "#848484",
    fontSize: 16,
    fontWeight: 400,
    marginBottom: 10,
  },
  referenceTitle: {
    display: "flex",
    alignItems: "center" as const,
    lineHeight: 1,
    fontWeight: "bold" as const,
    "& .min-icon": {
      width: 10,
      height: 10,
      marginTop: -5,
    },
  },
};

export const pageContentStyles = {
  contentSpacer: {
    padding: "2rem",
  },
};

export const linkStyles = (color: string) => ({
  link: {
    textDecoration: "underline",
    color,
    backgroundColor: "transparent",
    border: 0,
    cursor: "pointer",
  },
});

export const serviceAccountStyles: any = {
  jsonPolicyEditor: {
    minHeight: 400,
    width: "100%",
  },
  buttonContainer: {
    textAlign: "right",
  },
  infoDetails: {
    color: "#393939",
    fontSize: 12,
    fontStyle: "italic",
    marginBottom: "8px",
  },
  containerScrollable: {
    maxHeight: "calc(100vh - 200px)" as const,
    overflowY: "auto" as const,
  },
  codeMirrorContainer: {
    marginBottom: 20,
    paddingLeft: 15,
    "&:nth-child(2) .MuiGrid-root:nth-child(3)": {
      border: "1px solid #EAEAEA",
    },
    "& label": {
      marginBottom: ".5rem",
    },
    "& label + div": {
      display: "none",
    },
  },
  stackedInputs: {
    display: "flex",
    gap: 15,
    paddingBottom: "1rem",
    paddingLeft: "1rem",
    flexFlow: "column",
  },
  buttonSpacer: {
    marginRight: "1rem",
  },
};

export const tableStyles: any = {
  tableBlock: {
    "& .ReactVirtualized__Table__headerRow.rowLine, .ReactVirtualized__Table__row.rowLine":
      {
        borderBottom: "1px solid #EAEAEA",
      },

    "& .rowLine:hover:not(.ReactVirtualized__Table__headerRow)": {
      backgroundColor: "#F8F8F8",
    },
    "& .ReactVirtualized__Table__row.rowLine": {
      fontSize: ".8rem",
    },
    "& .optionsAlignment ": {
      textAlign: "right",

      "& .MuiButtonBase-root": {
        backgroundColor: "#F8F8F8",
      },

      "&:hover": {
        backgroundColor: "#E2E2E2",
      },
      "& .min-icon": {
        width: 13,
        margin: 3,
      },
    },
  },
};

export const spacingUtils: any = {
  spacerRight: {
    marginRight: ".9rem",
  },
  spacerLeft: {
    marginLeft: ".9rem",
  },
};

export const formFieldStyles = {
  formFieldRow: {
    marginBottom: ".8rem",
    "& .MuiInputLabel-root": {
      fontWeight: "normal",
    },
  },
};

export const fileInputStyles = {
  fieldBottom: {
    borderBottom: 0,
  },
  fileReselect: {
    border: "1px solid #EAEAEA",
    width: "100%",
    paddingLeft: 10,
  },
  textBoxContainer: {
    border: "1px solid #EAEAEA",
    borderRadius: 3,
    padding: 5,
    "& input": {
      width: "100%",
      margin: "auto",
    },
  },
};

export const deleteDialogStyles = {
  root: {
    "& .MuiPaper-root": {
      padding: "1rem 2rem 2rem 1rem",
    },
  },
  title: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleText: {
    fontSize: "1rem",
    fontWeight: 600,
  },
  closeContainer: {
    "& .MuiIconButton-root": {
      top: -20,
      left: 30,
      position: "relative",
    },
    "& .min-icon": {
      height: 16,
      width: 16,
    },
  },
};

export const advancedFilterToggleStyles: any = {
  advancedButton: {
    flexGrow: 1,
    alignItems: "flex-end",
    display: "flex",
    justifyContent: "flex-end",
  },
  advancedConfiguration: {
    color: "#2781B0",
    fontSize: 10,
    textDecoration: "underline",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    alignItems: "center",
    display: "flex",
    float: "right",

    "&:hover": {
      color: "#07193E",
    },

    "& svg": {
      width: 10,
      alignSelf: "center",
      marginLeft: 5,
    },
  },
  advancedOpen: {
    transform: "rotateZ(-90deg) translateX(-4px) translateY(2px)",
  },
  advancedClosed: {
    transform: "rotateZ(90deg)",
  },
};

export const createTenantCommon: any = {
  fieldGroup: {
    border: "1px solid #EAEAEA",
    paddingTop: 5,
  },
};
