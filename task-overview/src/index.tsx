import React from "react";
import ReactDOM from "react-dom/client";
import TaskOverview from "./TaskOverview";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
  dsn: "https://36ee1b71974e4741be97e5862ac69da1@o1125793.ingest.sentry.io/6553329",
  integrations: [new BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

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
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <TaskOverview />
    </ThemeProvider>
  </React.StrictMode>
);
