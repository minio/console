// This file is part of MinIO Console Server
// Copyright (c) 2020 MinIO, Inc.
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

const styles = (theme: Theme) =>
  createStyles({
    wizardMain: {
      display: "flex",
      width: "100%",
      flexGrow: 1,
    },
    wizardSteps: {
      minWidth: 180,
      marginRight: 10,
      "& ul": {
        padding: "0 15px 0 0",

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
    wizardContainer: {
      flexGrow: 1,
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
    <div className={classes.wizardMain}>
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
      <div className={classes.wizardContainer}>
        <WizardPage page={wizardSteps[currentStep]} pageChange={pageChange} />
      </div>
    </div>
  );
};

export default withStyles(styles)(GenericWizard);
