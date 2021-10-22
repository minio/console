import { createTheme, adaptV4Theme } from "@mui/material";

const newTheme = createTheme(
  adaptV4Theme({
    palette: {
      primary: {
        light: "#0c4453",
        main: "#01262e",
        dark: "#001115",
        contrastText: "#fff",
      },
      secondary: {
        light: "#ff7961",
        main: "#f44336",
        dark: "#01262E",
        contrastText: "#000",
      },
      grey: {
        100: "#F7F7F7",
        200: "#D8DDDE",
        300: "#BAC3C5",
        400: "#9BA9AC",
        500: "#7C8F93",
        600: "#5D7479",
        700: "#3F5A60",
        800: "#204047",
        900: "#01262E",
      },
      background: {
        default: "#F4F4F4",
      },
      success: {
        main: "#32c787",
      },
      warning: {
        main: "#ffb300",
      },
      error: {
        light: "#e03a48",
        main: "#dc1f2e",
        contrastText: "#ffffff",
      },
    },
    typography: {
      fontFamily: ["Lato", "sans-serif"].join(","),
      h1: {
        fontWeight: "bold",
        color: "#01262E",
      },
      h2: {
        fontWeight: "bold",
        color: "#01262E",
      },
      h3: {
        fontWeight: "bold",
        color: "#01262E",
      },
      h4: {
        fontWeight: "bold",
        color: "#01262E",
      },
      h5: {
        fontWeight: "bold",
        color: "#01262E",
      },
      h6: {
        fontWeight: "bold",
        color: "#01262E",
      },
    },
  })
);

export default newTheme;
