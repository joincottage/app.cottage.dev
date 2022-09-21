import { SET_PROFILE_DATA } from "./actions/setProfileData";
import { AppAction, AppState } from "./AppContext";

export default function appReducer(state: AppState, action: AppAction) {
  switch (action.type) {
    case SET_PROFILE_DATA:
      return {
        ...state,
        profileData: action.payload.profileData,
      };
    default:
      // TODO: report unknown action types as an error
      throw new Error(`Unrecognized action: ${action.type}`);
  }
}
