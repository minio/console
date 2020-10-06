import { createMuiTheme } from "@material-ui/core";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#073052",
      main: "#081C42",
      dark: "#05122B",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff7961",
      main: "#f44336",
      dark: "#ba000d",
      contrastText: "#000",
    },
    error: {
      light: "#e03a48",
      main: "#dc1f2e",
      contrastText: "#ffffff",
    },
    grey: {
      100: "#f0f0f0",
      200: "#e6e6e6",
      300: "#cccccc",
      400: "#999999",
      500: "#8c8c8c",
      600: "#737373",
      700: "#666666",
      800: "#4d4d4d",
      900: "#333333",
    },
    background: {
      default: "#F4F4F4",
    },
  },
  typography: {
    fontFamily: ["Lato", "sans-serif"].join(","),
    h1: {
      fontWeight: "bold",
      color: "#081C42",
    },
    h2: {
      fontWeight: "bold",
      color: "#081C42",
    },
    h3: {
      fontWeight: "bold",
      color: "#081C42",
    },
    h4: {
      fontWeight: "bold",
      color: "#201763",
    },
    h5: {
      fontWeight: "bold",
      color: "#081C42",
    },
    h6: {
      fontWeight: "bold",
      color: "#000000",
    },
  },
});

export default theme;
