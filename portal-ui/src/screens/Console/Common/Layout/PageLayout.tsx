import React from "react";
import { Grid } from "@mui/material";

type PageLayoutProps = {
  className?: string;
  variant?: "constrained" | "full";
  children: any;
  noPadding?: boolean;
};

const PageLayout = ({
  className = "",
  children,
  variant = "constrained",
  noPadding = false,
}: PageLayoutProps) => {
  let style = variant === "constrained" ? { maxWidth: 1220 } : {};
  return (
    <div
      style={{
        padding: noPadding ? 0 : "2rem",
      }}
    >
      <Grid container>
        <Grid item xs={12} className={className} style={style}>
          {children}
        </Grid>
      </Grid>
    </div>
  );
};

export default PageLayout;
