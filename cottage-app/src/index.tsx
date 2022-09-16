import * as React from "react";
import { StrictMode, useMemo, useReducer } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import theme from "./theme";
import CreateTask from "./pages/create-task";
import TaskDetails from "./pages/task-details";
import TaskOverview from "./pages/task-overview";
import ReviewSubmission from "./pages/review-submission";
import Portfolio from "./pages/portfolio";
import { AppDataContext, initialState } from "./state/AppContext";
import appReducer from "./state/AppReducer";

const components: Record<string, () => JSX.Element | null> = {
  "portfolio": Portfolio,
  "create-task": CreateTask,
  "review-submission": ReviewSubmission,
  "task-details": TaskDetails,
  "task-overview": TaskOverview,
};

function AppProviders({ children }: { children: JSX.Element }) {
  // @ts-ignoreS
  const [state, dispatch] = useReducer(appReducer, initialState);
  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]) as AppContext;

  return (
    <AppDataContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {children}
        </LocalizationProvider>
      </ThemeProvider>
    </AppDataContext.Provider>
  );
}

function renderPage(pageName: string) {
  console.log(`rendering ${pageName}`);

  const PageComponent = components[pageName];
  if (!PageComponent) {
    console.error("could not find component for pageName: " + pageName);
    return;
  }

  const rootElement = document.createElement("div");
  rootElement.setAttribute("id", pageName);
  document.body.appendChild(rootElement);

  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <AppProviders> 
        <PageComponent />
      </AppProviders> 
    </StrictMode>
  );
}

window.Cottage = window.Cottage || {};
window.Cottage.renderPage = renderPage;

if (process.env.REACT_APP_TEST_ENV === "dev") {
  renderPage("portfolio");
}
