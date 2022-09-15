import ProfileData from "../../pages/profile/types/ProfileData";

export const SET_PROFILE_DATA = "SET_PROFILE_DATA";
export interface SetProfileDataAction {
  type: typeof SET_PROFILE_DATA;
  payload: {
    profileData: ProfileData;
  };
}

const setProfileData = (profileData: ProfileData): SetProfileDataAction => ({
  type: SET_PROFILE_DATA,
  payload: { profileData },
});

export default setProfileData;
