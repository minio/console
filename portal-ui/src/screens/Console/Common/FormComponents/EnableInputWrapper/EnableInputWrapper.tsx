import React, { useState, Fragment } from "react";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { searchField } from "../common/styleLibrary";
import FormSwitchWrapper from "../FormSwitchWrapper/FormSwitchWrapper";

interface IEnableInputWrapper {
  classes: any;
  value: string;
  onChange: (txtVar: string) => any;
  label: string;
  placeholder?: string;
  id: string;
  name: string;
}

const styles = (theme: Theme) =>
  createStyles({
    searchField: {
      ...searchField.searchField,
      height: 30,
      padding: 0,
      "& input": {
        padding: "0 12px",
        height: 28,
        fontSize: 12,
        fontWeight: 600,
        color: "#393939",
      },
      "&.isDisabled": {
        "&:hover": {
          borderColor: "#EAEDEE",
        },
      },
      "& input.Mui-disabled": {
        backgroundColor: "#EAEAEA",
      },
    },
    labelStyle: {
      color: "#393939",
      fontSize: 12,
      marginBottom: 4,
    },
    buttonKit: {
      display: "flex",
      alignItems: "center",
    },
    toggleButton: {
      marginRight: 10,
    },
    switcherContainer: {
      flexGrow: 1,
      margin: "0 15px",
    },
  });

const EnableInputWrapper = ({
  classes,
  label,
  onChange,
  value,
  placeholder = "",
  id,
  name,
}: IEnableInputWrapper) => {
  const [inputEnabled, setInputEnabled] = useState<boolean>(false);

  const inputToggle = (checked: boolean) => {
    setInputEnabled(checked);

    if (!checked) {
      onChange("");
    }
  };

  return (
    <Fragment>
      <div className={classes.switcherContainer}>
        <div className={classes.labelStyle}>{label}</div>
        <div className={classes.buttonKit}>
          <FormSwitchWrapper
            id={`frm-switch-${id}`}
            name={`frm-switch-${name}`}
            value={"enabled"}
            checked={inputEnabled}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              inputToggle(event.target.checked);
            }}
            label={""}
            switchOnly
          />
          <TextField
            placeholder={placeholder}
            id={id}
            name={name}
            label=""
            onChange={(val) => {
              onChange(val.target.value);
            }}
            InputProps={{
              disableUnderline: true,
            }}
            className={`${classes.searchField} ${
              !inputEnabled ? "isDisabled" : ""
            }`}
            value={value}
            disabled={!inputEnabled}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default withStyles(styles)(EnableInputWrapper);
