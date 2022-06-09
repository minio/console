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

import React, { Fragment } from "react";
import InputBoxWrapper from "../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import FormSwitchWrapper from "../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import { Grid } from "@mui/material";
import { useDispatch } from "react-redux";
import createStyles from "@mui/styles/createStyles";
import { Theme } from "@mui/material/styles";
import withStyles from "@mui/styles/withStyles";

interface IEditSecurityContextProps {
    classes: any;
    runAsUser: string;
    runAsGroup: string;
    fsGroup: string;
    runAsNonRoot: boolean;
    setRunAsUser: any;
    setRunAsGroup: any;
    setFSGroup: any;
    setRunAsNonRoot: any;
}

const styles = () =>
  createStyles({
    tabsContainer: {
      display: "flex",
      height: "100%",
      width: "100%",
    },
    /*Below md breakpoint make it horizontal and style it for scrolling tabs*/
    "@media (max-width: 700px)": {
      tabsContainer: {
        flexFlow: "column",
        flexDirection: "column",
      },
    },
  });

const SecurityContextSelector = ({ classes, runAsGroup, runAsUser, fsGroup, runAsNonRoot, setRunAsUser, setRunAsGroup, setFSGroup, setRunAsNonRoot }: IEditSecurityContextProps ) => {
    const dispatch = useDispatch();
    return (
        <Fragment>
          <fieldset
              className={`${classes.fieldGroup} ${classes.fieldSpaceTop} `}
            >
              <legend className={classes.descriptionText}>
                SecurityContext 
              </legend>

              <Grid item xs={12}>
                <div
                  className={`${classes.multiContainer} ${classes.responsiveSectionItem} ${classes.tabsContainer}`}
                >
                  <div className={classes.configSectionItem}>
                    <InputBoxWrapper
                      type="number"
                      id="securityContext_runAsUser"
                      name="securityContext_runAsUser"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        dispatch(setRunAsUser(e.target.value));
                      }}          
                      label="Run As User"
                      value={runAsUser}
                      required                
                      min="0"
                    />
                  </div>
                  <div className={classes.configSectionItem}>
                    <InputBoxWrapper
                      type="number"
                      id="securityContext_runAsGroup"
                      name="securityContext_runAsGroup"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => { dispatch(setRunAsGroup(e.target.value));
                      }}
                      label="Run As Group"
                      value={runAsGroup}
                      required
                      min="0"
                    />
                  </div>
                  <div className={classes.configSectionItem}>
                    <InputBoxWrapper
                      type="number"
                      id="securityContext_fsGroup"
                      name="securityContext_fsGroup"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {dispatch(setFSGroup(e.target.value)); }}
                      label="FsGroup"
                      value={fsGroup}
                      required
                      min="0"
                    />
                  </div>
                </div>
              </Grid>
              <br />
              <Grid item xs={12}>
                <div className={classes.multiContainer}>
                  <FormSwitchWrapper
                    value="prometheusSecurityContextRunAsNonRoot"
                    id="prometheus_securityContext_runAsNonRoot"
                    name="prometheus_securityContext_runAsNonRoot"
                    checked={runAsNonRoot}
                    onChange={() => {
                      dispatch(setRunAsNonRoot(!runAsNonRoot));
                      }
                    }
                    label={"Do not run as Root"}
                  />
                </div>
              </Grid>
            </fieldset>
        </Fragment>
        );
};
export default withStyles(styles)(SecurityContextSelector);


    