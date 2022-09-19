import { createTheme } from "@mui/material";

export default createTheme({
  palette: {
    mode: "dark",
    primary: {
      light: "rgb(38, 97, 246)",
      main: "rgb(38, 97, 246)",
      dark: "rgb(38, 97, 246)",
    },
    background: {
      default: "rgb(32, 35, 39)",
      paper: "rgb(32, 35, 39)",
    },
    info: {
      light: "#ccc",
      main: "#ccc",
      dark: "#ccc",
    },
    text: {
      primary: "#ccc",
      secondary: "#ccc",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        // Name of the slot
        root: {
          borderRadius: "32px",
          padding: "6px 20px",
        },
      },
    },
  },
});
