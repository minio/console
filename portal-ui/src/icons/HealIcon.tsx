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

const HealIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
    >
      <defs>
        <clipPath id="prefix__a">
          <path d="M0 0h256v256H0z" />
        </clipPath>
      </defs>
      <g clipPath="url(#prefix__a)">
        <path
          data-name="heal-icn"
          d="M157.75 238.818l-4.719-4.727-24.812-24.7-29.438 29.427a57.488 57.488 0 01-81.312 0 57.4 57.4 0 010-81.422l29.438-29.422-24.813-24.819-4.625-4.609a57.4 57.4 0 010-81.43c21.719-21.82 59.625-21.82 81.313 0l4.719 4.625 24.719 24.8 29.531-29.43c21.719-21.82 59.594-21.82 81.313 0a57.4 57.4 0 010 81.43l-29.437 29.43 24.813 24.688 4.625 4.734a57.535 57.535 0 11-81.312 81.422zm13.625-22.937l4.563 4.609c12.125 11.977 32.938 11.977 44.938 0a31.782 31.782 0 000-44.766l-4.781-4.727zM35.719 175.724a31.63 31.63 0 000 44.766c11.938 11.977 32.875 11.977 44.875 0L110 191.068l-44.906-44.9zm22.906-72.569l6.469 6.492 81.469 81.422 6.469 6.477 44.875-44.883-6.469-6.492L110 64.88l-6.5-6.492zm117.312-67.7l-29.375 29.43 44.875 44.766 29.438-29.43a31.426 31.426 0 009.219-22.445 31.112 31.112 0 00-9.219-22.32 32.365 32.365 0 00-44.937 0zm-140.219 0a31.045 31.045 0 00-9.281 22.32 31.357 31.357 0 009.281 22.445l4.719 4.735 44.75-44.9-4.593-4.6a31.593 31.593 0 00-44.875 0zm105.344 117.956a12.7 12.7 0 1112.719 12.836 12.775 12.775 0 01-12.719-12.836zM115.5 127.974a12.781 12.781 0 1112.719 12.719 12.707 12.707 0 01-12.719-12.719zm-25.437-25.57a12.719 12.719 0 1112.688 12.844 12.757 12.757 0 01-12.689-12.845z"
          stroke="rgba(0,0,0,0)"
          strokeMiterlimit={10}
        />
      </g>
    </svg>
  );
};

export default HealIcon;
