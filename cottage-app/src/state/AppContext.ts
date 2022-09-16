import React, { Dispatch } from "react";
import ProfileData from "../pages/portfolio/types/ProfileData";

export type AllClients = { name: "All" };
export interface AppState {
  profileData: ProfileData | null;
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
  profileData: null,
};
export const AppDataContext = React.createContext<AppContext>({
  state: initialState,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispatch: () => {},
});
