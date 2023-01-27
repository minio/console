import React from "react";
import { Stack } from "@mui/material";
import HelpTip from "../../HelpTip";
import { Grid } from "mds";

type LabelValuePairProps = {
  label?: any;
  value?: any;
  orientation?: any;
  stkProps?: any;
  lblProps?: any;
  valProps?: any;
  helpTipID?: string;
};

const LabelValuePair = ({
  label = null,
  value = "-",
  orientation = "column",
  stkProps = {},
  lblProps = {},
  valProps = {},
  helpTipID,
}: LabelValuePairProps) => {
  return (
    <Stack direction={{ xs: "column", sm: orientation }} {...stkProps}>
      <Grid
        container
        direction="column"
        sx={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "flex-start",
        }}
      >
        <Grid item data-tooltip-id={helpTipID}>
          <label style={{ marginRight: 5, fontWeight: 600 }} {...lblProps}>
            {label}
          </label>
        </Grid>
        <Grid item>
          <label style={{ marginRight: 5, fontWeight: 500 }} {...valProps}>
            {value}
          </label>
        </Grid>
      </Grid>
      <HelpTip helpTipID={helpTipID} position="right" />
    </Stack>
  );
};

export default LabelValuePair;
