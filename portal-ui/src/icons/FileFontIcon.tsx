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

const FileFontIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-19.281 0 256 256"
    >
      <path
        data-name="Trazado 450"
        d="M217.001 77.194c.388-15.754.958-32.241-.5-47.941-1.094-11.755-6.193-21.736-17.831-25.914a42.392 42.392 0 00-5.017-1.448c-6.549-1.478-13.432-1.6-20.09-1.8-11.726-.343-23.448.365-35.175.314-23.493-.1-46.985.323-70.479.414q-4.228.016-8.456.017H17.247A17.26 17.26 0 00.007 18.077v220.678a17.259 17.259 0 0017.24 17.241h182.541a17.259 17.259 0 0017.241-17.241V128.812c-.007-17.183-.454-34.458-.028-51.618zm-20.922 145.988a14.888 14.888 0 01-14.888 14.888H32.823a14.888 14.888 0 01-14.888-14.888V33.658A14.888 14.888 0 0132.823 18.77h99.548v25.459a37.8 37.8 0 0037.757 37.759h25.951zm0-157.656h-25.951a21.321 21.321 0 01-21.3-21.3V18.767h32.359a14.888 14.888 0 0114.888 14.888z"
      />
      <path
        data-name="Trazado 451"
        d="M163.558 83.837a8.758 8.758 0 00-9.014 8.572c-.094 3.782-4.306 9.1-10.941 11.105-12.038 3.631-30.066 2.206-43.232 1.163-4.439-.351-8.273-.655-11.49-.746-10.771-.3-17.189 3.835-20.7 7.365-5.5 5.526-7.347 12.842-7.571 20.381-.1 3.232-.545 6.4 1.436 9.188a8.729 8.729 0 007.057 3.66h1.932c3.206 0 5.272-2.557 6.179-5.394.88-2.755.889-5.681 1.086-8.538.174-2.509.518-5.1 2.416-6.953 1.544-1.508 4.119-2.224 7.659-2.122 2.773.08 6.4.366 10.605.7 2.125.168 4.374.344 6.7.509a283.573 283.573 0 01-1.593 29.877H79.006a8.8 8.8 0 00-8.8 8.8 8.8 8.8 0 008.8 8.8h22.449c-2.426 12.2-6.025 22.628-11.124 27.883-2.627 2.707-4.779 3.054-6.362 3.054-7.431 0-8.671-5.945-8.75-9.4a8.8 8.8 0 00-8.8-8.8 8.8 8.8 0 00-8.8 8.792 32.282 32.282 0 003.064 12.92c4.373 9.077 12.64 14.074 23.28 14.075a26.113 26.113 0 0018.985-8.395c8.565-8.827 13.551-24.242 16.438-40.135h18.471a8.8 8.8 0 008.8-8.8 8.8 8.8 0 00-8.8-8.8h-16.049c1.153-11.616 1.425-22.208 1.444-29.165 8.812-.018 17.721-.757 25.42-3.079 13.5-4.074 23.143-15.385 23.447-27.508a8.8 8.8 0 00-8.561-9.009z"
      />
    </svg>
  );
};

export default FileFontIcon;
