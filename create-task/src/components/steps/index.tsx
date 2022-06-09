import { Box } from "@mui/material";
import Stepper from "./Stepper";
import GithubLoginPage from "./GithubLogin";
import { Step } from "../../types/Step";
import React, { useMemo, useReducer } from "react";
import CreateTask from "./CreateTask";
import ImportRepository from "./ImportRepository";
import {
  AppAction,
  AppContext,
  AppDataContext,
  AppState,
  initialState,
} from "../../AppContext";
import { SET_SELECTED_TASKS } from "../../actions/setSelectedTasks";
import { SET_SELECTED_REPO } from "../../actions/setSelectedRepo";
import { SET_ACTIVE_STEP } from "../../actions/setActiveStep";

function appReducer(state: AppState, action: AppAction) {
  switch (action.type) {
    case SET_SELECTED_TASKS:
      return {
        ...state,
        selectedTasks: action.payload.selectedTasks,
      };
    case SET_SELECTED_REPO:
      return {
        ...state,
        selectedRepo: action.payload.selectedRepo,
      };
    case SET_ACTIVE_STEP:
      return {
        ...state,
        activeStep: action.payload.activeStep,
      };
    default:
      // TODO: report unknown action types as an error
      throw new Error(`Unrecognized action: ${action.type}`);
  }
}

const steps: Step[] = [
  {
    title: "connect to Github",
    component: <GithubLoginPage />,
  },
  {
    title: "import repository",
    component: <ImportRepository />,
  },
  {
    title: "create task",
    component: <CreateTask />,
  },
];

const Steps = () => {
  // @ts-ignore
  const [state, dispatch] = useReducer(appReducer, initialState);
  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]) as AppContext;

  return (
    <AppDataContext.Provider value={contextValue}>
      <Box>
        <Stepper
          steps={steps}
        />
      </Box>
    </AppDataContext.Provider>
  );
};

export default Steps;
