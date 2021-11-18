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

import React, { SVGProps } from "react";

const ConsoleLogo = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 121.755 29.822"
    >
      <path
        className="prefix__a"
        d="M15.647 15.935l-1.772 1.194a6.088 6.088 0 00-5.135-2.652 6.348 6.348 0 00-6.522 6.654 6.348 6.348 0 006.522 6.654 6.031 6.031 0 005.124-2.64l1.735 1.266a8.126 8.126 0 01-6.859 3.411A8.422 8.422 0 010 21.131a8.422 8.422 0 018.74-8.691 7.963 7.963 0 016.907 3.495zM35.641 21.131a8.422 8.422 0 01-8.74 8.691 8.422 8.422 0 01-8.739-8.691 8.421 8.421 0 018.739-8.691 8.422 8.422 0 018.74 8.691zm-15.261 0a6.347 6.347 0 006.521 6.654 6.347 6.347 0 006.521-6.654 6.347 6.347 0 00-6.521-6.654 6.347 6.347 0 00-6.521 6.654zM53.729 29.581h-1.917l-10.2-13.26-.012 13.248h-2.122V12.681h1.917l10.21 13.26V12.693h2.122zM69.551 16.02a8.835 8.835 0 00-5-1.555c-2.471 0-4.231 1.109-4.231 2.929 0 1.531 1.29 2.315 3.821 2.628l1.484.181c2.856.35 5.3 1.507 5.3 4.484 0 3.364-3.05 5.123-6.7 5.123a10.935 10.935 0 01-6.654-2.194l1.157-1.687a9.018 9.018 0 005.5 1.868c2.519 0 4.5-1.025 4.5-2.929 0-1.567-1.41-2.314-4.038-2.64l-1.567-.193c-2.784-.337-5-1.627-5-4.508 0-3.255 2.893-5.075 6.449-5.075a10.336 10.336 0 016.076 1.844zM91.268 21.131a8.422 8.422 0 01-8.74 8.691 8.422 8.422 0 01-8.739-8.691 8.421 8.421 0 018.739-8.691 8.422 8.422 0 018.74 8.691zm-15.261 0a6.348 6.348 0 006.521 6.654 6.347 6.347 0 006.521-6.654 6.347 6.347 0 00-6.521-6.654 6.348 6.348 0 00-6.521 6.654zM106.897 29.569h-11.79V12.693h2.122v14.863h9.668zM121.76 29.569h-11.982V12.693h11.862v1.988h-9.74v5.389h9.427v2H111.9v5.509h9.86zM14.9.167h2.576v7.547H14.9zM11.801.238l-5.23 3.194a.229.229 0 01-.242 0L1.099.238a.726.726 0 00-.374-.1H.719a.717.717 0 00-.717.717v6.864h2.574V4.462a.258.258 0 01.392-.22l2.931 1.793a.919.919 0 00.944.009L9.935 4.23a.258.258 0 01.388.222v3.267h2.575V.855a.717.717 0 00-.717-.717h-.006a.723.723 0 00-.374.1zM30.348.165h-2.613v3.463a.258.258 0 01-.379.228L20.585.249a.723.723 0 00-.337-.084.717.717 0 00-.717.717v6.832h2.592V4.306a.258.258 0 01.379-.227l6.8 3.606a.714.714 0 00.336.083.716.716 0 00.717-.717V.165zM32.439 7.712V.165h1.2v7.547zM40.536 7.878c-3.189 0-5.451-1.513-5.451-3.939S37.361 0 40.536 0s5.466 1.513 5.466 3.939-2.236 3.939-5.466 3.939zm0-6.87c-2.371 0-4.2 1.036-4.2 2.931s1.826 2.93 4.2 2.93 4.212-1.022 4.212-2.93-1.84-2.931-4.212-2.931z"
      />
    </svg>
  );
};

export default ConsoleLogo;
