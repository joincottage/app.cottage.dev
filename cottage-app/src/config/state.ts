import ProfileData from './ProfileData';

// Define app state
export interface AppState {
  profileData: ProfileData | null;
}
export const initialState: AppState = {
  profileData: null,
};