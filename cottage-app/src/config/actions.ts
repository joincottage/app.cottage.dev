import { helpers } from "@cottage-software-inc/client-library";
import ProfileData from "./ProfileData";

// setProfileData.with(profileData) returns an object of the form { type: 'SET_PROFILE_DATA', data: profileData }
export const setProfileData =
  helpers.createAppAction<ProfileData>("SET_PROFILE_DATA");