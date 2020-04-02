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
class DeleteIcon extends React.Component {
    render() {
        return (<SvgIcon>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                <title>ic_h_delete</title>
                <g id="Layer_2" data-name="Layer 2">
                    <g id="Layer_1-2" data-name="Layer 1">
                        <path className="cls-1"
                              d="M0,8H0a8,8,0,0,0,8,8H8a8,8,0,0,0,8-8h0A8,8,0,0,0,8,0H8A8,8,0,0,0,0,8Zm10.007,3.489L8,9.482,5.993,11.489,4.511,10.007,6.518,8,4.511,5.993,5.993,4.511,8,6.518l2.007-2.007,1.482,1.482L9.482,8l2.007,2.007Z"/>
                    </g>
                </g>
            </svg>
        </SvgIcon>)
    }
}

export default DeleteIcon;
