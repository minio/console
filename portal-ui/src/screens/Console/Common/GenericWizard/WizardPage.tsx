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

import React from "react";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { IWizardButton, IWizardPage } from "./types";
import { Button } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    wizardStepContainer: {
      display: "flex",
      flexDirection: "column",
    },
    wizardComponent: {
      height: 375,
      overflowY: "auto",
      marginBottom: 10,
    },
    buttonsContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end" as const,
      "& button": {
        marginLeft: 10,
      },
    },
  });

const WizardPage = ({ classes, page, pageChange }: IWizardPage) => {
  const buttonAction = (btn: IWizardButton) => {
    switch (btn.type) {
      case "next":
        pageChange("++");
        break;
      case "back":
        pageChange("--");
        break;
      case "to":
        pageChange(btn.toPage || 0);
      default:
    }

    if (btn.action) {
      btn.action();
    }
  };

  console.log("buttons", page);

  return (
    <div className={classes.wizardStepContainer}>
      <div className={classes.wizardComponent}>{page.componentRender}</div>
      <div className={classes.buttonsContainer}>
        {page.buttons.map((btn) => {
          return (
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => {
                buttonAction(btn);
              }}
              disabled={!btn.enabled}
              key={`button-${page.label}-${btn.label}`}
            >
              {btn.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default withStyles(styles)(WizardPage);
