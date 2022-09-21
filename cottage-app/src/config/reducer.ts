import { setProfileData } from "./actions";
import AppAction from "@cottage-software-inc/client-library/lib/lib/types/AppAction";

export default function appReducer<T>(state: T, action: AppAction<T>) {
  switch (action.type) {
    case setProfileData.type:
      return {
        ...state,
        profileData: action.payload.data,
      };
    default:
      // TODO: report unknown action types as an error
      throw new Error(`Unrecognized action: ${action.type}`);
  }
}