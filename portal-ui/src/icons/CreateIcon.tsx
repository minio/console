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
class CreateIcon extends React.Component {
    render() {
        return (<SvgIcon>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                <title>ic_h_create-new_sl</title>
                <g id="Layer_2" data-name="Layer 2">
                    <g id="Layer_1-2" data-name="Layer 1">
                        <path className="cls-1"
                              d="M0,0V16H16V0ZM11.886,9.048H9.048v2.838h-2.1V9.048H4.114v-2.1H6.952V4.114h2.1V6.952h2.838Z"/>
                    </g>
                </g>
            </svg>
        </SvgIcon>)
    }
}

export default CreateIcon;
