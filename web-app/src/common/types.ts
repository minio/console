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

export interface ErrorResponseHandler {
  errorMessage: string;
  detailedError: string;
  statusCode?: number;
}

interface IEmbeddedCustomButton {
  backgroundColor: string;
  textColor: string;
  hoverColor: string;
  hoverText: string;
  activeColor: string;
  activeText: string;
  disabledColor: string;
  disabledText: string;
}

interface IEmbeddedCustomTable {
  border: string;
  disabledBorder: string;
  disabledBG: string;
  selected: string;
  deletedDisabled: string;
  hoverColor: string;
}

interface IEmbeddedInputBox {
  border: string;
  hoverBorder: string;
  textColor: string;
  backgroundColor: string;
}

interface IEmbeddedSwitch {
  switchBackground: string;
  bulletBorderColor: string;
  bulletBGColor: string;
  disabledBackground: string;
  disabledBulletBorderColor: string;
  disabledBulletBGColor: string;
}

export interface IEmbeddedCustomStyles {
  backgroundColor: string;
  fontColor: string;
  secondaryFontColor: string;
  borderColor: string;
  loaderColor: string;
  boxBackground: string;
  okColor: string;
  errorColor: string;
  warnColor: string;
  linkColor: string;
  disabledLinkColor: string;
  hoverLinkColor: string;
  tableColors: IEmbeddedCustomTable;
  buttonStyles: IEmbeddedCustomButton;
  secondaryButtonStyles: IEmbeddedCustomButton;
  regularButtonStyles: IEmbeddedCustomButton;
  inputBox: IEmbeddedInputBox;
  switch: IEmbeddedSwitch;
}
