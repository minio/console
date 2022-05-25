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

import React, { SVGProps } from "react";

const AzureTierIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`min-icon`}
      fill={"currentcolor"}
      viewBox="0 0 47.137 36.516"
      {...props}
    >
      <g id="azure-logo-color" transform="translate(-437.603 -471.382)">
        <g id="layer1-1" transform="translate(437.603 471.382)">
          <path
            id="path21"
            d="M459.411,505.944c6.055-1.07,11.056-1.953,11.115-1.965l.1-.024-5.717-6.8c-3.143-3.74-5.717-6.815-5.717-6.831,0-.032,5.9-16.291,5.936-16.347.012-.019,4.03,6.919,9.738,16.812,5.347,9.266,9.755,16.9,9.8,16.975l.075.132-18.168,0-18.169,0S459.411,505.944,459.411,505.944ZM437.6,503.868c0-.008,2.693-4.686,5.987-10.391l5.987-10.375,6.978-5.856c3.839-3.219,6.986-5.86,7-5.864a1.448,1.448,0,0,1-.112.282c-.075.159-3.485,7.471-7.574,16.247l-7.44,15.957-5.41.008C440.037,503.884,437.6,503.88,437.6,503.868Z"
            transform="translate(-437.603 -471.382)"
            fill="#2a94dc"
          />
        </g>
      </g>
    </svg>
  );
};

export default AzureTierIcon;
