// This file is part of MinIO Console Server
// Copyright (c) 2023 MinIO, Inc.
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

// helpInformationGenerator, this function tries to generate some generic release notes automatically from title in case no curated information is given.
export const helpInformationGenerator = (name: string) => {
  const lowCaseName = name.toLowerCase();

  let retInformation = [];

  if (lowCaseName.includes("bug") || lowCaseName.includes("security")) {
    if (lowCaseName.includes("security")) {
      retInformation.push("important security fixes");
    } else {
      if (lowCaseName.includes("critical bug")) {
        retInformation.push("critical bug fixes");
      } else if (lowCaseName.includes("bug")) {
        retInformation.push("important bug fixes");
      }
    }
  }

  if (lowCaseName.includes("feature")) {
    retInformation.push("new features");
  }

  let includeString = "";

  if (retInformation.length > 0) {
    includeString = retInformation.join(" as well as ");
  }

  return `This update provides ${
    includeString !== "" ? includeString : "new improvements"
  } for your MinIO instance`;
};
