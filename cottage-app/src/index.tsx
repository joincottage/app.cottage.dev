import * as React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import theme from "./theme";
import CreateTask from "./pages/create-task";
import TaskDetails from "./pages/task-details";
import TaskOverview from "./pages/task-overview";
import ReviewSubmission from "./pages/review-submission";

const components: Record<string, () => JSX.Element | null> = {
  "create-task": CreateTask,
  "review-submission": ReviewSubmission,
  "task-details": TaskDetails,
  "task-overview": TaskOverview,
};

function renderPage(pageName: string) {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error('Could not find <div id="roo"></div> in document');
    return;
  }

  console.log(`rendering ${pageName}`);

  const PageComponent = components[pageName];
  if (!PageComponent) {
    console.error("could not find component for pageName: " + pageName);
    return;
  }

  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <PageComponent />
        </LocalizationProvider>
      </ThemeProvider>
    </StrictMode>
  );
}

window.Cottage = window.Cottage || {};
window.Cottage.renderPage = renderPage;

//if (process.env.REACT_APP_TEST_ENV === "dev") {
renderPage("task-details");
//}
