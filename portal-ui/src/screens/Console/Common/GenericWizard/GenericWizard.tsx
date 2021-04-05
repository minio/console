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

import React, { useState, Fragment } from "react";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { IWizardMain } from "./types";
import WizardPage from "./WizardPage";
import { Grid } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    wizardMain: {
      display: "flex",
      width: "100%",
      height: "100%",
      flexGrow: 1,
    },
    wizFromContainer: {
      height: "calc(100vh - 365px)",
      minHeight: 450,
      padding: "0 30px",
    },
    wizFromModal: {
      position: "relative",
    },
    wizardSteps: {
      minWidth: 180,
      marginRight: 10,
      borderRight: "#eaeaea 1px solid",
      display: "flex",
      flexGrow: 1,
      flexDirection: "column",
      height: "100%",
      "& ul": {
        padding: "0 15px 0 40px",
        marginTop: 0,

        "& li": {
          listStyle: "lower-roman",
          marginBottom: 12,
        },
      },
    },
    modalWizardSteps: {
      padding: 5,
      borderBottom: "#eaeaea 1px solid",
      "& ul": {
        padding: 0,
        marginTop: 0,
        display: "flex",
        justifyContent: "space-evenly",

        "& li": {
          listStyle: "lower-roman",
          "&::marker": {
            paddingLeft: 15,
          },
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
    paddedContentGrid: {
      padding: "0 10px",
    },
    stepsLabel: {
      fontSize: 20,
      color: "#393939",
      fontWeight: 600,
      margin: "15px 12px",
      "&.stepsModalTitle": {
        textAlign: "center",
        width: "100%",
        marginTop: 0,
        marginBottom: 10,
      },
    },
    stepsMasterContainer: {
      position: "sticky",
      top: 0,
      backgroundColor: "#FFFFFF",
      width: "100%",
      maxHeight: 90,
    },
  });

const GenericWizard = ({
  classes,
  wizardSteps,
  loadingStep,
  forModal,
}: IWizardMain) => {
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

  const stepsList = () => {
    return (
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
    );
  };

  return (
    <Grid
      container
      className={forModal ? classes.wizFromModal : classes.wizFromContainer}
    >
      {forModal ? (
        <Fragment>
          <div className={classes.stepsMasterContainer}>
            <div className={`${classes.stepsLabel} stepsModalTitle`}>Steps</div>
            <div className={classes.modalWizardSteps}>{stepsList()}</div>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <Grid item xs={12} sm={3} md={3} lg={3} xl={2}>
            <div className={classes.wizardSteps}>
              <span className={classes.stepsLabel}>Steps</span>
              {stepsList()}
            </div>
          </Grid>
        </Fragment>
      )}

      <Grid
        item
        xs={12}
        sm={forModal ? 12 : 9}
        md={forModal ? 12 : 9}
        lg={forModal ? 12 : 9}
        xl={forModal ? 12 : 10}
        className={forModal ? "" : classes.paddedContentGrid}
      >
        <WizardPage
          page={wizardSteps[currentStep]}
          pageChange={pageChange}
          loadingStep={loadingStep}
          forModal={forModal}
        />
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(GenericWizard);
