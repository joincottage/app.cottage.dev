import React, { Dispatch } from "react";

export interface AppState {
  selectedTasks: any[];
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
};
export const AppDataContext = React.createContext<AppContext>({
  state: initialState,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispatch: () => {},
});
