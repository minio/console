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

import React, { useState } from "react";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { IWizardMain } from "./types";
import WizardPage from "./WizardPage";
import { Grid, Paper } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    wizardMain: {
      display: "flex",
      width: "100%",
      flexGrow: 1,
    },
    wizFromContainer: {
      marginTop: "32px",
    },
    wizardSteps: {
      minWidth: 180,
      marginRight: 10,
      "& ul": {
        padding: "0px 15px 0 30px",
        marginTop: "0px",

        "& li": {
          listStyle: "lower-roman",
          marginBottom: 12,
        },
      },
    },
    buttonList: {
      backgroundColor: "transparent",
      border: "none",
      cursor: "pointer",
      "&:not(:disabled):hover": {
        textDecoration: "underline",
      },
      "&:selected, &:active, &:focus, &:focus:active": {
        border: "none",
        outline: 0,
        boxShadow: "none",
      },
    },
    paddedGridItem: {
      padding: "0px 10px 0px 10px",
    },
    menuPaper: {
      padding: "20px",
    },
    paperContainer: {
      padding: "10px",
      maxWidth: "900px",
    },
  });

const GenericWizard = ({ classes, wizardSteps }: IWizardMain) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const pageChange = (toElement: string | number) => {
    const lastPage = wizardSteps.length - 1;

    if (toElement === "++") {
      let nextPage = currentStep + 1;

      if (nextPage > lastPage) {
        nextPage = lastPage;
      }

      setCurrentStep(nextPage);
    }

    if (toElement === "--") {
      let prevPage = currentStep - 1;

      if (prevPage < 0) {
        prevPage = 0;
      }

      setCurrentStep(prevPage);
    }

    if (typeof toElement === "number") {
      let pg = toElement;
      if (toElement < 0) {
        pg = 0;
      }

      if (toElement > lastPage) {
        pg = lastPage;
      }

      setCurrentStep(pg);
    }
  };

  if (wizardSteps.length === 0) {
    return null;
  }

  return (
    <Grid container className={classes.wizFromContainer}>
      <Grid
        item
        xs={12}
        sm={3}
        md={3}
        lg={3}
        xl={2}
        className={classes.paddedGridItem}
      >
        <Paper className={classes.menuPaper}>
          <div className={classes.wizardSteps}>
            <ul>
              {wizardSteps.map((step, index) => {
                return (
                  <li key={`wizard-${index.toString()}`}>
                    <button
                      onClick={() => pageChange(index)}
                      disabled={index > currentStep}
                      className={classes.buttonList}
                    >
                      {step.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </Paper>
      </Grid>
      <Grid
        item
        xs={12}
        sm={9}
        md={9}
        lg={9}
        xl={10}
        className={classes.paddedGridItem}
      >
        <Paper className={classes.paperContainer}>
          <WizardPage page={wizardSteps[currentStep]} pageChange={pageChange} />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(GenericWizard);
