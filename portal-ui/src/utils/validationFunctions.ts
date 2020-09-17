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

export interface IValidation {
  fieldKey: string;
  required: boolean;
  pattern?: RegExp;
  customPatternMessage?: string;
  customValidation?: boolean;
  customValidationMessage?: string;
  value: string;
}

export const commonFormValidation = (fieldsValidate: IValidation[]) => {
  let returnErrors: any = {};

  fieldsValidate.forEach((field) => {
    if (field.required && field.value.trim() === "") {
      returnErrors[field.fieldKey] = "Field cannot be empty";
      return;
    }

    if (field.customValidation && field.customValidationMessage) {
      returnErrors[field.fieldKey] = field.customValidationMessage;
      return;
    }

    if (field.pattern && field.customPatternMessage) {
      const rgx = new RegExp(field.pattern, "g");

      if (!field.value.match(rgx)) {
        returnErrors[field.fieldKey] = field.customPatternMessage;
      }
      return;
    }
  });

  return returnErrors;
};
