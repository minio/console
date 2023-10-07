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

import { breakPoints } from "mds";
import get from "lodash/get";

const inputLabelBase = {
  fontWeight: 600,
  marginRight: 10,
  fontSize: 14,
  color: "#07193E",
  textAlign: "left" as const,
  overflow: "hidden",
  alignItems: "center",
  display: "flex",
  "& span": {
    display: "flex",
    alignItems: "center",
  },
};

export const fieldBasic: any = {
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
    flexWrap: "wrap",
    "@media (max-width: 600px)": {
      flexFlow: "column",
    },
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
  clearButton: {
    fontFamily: "Inter, sans-serif",
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
  configureString: {
    border: "#EAEAEA 1px solid",
    borderRadius: 4,
    padding: "24px 50px",
    overflowY: "auto" as const,
    height: 170,
    backgroundColor: "#FBFAFA",
  },
};

export const tooltipHelper = {
  tooltip: {
    "& .min-icon": {
      width: 13,
    },
  },
};

export const containerForHeader = {
  container: {
    position: "relative" as const,
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
  boxy: {
    border: "#E5E5E5 1px solid",
    borderRadius: 2,
    padding: 40,
    backgroundColor: "#fff",
  },
};

export const actionsTray = {
  label: {
    color: "#07193E",
    fontSize: 13,
    alignSelf: "center" as const,
    whiteSpace: "nowrap" as const,
    "&:not(:first-of-type)": {
      marginLeft: 10,
    },
  },
  actionsTray: {
    display: "flex" as const,
    justifyContent: "space-between" as const,
    alignItems: "center",
    marginBottom: "1rem",
    "& button": {
      flexGrow: 0,
      marginLeft: 8,
    },
  },
};

export const searchField = {
  searchField: {},
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
  includesActionButton: {
    paddingRight: 45,
    position: "relative" as const,
  },
  overlayShareOption: {
    position: "absolute" as const,
    width: 45,
    right: 0,
    top: "50%",
    transform: "translate(0, -50%)",
  },
};

export const objectBrowserCommon = {
  breadcrumbsMain: {
    display: "flex",
  },
  breadcrumbs: {
    fontSize: 12,
    color: "#969FA8",
    fontWeight: "bold",
    border: "#EAEDEE 1px solid",
    height: 38,
    display: "flex",
    alignItems: "center",
    backgroundColor: "#FCFCFD",
    marginRight: 10,
    "& a": {
      textDecoration: "none",
      color: "#969FA8",
      "&:hover": {
        textDecoration: "underline",
      },
    },
    "& .min-icon": {
      width: 16,
      minWidth: 16,
    },
  },
  additionalOptions: {
    paddingRight: "10px",
    display: "flex",
    alignItems: "center",
    "@media (max-width: 1060px)": {
      display: "none",
    },
  },
  bucketDetails: {
    marginLeft: 10,
    fontSize: 14,
    color: "#969FA8",
    "@media (max-width: 600px)": {
      marginLeft: 0,
      "& span": {
        marginBottom: 10,
        display: "flex",
        flexDirection: "column",
      },
    },
  },
  detailsSpacer: {
    marginRight: 18,
    "@media (max-width: 600px)": {
      marginRight: 0,
    },
  },
  breadcrumbsList: {
    textOverflow: "ellipsis" as const,
    overflow: "hidden" as const,
    whiteSpace: "nowrap" as const,
    display: "inline-block" as const,
    flexGrow: 1,
    textAlign: "left" as const,
    marginLeft: 15,
    marginRight: 10,
    width: 0, // WA to avoid overflow if child elements in flexbox list.**
  },
  breadcrumbsSecond: {
    display: "none" as const,
    marginTop: 15,
    marginBottom: 5,
    justifyContent: "flex-start" as const,
    "& > div": {
      fontSize: 12,
      fontWeight: "normal",
      flexDirection: "row" as const,
      flexWrap: "nowrap" as const,
    },
    "@media (max-width: 1060px)": {
      display: "flex" as const,
    },
  },
  overrideShowDeleted: {
    "@media (max-width: 600px)": {
      flexDirection: "row" as const,
    },
  },
};

// ** According to W3 spec, default minimum values for flex width flex-grow is "auto" (https://drafts.csswg.org/css-flexbox/#min-size-auto). So in this case we need to enforce the use of an absolute width.
// "The preferred width of a box element child containing text content is currently the text without line breaks, leading to very unintuitive width and flex calculations → declare a width on a box element child with more than a few words (ever wonder why flexbox demos are all “1,2,3”?)"

export const settingsCommon: any = {
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
    display: "flex",
    justifyContent: "flex-end",
  },
  settingsOptionsContainer: {
    height: "calc(100vh - 244px)",
    backgroundColor: "#fff",
    border: "#EAEDEE 1px solid",
    borderRadius: 3,
    marginTop: 15,
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
  logoButton: {
    height: "80px",
  },
  lambdaNotif: {
    background: "#ffffff50",
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
    "&:hover": {
      backgroundColor: "#ebebeb",
    },
  },

  lambdaNotifIcon: {
    background: "transparent",
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
    fontFamily: "Inter,sans-serif",
    paddingLeft: 18,
  },
};

export const widgetCommon = (theme: any) => ({
  "& .singleValueContainer": {
    height: 200,
    border: `${get(theme, "borderColor", "#eaeaea")} 1px solid`,
    borderRadius: 2,
    backgroundColor: get(theme, "bgColor", "#fff"),
    padding: 16,
  },
  "& .titleContainer": {
    color: get(theme, "mutedText", "#87888d"),
    fontSize: 16,
    fontWeight: 600,
    paddingBottom: 14,
    marginBottom: 5,
    display: "flex" as const,
    justifyContent: "space-between" as const,
  },
  "& .contentContainer": {
    justifyContent: "center" as const,
    alignItems: "center" as const,
    display: "flex" as const,
    width: "100%",
    height: 140,
  },
  "& .singleLegendContainer": {
    display: "flex",
    alignItems: "center",
    padding: "0 10px",
    maxWidth: "100%",
  },
  "& .colorContainer": {
    width: 8,
    height: 8,
    minWidth: 8,
    marginRight: 5,
  },
  "& .legendLabel": {
    fontSize: "80%",
    color: get(theme, "mutedText", "#87888d"),
    whiteSpace: "nowrap" as const,
    overflow: "hidden" as const,
    textOverflow: "ellipsis" as const,
  },
  "& .zoomChartCont": {
    position: "relative" as const,
    height: 340,
    width: "100%",
  },
});

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
    fontFamily: "Inter, sans-serif",
    fontSize: 14,
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
    "&.MuiPaper-root": {
      padding: "0px 20px 0px 20px",
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
  multiContainerStackNarrow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "8px",
    "@media (max-width: 750px)": {
      flexFlow: "column",
      flexDirection: "column",
    },
  },
  headerElement: {
    position: "sticky" as const,
    top: 0,
    paddingTop: 5,
    marginBottom: 10,
    zIndex: 500,
    backgroundColor: "#fff",
  },
  error: {
    color: "#dc1f2e",
    fontSize: "0.75rem",
  },
  descriptionText: {
    fontSize: 14,
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
      color: "#858585",
      opacity: 1,
      fontWeight: 400,
    },
  },
  error: {
    color: "#b53b4b",
  },
};

export const tableStyles: any = {
  tableBlock: {
    display: "flex",
    flexDirection: "row",
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
  spacerBottom: {
    marginBottom: ".9rem",
  },
  spacerTop: {
    marginTop: ".9rem",
  },
};

export const formFieldStyles: any = {
  formFieldRow: {
    marginBottom: ".8rem",
    "& .MuiInputLabel-root": {
      fontWeight: "normal",
    },
  },
};

export const deleteDialogStyles: any = {
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
    fontSize: 20,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    "& svg": {
      marginRight: 10,
    },
    wordBreak: "break-all",
    whiteSpace: "normal",
  },
  closeContainer: {
    "& .MuiIconButton-root": {
      top: -20,
      left: 30,
      position: "relative",
      padding: 1,
      "&:focus, &:hover": {
        background: "#EAEAEA",
      },
    },
    "& .min-icon": {
      height: 16,
      width: 16,
    },
  },
};

export const createTenantCommon: any = {
  fieldGroup: {
    border: "1px solid #EAEAEA",
    paddingTop: 15,
  },
  descriptionText: {
    fontSize: 14,
  },
};

export const modalStyleUtils: any = {
  modalButtonBar: {
    marginTop: 15,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 10,
  },
  modalFormScrollable: {
    maxHeight: "calc(100vh - 300px)",
    overflowY: "auto",
    paddingTop: 10,
  },
};

export const textStyleUtils: any = {
  textMuted: {
    color: "#8399AB",
  },
};

export const detailsPanel: any = {
  metadataLinear: {
    marginBottom: 15,
    fontSize: 14,
    maxHeight: 180,
    overflowY: "auto",
  },
  detailContainer: {
    padding: "0 22px",
    marginBottom: 20,
    fontSize: 14,
  },
  titleLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000",
    padding: "12px 30px 8px 22px",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
    alignItems: "center",
  },
  objectActions: {
    backgroundColor: "#F8F8F8",
    border: "#F1F1F1 1px solid",
    borderRadius: 3,
    margin: "8px 22px",
    padding: 0,
    color: "#696969",
    "& li": {
      listStyle: "none",
      padding: 6,
      margin: 0,
      borderBottom: "#E5E5E5 1px solid",
      fontSize: 14,
      "&:first-of-type": {
        padding: 10,
        fontWeight: "bold",
        color: "#000",
      },
      "&:last-of-type": {
        borderBottom: 0,
      },
      "&::before": {
        content: "' '!important",
      },
    },
  },
};

export const objectBrowserExtras = {
  listIcon: {
    display: "block",
    marginTop: "-10px",
    "& .min-icon": {
      width: 20,
      height: 20,
    },
  },
  titleSpacer: {
    marginLeft: 10,
    "@media (max-width: 600px)": {
      marginLeft: 0,
    },
  },
};

export const twoColCssGridLayoutConfig = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gridAutoFlow: "row",
  gap: 10,
  [`@media (max-width: ${breakPoints.sm}px)`]: {
    gridTemplateColumns: "1fr",
    gridAutoFlow: "dense",
  },
};
