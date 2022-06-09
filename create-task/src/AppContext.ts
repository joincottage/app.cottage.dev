import React, { Dispatch } from "react";
import params from "./util/getQueryParams";

export interface AppState {
  selectedTasks: any[];
  selectedRepo: any;
  activeStep: string | number;
}
export interface AppAction {
  type: string;
  payload: Partial<AppState>;
}
export interface AppContext {
  state: AppState;
  dispatch: Dispatch<AppAction>;
}

export const initialState: AppState = {
  selectedTasks: [],
  selectedRepo: {},
  activeStep: params.activeStep || "1",
};
export const AppDataContext = React.createContext<AppContext>({
  state: initialState,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispatch: () => {},
});
