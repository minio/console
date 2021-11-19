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

const FileImageIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-19.298 0 256.227 256.227"
    >
      <path
        data-name="Trazado 422"
        d="M217.188 77.262c.389-15.768.96-32.27-.5-47.984-1.095-11.766-6.2-21.754-17.847-25.937a42.717 42.717 0 00-5.02-1.449c-6.556-1.479-13.445-1.6-20.108-1.8-11.737-.344-23.47.366-35.207.314-23.515-.1-47.027.324-70.541.415q-4.232.017-8.464.017H17.258A17.275 17.275 0 00.002 18.094v220.875a17.2 17.2 0 005.189 12.314v.035h.037a17.19 17.19 0 0012.027 4.907h182.7a17.275 17.275 0 0017.256-17.256V128.926c.002-17.198-.444-34.49-.023-51.664zM148.96 18.786h32.387a14.9 14.9 0 0114.9 14.9v31.9h-25.974a21.339 21.339 0 01-21.313-21.315zm-116.114 0h99.637v25.481a37.835 37.835 0 0037.79 37.792h25.974v94.9l-15.227-26.374a28.351 28.351 0 00-24.8-14.32 28.388 28.388 0 00-24.85 14.4l-10.021 17.81-27.633-47.861a28.351 28.351 0 00-24.8-14.319 28.389 28.389 0 00-24.85 14.4L17.95 167.117V33.687a14.9 14.9 0 0114.896-14.901zm-9.864 215.74a14.853 14.853 0 01-1.692-1.746l-1.561-34.31 39.036-69.391a11.6 11.6 0 0110.146-5.857 11.6 11.6 0 0110.146 5.857l61.387 106.324zm158.364 3.754h-19.7l-30.466-52.769 14.889-26.465a11.6 11.6 0 0110.146-5.858 11.6 11.6 0 0110.146 5.858l29.884 51.762v12.57a14.9 14.9 0 01-14.898 14.902z"
      />
      <path
        data-name="Trazado 423"
        d="M69.379 96.211a33.381 33.381 0 0033.343-33.344 33.382 33.382 0 00-33.343-33.344 33.381 33.381 0 00-33.344 33.344 33.381 33.381 0 0033.344 33.344zm0-49.763a16.438 16.438 0 0116.418 16.419 16.438 16.438 0 01-16.418 16.419A16.438 16.438 0 0152.96 62.867a16.437 16.437 0 0116.419-16.419z"
      />
    </svg>
  );
};

export default FileImageIcon;
