// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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

import { IEmbeddedCustomStyles } from "../common/types";
import get from "lodash/get";

export const getOverrideColorVariants: (
  customStyles: string,
) => false | IEmbeddedCustomStyles = (customStyles) => {
  try {
    return JSON.parse(atob(customStyles)) as IEmbeddedCustomStyles;
  } catch (e) {
    console.error("Error processing override styles, skipping.", e);
    return false;
  }
};

export const generateOverrideTheme = (overrideVars: IEmbeddedCustomStyles) => {
  let retVal = undefined;

  try {
    retVal = {
      bgColor: overrideVars.backgroundColor,
      fontColor: overrideVars.fontColor,
      borderColor: overrideVars.borderColor,
      bulletColor: overrideVars.fontColor,
      logoColor: "#C51B3F",
      logoLabelColor: overrideVars.fontColor,
      logoLabelInverse: "#FFF",
      logoContrast: "#000",
      logoContrastInverse: overrideVars.fontColor,
      loaderColor: overrideVars.loaderColor,
      boxBackground: overrideVars.boxBackground,
      mutedText: "#9c9c9c",
      secondaryText: "#9c9c9c",
      buttons: {
        regular: {
          enabled: {
            border: overrideVars.regularButtonStyles.textColor,
            text: overrideVars.regularButtonStyles.textColor,
            background: "transparent",
            iconColor: overrideVars.regularButtonStyles.textColor,
          },
          disabled: {
            border: overrideVars.regularButtonStyles.disabledText,
            text: overrideVars.regularButtonStyles.disabledText,
            background: "transparent",
            iconColor: overrideVars.regularButtonStyles.disabledText,
          },
          hover: {
            border: overrideVars.regularButtonStyles.hoverText,
            text: overrideVars.regularButtonStyles.hoverText,
            background: "transparent",
            iconColor: overrideVars.regularButtonStyles.hoverText,
          },
          pressed: {
            border: overrideVars.regularButtonStyles.activeText,
            text: overrideVars.regularButtonStyles.activeText,
            background: "transparent",
            iconColor: overrideVars.regularButtonStyles.activeText,
          },
        },
        callAction: {
          enabled: {
            border: overrideVars.buttonStyles.backgroundColor,
            text: overrideVars.buttonStyles.textColor,
            background: overrideVars.buttonStyles.backgroundColor,
            iconColor: overrideVars.buttonStyles.textColor,
          },
          disabled: {
            border: overrideVars.buttonStyles.disabledColor,
            text: overrideVars.buttonStyles.disabledText,
            background: overrideVars.buttonStyles.disabledColor,
            iconColor: overrideVars.buttonStyles.disabledText,
          },
          hover: {
            border: overrideVars.buttonStyles.hoverColor,
            text: overrideVars.buttonStyles.hoverText,
            background: overrideVars.buttonStyles.hoverColor,
            iconColor: overrideVars.buttonStyles.hoverText,
          },
          pressed: {
            border: overrideVars.buttonStyles.activeColor,
            text: overrideVars.buttonStyles.activeText,
            background: overrideVars.buttonStyles.activeColor,
            iconColor: overrideVars.buttonStyles.activeText,
          },
        },
        secondary: {
          enabled: {
            border: overrideVars.secondaryButtonStyles.textColor,
            text: overrideVars.secondaryButtonStyles.textColor,
            background: "transparent",
            iconColor: overrideVars.secondaryButtonStyles.textColor,
          },
          disabled: {
            border: overrideVars.secondaryButtonStyles.disabledText,
            text: overrideVars.secondaryButtonStyles.disabledText,
            background: "transparent",
            iconColor: overrideVars.secondaryButtonStyles.disabledText,
          },
          hover: {
            border: overrideVars.secondaryButtonStyles.hoverText,
            text: overrideVars.secondaryButtonStyles.hoverText,
            background: "transparent",
            iconColor: overrideVars.secondaryButtonStyles.hoverText,
          },
          pressed: {
            border: overrideVars.secondaryButtonStyles.activeText,
            text: overrideVars.secondaryButtonStyles.activeText,
            background: "transparent",
            iconColor: overrideVars.secondaryButtonStyles.activeText,
          },
        },
        text: {
          enabled: {
            border: "transparent",
            text: overrideVars.fontColor,
            background: "transparent",
            iconColor: overrideVars.fontColor,
          },
          disabled: {
            border: "transparent",
            text: overrideVars.fontColor,
            background: "transparent",
            iconColor: overrideVars.fontColor,
          },
          hover: {
            border: "transparent",
            text: overrideVars.fontColor,
            background: "transparent",
            iconColor: overrideVars.fontColor,
          },
          pressed: {
            border: "transparent",
            text: overrideVars.fontColor,
            background: "transparent",
            iconColor: overrideVars.fontColor,
          },
        },
      },
      login: {
        formBG: "#fff",
        bgFilter: "none",
        promoBG: "#000110",
        promoHeader: "#fff",
        promoText: "#A6DFEF",
        footerElements: "#2781B0",
        footerDivider: "#F2F2F2",
      },
      pageHeader: {
        background: overrideVars.boxBackground,
        border: overrideVars.borderColor,
        color: overrideVars.fontColor,
      },
      tooltip: {
        background: overrideVars.boxBackground,
        color: overrideVars.fontColor,
      },
      commonInput: {
        labelColor: overrideVars.fontColor,
      },
      checkbox: {
        checkBoxBorder: overrideVars.borderColor,
        checkBoxColor: overrideVars.okColor,
        disabledBorder: overrideVars.buttonStyles.disabledColor,
        disabledColor: overrideVars.buttonStyles.disabledColor,
      },
      iconButton: {
        buttonBG: overrideVars.buttonStyles.backgroundColor,
        activeBG: overrideVars.buttonStyles.activeColor,
        hoverBG: overrideVars.buttonStyles.hoverColor,
        disabledBG: overrideVars.buttonStyles.disabledColor,
        color: overrideVars.buttonStyles.textColor,
      },
      dataTable: {
        border: overrideVars.tableColors.border,
        disabledBorder: overrideVars.tableColors.disabledBorder,
        disabledBG: overrideVars.tableColors.disabledBG,
        selected: overrideVars.tableColors.selected,
        deletedDisabled: overrideVars.tableColors.deletedDisabled,
        hoverColor: overrideVars.tableColors.hoverColor,
      },
      backLink: {
        color: overrideVars.linkColor,
        arrow: overrideVars.linkColor,
        hover: overrideVars.hoverLinkColor,
      },
      inputBox: {
        border: overrideVars.inputBox.border,
        hoverBorder: overrideVars.inputBox.hoverBorder,
        color: overrideVars.inputBox.textColor,
        backgroundColor: overrideVars.inputBox.backgroundColor,
        error: overrideVars.errorColor,
        placeholderColor: overrideVars.inputBox.textColor,
        disabledBorder: overrideVars.buttonStyles.disabledColor,
        disabledBackground: overrideVars.inputBox.backgroundColor,
        disabledPlaceholder: overrideVars.buttonStyles.disabledColor,
        disabledText: overrideVars.buttonStyles.disabledColor,
      },
      breadcrumbs: {
        border: overrideVars.borderColor,
        linksColor: overrideVars.linkColor,
        textColor: overrideVars.fontColor,
        backgroundColor: overrideVars.boxBackground,
        backButton: {
          border: overrideVars.borderColor,
          backgroundColor: overrideVars.boxBackground,
        },
      },
      actionsList: {
        containerBorderColor: overrideVars.boxBackground,
        backgroundColor: overrideVars.boxBackground,
        disabledOptionsTextColor: overrideVars.disabledLinkColor,
        optionsBorder: overrideVars.borderColor,
        optionsHoverTextColor: overrideVars.hoverLinkColor,
        optionsTextColor: overrideVars.linkColor,
        titleColor: overrideVars.fontColor,
      },
      screenTitle: {
        border: overrideVars.borderColor,
        subtitleColor: overrideVars.secondaryFontColor,
        iconColor: overrideVars.fontColor,
      },
      modalBox: {
        closeColor: overrideVars.regularButtonStyles.textColor,
        closeHoverBG: overrideVars.regularButtonStyles.hoverColor,
        closeHoverColor: overrideVars.regularButtonStyles.hoverText,
        containerColor: overrideVars.backgroundColor,
        overlayColor: "#00000050",
        titleColor: overrideVars.fontColor,
        iconColor: {
          default: overrideVars.fontColor,
          accept: overrideVars.okColor,
          delete: overrideVars.errorColor,
        },
      },
      switchButton: {
        bulletBGColor: overrideVars.switch.bulletBGColor,
        bulletBorderColor: overrideVars.switch.bulletBorderColor,
        disabledBulletBGColor: overrideVars.switch.disabledBulletBGColor,
        disabledBulletBorderColor:
          overrideVars.switch.disabledBulletBorderColor,
        offLabelColor: overrideVars.secondaryFontColor,
        onLabelColor: overrideVars.fontColor,
        onBackgroundColor: overrideVars.okColor,
        switchBackground: overrideVars.switch.switchBackground,
        disabledBackground: overrideVars.switch.disabledBackground,
        disabledOnBackground: overrideVars.switch.disabledBackground,
      },
      dropdownSelector: {
        hoverText: overrideVars.buttonStyles.hoverText,
        backgroundColor: overrideVars.boxBackground,
        hoverBG: overrideVars.buttonStyles.hoverColor,
        selectedBGColor: overrideVars.buttonStyles.hoverColor,
        selectedTextColor: overrideVars.buttonStyles.hoverText,
        optionTextColor: overrideVars.fontColor,
        disabledText: overrideVars.disabledLinkColor,
      },
      readBox: {
        borderColor: overrideVars.borderColor,
        backgroundColor: overrideVars.boxBackground,
        textColor: overrideVars.fontColor,
      },
    };
  } catch (e) {
    console.warn("Invalid theme provided. Fallback to original theme.");
  }

  return retVal;
};

export const isDarkModeOn = () => {
  const darkMode = localStorage.getItem("dark-mode");

  if (!darkMode) {
    const systemDarkMode = window.matchMedia("(prefers-color-scheme: dark)");
    return get(systemDarkMode, "matches", false);
  }

  return darkMode === "on";
};

export const storeDarkMode = (mode: "on" | "off") => {
  localStorage.setItem("dark-mode", mode);
};
