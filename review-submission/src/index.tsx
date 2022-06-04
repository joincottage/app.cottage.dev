import React from "react";
import ReactDOM from "react-dom/client";
import ReviewSubmission from "./ReviewSubmission";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { orange } from "@mui/material/colors";

declare module "@mui/material/styles" {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

const theme = createTheme({
  palette: {
    primary: {
      light: "rgb(38, 97, 246)",
      main: "rgb(38, 97, 246)",
      dark: "rgb(38, 97, 246)",
    },
  },
  status: {
    danger: orange[500],
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

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ReviewSubmission />
    </ThemeProvider>
  </React.StrictMode>
);
