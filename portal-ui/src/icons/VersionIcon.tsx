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

import * as React from "react";
import { SVGProps } from "react";

const VersionIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-63.2625 0 250.048 250.048"
    >
      <path d="M122.868 61.247q-9.479-15.673-19.012-31.309c-3.3-5.408-6.654-10.786-10-16.167l-1.325-1.954c-6.086-9.265-18.136-15.384-29.822-9.5-10.457 5.262-14.978 17.8-9.618 28.2 2.035 3.947 5.414 7.281 8.518 10.58 9.561 10.159 19.427 20.03 28.91 30.258a29.852 29.852 0 01-10.4 48.02l-.636.26V72.047a154.076 154.076 0 00-44.533 34.5c-19.719 22-31.377 49.48-34.95 69.532 10.834-5.516 21.518-10.959 32.206-16.4 10.708-5.444 21.342-10.792 32.457-16.439v91.767l14.825 15.04V135.519s.338-.161 1.449-.756c4.371-2.328 8.957-4.368 12.991-7.195a43.9 43.9 0 006.439-66.377C89.354 49.673 78.29 38.206 67.292 26.676c-3.2-3.358-3.131-7.607-.009-10.574 3.045-2.9 7.4-2.65 10.625.6 1.533 1.545 11.859 12.453 15.54 16.314q13.952 14.615 27.951 29.176a19.907 19.907 0 001.545 1.324l.58-.341a9.257 9.257 0 00-.656-1.928zm-58.237 64.956a2.675 2.675 0 01-1.356 1.808c-5.895 3.125-11.838 6.167-17.775 9.217-7.041 3.619-14.092 7.219-21.642 11.091a140.009 140.009 0 0140.548-50.246l.263-.218c.011 9.192.044 19.154-.038 28.348z" />
    </svg>
  );
};

export default VersionIcon;
