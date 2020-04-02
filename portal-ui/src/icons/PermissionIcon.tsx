// This file is part of MinIO Kubernetes Cloud
// Copyright (c) 2019 MinIO, Inc.
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

import React from "react";
import {SvgIcon} from "@material-ui/core";
class PermissionIcon extends React.Component {
    render() {
        return (<SvgIcon>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 16">
                <title>ic_permissions</title>
                <g id="Layer_2" data-name="Layer 2">
                    <g id="Layer_1-2" data-name="Layer 1">
                        <polygon className="cls-1" points="14 16 7.035 12.13 0 16 0 0 14 0 14 16"/>
                    </g>
                </g>
            </svg>
        </SvgIcon>)
    }
}

export default PermissionIcon;
