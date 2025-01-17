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

export const generateOverrideTheme = (
  overrideVars: IEmbeddedCustomStyles | {},
) => {
  // Core Colors
  const PRIMARY = "#ff00a0";
  const PRIMARY_HOVER = "#e4008e";
  const TEXT_PRIMARY = "#f9fafb";
  const TEXT_SECONDARY = "#e5e7eb";
  const TEXT_MUTED = "#9ca3af";
  const BG_DARK = "#19191d";
  const BORDER_COLOR = "#39393c";
  const CARD_BG = "#ffffff";
  const CARD_TEXT = "#1f2937";
  const CARD_CONTENT = "#4b5563";
  const CARD_BORDER = "#e5e7eb";

  // Additional Colors
  const ERROR_COLOR = "#dc2626";
  const SUCCESS_COLOR = "#059669";
  const LINK_COLOR = PRIMARY;
  const LINK_HOVER = PRIMARY_HOVER;
  const DISABLED_COLOR = TEXT_MUTED;
  const OVERLAY_COLOR = "#00000050";
  const ACTIVE_NAV_BG = "rgba(255, 0, 160, 0.15)";

  return {
    bgColor: BG_DARK,
    fontColor: TEXT_PRIMARY,
    borderColor: BORDER_COLOR,
    bulletColor: TEXT_PRIMARY,
    logoColor: PRIMARY,
    logoLabelColor: TEXT_PRIMARY,
    logoLabelInverse: CARD_BG,
    loaderColor: PRIMARY,
    boxBackground: BG_DARK,
    mutedText: TEXT_MUTED,
    secondaryText: TEXT_SECONDARY,
    buttons: {
      regular: {
        enabled: {
          border: PRIMARY,
          text: TEXT_PRIMARY,
          background: "transparent",
          iconColor: TEXT_PRIMARY,
        },
        disabled: {
          border: TEXT_MUTED,
          text: TEXT_MUTED,
          background: "transparent",
          iconColor: TEXT_MUTED,
        },
        hover: {
          border: PRIMARY_HOVER,
          text: TEXT_PRIMARY,
          background: "transparent",
          iconColor: TEXT_PRIMARY,
        },
        pressed: {
          border: PRIMARY_HOVER,
          text: TEXT_PRIMARY,
          background: "transparent",
          iconColor: TEXT_PRIMARY,
        },
      },
      callAction: {
        enabled: {
          border: PRIMARY,
          text: TEXT_PRIMARY,
          background: PRIMARY,
          iconColor: TEXT_PRIMARY,
        },
        disabled: {
          border: TEXT_MUTED,
          text: TEXT_MUTED,
          background: `${TEXT_MUTED}40`,
          iconColor: TEXT_MUTED,
        },
        hover: {
          border: PRIMARY_HOVER,
          text: TEXT_PRIMARY,
          background: PRIMARY_HOVER,
          iconColor: TEXT_PRIMARY,
        },
        pressed: {
          border: PRIMARY_HOVER,
          text: TEXT_PRIMARY,
          background: PRIMARY_HOVER,
          iconColor: TEXT_PRIMARY,
        },
      },
      secondary: {
        enabled: {
          border: TEXT_PRIMARY,
          text: TEXT_PRIMARY,
          background: "transparent",
          iconColor: TEXT_PRIMARY,
        },
        disabled: {
          border: DISABLED_COLOR,
          text: DISABLED_COLOR,
          background: "transparent",
          iconColor: DISABLED_COLOR,
        },
        hover: {
          border: TEXT_SECONDARY,
          text: TEXT_SECONDARY,
          background: "transparent",
          iconColor: TEXT_SECONDARY,
        },
        pressed: {
          border: TEXT_SECONDARY,
          text: TEXT_SECONDARY,
          background: "transparent",
          iconColor: TEXT_SECONDARY,
        },
      },
      text: {
        enabled: {
          border: "transparent",
          text: TEXT_PRIMARY,
          background: "transparent",
          iconColor: TEXT_PRIMARY,
        },
        disabled: {
          border: "transparent",
          text: DISABLED_COLOR,
          background: "transparent",
          iconColor: DISABLED_COLOR,
        },
        hover: {
          border: "transparent",
          text: TEXT_SECONDARY,
          background: "transparent",
          iconColor: TEXT_SECONDARY,
        },
        pressed: {
          border: "transparent",
          text: TEXT_SECONDARY,
          background: "transparent",
          iconColor: TEXT_SECONDARY,
        },
      },
    },
    login: {
      formBG: BG_DARK,
      bgFilter: "none",
      promoBG: BG_DARK,
      promoHeader: TEXT_PRIMARY,
      promoText: TEXT_SECONDARY,
      footerElements: TEXT_SECONDARY,
      footerDivider: BORDER_COLOR,
    },
    pageHeader: {
      background: BG_DARK,
      border: BORDER_COLOR,
      color: TEXT_PRIMARY,
    },
    tooltip: {
      background: BG_DARK,
      color: TEXT_PRIMARY,
    },
    commonInput: {
      labelColor: TEXT_PRIMARY,
    },
    checkbox: {
      checkBoxBorder: BORDER_COLOR,
      checkBoxColor: SUCCESS_COLOR,
      disabledBorder: DISABLED_COLOR,
      disabledColor: DISABLED_COLOR,
    },
    iconButton: {
      buttonBG: "transparent",
      activeBG: ACTIVE_NAV_BG,
      hoverBG: ACTIVE_NAV_BG,
      disabledBG: DISABLED_COLOR,
      color: TEXT_PRIMARY,
    },
    dataTable: {
      border: BORDER_COLOR,
      disabledBorder: DISABLED_COLOR,
      disabledBG: `${DISABLED_COLOR}40`,
      selected: ACTIVE_NAV_BG,
      deletedDisabled: ERROR_COLOR,
      hoverColor: ACTIVE_NAV_BG,
    },
    backLink: {
      color: LINK_COLOR,
      arrow: LINK_COLOR,
      hover: LINK_HOVER,
    },
    inputBox: {
      border: BORDER_COLOR,
      hoverBorder: PRIMARY,
      color: TEXT_PRIMARY,
      backgroundColor: BG_DARK,
      error: ERROR_COLOR,
      placeholderColor: TEXT_MUTED,
      disabledBorder: DISABLED_COLOR,
      disabledBackground: BG_DARK,
      disabledPlaceholder: DISABLED_COLOR,
      disabledText: DISABLED_COLOR,
    },
    breadcrumbs: {
      border: BORDER_COLOR,
      linksColor: LINK_COLOR,
      textColor: TEXT_PRIMARY,
      backgroundColor: BG_DARK,
      backButton: {
        border: BORDER_COLOR,
        backgroundColor: BG_DARK,
      },
    },
    actionsList: {
      containerBorderColor: BG_DARK,
      backgroundColor: BG_DARK,
      disabledOptionsTextColor: DISABLED_COLOR,
      optionsBorder: BORDER_COLOR,
      optionsHoverTextColor: LINK_HOVER,
      optionsTextColor: LINK_COLOR,
      titleColor: TEXT_PRIMARY,
    },
    screenTitle: {
      border: BORDER_COLOR,
      subtitleColor: TEXT_SECONDARY,
      iconColor: TEXT_PRIMARY,
    },
    modalBox: {
      closeColor: TEXT_PRIMARY,
      closeHoverBG: ACTIVE_NAV_BG,
      closeHoverColor: PRIMARY,
      containerColor: BG_DARK,
      overlayColor: OVERLAY_COLOR,
      titleColor: TEXT_PRIMARY,
      iconColor: {
        default: TEXT_PRIMARY,
        accept: SUCCESS_COLOR,
        delete: ERROR_COLOR,
      },
    },
    switchButton: {
      bulletBGColor: TEXT_PRIMARY,
      bulletBorderColor: BORDER_COLOR,
      disabledBulletBGColor: DISABLED_COLOR,
      disabledBulletBorderColor: DISABLED_COLOR,
      offLabelColor: TEXT_SECONDARY,
      onLabelColor: TEXT_PRIMARY,
      onBackgroundColor: SUCCESS_COLOR,
      switchBackground: BG_DARK,
      disabledBackground: `${DISABLED_COLOR}40`,
      disabledOnBackground: `${DISABLED_COLOR}40`,
    },
    dropdownSelector: {
      hoverText: PRIMARY,
      backgroundColor: BG_DARK,
      hoverBG: ACTIVE_NAV_BG,
      selectedBGColor: ACTIVE_NAV_BG,
      selectedTextColor: PRIMARY,
      optionTextColor: TEXT_PRIMARY,
      disabledText: DISABLED_COLOR,
    },
    readBox: {
      borderColor: BORDER_COLOR,
      backgroundColor: BG_DARK,
      textColor: TEXT_PRIMARY,
    },
  };
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
