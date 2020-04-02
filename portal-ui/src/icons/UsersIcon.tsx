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
class UsersIcon extends React.Component {
    render() {
        return (<SvgIcon>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 14.874">
                <title>ic_users</title>
                <g id="Layer_2" data-name="Layer 2">
                    <g id="Layer_1-2" data-name="Layer 1">
                        <path className="cls-1"
                              d="M3.5,6.875h0a3.5,3.5,0,0,1,3.5,3.5v4.5a0,0,0,0,1,0,0H0a0,0,0,0,1,0,0v-4.5A3.5,3.5,0,0,1,3.5,6.875Z"/>
                        <path className="cls-1"
                              d="M12.5,6.875h0a3.5,3.5,0,0,1,3.5,3.5v4.5a0,0,0,0,1,0,0H9a0,0,0,0,1,0,0v-4.5A3.5,3.5,0,0,1,12.5,6.875Z"/>
                        <circle className="cls-1" cx="3.498" cy="2.859" r="2.859"/>
                        <circle className="cls-1" cx="12.502" cy="2.859" r="2.859"/>
                    </g>
                </g>
            </svg>
        </SvgIcon>)
    }
}

export default UsersIcon;
