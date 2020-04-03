// This file is part of MinIO Console Server
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
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";

const styles = (theme: Theme) =>
    createStyles({
        seeMore: {
            marginTop: theme.spacing(3)
        },
        paper: {
            // padding: theme.spacing(2),
            display: "flex",
            overflow: "auto",
            flexDirection: "column"
        },
        addSideBar: {
            width: "320px",
            padding: "20px"
        },
        errorBlock: {
            color: "red"
        },
        tableToolbar: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(0)
        },
        wrapCell: {
            maxWidth: "200px",
            whiteSpace: "normal",
            wordWrap: "break-word"
        },
        minTableHeader: {
            color: "#393939",
            "& tr": {
                "& th": {
                    fontWeight:'bold'
                }
            }
        },
        actionsTray: {
            textAlign: "right",
            "& button": {
                marginLeft: 10,
            }
        },
        searchField: {
            background: "#FFFFFF",
            padding: 12,
            borderRadius: 5,
            boxShadow: "0px 3px 6px #00000012",
        }
    });

const Groups = () => {
    return (<React.Fragment>
        Groups Page
    </React.Fragment>)
};

export default withStyles(styles)(Groups);
