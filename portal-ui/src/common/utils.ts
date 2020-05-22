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

export const units = [
  "B",
  "KiB",
  "MiB",
  "GiB",
  "TiB",
  "PiB",
  "EiB",
  "ZiB",
  "YiB",
];
export const niceBytes = (x: string) => {
  let l = 0,
    n = parseInt(x, 10) || 0;

  while (n >= 1024 && ++l) {
    n = n / 1024;
  }
  //include a decimal point and a tenths-place digit if presenting
  //less than ten of KB or greater units
  return n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + units[l];
};

export const setCookie = (name: string, val: string) => {
  const date = new Date();
  const value = val;

  // Set it expire in 45 minutes
  date.setTime(date.getTime() + 45 * 60 * 1000);

  // Set it
  document.cookie =
    name + "=" + value + "; expires=" + date.toUTCString() + "; path=/";
};

// timeFromdate gets time string from date input
export const timeFromDate = (d: Date) => {
  let h = d.getHours() < 10 ? `0${d.getHours()}` : `${d.getHours()}`;
  let m = d.getMinutes() < 10 ? `0${d.getMinutes()}` : `${d.getMinutes()}`;
  let s = d.getSeconds() < 10 ? `0${d.getSeconds()}` : `${d.getSeconds()}`;

  return `${h}:${m}:${s}:${d.getMilliseconds()}`;
};

// units to be used in a dropdown
export const factorForDropdown = () => {
  return units.map((unit) => {
    return { label: unit, value: unit };
  });
};

//getBytes, converts from a value and a unit from units array to bytes
export const getBytes = (value: string, unit: string) => {
  const vl: number = parseFloat(value);
  const powFactor = units.findIndex((element) => element === unit);

  if (powFactor == -1) {
    return 0;
  }
  const factor = Math.pow(1024, powFactor);
  const total = vl * factor;

  return total.toString(10);
};

//getTotalSize gets the total size of a value & unit
export const getTotalSize = (value: string, unit: string) => {
  const bytes = getBytes(value, unit).toString(10);
  return niceBytes(bytes);
};
